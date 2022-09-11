import { mount, shallowMount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import SocialList from '@components/SocialList.vue'
import { Github, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-vue-next'

describe('SocialList.vue', () => {
  let wrapper = mount(SocialList, {
    props: {
      socialItems: {
        facebook: 'https://fb.test',
        github: 'https://gh.lol'
      }
    }
  })

  test('Test if all list elements are there', () => {
    const list = wrapper.findAll('.c-social-list__link')
    expect(list).toHaveLength(2)
  })

  test('Test if all components are mounted', () => {
    expect(wrapper.findComponent(Facebook).exists()).toBe(true)
    expect(wrapper.findComponent(Linkedin).exists()).toBe(false)
    expect(wrapper.findComponent(Github).exists()).toBe(true)
  })
})
