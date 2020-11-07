/**
 * This file takes care of all the license management necessary for
 * your application.
 * It will show you a modal that prompts the user to enter their license
 * information.
 */

import LicenseManager from './../lib/LicenseManager'

export default {
  data() {
    return {
      licenseKey: mainStorage.get('licenseKey', ''),
      email: mainStorage.get('email', ''),
    }
  },
  computed: {
    hasValidLicense() {
      /**
       * Our license key is only valid when the signature (key) matches the data (email).
       */
      return LicenseManager.verifyLicenseKey(this.licenseKey, this.email)
    }
  },
  methods: {
    registerLicenseKeyListener() {
      mainStorage.onDidChange('licenseKey', (newValue) => {
        this.licenseKey = newValue;
      });

      mainStorage.onDidChange('email', (newValue) => {
        this.email = newValue;
      });
    },
  },
  mounted() {
    this.registerLicenseKeyListener();
  },
}