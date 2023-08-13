import { Restaurant } from '@/types/restaurant';

export async function toggleRestaurant(restaurant: Restaurant) {
  try {
    const { $messageApi, $client } = useNuxtApp();
    const proceed = await usePromiseConfirm({
      type: 'warning',
      title: 'Toggle restaurant',
      content: `Are you sure you want to ${restaurant.disabled ? 'enable' : 'disable'} this restaurant?`,
    });

    if (!proceed) return false;

    await $client.restaurant.toggleRestaurant.mutate(restaurant._id);
    $messageApi.success(
      `Restaurant ${restaurant.name} has been ${restaurant.disabled ? 'enabled' : 'disabled'}`,
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function manuallyInsertRestaurant() {
  try {
    const { $formApi, $messageApi } = useNuxtApp();
    const { formData, isCompleted } = await $formApi.createForm({
      title: 'Add restaurant',
      maxWidth: '500px',
      gridSize: 1,
      fieldSize: 1,
      fields: [{ key: 'placeId', label: 'Place ID', type: 'text', required: true }],
    });

    if (!isCompleted) return false;

    // const restaurant = await RestaurantController.insertRestaurantByPlaceId(formData.placeId);
    // $messageApi.success(`Restaurant ${restaurant.name} has been inserted`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
