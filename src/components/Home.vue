<template>
  <div>
    <div class="relative bg-white overflow-hidden" v-if="activeScreen === 'home'">
      <div class="max-w-screen-xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div class="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

          <main class="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h2 class="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                Magento 2 Upgrade
                <br class="xl:hidden">
                <span class="text-orange-600">GUI</span>
              </h2>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                A GUI tool to help you visually and easily spot differences in a three-way comparison between the version you upgraded <strong>from</strong>, the version you upgraded <strong>to</strong>, and your Magento preferences, plugins and overrides.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a href="#" v-on:click="openProjectDir" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                    Open your Magento 2 project dir
                  </a>
                </div>
              </div>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a href="#" v-on:click="openSettings" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                    Settings
                  </a>
                </div>
                <div class="rounded-md shadow ml-6">
                  <a href="#" v-on:click="openInstructions" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                    Instructions
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img class="border-b-8 border-orange-400 h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://d27i7n2isjbnbi.cloudfront.net/careers/photos/180422/normal_photo_1597776635.jpg" alt="">
      </div>
    </div>

    <div class="relative bg-white overflow-hidden" v-if="activeScreen === 'settings'">
      <div class="max-w-screen-xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div class="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

          <main class="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h2 class="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                Settings
              </h2>
              <div class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                <div>Gitlab host: <input type="text" name="gitlab_host" class="border" v-model="settings.gitlab.host" @change="updateSettings"  /></div>
                <div>Gitlab token: <input type="text" name="gitlab_token" class="border" v-model="settings.gitlab.token" @change="updateSettings"  /></div>
                <div>Gitlab project ID: <input type="text" name="gitlab_project_id" class="border" v-model="settings.gitlab.project_id" @change="updateSettings"  /></div>
                <div>Gitlab issue ID: <input type="text" name="gitlab_issue_id" class="border" v-model="settings.gitlab.issue_id" @change="updateSettings"  /></div>
                <div>Enable Git auto commit: <input type="checkbox" name="git_auto_commit" v-model="settings.git.auto_commit" @change="updateSettings"  /></div>
                <div>Git auto commit message: <input type="text" name="git_auto_commit_message" class="border" v-model="settings.git.auto_commit_message" @change="updateSettings" /></div>
              </div>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a href="#" v-on:click="openHome" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                    Close Settings
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <div class="relative bg-white overflow-hidden" v-if="activeScreen === 'instructions'">
      <div class="max-w-screen-xl mx-auto">
        <div class="">
          <svg class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div class="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

          <main class="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h2 class="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                Instructions
              </h2>
              <div>
                <p class="mb-4">To use this app, you will need the following files in your Magento 2 directory;</p>
                <ol>
                  <li>- vendor (regular composer directory)</li>
                  <li>- vendor.patch (generated by the upgrade patch helper)</li>
                  <li>- vendor_files_to_check.patch (generated by the upgrade patch helper)</li>
                  <li>- patch-helper-output.txt (the output generated by the upgrade patch helper, directed from stdout to a file)</li>
                  <li>- classmap.json (see below)</li>
                </ol>
                <p class="my-4">You will need to generate the classmap.json file yourself. This is needed because the tool needs to map PSR-4 classnames to actual filenames, which Composer can do for us. Run these commands to generate the file;</p>
                <blockquote class="font-mono">
                  composer dump --classmap-authoritative<br />
                  php -r "\$classmap=require_once('vendor/composer/autoload_classmap.php'); echo json_encode(\$classmap);" > classmap.json
                </blockquote>
              </div>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a href="#" v-on:click="openHome" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                    Close Instructions
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: 'Instructions',
  props: {
    msg: String
  },
  data() {
    return {
      activeScreen: 'home',
      settings: []
    }
  },
  mounted() {
    ipcRenderer.on('outputTableParsed', (event, args) => {
      if (args.warnings) {
        this.activeScreen = 'editor';
      }
    });
    ipcRenderer.on('settings', (event, args) => {
      this.settings = args.settings;
    });
  },
  methods: {
    openProjectDir: function () {
      ipcRenderer.send('openProjectDir');
    },
    openSettings: function () {
      ipcRenderer.send('openSettings');
      this.activeScreen = 'settings';
    },
    openInstructions: function () {
      this.activeScreen = 'instructions';
    },
    openHome: function () {
      this.activeScreen = 'home';
    },
    updateSettings: function () {
      ipcRenderer.send('updateSettings', this.settings);
    }
  }
}
</script>
