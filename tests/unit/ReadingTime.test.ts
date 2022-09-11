import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import ReadingTime from '@components/ReadingTime.vue'

test('Viewing the reading time text', () => {
  let wrapper = mount(ReadingTime, {
    props: {
      time: 12
    }
  })

  const time = wrapper.find('.c-reading-time__time')
  expect(time.text()).toBeDefined()
})
