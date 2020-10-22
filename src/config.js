var apiUrl = process.env.VUE_APP_API_URL
module.exports = {
    apiUrl: `${apiUrl}/api/`,
    sanctumUrl: `${apiUrl}/sanctum/csrf-cookie`,
    authUrl: apiUrl,
    storage: `${apiUrl}/storage/`
};
