<script setup lang="ts">
import { TRPCClientError } from '@trpc/client';
import { AuthLoginDto } from '@/types/auth';

definePageMeta({
  middleware: ['no-auth'],
});

const userStore = useUserStore();
const appStore = useAppStore();
const messageApi = useMessage();
const { $client } = useNuxtApp();

async function authenticate(data: AuthLoginDto) {
  try {
    appStore.startLoading('Authentification en cours...');
    const authData = await $client.auth.login.mutate(data);
    appStore.stopLoading();
    userStore.storeAuthData(authData);
    messageApi.success(`Bienvenue, ${authData.user.firstName} ${authData.user.lastName}`);
    await nextTick();
    await sleep(200);
    navigateTo('/auth/portal');
  } catch (err) {
    appStore.stopLoading();
    if (err instanceof TRPCClientError) {
      if (err.data.code === 'NOT_FOUND') messageApi.error('Identifiants incorrects');
      else messageApi.error(err?.message ?? 'Une erreur est survenue');
    } else {
      messageApi.error('Une erreur est survenue');
    }
  }
}
</script>

<template>
  <div class="flex overflow-hidden">
    <div class="h-layout w-full !lg:w-2/5 p-16 flex flex-col gap-8">
      <h1 class="font-600 text-lg">Connexion à Midi Friendly</h1>
      <p class="text-gray-500">
        Connectez-vous à votre compte pour accéder à la carte interactive des restaurants Midi Friendly.
      </p>
      <LoginForm @on-submit="authenticate" />
    </div>
    <NuxtImg class="w-0 !lg:w-3/5 h-layout" src="/invitation/illu.png" sizes="sm:0 lg:60vw" fit="cover" />
    <!-- <div class="w-0 !lg:w-3/5 h-layout illu-container-full"></div> -->
  </div>
</template>

<style lang="scss" scoped>
.illu-container-full {
  background: url('@/assets/images/invitationIllu.png') no-repeat;
  background-size: cover;
}
</style>
