const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/amcoder",
  configureWebpack: (config) => {
    config.devtool = "source-map"
  },
  devServer: {
    proxy: {
      '/': {
        // target: `https://www.500jf.com/`,
        target: `http://139.129.39.177`,
        changeOrigin: true,
        ws:false,
        pathRewrite: {
          '/': ``,
        },
      },
    },
    // open: true,
    client: {
      overlay: false,
    },
  },
  lintOnSave: "warning",
})
