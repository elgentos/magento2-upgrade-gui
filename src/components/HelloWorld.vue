<template>
  <div>
  <div class="flex items-center justify-center h-full text-white">
    <h1 class="text-2xl">{{ msg }}</h1>
  </div>
  <div class="text-white items-center justify-center">
    <p>Select File -> Open to select a Magento 2 project.</p>
    <h2 class="text-xl">Pre-requisites</h2>
    <p>You need to run the ampersand/magento2-upgrade-patch-helper first. This will generate two files:</p>
    <ul>
      <li>vendor.patch</li>
      <li>vendor_files_to_check.patch</li>
    </ul>
    <p>Place these files in your Magento 2 project directory.</p>
    <p>It will also show you a table with all overrides/plugins/preferences that are affected by the upgrade. Save this table to a file called output.txt in your Magento 2 project directory.</p>
  </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
