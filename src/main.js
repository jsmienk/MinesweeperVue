import Vue from 'vue'
import App from './App.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import Minefield from './Minefield.vue'
import ButtonSwitch from "./ButtonSwitch.vue"
import MinefieldCell from "./MinefieldCell.vue"

Vue.component('minesweeper-header', Header)
Vue.component('minesweeper-field', Minefield)
Vue.component('minesweeper-field-cell', MinefieldCell)
Vue.component('minesweeper-footer', Footer)
Vue.component('app-button-switch', ButtonSwitch)

new Vue({
  el: '#app',
  render: h => h(App)
})
