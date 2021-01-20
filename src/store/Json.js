const state = {
  Json: {}
}
const mutations = {
  setGlobalJson (state, val) {
    state.Json = val
  }
}
const actions = {}
const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
