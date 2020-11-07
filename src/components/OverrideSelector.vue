<template>
  <div v-if="overrides">
    <div>
      <select @change="loadOverride" id="override" class="mt-1 form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 bg-indigo-200">
        <option>Select a preference/plugin/override</option>
        <option v-for="(override, index) in overrides" :key="index" :value="index">{{ override[0] }}: {{ override[1] }} {{ override[2] }}</option>
      </select>
    </div>
    <div class="flex flex-row mt-2">
      <div class="w-1/2 bg-indigo-200 px-4 py-2">
        <h2 class="mb-4 font-bold">Diff</h2>
        <div v-highlight>
          <pre class="language-xml"><code>{{ vendorFileContent }}</code></pre>
        </div>
      </div>
      <div class="w-1/2 bg-indigo-300 px-4 py-2">
        <h2 class="mb-4 font-bold">{{ type }}</h2>
        <div v-highlight>
          <pre class="language-xml"><code>{{ customFileContent }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';


export default {
  data() {
    return {
      type: '',
      overrides: false,
      vendorFileContent: '',
      customFileContent: ''
    }
  },
  mounted() {
    ipcRenderer.on('overridesParsed', (event, args) => {
      this.overrides = args.contents;
    })
  },
  methods: {
    loadOverride: function (event) {
      let [type, vendorFilePath, customFilePath] = this.overrides[event.target.value];
      this.type = type;
      ipcRenderer.send('vendorFilePathChosen', {
        path: vendorFilePath
      });
      customFilePath = customFilePath.replace('data/', '/home/peterjaap/development/workspace/');

      const fs = require('fs');

      if (fs.existsSync(customFilePath)) {
        this.customFileContent = fs.readFileSync(customFilePath);
      } else {
        this.customFileContent = 'Could not find file ' + customFilePath;
      }

      if (fs.existsSync(vendorFilePath)) {
        if (vendorFilePath === '/home/peterjaap/development/workspace/zechsal/magento2/vendor/magento/module-catalog/view/frontend/layout/catalog_product_view.xml') {
          this.vendorFileContent = `diff -ur vendor_orig/magento/module-catalog/view/frontend/layout/catalog_product_view.xml vendor/magento/module-catalog/view/frontend/layout/catalog_product_view.xml
--- vendor_orig/magento/module-catalog/view/frontend/layout/catalog_product_view.xml\t2020-04-23 10:56:40.000000000 +0200
+++ vendor/magento/module-catalog/view/frontend/layout/catalog_product_view.xml\t2020-06-23 14:03:12.000000000 +0200
@@ -21,6 +21,7 @@
             <arguments>
                 <argument name="css_class" xsi:type="string">product</argument>
                 <argument name="add_base_attribute" xsi:type="string">itemprop="name"</argument>
+                <argument name="translate" xsi:type="boolean">false</argument>
             </arguments>
         </referenceBlock>
         <referenceBlock name="root">
@@ -175,6 +176,7 @@
             <block class="Magento\\Catalog\\Block\\Product\\ProductList\\Related" name="catalog.product.related" template="Magento_Catalog::product/list/items.phtml">
                 <arguments>
                     <argument name="type" xsi:type="string">related</argument>
+                    <argument name="view_model" xsi:type="object">Magento\\Catalog\\ViewModel\\Product\\Listing\\PreparePostData</argument>
                 </arguments>
                 <block class="Magento\\Catalog\\Block\\Product\\ProductList\\Item\\Container" name="related.product.addto" as="addto">
                     <block class="Magento\\Catalog\\Block\\Product\\ProductList\\Item\\AddTo\\Compare"
@@ -185,6 +187,7 @@
             <block class="Magento\\Catalog\\Block\\Product\\ProductList\\Upsell" name="product.info.upsell" template="Magento_Catalog::product/list/items.phtml">
                 <arguments>
                     <argument name="type" xsi:type="string">upsell</argument>
+                    <argument name="view_model" xsi:type="object">Magento\\Catalog\\ViewModel\\Product\\Listing\\PreparePostData</argument>
                 </arguments>
                 <block class="Magento\\Catalog\\Block\\Product\\ProductList\\Item\\Container" name="upsell.product.addto" as="addto">
                     <block class="Magento\\Catalog\\Block\\Product\\ProductList\\Item\\AddTo\\Compare"`;
        } else {
          this.vendorFileContent = fs.readFileSync(vendorFilePath).toString();
        }
      } else {
        this.vendorFileContent = 'Could not find file ' + vendorFilePath;
      }
    }
  }
}
</script>