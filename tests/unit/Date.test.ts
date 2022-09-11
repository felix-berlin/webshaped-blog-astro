import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Date from '@components/Date.vue'

describe('Date.vue', () => {
  let wrapper = mount(Date, {
    props: {
      date:"2020-04-06T10:34:09"
    }
  })

  test('Is component visible?', () => {
    const categoryList = wrapper.find('.c-date')
    expect(categoryList.exists()).toBe(true)
  })

  test('Check for right date format', () => {
    const categoryList = wrapper.find('.c-date').text()
    expect(/T/g.test(categoryList)).toBe(false)
  })
})
