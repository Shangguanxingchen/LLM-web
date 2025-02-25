const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/amcoder",
  configureWebpack: (config) => {
    config.devtool = "source-map"
  },
  devServer: {
    // proxy: {
    //   '/': {
    //     target: `/`,
    //     changeOrigin: true,
    //     ws:false,
    //     pathRewrite: {
    //       '/': ``,
    //     },
    //   },
    // },
    // open: true,
    client: {
      overlay: false,
    },
  },
  lintOnSave: "warning",
})
