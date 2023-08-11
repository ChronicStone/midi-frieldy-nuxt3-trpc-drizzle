import { defineStore } from 'pinia';
import { useStorage as useCStorage } from '@vueuse/core';
// import { Organization } from "./../types/organization";
// import { AuthLoginData } from "@/types/auth";
import { Organization } from '@/types/organization';
import { User } from '@/types/user';
import { AuthLoginData } from '@/types/auth';
// import { ObjectSerializer } from "@/utils/data/object";

export const useUserStore = defineStore('userStore', () => {
  const refreshToken = ref<string | null>();
  const rememberMe = ref<boolean>(false);

  const organizations = useCStorage<Organization[]>(
    'organizations',
    [],
    localStorage,
    // { serializer: ObjectSerializer as Serializer<Organization[]> },
  );

  const activeOrganizationId = useCStorage<string | null>('activeOrganizationId', null, localStorage);

  const accessToken = useCStorage<string | null>('refreshToken', null, localStorage);

  const user = useCStorage<User | null>(
    'user',
    null,
    localStorage,
    // {
    //   serializer: ObjectSerializer as Serializer<User & { onboarded: boolean }>,
    // },
  );

  const activeOrganization = computed<Organization | null>(() =>
    user.value ? organizations.value.find((orga) => orga._id === activeOrganizationId.value) ?? null : null,
  );

  function storeAuthData(data: AuthLoginData) {
    accessToken.value = data.accessToken;
    user.value = data.user;
    organizations.value = data.organizations;
    if (data.organizations.length === 1) activeOrganizationId.value = data.organizations[0]._id;
  }

  function clearUserSession() {
    accessToken.value = null;
    user.value = null;
    // organizations.value = [];
    activeOrganizationId.value = null;
  }

  function setActiveOrganization(id: string) {
    activeOrganizationId.value = id;
  }

  // function setOnboardingCompleted() {
  //   if (user.value?.onboarded) return;
  //   UserController.completeOnboarding();
  //   user.value = { ...user.value, onboarded: true } as User & {
  //     onboarded: boolean;
  //   };
  // }

  return {
    accessToken,
    refreshToken,
    rememberMe,
    user,
    activeOrganizationId,
    activeOrganization,
    organizations,
    storeAuthData,
    clearUserSession,
    setActiveOrganization,
    // setOnboardingCompleted,
  };
});
