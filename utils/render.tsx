import { createTextVNode, VNodeChild } from "vue";
import { NIcon } from "naive-ui";

export function renderVNode<T extends any[]>(
  r:
    | string
    | number
    | undefined
    | null
    | ((...args: [...T]) => VNodeChild)
    | unknown,
  ...args: [...T]
): VNodeChild {
  if (typeof r === "function") {
    const node = r(...args);
    return typeof node === "string" ? createTextVNode(node) : node;
  } else if (typeof r === "string") {
    return createTextVNode(r);
  } else if (typeof r === "number") {
    return createTextVNode(String(r));
  } else {
    return null;
  }
}

export function renderIcon(icon: string) {
  return () => (
    <NIcon>
      <span class="iconify" data-icon={icon}></span>
    </NIcon>
  );
}
