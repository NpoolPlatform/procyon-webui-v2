import { boot } from 'quasar/wrappers'
import InstantSearch from 'vue-instantsearch/vue3/es'

export default boot(({ app }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.use(InstantSearch)
})
