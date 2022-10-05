<template>
  <div v-if="overrides">
    <div>
      <select
        @change="setSelectedFile"
        id="override"
        class="block w-full py-2 pl-3 mt-1 -ml-1 -mr-2 text-base leading-6 bg-orange-200 border-gray-300 rounded-md form-select focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
      >
        <option>Select a preference/plugin/override</option>
        <option
          v-for="(override, index) in overrides"
          :key="index"
          :value="index"
        >
          {{ override[1] }}: {{ override[2] }} {{ override[3] }} ({{ override[0] }})
        </option>
      </select>
    </div>

    <span
      class="relative z-0 inline-flex my-4 rounded-md shadow-sm"
    >
      <button
          @click="processActionBar('previous')"
          type="button"
          class="relative inline-flex items-center px-4 py-2 ml-2 text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-gray-400 border border-gray-300 rounded-l-md hover:text-gray-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Previous (←)
      </button>
      <button
          @click="processActionBar('resolved')"
          type="button"
          class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-green-400 border border-gray-300 hover:text-green-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Mark as Resolved (R)
      </button>
      <button
          @click="processActionBar('skipped')"
          type="button"
          class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-orange-200 border border-gray-300 hover:text-orange-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Mark as Skipped (S)
      </button>
      <button
          @click="processActionBar('cannot-fix')"
          type="button"
          class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-red-200 border border-gray-300 hover:text-red-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Mark as Cannot fix (N)
      </button>
      <button
          @click="processActionBar('unresolved')"
          type="button"
          class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-white-200 border border-gray-300 hover:text-red-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Mark as Unresolved (U)
      </button>
      <button
          @click="processActionBar('next')"
          type="button"
          class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out bg-white bg-gray-200 border border-gray-300 rounded-r-md hover:text-gray-900 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700"
      >
        Next (→)
      </button>
    </span>

    <div class="flex flex-row mt-2" v-if="selectedOverride">
      <div class="w-1/2 px-4 py-2 overflow-y-scroll bg-orange-200">
        <h2 class="mb-4 font-bold">Diff</h2>
        <h3 class="mb-4 font-bold">
          <a :href="'http://localhost:63342/api/file?file=' + relativePathVendorFileOrig" target="phpstorm-api-call">Original vendor file</a> |
          <a :href="'http://localhost:63342/api/file?file=' + relativePathVendorFile" target="phpstorm-api-call">New vendor file</a> |
          <a href="#" @click.prevent.self="openThreeWayDiff()">Open three way diff</a>
        </h3>
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
        <h3 class="mb-4 font-bold"><a :href="'http://localhost:63342/api/file?file=' + relativePath" target="phpstorm-api-call">{{ relativePath }}</a></h3>
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
import {markdownTable} from 'markdown-table'

const fs = require("fs");

export default {
  components: {
    PrismEditor,
  },
  data() {
    return {
      componentKey: 0,
      type: "",
      relativePath: "",
      relativePathVendorFile: "",
      relativePathVendorFileOrig: "",
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
      selectedFile: null
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
    ipcRenderer.on("navigationBar", (event, args) => {
      this.processActionBar(args.action);
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
  watch: {
    selectedFile: function() {
      this.loadOverride()
    }
  },
  methods: {
    vendorFileContentHighlighter(code) {
      return highlight(code, languages[this.vendorFileType]);
    },
    customFileContentHighlighter(code) {
      return highlight(code, languages[this.customFileType]);
    },
    setSelectedFile: function (event) {
      this.selectedFile = event.target.value;
    },
    loadOverride: function() {
      if (!(this.selectedFile in this.overrides)) {
        this.selectedOverride = null;
        return;
      }

      let methodName = null;
      let [, type, vendorFilePath, customFilePath] = this.overrides[this.selectedFile];
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
      this.relativePath = this.getRelativePath(customFilePath);
      this.relativePathVendorFile = this.getRelativePath(vendorFilePath);
      this.relativePathVendorFileOrig = this.relativePathVendorFile.replace('vendor', 'vendor_orig');
      customFilePath = this.getAbsolutePath(customFilePath);
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
    },
    openThreeWayDiff() {
      ipcRenderer.send('openThreeWayDiff', {
        vendorOrigFile: this.selectedMagento2ProjectDir + '/' + this.relativePathVendorFileOrig,
        vendorFile: this.selectedMagento2ProjectDir + '/' + this.relativePathVendorFile,
        overrideFile: this.selectedMagento2ProjectDir + '/' + this.relativePath
      });
    },
    processActionBar(action) {
      let element = document.querySelector('#override');
      if (action === 'next') {
        element.selectedIndex += 1;
        this.selectedFile = element.value;
      } else if (action === 'previous') {
        element.selectedIndex -= 1;
        this.selectedFile = element.value;
      }

      let [,,, customFilePath] = this.overrides[this.selectedFile];

      if (action === 'resolved' || action === 'cannot-fix' || action === 'skipped' || action === 'unresolved') {
        this.overrides[this.selectedFile][0] = action;
        this.writeResultsJsonFile();
        let table = this.generateMarkdownTable();
        this.writeMarkdownTableToFile.call(this, table);
        this.updateGitlabIssueNote(table);
        this.runGitCommands(customFilePath);
        this.processActionBar('next');
      }
    },
    generateMarkdownTable: function () {
      let table = markdownTable([['Status', 'Type', 'Vendor file', 'Project file']].concat(this.overrides));
      table = table.replaceAll('unresolved', ':grey_question:');
      table = table.replaceAll('resolved', ':white_check_mark:');
      table = table.replaceAll('skipped', ':arrow_heading_down:');
      return table.replaceAll('cannot-fix', ':x:');
    },
    writeMarkdownTableToFile(table) {
      fs.writeFileSync(this.selectedMagento2ProjectDir + '/results.md', table);
    },
    writeResultsJsonFile: function () {
      fs.writeFileSync(this.selectedMagento2ProjectDir + '/results.json', JSON.stringify(this.overrides));
    },
    getAbsolutePath(path) {
      if (path.indexOf(this.selectedMagento2ProjectDir) > -1) {
        return path;
      }
      return this.selectedMagento2ProjectDir + "/" + this.relativePath;
    },
    getRelativePath(path) {
      if (path.indexOf('/data/') > -1) {
        // support for https://github.com/JeroenBoersma/docker-compose-development/
        path = path.replace(/\/data\/(.*)\/magento2\//i, '', path);
      }
      return path.replace(this.selectedMagento2ProjectDir + "/", "");
    },
    updateGitlabIssueNote(table) {
      ipcRenderer.send('update-gitlab-issue', {table: table})
    },
    runGitCommands(file) {
      ipcRenderer.send('run-git-commands', {file: file});
    }
  }
};
</script>
