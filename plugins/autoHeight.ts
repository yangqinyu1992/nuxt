import type { App } from 'vue'
import autoHeightDirective from '~/directives/autoHeight'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('auto-height', autoHeightDirective)
})