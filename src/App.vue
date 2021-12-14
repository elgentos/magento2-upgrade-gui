<template>
  <div class="h-full w-full flex flex-col bg-white">
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

export default {
  name: 'App',
  components: {
    Instructions,
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
