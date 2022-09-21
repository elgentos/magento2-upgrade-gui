<template>
  <div class="h-full w-full flex flex-col bg-white">
    <template>
      <div>
        <Home />
        <Editor />
      </div>
    </template>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import Editor from './components/Editor.vue'

export default {
  name: 'App',
  components: {
    Home,
    Editor
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
