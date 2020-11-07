<template>
  <div class="h-full w-full flex flex-col">
    <Licensing 
      v-if="! hasValidLicense"
    />
    <HelloWorld msg="Welcome to Your Electron App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Licensing from './components/Licensing';
import licenseCheck from './mixins/licensing';

export default {
  name: 'App',
  mixins: [
    licenseCheck
  ],
  components: {
    HelloWorld,
    Licensing,
  },
}
</script>

<!-- Load Tailwind -->
<style src="./assets/css/tailwind.css"></style>

<style>
html, body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>