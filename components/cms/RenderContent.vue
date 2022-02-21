<template>
  <div>
    <component
      v-for="(component, index) in components"
      :key="`${component.componentName}-${index}`"
      :is="component.componentName"
      v-bind="component.props"
      class="content-block"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { extractComponents } from '@vsf-enterprise/graphcms'

export default Vue.extend({
  name: 'RenderContent',
  props: {
    content: {
      type: Array,
    },
  },
  computed: {
    components() {
      return extractComponents(this.content)
    },
  },
})
</script>
