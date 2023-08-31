import { buildFormSchema, buildTableSchema, buildMultiFieldSchema } from '@chronicstone/vue-sweettools';
import { maxValue, helpers } from '@vuelidate/validators';

export function lunchGroupTableSchema() {
  const { $client } = useNuxtApp();
  return buildTableSchema({
    remote: false,
    columns: [],
    datasource: () => $client.lunchGroup.getLunchGroups.query(),
  });
}

export function lunchGroupFormSchema() {
  return buildFormSchema({
    title: 'Créer un groupe',
    maxWidth: '650px',
    fieldSize: 9,
    gridSize: 9,
    allowClickOutside: false,
    fields: [...lunchGroupBaseFormFieldsSchema()],
  });
}

export function lunchGroupPollFormSchema() {
  const { $client } = useNuxtApp();
  return buildFormSchema({
    title: 'Initier un vote',
    maxWidth: '700px',
    fieldSize: 9,
    gridSize: 9,
    allowClickOutside: false,
    fields: [
      formSectionTitle({ title: 'Paramètres du vote', size: 9 }),
      {
        key: 'voteDeadline',
        label: 'Heure limite de vote',
        type: 'time',
        fieldParams: { format: 'HH:mm', minuteStep: 5 },
        required: true,
        default: getFutureDate(15).valueOf(),
        size: '9 md:4',
        dependencies: ['meetingTime'],
        transform: (value: number) => new Date(value).toISOString(),
        validators: (dependencies: { meetingTime: string }) => {
          const meetingTime = new Date(dependencies?.meetingTime);
          return {
            lowerThanMeetingTime: helpers.withMessage(
              "L'heure de fin du vote ne peut pas être supérieure à l'heure de rendez-vous",
              maxValue(meetingTime.valueOf()),
            ),
          };
        },
      },
      {
        key: 'allowedRestaurants',
        label: 'Restaurants autorisés',
        type: 'select',
        required: false,
        placeholder: 'Restaurants autorisés (optionnel)',
        size: '9 md:5',
        options: () => $client.filterOptions.getRestaurants.query(),
        multiple: true,
      },
      {
        key: 'userVote',
        label: 'Votre choix de restaurant',
        type: 'select',
        required: true,
        placeholder: 'Votez pour le restaurant de votre choix',
        size: 9,
        dependencies: ['allowedRestaurants'],
        options: async (dependencies) => {
          const restaurants = await $client.filterOptions.getRestaurants.query();
          if (!dependencies?.allowedRestaurants?.length ?? false) return restaurants;
          else
            return restaurants.filter(
              (restaurant) => dependencies?.allowedRestaurants.includes(restaurant.value),
            );
        },
      },
      formSectionTitle({ title: 'Paramètres du groupe', size: 9, topPadding: true }),
      ...lunchGroupBaseFormFieldsSchema(),
    ],
  });
}

export function lunchGroupPollVoteFormSchema(voteOptions: Array<{ label: string; value: string }>) {
  return buildFormSchema({
    title: 'Choisissez un restaurant',
    maxWidth: '500px',
    fieldSize: 9,
    gridSize: 9,
    allowClickOutside: false,
    fields: [
      {
        key: 'restaurant',
        label: 'Restaurant',
        type: 'select',
        required: true,
        placeholder: 'Choisissez un restaurant',
        options: voteOptions,
      },
    ],
  });
}

export function lunchGroupBaseFormFieldsSchema() {
  return buildMultiFieldSchema([
    {
      label: 'Label',
      key: 'label',
      type: 'text',
      required: true,
      placeholder: 'Afterwork IT',
      size: '9 md:6',
    },
    {
      key: 'meetingTime',
      label: 'Heure de rendez-vous',
      type: 'time',
      required: true,
      size: '9 md:3',
      fieldParams: {
        format: 'HH:mm',
        minuteStep: 5,
      },
      default: getFutureDate(20).valueOf(),
      transform: (value) => new Date(value).toISOString(),
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Description du groupe (optionnel)',
    },
  ]);
}
