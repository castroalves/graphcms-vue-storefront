<template>
  <Banner
    :title="title"
    :subtitle="subtitle"
    :description="description"
    :button-text="banner_text"
    :link="banner_link"
    :image="image"
    :background="background"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Banner',
  props: {
    title: {},
    subtitle: {},
    description: {},
    banner_text: {},
    banner_link: {},
    image: {},
    background: {}
  }
})
</script>