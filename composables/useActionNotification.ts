export function useActionNotification(loadingMessage: string, options?: { immediate: boolean }) {
  const { $messageApi } = useNuxtApp();

  let message: ReturnType<typeof $messageApi.create> | null = options?.immediate
    ? $messageApi.create(loadingMessage, {
        type: 'loading',
        duration: 0,
      })
    : null;

  const setSuccess = (successMessage: string) => {
    if (!message) throw new Error('message not initializede yet');

    message.type = 'success';
    message.content = successMessage;
    setTimeout(() => message?.destroy(), 3000);
  };

  const setError = (errorMessage: string) => {
    if (!message) message = $messageApi.create(loadingMessage, { type: 'loading', duration: 0 });
    message.type = 'error';
    message.content = errorMessage;
    setTimeout(() => message?.destroy(), 3000);
  };

  const setWarning = (warningMessage: string) => {
    if (!message) throw new Error('message not initializede yet');

    message.type = 'warning';
    message.content = warningMessage;
    setTimeout(() => message?.destroy(), 3000);
  };

  const open = () => {
    if (message) throw new Error('message not initializede yet');

    message = $messageApi.create(loadingMessage, {
      type: 'loading',
      duration: 0,
    });
  };

  const close = () => {
    if (!message) throw new Error('message not initializede yet');

    message.destroy();
    message = null;
  };

  return { setSuccess, setWarning, setError, close, open };
}
