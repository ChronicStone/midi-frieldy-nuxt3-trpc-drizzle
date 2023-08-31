import { AddressType, Client, Place, PlaceData, PlacePhoto } from '@googlemaps/google-maps-services-js';
import { consola } from 'consola';
import { z } from 'zod';

import { uploadImageFromBuffer } from '@/server/services/external/awsS3.service';
import type { Address, Coordinates } from '@/types/system/location';
import { rateLimitPromiseQueue } from '@/utils/server/async';
import { rawRestaurantSchema } from '@/server/dto/restaurant.dto';
import { sleep } from '@/utils/system/runtime';
import { env } from '@/server/env';

const GMapsClient = new Client({});

export async function getCoordinatesFromAddress(address: Address) {
  try {
    const data = await GMapsClient.geocode({
      params: {
        address: `${address.street} ${address.city} ${address.zip} ${address.country} `,
        key: env.VITE_GOOGLE_API_KEY,
      },
      timeout: 1000,
    });

    const coordinates = data.data.results?.[0]?.geometry?.location ?? null;
    if (!coordinates) return null;
    return {
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    };
  } catch (error) {
    consola.error('Unable to resolve coordinates');
    consola.error(error);
    throw new Error('Error getting coordinates from address', { cause: error });
  }
}

export async function getRestaurantsNearby(coordinates: Coordinates) {
  consola.info(
    `Retriving restaurants nearby for coordinates : ${JSON.stringify(coordinates)}`,
    'GoogleMapsService.getRestaurantsNearby',
  );
  try {
    let page = 1;
    let nextToken = '';
    let resolvingComplete = false;
    const locations = [];

    while (!resolvingComplete) {
      try {
        consola.info(
          `Retriving page ${page} of restaurants nearby - page token : ${nextToken}`,
          'GoogleMapsService.getRestaurantsNearby',
        );
        if (page > 1) await sleep(2500);
        const data = await GMapsClient.placesNearby({
          params: {
            location: `${coordinates.latitude},${coordinates.longitude}`,
            radius: 500,
            type: 'restaurant',
            key: env.VITE_GOOGLE_API_KEY,
            ...(nextToken && { pagetoken: nextToken }),
          },
          timeout: 1000000,
        }).then((data) => data.data);

        locations.push(...data.results);
        if (data.next_page_token) nextToken = data.next_page_token;
        else resolvingComplete = true;
        page++;
      } catch (err: any) {
        nextToken = '';
        resolvingComplete = true;
        consola.error(
          `Unable to retrive page ${page} of restaurants nearby - page token : ${nextToken}`,
          'GoogleMapsService.getRestaurantsNearby',
        );
        consola.error(
          err?.response?.data?.error_message ?? 'Unexpected GMAPS unknown error',
          'GoogleMapsService.getRestaurantsNearby',
        );
      }
    }

    const [restaurants] = await rateLimitPromiseQueue<z.infer<typeof rawRestaurantSchema>>(
      locations.map((location) => () => mapRestaurantFullData(location)),
      { concurrency: 1, interval: 1500, runsPerInterval: 1 },
    );

    return restaurants;
  } catch (err: any) {
    consola.error(err?.response?.data?.error_message ?? err, 'GoogleMapsService.getRestaurantsNearby');
    throw new Error(err?.response?.data?.error_message ?? 'Unexpected GMAPS unknown error', { cause: err });
  }
}

export async function mapRestaurantFullData(location: Place) {
  consola.info(
    `Retriving full restaurant data for placeId :  ${location.place_id}`,
    'GoogleMapsService.mapRestaurantFullData',
  );
  try {
    const restaurantDetails = await getRestaurantDetails(location.place_id!);
    const [photos] = await rateLimitPromiseQueue<{
      url: string;
      reference: string;
      width: number;
      height: number;
    }>(
      (restaurantDetails?.photos ?? []).map(
        (photo) => () => resolveAndSavePlacePhoto(photo, location.place_id!),
      ),
      { concurrency: 1, interval: 1500, runsPerInterval: 10 },
    );
    return {
      name: restaurantDetails.name,
      placeId: restaurantDetails.place_id,
      address: formatAddressFromString(restaurantDetails),
      coordinates: {
        latitude: restaurantDetails.geometry?.location.lat ?? 0,
        longitude: restaurantDetails.geometry?.location.lng ?? 0,
      },
      gMapsReviews:
        restaurantDetails.reviews?.map((review) => ({
          authorName: review.author_name,
          authorPhoto: review.profile_photo_url,
          rating: review.rating,
          text: review.text,
          createdAt: review.time,
        })) ?? [],
      priceLevel: restaurantDetails?.price_level ?? 0,
      photos: photos ?? [],
      openingHours: restaurantDetails?.opening_hours?.weekday_text ?? [],
      website: restaurantDetails?.website ?? '',
      phoneNumber: restaurantDetails?.formatted_phone_number ?? '',
      services: {
        delivery: restaurantDetails?.delivery ?? false,
        takeout: restaurantDetails?.takeout ?? false,
        dineIn: restaurantDetails?.dine_in ?? false,
        wine: restaurantDetails?.serves_wine ?? false,
        beer: restaurantDetails?.serves_beer ?? false,
        breakfast: restaurantDetails?.serves_breakfast ?? false,
        lunch: restaurantDetails?.serves_lunch ?? false,
        dinner: restaurantDetails?.serves_dinner ?? false,
        reservable: restaurantDetails?.reservable ?? false,
        vegetarian: restaurantDetails?.serves_vegetarian_food ?? false,
      },
      types: restaurantDetails?.types ?? [],
    };
  } catch (err: any) {
    consola.error(err?.response?.data?.error_message ?? err, 'GoogleMapsService.mapRestaurantFullData');
    throw new Error(err?.response?.data?.error_message ?? 'Unexpected GMAPS unknown error', { cause: err });
  }
}

