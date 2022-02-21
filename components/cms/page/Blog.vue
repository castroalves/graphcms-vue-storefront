<template>
  <div>
    <RenderContent :content="content" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Blog',
  props: {
    content: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
    },
    excerpt: {
      type: String,
    },
    image: {
      type: Object,
      default: () => ({
        url: '',
        alt: '',
      }),
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
})
</script>
