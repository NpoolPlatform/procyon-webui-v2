import { boot } from 'quasar/wrappers'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import { GoogleRecaptchaKey } from 'src/npoolstore/const'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // something to do
  app.use(VueReCaptcha, { siteKey: GoogleRecaptchaKey })
})
