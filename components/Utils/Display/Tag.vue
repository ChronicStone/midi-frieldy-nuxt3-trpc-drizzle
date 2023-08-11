<script lang="tsx">
import { match } from 'ts-pattern';
import { NTag, TagProps as BaseTagProps, useThemeVars, tagProps as _tagProps } from 'naive-ui';
type TagProps = Omit<BaseTagProps, 'type' | 'color'> & {
  type?: 'warning' | 'info' | 'error' | 'success' | null;
  class?: string;
  key?: number | string;
};

const tagPropsKeys = [...new Set(Object.keys(_tagProps))].filter((key) => key !== 'type');

export default defineComponent(
  (props: TagProps, context) => {
    const appStore = useAppStore();
    const themeVars = useThemeVars();

    const tagProps = computed(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, ...rest } = props;
      const color = match(props.type)
        .with('warning', () => 'warning' as const)
        .with('info', () => 'info' as const)
        .with('error', () => 'error' as const)
        .with('success', () => 'success' as const)
        .otherwise(() => null);

      if (!color) return {};

      const computedColor = !appStore.isDark
        ? themeVars.value[`${color}Color`]
        : themeVars.value[`${color}ColorSuppl`];

      return {
        ...rest,
        color: {
          borderColor: computedColor,
          color:
            getColorFormat(computedColor) === 'hex'
              ? convertHexToRgba(computedColor, 0.2)
              : changeRgbaOpacity(computedColor, 0.2),
          textColor: computedColor,
        },
      };
    });

    return () => <NTag {...tagProps.value}>{context.slots.default?.()}</NTag>;
  },

  { props: [...tagPropsKeys, 'type'] as any },
);
</script>
