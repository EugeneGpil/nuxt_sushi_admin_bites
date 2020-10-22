import Axios from 'axios'

export default {

  getCities() {
    return Axios.get('/city/list')
  },

  getRestaurantsByCityId(cityId) {
    return Axios.get(`/city/${cityId}/restaurants`)
  },

  getAllImages() {
    return Axios.get('/vacancy_image/list')
  },

  deleteImage(id) {
    return Axios.delete(`/admin/vacancy_image/${id}`)
  },

  addImage(formData) {
    return Axios.post(
      '/admin/vacancy_image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      },
    )
  },

  updateVacancy(data) {
    return Axios.put('/admin/vacancy', data)
  },

  addVacancy(data) {
    return Axios.post('/admin/vacancy', data)
  },

  deleteVacancy(id) {
    return Axios.delete(`/admin/vacancy/${id}`)
  },

}