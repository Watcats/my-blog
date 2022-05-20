const path = require('path')
const { name } = require('./package')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  filenameHashing: true,
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: true,
  productionSourceMap: false,
  devServer: {
    hot: true,
    historyApiFallback: true,
    allowedHosts: "all",
    // 修改默认端口，和注册时一直
    port: 3002,
    // overlay: {
    //   warnings: true,
    //   errors: true
    // },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy:{
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        ws: true,
        rewrite: (pathStr) => pathStr.replace('/api', '')
      },
    }

  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 让主应用能正确识别微应用暴露出来的一些信息
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把子应用打包成 umd 库格式
      chunkLoadingGlobal: `webpackJsonp_${name}`
    }
  }
}
