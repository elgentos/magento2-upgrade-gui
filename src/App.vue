<template>
  <div class="h-full w-full flex flex-col bg-white">
    <Licensing
      v-if="! hasValidLicense"
    />
    <template>
      <div>
        <Instructions />
        <OverrideSelector />
      </div>
    </template>
  </div>
</template>

<script>
import Instructions from './components/Instructions.vue'
import OverrideSelector from './components/OverrideSelector.vue'
import Licensing from './components/Licensing';
import licenseCheck from './mixins/licensing';

export default {
  name: 'App',
  mixins: [
    licenseCheck
  ],
  components: {
    Instructions,
    Licensing,
    OverrideSelector
  },
}
</script>

<!-- Load Tailwind -->
<style src="./assets/css/tailwind.css"></style>
<style>
html,body {
  height:100%;
}
</style>