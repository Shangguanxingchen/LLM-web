const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/amcoder",
  devServer: {
    proxy: {
      '/': {
        target: `https://www.500jf.com/`,
        changeOrigin: true,
        ws:false,
        pathRewrite: {
          '/': ``,
        },
      },
    },
    open: true,
    client: {
      overlay: false,
    },
  },
})
