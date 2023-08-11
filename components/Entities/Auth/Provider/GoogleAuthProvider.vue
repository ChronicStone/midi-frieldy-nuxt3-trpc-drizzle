<script setup lang="ts">
import {
  useTokenClient,
  type AuthCodeFlowSuccessResponse,
  type AuthCodeFlowErrorResponse,
} from 'vue3-google-signin';
import axios from 'axios';
import { AuthRegisterDto } from '@/types/auth';

const emit = defineEmits<{
  (e: 'onAuth', data: AuthRegisterDto): void;
}>();

const isWindowFocused = useWindowFocus();
const isLoading = ref<boolean>(false);
const isAuthenticating = ref<boolean>(false);

const { isReady, login } = useTokenClient({
  onSuccess: retriveProfileData,
  onError: authenticationFailed,
});

watch(
  () => isWindowFocused.value,
  (newVal, oldVal) => newVal && !oldVal && !isAuthenticating.value && (isLoading.value = false),
  { immediate: true },
);

function startAuthenticate() {
  isLoading.value = true;
  login();
}

async function retriveProfileData(response: AuthCodeFlowSuccessResponse) {
  isAuthenticating.value = true;
  const { data } = await axios.get('https://people.googleapis.com/v1/people/me', {
    headers: { Authorization: `Bearer ${response.access_token}` },
    params: { personFields: 'emailAddresses,names,photos,metadata' },
  });

  isLoading.value = false;
  isAuthenticating.value = false;
  emit('onAuth', {
    type: 'google',
    email: data.emailAddresses[0].value,
    firstName: data.names[0].givenName,
    lastName: data.names[0].familyName,
    avatar: data.photos[0].url,
    userId: data.metadata.sources[0].id,
  });
}

function authenticationFailed(errorResponse: AuthCodeFlowErrorResponse) {
  isLoading.value = false;
  console.error('Error: ', errorResponse);
}
</script>

<template>
  <NButton :disabled="!isReady || isLoading" :loading="isLoading" secondary round @click="startAuthenticate">
    <template #icon>
      <i:logos:google-icon />
    </template>
    <slot v-if="$slots.default" />
  </NButton>
</template>
