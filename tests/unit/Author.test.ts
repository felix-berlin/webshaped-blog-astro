import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Author from '../../src/components/Author.vue'

describe('Author.vue', () => {
  let wrapper = mount(Author, {
    props: {
      author: {
        node: {
          avatar: {
            foundAvatar: false,
            height: null,
            url: null,
            width:  null,
          },
          email: 'test@lol.cool',
          firstName: 'Testerella',
          lastName: 'Doe',
          description: 'Cool Dev with lot of skills',
          id: 'XYZ',
          seo: {
            social: {
              facebook: 'https://fb.lol',
              // instagram: string,
              // linkedIn: string,
              // mySpace: string,
              // pinterest: string,
              // soundCloud: string,
              // twitter: string,
              // wikipedia: string,
              // youTube: string,
            }
          },
          socialAdvanced: {
            github: 'https://gh.test',
          }
        }
      }
    }
  })

  test('Viewing for the author names', () => {
    const name = wrapper.find('.c-author__name')
    expect(name.text()).toBeDefined()
  })

  test('Make sure author image is not every time availalbe', () => {
    const image = wrapper.find('.c-author__image')

    expect(image.exists()).toBe(false)
  })
})


