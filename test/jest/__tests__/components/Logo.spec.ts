import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Announcement from '../../../../src/components/announcement/Announcement.vue'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'

// Specify here Quasar config you'll need to test your component
installQuasarPlugin()

test('Logo Test', () => {
  // CAN NOT THIS IMPORT
  const wrapper = mount(Announcement, {
    global: {
      plugins: [createTestingPinia()]
    }
  })
  expect(wrapper.html()).toContain('')
})