function formatAddressFromString(place: PlaceData): Address {
  if (place.adr_address)
    return {
      street: place.adr_address?.match(/(?<=<span class="street-address">)(.*?)(?=<\/span>)/g)?.[0] ?? '',
      city: place.adr_address?.match(/(?<=<span class="locality">)(.*?)(?=<\/span>)/g)?.[0] ?? '',
      zip: place.adr_address?.match(/(?<=<span class="postal-code">)(.*?)(?=<\/span>)/g)?.[0] ?? '',
      country: place.adr_address?.match(/(?<=<span class="country-name">)(.*?)(?=<\/span>)/g)?.[0] ?? '',
    };
  else if (place.address_components?.length)
    return {
      street:
        `${place.address_components.find((component) =>
          component.types.includes('street_number' as AddressType),
        )?.long_name} ${place.address_components.find((component) =>
          component.types.includes('route' as AddressType),
        )?.long_name}` || 'N/A',
      city:
        place.address_components.find((component) => component.types.includes('locality' as AddressType))
          ?.long_name ?? 'N/A',
      zip:
        place.address_components.find((component) => component.types.includes('postal_code' as AddressType))
          ?.long_name ?? 'N/A',
      country:
        place.address_components.find((component) => component.types.includes('country' as AddressType))
          ?.long_name ?? 'N/A',
    };

  return {
    street: 'N/A',
    city: 'N/A',
    zip: 'N/A',
    country: 'N/A',
  };
}

async function resolveAndSavePlacePhoto(photo: PlacePhoto, placeId: string) {
  consola.info(
    `Retriving photo for placeId : ${placeId} and photo reference : ${photo.photo_reference}`,
    'GoogleMapsService.resolveAndSavePhoto',
  );
  try {
    const filePath = `restaurants/${placeId}/photos/${photo.photo_reference}_${Date.now()}.jpg`;
    const fileBody = await resolvePlacePhoto(photo.photo_reference);
    await uploadImageFromBuffer(fileBody, filePath);

    consola.info(
      `Photo for placeId : ${placeId} and photo reference : ${photo.photo_reference} saved`,
      'GoogleMapsService.resolveAndSavePhoto',
    );

    return {
      url: filePath,
      reference: photo.photo_reference,
      width: photo.width,
      height: photo.height,
    };
  } catch (err: any) {
    consola.error(
      err?.response?.data?.error_message ?? 'Unexpected GMAPS/AWS unknown error',
      'GoogleMapsService.resolveAndSavePhoto',
    );
    throw new Error(err?.response?.data?.error_message ?? 'Unexpected GMAPS unknown error', { cause: err });
  }
}

async function resolvePlacePhoto(reference: string, options?: { maxWidth?: number; maxLength?: number }) {
  try {
    return Buffer.from(
      await GMapsClient.placePhoto({
        params: {
          photoreference: reference,
          key: env.VITE_GOOGLE_API_KEY,
          maxwidth: options?.maxWidth ?? 1000,
          maxheight: options?.maxLength ?? 1000,
        },
        responseType: 'arraybuffer',
      }).then((data) => data.data),
    );
  } catch (err: any) {
    consola.error(
      err?.response?.data?.error_message ?? `Unexpected GMAPS unknown error for reference : ${reference}`,
      'GoogleMapsService.getPlacePhotoBuffer',
    );
    throw new Error(err?.response?.data?.error_message ?? 'Unexpected GMAPS unknown error', { cause: err });
  }
}

function getRestaurantDetails(placeId: string): Promise<PlaceData & Record<string, any>> {
  try {
    return GMapsClient.placeDetails({
      params: {
        place_id: placeId,
        key: env.VITE_GOOGLE_API_KEY,
        fields: [
          'name',
          'place_id',
          'address_components',
          'geometry',
          'reviews',
          'price_level',
          'photos',
          'opening_hours',
          'website',
          'formatted_phone_number',
          'delivery',
          'dine_in',
          'reservable',
          'serves_beer',
          'serves_wine',
          'serves_breakfast',
          'serves_lunch',
          'serves_dinner',
          'serves_vegetarian_food',
          'takeout',
          'types',
        ],
      },
      timeout: 1000,
    }).then((data) => data.data.result as PlaceData);
  } catch (err: any) {
    consola.error(err?.response?.data?.error_message ?? err, 'GoogleMapsService.getRestaurantDetails');
    throw new Error(err?.response?.data?.error_message ?? 'Unexpected GMAPS unknown error', { cause: err });
  }
}
