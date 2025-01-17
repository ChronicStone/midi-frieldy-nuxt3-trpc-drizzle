import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerDirectives from '@unocss/transformer-directives';
import Components from 'unplugin-vue-components/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import PurgeIcons from 'vite-plugin-purge-icons';
import './server/env';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  pages: true,
  devtools: { enabled: true },
  experimental: { typedPages: true },
  build: { transpile: ['trpc-nuxt'] },
  alias: { '@/.': './' },
  typescript: { typeCheck: process.env.APP_ENV !== 'production' && false },
  nitro: {
    imports: {
      dirs: ['@/db', '@/utils/server', '@/db/schema'],
    },
    plugins: ['@/nitro/ws', '@/nitro/scheduler'],
    storage: {
      db: {
        driver: 'fs',
        base: './data/db',
      },
    },
  },
  modules: [
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@huntersofbook/naive-ui-nuxt',
    '@vueuse/nuxt',
    '@nuxt/image-edge',
    '@vue-macros/nuxt',
    'nuxt-scheduler',
  ],
  imports: {
    dirs: [
      'stores',
      'config',
      'composables',
      'utils',
      'services',
      'services/_utils',
      'utils/**/*',
      'utils/**',
      'server/dto/*',
      'db/*',
      'entities/**/*',
    ],
  },
  components: {
    dirs: [{ path: 'components', pathPrefix: false }],
  },
  app: {
    head: {
      title: 'Midi friendly',
      script: [{ src: 'https://code.iconify.design/1/1.0.0/iconify.min.js' }],
    },
    pageTransition: { name: 'slide-fade-reverse', mode: 'out-in' },
  },
  css: ['@unocss/reset/tailwind.css'],
  vite: {
    plugins: [
      Components({
        resolvers: [IconsResolver({ componentPrefix: 'i' })], // Automatically register all components in the `components` directory
      }),
      Icons({
        autoInstall: true,
      }),
      PurgeIcons(),
    ],
  },

  plugins: [],
});
