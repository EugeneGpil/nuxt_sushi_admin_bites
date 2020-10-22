module.exports = {
  devServer: {
    host: process.env.VUE_APP_BASE_URL
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Admin'
        return args
      })
  }
}