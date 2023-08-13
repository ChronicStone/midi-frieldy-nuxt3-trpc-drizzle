import { VNodeChild } from 'vue';

interface DialogOptions {
  type: 'create' | 'success' | 'error' | 'warning' | 'info';
  title: string | (() => VNodeChild);
  content?: string | (() => VNodeChild);
  positiveText?: string;
  negativeText?: string;
  closable?: boolean;
  style?: { [key: string]: string } | string;
}

export function usePromiseConfirm({
  type = 'create',
  title,
  content,
  positiveText = 'Yes',
  negativeText = 'No',
  style = {},
}: DialogOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const { $dialogApi } = useNuxtApp();
    $dialogApi?.[type]({
      title,
      content,
      positiveText,
      negativeText,
      style: style ?? {},
      onPositiveClick: () => resolve(true),
      onNegativeClick: () => resolve(false),
      onClose: () => resolve(false),
      onMaskClick: () => resolve(false),
    });
  });
}
