export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  store: true,
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  env:{
    apiUrl: process.env.API_URL,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt2-script-setup-example',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css',
    '@mdi/font/css/materialdesignicons.css'
  ],

  
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    ['@nuxt/typescript-build', { typeCheck: false }],
    '@nuxtjs/vuetify',
  ],

  scriptSetup: {
    refTransform: true
  },

  vuetify: {
    customVariables: ['~/assets/css/main.css'],
    treeShake: true,
    optionsPath: './vuetify.options.js',
    defaultAssets: false,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00'
        }
      }
    }
  }
}
