import { defineConfig, presetTypography, presetWebFonts } from 'unocss';
import presetUno from '@unocss/preset-uno';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerDirectives from '@unocss/transformer-directives';

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        lato: 'Lato',
      },
    }),
  ],
  transformers: [
    // @ts-expect-error weird ts infer issue
    transformerVariantGroup(),
    // @ts-expect-error weird ts infer issue
    transformerDirectives({
      applyVariable: ['--at-apply', '--uno-apply', '--uno'],
    }),
  ],
  theme: {
    colors: {
      primary: '#F18669',
    },
  },
  rules: [['h-layout', { height: 'calc(100vh - 4rem)' }]],
});
