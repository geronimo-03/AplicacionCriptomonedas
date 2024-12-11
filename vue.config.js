const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    proxy: {
      "/api": {
        target: "https://laboratorio-ab82.restdb.io",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
      "/cripto": {
        target: "https://criptoya.com",
        changeOrigin: true,
        pathRewrite: { "^/cripto": "" },
      },
    },
  },
});
