import { mount, createLocalVue } from '@vue/test-utils'
import CurrencyMixin from '@/mixins/currency'
import NetworkMixin from '@/mixins/network'
import TotalForged from '@/components/monitor/header/TotalForged'
import VueI18n from 'vue-i18n'
import Vuex from 'vuex'

const getTotalForged = (height, offset) => {
  return height > offset ? (height - offset) * 2 : 0
}

describe('Components > Monitor > TotalForged', () => {
  let wrapper
  let store

  beforeEach(() => {
    const localVue = createLocalVue()

    localVue.use(VueI18n)
    localVue.use(Vuex)

    const i18n = new VueI18n({
      locale: 'en-gb',
      fallbackLocale: 'en-gb',
      messages: { 'en-gb': {} },
      silentTranslationWarn: true
    })

    const networkState = {
      height: 13515,
      rewardOffset: 6413
    }

    store = new Vuex.Store({
      modules: {
        network: {
          namespaced: true,
          state: networkState,
          getters: {
            height: state => networkState.height,
            rewardOffset: state => networkState.rewardOffset
          },
          mutations: {
            setHeight (state, payload) {
              state.height = payload.value
            }
          },
          actions: {
            setHeight: ({ commit }, value) => {
              commit({
                type: 'setHeight',
                value
              })
            }
          }
        }
      },
      strict: true
    })

    wrapper = mount(TotalForged, {
      i18n,
      localVue,
      mixins: [CurrencyMixin, NetworkMixin],
      store
    })
  })

  it('should display calculated result', (done) => {
    expect.assertions(1)

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('div > div.text-lg').text())
        .toBe(getTotalForged(store.getters['network/height'], store.getters['network/rewardOffset']).toLocaleString())
      done()
    })
  })

  it('should change calculated result when height changes', (done) => {
    expect.assertions(2)

    wrapper.vm.$nextTick(() => {
      let textBeforeChange = wrapper.find('div > div.text-lg').text()
      store.dispatch('network/setHeight', 13518)

      wrapper.vm.$nextTick(() => {
        let textAfterChange = wrapper.find('div > div.text-lg').text()
        expect(textAfterChange)
          .toBe(getTotalForged(store.getters['network/height'], store.getters['network/rewardOffset']).toLocaleString())
        expect(textBeforeChange).not.toBe(textAfterChange)

        done()
      })
    })
  })

  it('should handle offsets greater than heights', (done) => {
    expect.assertions(1)

    store.dispatch('network/setHeight', 1)

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('div > div.text-lg').text())
        .toBe((0).toLocaleString())

      done()
    })
  })
})
