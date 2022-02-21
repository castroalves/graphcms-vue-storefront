import theme from './themeConfig';

import webpack from 'webpack';
import { VSF_LOCALE_COOKIE } from '@vue-storefront/core';

export default {
  components: ['~/components/cms/', '~/components/cms/page/', '~/components/cms/layout/'],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap'
      }
    ],
    script: []
  },
  loading: { color: '#fff' },
  router: {
    middleware: ['checkout'],
    scrollBehavior (_to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'home',
        path: '/',
        component: resolve(__dirname, 'pages/Home.vue')
      },
      {
        name: 'product',
        path: '/p/:id/:slug/',
        component: resolve(__dirname, 'pages/Product.vue')
      },
      {
        name: 'category',
        path: '/c/:slug_1/:slug_2?/:slug_3?/:slug_4?/:slug_5?',
        component: resolve(__dirname, 'pages/Category.vue')
      },
      {
        name: 'my-account',
        path: '/my-account/:pageName?',
        component: resolve(__dirname, 'pages/MyAccount.vue')
      },
      {
        name: 'checkout',
        path: '/checkout',
        component: resolve(__dirname, 'pages/Checkout.vue'),
        children: [
          {
            path: 'shipping',
            name: 'shipping',
            component: resolve(__dirname, 'pages/Checkout/Shipping.vue')
          },
          {
            path: 'billing',
            name: 'billing',
            component: resolve(__dirname, 'pages/Checkout/Billing.vue')
          },
          {
            path: 'payment',
            name: 'payment',
            component: resolve(__dirname, 'pages/Checkout/Payment.vue')
          },
          {
            path: 'thank-you',
            name: 'thank-you',
            component: resolve(__dirname, 'pages/Checkout/ThankYou.vue')
          }
        ]
      },
      {
        name: 'reset-password',
        path: '/reset-password',
        component: resolve(__dirname, 'pages/ResetPassword.vue')
      });
    }
  },
  buildModules: [
    '@nuxtjs/composition-api/module',
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@nuxtjs/pwa',
    ['@vsf-enterprise/commercetools/nuxt', {
      i18n: {
        useNuxtI18nConfig: true
      },
      faceting: {
        pageOptions: [20, 50, 100],
        subcategoriesLimit: 100,
        availableFacets: [
          { facet: 'categories.id', type: 'string', option: 'subtree("*")', name: 'category', filteringStrategy: 'query' },
          { facet: 'variants.attributes.size', type: 'string', option: '', name: 'size' },
          { facet: 'variants.attributes.color.key', type: 'string', option: '', name: 'color' }
        ],
        sortingOptions: [
          { id: 'latest', name: 'Latest', facet: 'createdAt', direction: 'desc' },
          { id: 'price-up', name: 'Price from low to high', facet: 'price', direction: 'asc' },
          { id: 'price-down', name: 'Price from high to low', facet: 'price', direction: 'desc' },
          { id: 'relevance', name: 'Relevance', facet: 'score', direction: 'desc' }
        ],
        filteringStrategy: 'filter'
      }
    }],
    '@vsf-enterprise/graphcms/nuxt',
    ['@vue-storefront/nuxt', {
      useRawSource: {
        dev: [
          '@vue-storefront/core',
          '@vsf-enterprise/commercetools',
          '@vsf-enterprise/graphcms',
        ],
        prod: [
          '@vue-storefront/core',
          '@vsf-enterprise/commercetools',
          '@vsf-enterprise/graphcms',
        ]
      }
    }],
  ],
  modules: [
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    '@vue-storefront/middleware/nuxt',
    '@vsf-enterprise/graphcms/nuxt',
    ['@vue-storefront/cache/nuxt', {
      enabled: process.env.REDIS_ENABLED === 'true',
      invalidation: {
        endpoint: process.env.CACHE_INVALIDATE_URL,
        key: process.env.CACHE_INVALIDATE_KEY,
        handlers: [
          '@vue-storefront/cache/defaultHandler'
        ]
      },
      driver: [
        '@vsf-enterprise/redis-cache',
        {
          // docs: https://github.com/luin/ioredis/blob/master/API.md#new-redisport-host-options
          redis: {
            keyPrefix: process.env.REDIS_KEY_PREFIX,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD
          }
        }
      ],
      // useRawSource: {
      //   dev: ['@vsf-enterprise/graphcms'],
      //   prod: ['@vsf-enterprise/graphcms']
      // },
    }]
  ],
  plugins: [],
  serverMiddleware: [],
  i18n: {
    currency: 'USD',
    country: 'US',
    countries: [
      { name: 'US', label: 'United States', states: ['California', 'Nevada'] },
      { name: 'AT', label: 'Austria' },
      { name: 'DE', label: 'Germany' },
      { name: 'NL', label: 'Netherlands' }
    ],
    currencies: [
      { name: 'EUR', label: 'Euro' },
      { name: 'USD', label: 'Dollar' }
    ],
    locales: [
      { code: 'en', label: 'English', file: 'en.js', iso: 'en' },
      { code: 'de', label: 'German', file: 'de.js', iso: 'de' }
    ],
    defaultLocale: 'en',
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: 'en',
      numberFormats: {
        en: {
          currency: {
            style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
          }
        },
        de: {
          currency: {
            style: 'currency', currency: 'EUR', currencyDisplay: 'symbol'
          }
        }
      }
    },
    detectBrowserLanguage: false
  },
  styleResources: {
    scss: [require.resolve('@storefront-ui/shared/styles/_helpers.scss', { paths: [process.cwd()] })]
  },
  publicRuntimeConfig: {
    theme
  },
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    },
    transpile: [
      'vee-validate/dist/rules'
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  }
};
