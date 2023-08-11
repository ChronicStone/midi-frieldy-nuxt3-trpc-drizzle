<script setup lang="ts">
import {
  FormRenderer,
  type FormRefInstance,
  useFormController,
  buildFormSchema,
} from '@chronicstone/vue-sweettools';
import { AuthEmailCredentials, AuthLoginDto, AuthRegisterDto } from '@/types/auth';

const emit = defineEmits<{ (e: 'onSubmit', data: AuthLoginDto): void }>();

const formRef = ref<FormRefInstance>();
const formSchema = buildFormSchema({
  gridSize: 8,
  fieldSize: 8,
  fields: [
    {
      label: 'Adresse email',
      key: 'email',
      type: 'text',
      size: 8,
      required: true,
    },
    {
      label: 'Mot de passe',
      key: 'password',
      type: 'password',
      required: true,
    },
  ],
});

const { validate, formData } = useFormController(formRef, formSchema);

function emitAuthData(
  type: AuthLoginDto['type'],
  data: Omit<AuthEmailCredentials, 'type'> | Omit<AuthRegisterDto, 'type'>,
) {
  emit('onSubmit', { type, ...data } as AuthLoginDto);
}

async function submitForm() {
  if (await validate()) {
    emitAuthData('email', formData.value);
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <FormRenderer ref="formRef" :schema="formSchema" />
    <NButton class="w-full" size="large" secondary type="primary" @click="submitForm"> CONNEXION </NButton>
    <NDivider class="!m-0">
      <span class="text-sm">OR</span>
    </NDivider>
    <div class="flex justify-center gap-4 items-center">
      <!-- <AuthProviderFacebook /> -->
      <GoogleAuthProvider @on-auth="emitAuthData('google', $event)">
        Se connecter avec Google
      </GoogleAuthProvider>
      <!-- <AuthProviderLinkedIn /> -->
    </div>
  </div>
</template>
