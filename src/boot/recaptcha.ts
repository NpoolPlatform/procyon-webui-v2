import { boot } from 'quasar/wrappers'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import { GoogleRecaptchaKey } from 'npool-cli-v2/const'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // something to do
  app.use(VueReCaptcha, { siteKey: GoogleRecaptchaKey })
})
