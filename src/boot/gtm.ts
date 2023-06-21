import { boot } from 'quasar/wrappers'
import VueGtag from 'vue-gtag'
import { RouteLocationNormalized } from 'vue-router'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app, router }) => {
  app.use(
    VueGtag,
    {
      appName: 'Procyon',
      pageTrackerScreenviewEnabled: true,
      config: {
        id: 'G-WMDW59ENZM'
      },
      pageTrackerTemplate (to: RouteLocationNormalized) {
        return {
          page_title: to.meta.Title,
          page_path: to.path
        }
      }
    },
    router
  )
})
