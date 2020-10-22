import RestaurantService from '@/services/RestaurantService'

const state = {
  cities: [],
}

const getters = {

}

const mutations = {

  SET_CITIES(context, cities) {
    context.cities = cities
  },

}

const actions = {

  getCities(context) {
    if (context.state.cities.length) {
      return
    }
    return RestaurantService.getCities().then(response => {
      context.commit('SET_CITIES', response.data)
    })
  },

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};