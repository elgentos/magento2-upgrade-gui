import Vue from 'vue'
import VueCodeHighlight from 'vue-code-highlight';
import 'prism-es6/components/prism-markup-templating';
import 'prism-es6/components/prism-php';
import 'prism-es6/components/prism-markup';

Vue.use(VueCodeHighlight)

import App from './App.vue'

// If you want to use Sentry for your error reporting, add your Sentry DSN configuration here.
// import * as Sentry from '@sentry/electron';
// Sentry.init({ dsn: 'your-dsn-url' });

const Storage = require('electron-store');

// We keep our main storage as a global variable
// so that it's automatically available in all
// our components
window.mainStorage = new Storage({
    watch: true,
    defaults: {
        email: '',
        licenseKey: ''
    }
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
