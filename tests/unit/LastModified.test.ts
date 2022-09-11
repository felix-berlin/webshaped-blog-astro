import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import LastModified from '../../src/components/LastModified.vue'

test('Test LastModified', () => {
  let wrapper = mount(LastModified, {
    props: {
      date: '2022-08-17T13:45:09'
    }
  })

  const time = wrapper.find('.c-last-modified')
  expect(time.text()).toBeDefined()
})
