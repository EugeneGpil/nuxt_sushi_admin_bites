import VacancyService from '@/services/VacancyService'

const mergeArraysById = (array1, array2) => {

	let res = JSON.parse(JSON.stringify(array1));

	for (let i = 0; i < array2.length; i++) {

		let isElementAdded = false;

		for (let j = 0; j < res.length; j++) {

			if (res[j].id == array2[i].id) {

				res[j] = JSON.parse(JSON.stringify(array2[i]))
				isElementAdded = true
				break
			}
		}

		if (!isElementAdded) {
			res.push(JSON.parse(JSON.stringify(array2[i])))
		}
	}

	return res;
}

const state = {
  cities: [],
  restaurants: [],
  images: []
}

const getters = {

}

const mutations = {

  SET_CITIES(context, cities) {
    context.cities = cities
  },

  ADD_RESTAURANTS(context, restaurants) {
    context.restaurants = mergeArraysById(context.restaurants, restaurants)
  },

  SET_IMAGES(context, images) {
    context.images = images
  },

}

const actions = {

  getCities(context) {
    if (context.state.cities.length) {
      return
    }
    return VacancyService.getCities().then(response => {
      context.commit('SET_CITIES', response.data)
    })
  },

  getRestaurantsByCityId(context, cityId) {
    if (!cityId) {
      return
    }
    for (let i = 0; i < context.state.restaurants.length; i++) {
      if (context.state.restaurants[i].city_id == cityId) {
        return
      }
    }
    return VacancyService.getRestaurantsByCityId(cityId).then(response => {
      context.commit('ADD_RESTAURANTS', response.data)
    })
  },

  getAllImages(context) {
    if (context.state.images.length) {
      return
    }
    return VacancyService.getAllImages().then(response => {
      context.commit('SET_IMAGES', response.data)
    })
  },

  updateImages(context) {
    return VacancyService.getAllImages().then(response => {
      context.commit('SET_IMAGES', response.data)
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