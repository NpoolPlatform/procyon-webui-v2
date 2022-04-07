import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Avatar from '../../../../src/components/avatar/Avatar.vue'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'

// Specify here Quasar config you'll need to test your component
installQuasarPlugin()

test('Logo Test', () => {
  // CAN NOT THIS IMPORT
  const wrapper = mount(Avatar, {
    global: {
      plugins: [createTestingPinia()]
    }
  })
  expect(wrapper.html()).toContain('')
})
