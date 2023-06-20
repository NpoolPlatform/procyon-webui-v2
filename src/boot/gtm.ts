import { boot } from 'quasar/wrappers'
import VueGtag from 'vue-gtag'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app, router }) => {
  app.use(
    VueGtag,
    {
      config: {
        id: 'G-5QW76XNF2Q'
      }
    },
    router
  )
})
