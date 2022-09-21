<template>
  <div>
    <div class="relative bg-white overflow-hidden" v-if="showInstructions">
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
                <div class="rounded-md shadow">
                  <a href="#" v-on:click="openSettings" class="ml-4 w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                    Settings
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
    <div class="relative bg-white overflow-hidden" v-if="showSettings">
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
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">

              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a href="#" v-on:click="closeSettings" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                    Close Settings
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
      showInstructions: true,
      showSettings: false,
    }
  },
  mounted() {
    ipcRenderer.on('overridesParsed', (event, args) => {
      if (args.contents) {
        this.showInstructions = false;
      }
    })
  },
  methods: {
    openProjectDir: function () {
      ipcRenderer.send('openProjectDir');
    },
    openSettings: function () {
      this.showInstructions = false;
      this.showSettings = true;
    },
    closeSettings: function () {
      this.showInstructions = true;
      this.showSettings = false;
    }
  }
}
</script>
