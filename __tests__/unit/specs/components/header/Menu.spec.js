import { mount, createLocalVue } from '@vue/test-utils'
import mixins from '@/mixins'
import { HeaderMenuDesktop, HeaderMenuMobile } from '@/components/header/menu'
import VueI18n from 'vue-i18n'
import Vuex from 'vuex'
import router from '@/router/index'

describe('Components > Header > Menu', () => {
  let wrapper
  let pushMock
  let dispatchMock

  const localVue = createLocalVue()
  localVue.use(VueI18n)
  localVue.use(Vuex)

  const i18n = new VueI18n({
    locale: 'en-gb',
    fallbackLocale: 'en-gb',
    messages: { 'en-gb': {} },
    silentTranslationWarn: true
  })

  const store = new Vuex.Store({
    modules: {
      ui: {
        namespaced: true,
        state: {
          menuVisible: true,
          nightMode: false
        },
        getters: {
          menuVisible: state => true,
          nightMode: state => false
        },
        actions: {
          setMenuVisible: jest.fn()
        }
      }
    },
    strict: true
  })

  describe('Desktop', () => {
    beforeEach(() => {
      pushMock = jest.fn(params => {
        return 'name' in params && name.length > 0
      })
      router.push = pushMock

      dispatchMock = jest.fn()
      store.dispatch = dispatchMock

      wrapper = mount(HeaderMenuDesktop, {
        i18n,
        localVue,
        mixins,
        store,
        router
      })
    })

    it('should be possible to click on menu option', () => {
      const items = wrapper.findAll('.menu-button')

      for (let i = 0; i < items.length; ++i) {
        items.at(i).trigger('click')
        expect(pushMock).toHaveBeenCalledTimes(i + 1)
        expect(pushMock).toHaveLastReturnedWith(true)
      }
    })

    it('should be possible to close menu on desktop', () => {
      wrapper.find('div > button:not(.menu-button)').trigger('click')

      expect(dispatchMock).toHaveBeenCalledTimes(1)
      expect(dispatchMock).toHaveBeenCalledWith('ui/setMenuVisible', false)
    })
  })

  describe('Mobile', () => {
    beforeEach(() => {
      pushMock = jest.fn(params => {
        return 'name' in params && name.length > 0
      })
      router.push = pushMock

      dispatchMock = jest.fn()
      store.dispatch = dispatchMock

      wrapper = mount(HeaderMenuMobile, {
        i18n,
        localVue,
        mixins,
        store,
        router
      })
    })

    it('should be possible to click on menu option', () => {
      const items = wrapper.findAll('.menu-container > li > div')

      for (let i = 0; i < items.length; ++i) {
        items.at(i).trigger('click')
        expect(pushMock).toHaveBeenCalledTimes(i + 1)
        expect(pushMock).toHaveLastReturnedWith(true)
      }
    })
  })
})
