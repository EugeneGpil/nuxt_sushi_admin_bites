import Axios from 'axios'

export default {

  getCities() {
    return Axios.get('/city/list')
  },

  updateRestaurant(data) {
    let requestData = JSON.parse(JSON.stringify(data))
    let id = data.id
    delete requestData.id
    return Axios.put(`/admin/restaurant/${id}`, requestData)
  },

  createRestaurant(data) {
    return Axios.post('/admin/restaurant', data)
  },

  deleteRestaurant(id) {
    return Axios.delete(`/admin/restaurant/${id}`)
  },

}