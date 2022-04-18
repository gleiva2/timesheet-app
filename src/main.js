import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import vuetify from './plugins/vuetify'
import moment from 'moment'

// Import the Auth0 configuration
import { domain, clientId } from '../auth_config.json';

// Import the plugin here
import { Auth0Plugin } from './auth';

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.config.productionTip = false
Vue.prototype.moment = moment

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
