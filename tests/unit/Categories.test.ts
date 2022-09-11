import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Categories from '@components/Categories.vue'

describe('Categories.vue', () => {
  let wrapper = mount(Categories, {
    props: {
      categories: {
        edges: [
          {
            node: {
              name: 'Coool Tech',
              parent: null,
              children: {
                edges: [],
              }
            }
          }
        ]
      }
    }
  })

  let emptyWrapper = mount(Categories, {
    props: {
      categories: {
        edges: [
          {
            node: {
              name: 'Uncategorized',
              parent: null,
              children: {
                edges: [],
              }
            }
          }
        ]
      }
    }
  })

  test('Viewing the reading time text', () => {
    const categoryList = wrapper.find('.c-categories')
    expect(categoryList.text()).toBeDefined()
  })

  test('Is component hidden?', () => {
    const categoryList = emptyWrapper.find('.c-categories')
    expect(categoryList.exists()).toBe(false)
  })
})
