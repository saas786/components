const vue = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')

module.exports = {
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@/Jetstream': './src/Elements',
    },
  },
}
