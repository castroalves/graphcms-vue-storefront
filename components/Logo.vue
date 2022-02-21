<template>
  <nuxt-link :to="localePath('/')" class="sf-header__logo">
    <SfImage
      :src="header.logo.url || `/icons/logo.svg`"
      :alt="header.logo.alt || `Vue Storefront Next`"
      class="sf-header__logo-image"
    />
  </nuxt-link>
</template>
<script>
import { SfImage } from '@storefront-ui/vue'
import useCmsLayout from '~/composables/useCmsLayout'

export default {
  components: {
    SfImage,
  },
  setup() {
    const { header } = useCmsLayout()

    return {
      header,
    }
  },
}
</script>