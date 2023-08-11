import type { VNodeChild } from "vue";
import type { RouteLocationRaw } from "#vue-router";
import { renderIcon } from "@/utils/render";
import { NuxtLink } from "#components";

export interface DropdownAction {
  label: string | (() => VNodeChild);
  icon?: string;
  action?: () => void;
  link?: RouteLocationRaw;
  disable?: boolean | (() => boolean);
  condition?: () => boolean;
  // permissions?: (string | string[])[];
}

export interface MappedDropdownAction {
  label: string | (() => VNodeChild);
  icon?: () => VNodeChild;
  disabled: boolean;
  hidden: boolean;
  props: {
    onClick: () => void;
  };
}

export function useDropdownActions(actions: DropdownAction[]) {
  return computed(() =>
    actions
      .map((action: DropdownAction) => ({
        label: action.link
          ? () => <NuxtLink to={action.link}>{action.label}</NuxtLink>
          : action.label,
        ...(action.icon && { icon: renderIcon(action.icon) }),
        disabled:
          typeof action.disable === "function"
            ? action.disable()
            : action?.disable ?? false,
        hidden:
          typeof action.condition === "function" ? !action.condition() : false,
        props: {
          onClick: () => action?.action?.(),
        },
      }))
      .filter((action) => !action.hidden),
  );
}
