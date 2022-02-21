<template>
  <div v-if="content" class="dynamic-page">
    <render-content :content="content" />
  </div>
</template>

<script>
import Vue from 'vue'
import { useContent } from '@vsf-enterprise/graphcms'
import { onSSR } from '@vue-storefront/core'

/*
 * This page is prepared for CMS dynamic content rendering.
 */
export default Vue.extend({
  name: 'CMSDynamicPage',
  setup(props, { root }) {
    const { $route } = root
    const { id } = $route.params
    const { search, content } = useContent(id)
    onSSR(async () => {
      await search({
        url: id,
      })
    })
    return {
      content,
    }
  },
})
</script>

<style lang="scss">
.dynamic-page .render-content {
  width: 100%;
  margin: 0 auto;
  margin-bottom: var(--spacer-xl);
}
</style>
