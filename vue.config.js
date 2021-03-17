module.exports = {
  configureWebpack: {
    entry: {
      app: './src/main-dev.js'
    },
    resolve: {
      // 配置路径别名
      alias: {
        assets: "@/assets",
        common: "@/common",
        components: "@/components",
        network: "@/network",
        views: "@/views"
      }
    }
  }
};
