<template>
  <div v-if="overrides">
    <div>
      <select @change="loadOverride" id="override" class="-mr-2 rounded-md mt-1 form-select block w-full -ml-1 pl-3 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 bg-indigo-200">
        <option>Select a preference/plugin/override</option>
        <option v-for="(override, index) in overrides" :key="index" :value="index">{{ override[0] }}: {{ override[1] }} {{ override[2] }}</option>
      </select>
    </div>

    <span class="relative z-0 inline-flex shadow-sm rounded-md my-4" v-if="selectedOverride">
      <button type="button" class="ml-2 bg-gray-400 relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-gray-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Previous (←)
      </button>
      <button type="button" class="bg-green-400 -ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-green-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Mark as Fixed (F)
      </button>
      <button type="button" class="bg-green-200 -ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-green-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Mark as False Positive (P)
      </button>
      <button type="button" class="bg-orange-200 -ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-orange-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Mark as Fix later (L)
      </button>
      <button type="button" class="bg-red-200 -ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-red-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Mark as Cannot fix (N)
      </button>
      <button type="button" class="bg-gray-200 -ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-900 hover:text-gray-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
        Next (→)
      </button>
    </span>

    <div class="flex flex-row mt-2" v-if="selectedOverride">
      <div class="w-1/2 bg-indigo-200 px-4 py-2 overflow-y-scroll">
        <h2 class="mb-4 font-bold">Diff</h2>
        <div>
          <pre class="text-xs">{{ vendorFileContent }}</pre>
        </div>
      </div>
      <div class="w-1/2 bg-indigo-300 px-4 py-2 overflow-y-scroll">
        <h2 class="mb-4 font-bold">{{ type }}</h2>
        <div >
          <pre class="text-xs">{{ customFileContent }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

const fs = require('fs');
const runner = require('child_process');

export default {
  data() {
    return {
      type: '',
      classMap: null,
      overrides: null,
      selectedOverride: null,
      vendorCheckDiffs: [],
      vendorFileContent: '',
      customFileContent: ''
    }
  },
  mounted() {
    ipcRenderer.on('overridesParsed', (event, args) => {
      this.overrides = args.contents;
    })
    ipcRenderer.on('vendorCheckDiffs', (event, args) => {
      this.vendorCheckDiffs = args.contents;
    })
  },
  methods: {
    loadOverride: function (event) {
      if (event.target.value in this.overrides) {
        // how to negate "in" operator??
      } else {
        this.selectedOverride = null;
        return;
      }
      let [type, vendorFilePath, customFilePath] = this.overrides[event.target.value];
      this.selectedOverride = vendorFilePath;
      this.type = type;
      customFilePath = customFilePath.replace('data/', '/home/peterjaap/development/workspace/');

      if (type === 'Preference' || type === 'Plugin') {
        // load authoritative classmap from Composer autoloader
        if (!this.classMap) {
          runner.exec('php -r "\\$classmap = require_once(\'/data/zechsal/magento2/vendor/composer/autoload_classmap.php\'); echo json_encode(\\$classmap);"', function (err, json) {
            console.log(json);
            this.classMap = JSON.parse(json);
          });
        }

        console.log(this.classMap);

        // find class name
        let className = customFilePath;
        let methodName = null;
        if (type === 'Plugin') {
          [className, methodName] = customFilePath.split('::');
        }
        // add slashes
        className = className.replace('\\', '\\\\');

        console.log(className);
        console.log(methodName);
        // find class

      }

      if (fs.existsSync(customFilePath)) {
        this.customFileContent = fs.readFileSync(customFilePath);
      } else {
        this.customFileContent = 'Could not find contents of ' + customFilePath;
      }

      if (vendorFilePath in this.vendorCheckDiffs) {
        this.vendorFileContent = this.vendorCheckDiffs[vendorFilePath];
      } else {
        this.vendorFileContent = 'Could not find diff info for ' + vendorFilePath;
      }
    }
  }
}
</script>
