<script setup lang="ts">
import {
  FormRenderer,
  useFormController,
  buildFormSchema,
  type FormRefInstance,
} from '@chronicstone/vue-sweettools';
import { helpers, sameAs } from '@vuelidate/validators';
import { AuthEmailCredentials, AuthLoginDto, AuthRegisterDto } from '@/types/auth';

const emit = defineEmits<{ (e: 'onSubmit', data: AuthRegisterDto): void }>();

const formRef = ref<FormRefInstance>();
const formSchema = buildFormSchema({
  gridSize: 8,
  fieldSize: '8 md:4',
  fields: [
    {
      label: 'Adresse email',
      key: 'email',
      type: 'text',
      size: 8,
      required: true,
    },
    { label: 'Prénom', key: 'firstName', type: 'text', required: true },
    { label: 'Nom de famille', key: 'lastName', type: 'text', required: true },
    {
      label: 'Mot de passe',
      key: 'password',
      type: 'password',
      required: true,
    },
    {
      label: 'Confirmez mot de passe',
      key: 'confirmPassword',
      type: 'password',
      dependencies: ['password'],
      validators: (dependencies) => ({
        sameAs: helpers.withMessage('Les mots de passe ne correspondent pas', sameAs(dependencies?.password)),
      }),
    },
  ],
});

const { validate, formData } = useFormController(formRef, formSchema);

function emitRegisterData(
  type: AuthLoginDto['type'],
  data: Omit<AuthEmailCredentials, 'type'> | Omit<AuthRegisterDto, 'type'>,
) {
  emit('onSubmit', { type, ...data } as AuthRegisterDto);
}

async function submitForm() {
  if (await validate()) {
    emitRegisterData('email', formData.value);
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <FormRenderer ref="formRef" :schema="formSchema" />
    <NButton class="w-full" size="large" secondary type="primary" @click="submitForm"> INSCRIPTION </NButton>
    <NDivider class="!m-0">
      <span class="text-sm">OR</span>
    </NDivider>
    <div class="flex justify-center gap-4 items-center">
      <!-- <AuthProviderFacebook /> -->
      <GoogleAuthProvider @on-auth="emitRegisterData('google', $event)">
        S'enregistrer avec google
      </GoogleAuthProvider>
      <!-- <AuthProviderLinkedIn /> -->
    </div>
  </div>
</template>
