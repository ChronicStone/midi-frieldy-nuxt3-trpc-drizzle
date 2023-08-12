import { useLoadingBar, useMessage, useDialog, useNotification, useThemeVars } from 'naive-ui';
import { useFormApi } from '@chronicstone/vue-sweettools';
import type { RouteLocation } from "#vue-router";

declare module '#app' {
  interface PageMeta {
    auth?: boolean;
    showLoginAction?: boolean;
    breadcrumbs?: Array<{ label: string; slug?: RouteLocation["name"]; icon: string }>;
  }

  interface NuxtApp {
    $formApi: ReturnType<typeof useFormApi>;
    $messageApi: ReturnType<typeof useMessage>;
    $loadingBarApi: ReturnType<typeof useLoadingBar>;
    $dialogApi: ReturnType<typeof useDialog>;
    $notificationApi: ReturnType<typeof useNotification>;
    $themeVars: ReturnType<typeof useThemeVars>;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $formApi: ReturnType<typeof useFormApi>;
    $messageApi: ReturnType<typeof useMessage>;
    $loadingBarApi: ReturnType<typeof useLoadingBar>;
    $dialogApi: ReturnType<typeof useDialog>;
    $notificationApi: ReturnType<typeof useNotification>;
    $themeVars: ReturnType<typeof useThemeVars>;
  }
}

declare module "jsonwebtoken" {
  import { sign, decode, verify } from "jsonwebtoken";
  declare const jwt = { sign, decode, verify }
  export default jwt
}


export {};
