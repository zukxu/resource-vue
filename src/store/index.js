import state from './state'
import mutation from './mutation'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state, mutation
})
export default store
