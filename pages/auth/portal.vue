<script setup lang="ts">
definePageMeta({
  auth: true,
  middleware: [
    (to, from, next) => {
      const userStore = useUserStore();
      const adminAndClient = !!userStore.user?.admin && !!userStore.organizations.length;
      if (!adminAndClient) return;
      return userStore.user?.admin ? navigateTo('/admin/organizations') : next('/map');
    },
  ],
});
</script>

<template>
  <div class="px-8 md:px-16 lg:px-32 xl:px-64 py-4 md:py-8 lg:py-16 xl:py-32 flex flex-col gap-10">
    <div class="flex flex-col gap-4 sm:max-w-[60%]">
      <h1 class="font-black text-2xl">Portail d'accès aux services de midi-friendly</h1>
    </div>

    <div class="flex flex-col !sm:flex-row gap-8 justify-between items-center w-full">
      <div
        class="w-full h-[20vh] !sm:w-[48%] !sm:h-[40vh] illu-container p-8 flex flex-col justify-end cursor-pointer"
        @click="navigateTo('/map')"
      >
        <p class="text-white text-md">Accéder à la carte interactive</p>
        <h2 class="font-bold text-white text-xl">Utilisateur ?</h2>
      </div>
      <div
        class="w-full h-[20vh] !sm:w-[48%] !sm:h-[40vh] illu-container p-8 flex flex-col justify-end cursor-pointer"
        @click="navigateTo('/admin')"
      >
        <p class="text-white text-md un-blur">Accéder au panneau d'administration</p>
        <h2 class="font-bold text-white text-xl">Administrateur ?</h2>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.illu-container {
  background:
    linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.673)),
    url('@/assets/images/invitation/link.png') no-repeat;
  background-size: cover;
  transition: all ease-in-out 0.2s;
  background-blend-mode: darken, luminosity;
  &:hover {
    filter: brightness(1.25);
  }
}

.illu-container-full {
  background: url('@/assets/images/invitationIllu.png') no-repeat;
  background-size: cover;
}
</style>
