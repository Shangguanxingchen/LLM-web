const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/amcoder",
  devServer: {
    proxy: {
      '/': {
        target: `https://xj.chinaamc.com:8000/`,
        changeOrigin: true,
        ws:false,
        pathRewrite: {
          '/': ``,
        },
      },
    },
    open: true
  },
})
