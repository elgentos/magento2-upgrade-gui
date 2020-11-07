<template>
  <div class="licensing-wrapper">
    <div class="window">
      <div class="flex-1 flex flex-col px-4">
        <div class="pb-4">
          <h1 class="text-2xl">Activate {{ appName }}</h1>
          <p>
            Please enter your license information in order to activate {{ appName }}.<br>
          </p>
        </div>

        <hr />

        <div class="form-group py-4">
          <label>Email address</label>
          <input type="email" v-model="email" class="form-control" placeholder="Email">
        </div>
        <div class="form-group">
          <label>License key</label>
          <input type="text" v-model="key" class="form-control" placeholder="License key">
        </div>
      </div>
      <footer class="toolbar toolbar-footer">
        <div class="toolbar-actions">
          <button class="btn btn-default" @click="quit">
            Quit
          </button>

          <button class="btn btn-default" @click="openWebsite">
            Contact
          </button>

          <button class="btn btn-primary pull-right" @click="activateLicense">
            Activate License
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron';
import LicenseManager from './../lib/LicenseManager'

export default {
  data() {
    return {
        appName: remote.app.getName(),
        email: '',
        key: '',
    };
  },

  methods: {
    activateLicense() {
      if (LicenseManager.verifyLicenseKey(this.key, this.email)) {
        mainStorage.set('email', this.email);

        mainStorage.set('licenseKey', this.key);
      } else {
        alert("Invalid license key provided.")
      }
    },

    openWebsite() {
      remote.shell.openExternal('YOUR-PRODUCT-WEBSITE');
    },

    quit() {
      remote.app.exit();
    }
  }
};
</script>

<style scoped src="./../assets/css/photon.css"></style>

<style>
.licensing-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 150;
  background: rgba(0, 0, 0, 0.5);
}
.window {
  height: 400px !important;
  width: 75%;
  margin: 0 auto;
}
.form-group label {
  font-weight: bold;
}
</style>
