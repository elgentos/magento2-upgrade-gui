<template>
  <div v-if="overrides">
    <div>
      <select
        @change="loadOverride"
        id="override"
        class="block w-full py-2 pl-3 mt-1 -ml-1 -mr-2 text-base leading-6 bg-orange-200 border-gray-300 rounded-md form-select focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
      >
        <option>Select a preference/plugin/override</option>
        <option
          v-for="(override, index) in overrides"
          :key="index"
          :value="index"
        >
          {{ override[0] }}: {{ override[1] }} {{ override[2] }}
        </option>
      </select>
    </div>

    <span
      class="relative z-0 inline-flex my-4 rounded-md shadow-sm hidden"
    >
      <button
        type="button"
        class="relative inline-flex items-center px-4 py-2 ml-2 text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-gray-400 border border-gray-300 rounded-l-md hover:text-gray-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Previous (←)
      </button>
      <button
        type="button"
        class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-green-400 border border-gray-300 hover:text-green-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Mark as Fixed (F)
      </button>
      <button
        type="button"
        class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-green-200 border border-gray-300 hover:text-green-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Mark as False Positive (P)
      </button>
      <button
        type="button"
        class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-orange-200 border border-gray-300 rounded-r-md hover:text-orange-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Mark as Fix later (L)
      </button>
      <button
        type="button"
        class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-red-200 border border-gray-300 rounded-r-md hover:text-red-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Mark as Cannot fix (N)
      </button>
      <button
        type="button"
        class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-gray-200 border border-gray-300 rounded-r-md hover:text-gray-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Next (→)
      </button>
    </span>

    <div class="flex flex-row mt-2" v-if="selectedOverride">
      <div class="w-1/2 px-4 py-2 overflow-y-scroll bg-orange-200">
        <h2 class="mb-4 font-bold">Diff</h2>
        <div>
          <prism-editor
            class="my-editor vendor-file-content-editor height-300"
            v-model="vendorFileContent"
            :highlight="vendorFileContentHighlighter"
            :line-numbers="lineNumbers"
          ></prism-editor>
        </div>
      </div>
      <div class="w-1/2 px-4 py-2 overflow-y-scroll bg-orange-300">
        <h2 class="mb-4 font-bold">{{ type }}</h2>
        <h3 class="mb-4 font-bold"><a :href="'http://localhost:8091?message=' + copyPasteableFilePath">{{ copyPasteableFilePath }}</a></h3>
        <div>
          <prism-editor
            class="my-editor custom-file-content-editor height-300"
            v-model="customFileContent"
            :highlight="customFileContentHighlighter"
            :line-numbers="lineNumbers"
          ></prism-editor>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* required class */
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>
<style>
span.function.token.methodHighlight {
  background-color: yellow;
  border: 3px solid red;
  padding: 5px;
}
</style>

<script>
import { ipcRenderer } from "electron";
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-php";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles

const fs = require("fs");

export default {
  components: {
    PrismEditor,
  },
  data() {
    return {
      type: "",
      copyPasteableFilePath: "",
      classMap: null,
      overrides: null,
      selectedOverride: null,
      vendorCheckDiffs: [],
      vendorFileContent: "",
      customFileContent: "",
      vendorFileType: "diff",
      customFileType: "diff",
      selectedMagento2ProjectDir: null,
      lineNumbers: true,
      methodName: null,
    };
  },
  mounted() {
    ipcRenderer.on("overridesParsed", (event, args) => {
      this.overrides = args.contents;
    });
    ipcRenderer.on("vendorCheckDiffs", (event, args) => {
      this.vendorCheckDiffs = args.contents;
    });
    ipcRenderer.on("selectedMagento2ProjectDir", (event, args) => {
      this.selectedMagento2ProjectDir = args.dir;
    });
  },
  updated: function() {
    if (this.type === "Plugin" && this.methodName !== null) {
      let highlightElement = [
        ...document.querySelectorAll("span.function.token"),
      ]
        .map((span) => (span.innerText === this.methodName ? span : false))
        .filter(Boolean)
        .shift();
      if (highlightElement) {
        highlightElement.classList.add("methodHighlight");
      }
    }
  },
  methods: {
    vendorFileContentHighlighter(code) {
      return highlight(code, languages[this.vendorFileType]);
    },
    customFileContentHighlighter(code) {
      return highlight(code, languages[this.customFileType]);
    },
    loadOverride: function(event) {
      if (event.target.value in this.overrides) {
        // how to negate "in" operator??
      } else {
        this.selectedOverride = null;
        return;
      }
      let methodName = null;
      let [type, vendorFilePath, customFilePath] = this.overrides[
        event.target.value
      ];
      this.selectedOverride = vendorFilePath;
      this.type = type;

      if (type === "Preference" || type === "Plugin") {
        // load authoritative classmap from Composer autoloader
        if (!this.classMap) {
          this.classMap = JSON.parse(
            fs.readFileSync(this.selectedMagento2ProjectDir + "/classmap.json")
          );
        }

        // find class name
        let className = customFilePath;
        if (type === "Plugin") {
          [className, methodName] = customFilePath.split("::");
        }

        // find class
        if (className in this.classMap) {
          customFilePath = this.classMap[className];
        }
      }

      this.methodName = methodName;
      this.copyPasteableFilePath = customFilePath.replace("data/", "");
      customFilePath = this.fixPath(customFilePath);
      this.customFileType = customFilePath.split(".").pop();
      if (this.customFileType === "phtml") {
        this.customFileType = "php";
      }
      if (fs.existsSync(customFilePath)) {
        this.customFileContent = fs.readFileSync(customFilePath).toString();
      } else {
        this.customFileContent = "Could not find contents of " + customFilePath;
      }

      this.vendorFileType = "diff";
      if (vendorFilePath in this.vendorCheckDiffs) {
        this.vendorFileContent = this.vendorCheckDiffs[vendorFilePath];
      } else {
        this.vendorFileContent =
          "Could not find diff info for " + vendorFilePath;
      }

      // Highlight the method name for plugins
      // Unfortunately we need a little setInterval because we can't hook into the after-render callback from Prism
      // setInterval(function () {
      //
      // }, 100);
    },
    fixPath(path) {
      if (path.indexOf("/data/") > -1) {
        path = path.split("magento2/")[1];
      }
      return this.selectedMagento2ProjectDir + "/" + path;
    },
  },
};
</script>
