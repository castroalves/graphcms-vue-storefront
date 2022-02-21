<template>
  <div>
    <div class="blog-page" v-if="blogPost">
      <div class="blog-page__image">
        <SfImage :src="blogPost.image.url" width="100%" />
      </div>
      <p class="blog-page__created-at">
        {{ blogPost.createdAt }}
      </p>
      <SfHeading
        :title="blogPost.title"
        :description="blogPost.excerpt"
        :level="1"
        class="blog-page__heading sf-heading--left"
      />
      <render-content :content="blogPost.content" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { onSSR } from '@vue-storefront/core'
import { onMounted } from '@nuxtjs/composition-api'
import { SfImage, SfHeading } from '@storefront-ui/vue'

import useCmsBlog from '~/composables/useCmsBlog'

/*
 * This page is prepared for CMS dynamic content rendering.
 */
export default Vue.extend({
  name: 'CMSBlogPage',
  components: {
    SfImage,
    SfHeading,
  },
  setup(props, { root }) {
    const { id } = root.$route.params

    const { getSingleBlogPost, blogPost } = useCmsBlog()

    onSSR(async () => {
      await getSingleBlogPost(id)
    })

    return {
      blogPost,
    }
  },
})
</script>

<style lang="scss" scoped>
.blog-page {
  &__heading {
    padding: 2rem 0;
  }

  &__created-at {
    margin-top: 1rem;
    margin-bottom: 0;
    font-size: var(--font-size--xs);
    color: var(--_c-gray-primary);
  }

  &__image {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .render-content {
    width: 100%;
    margin: 0 auto;
    margin-bottom: var(--spacer-xl);
  }
}
</style>

