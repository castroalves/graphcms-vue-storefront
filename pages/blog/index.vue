<template>
  <div class="blog-page">
    <SfHeading class="blog-page__heading" title="Blog" :level="1" />
    <div class="blog-page__filters">
      <SfSearchBar
        v-if="searchTerm !== null"
        placeholder="Search for post"
        :value="null"
        aria-label="Search"
        :icon="{ size: '1.25rem', color: '#43464E' }"
        v-model="searchTerm"
        @input="getBlogPosts"
      />
      <SfSelect
        class="sf-select--underlined"
        valid
        :disabled="false"
        v-model="orderBy"
        @input="getBlogPosts"
      >
        <SfSelectOption value="desc">Latest</SfSelectOption>
        <SfSelectOption value="asc">Oldest</SfSelectOption>
      </SfSelect>
    </div>
    <hr class="sf-divider" />
    <div class="blog-page__posts" v-if="blogPosts.length">
      <SfCard
        v-for="item in blogPosts"
        :key="item.url"
        :image="item.image.url"
        :title="item.title"
        :titleLevel="3"
        :description="item.excerpt"
        :link="`/blog/${item.url}`"
        buttonText="Learn more"
      >
        <template v-slot:details>
          <div class="sf-card__details">
            <p class="sf-card__created-at">
              {{ item.createdAt }}
            </p>
            <SfHeading
              class="sf-heading--left"
              :title="item.title"
              :level="3"
              :description="item.excerpt"
            />
          </div>
        </template>
      </SfCard>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { onSSR } from '@vue-storefront/core'
import { onMounted } from '@nuxtjs/composition-api'
import { SfCard, SfHeading, SfSelect, SfSearchBar } from '@storefront-ui/vue'

import useCmsBlog from '~/composables/useCmsBlog'

/*
 * This page is prepared for CMS dynamic content rendering.
 */
export default Vue.extend({
  name: 'CMSDynamicPage',
  components: {
    SfCard,
    SfHeading,
    SfSelect,
    SfSearchBar,
  },
  setup() {
    const { blogPosts, orderBy, searchTerm, getBlogPosts } = useCmsBlog()

    onSSR(async () => {
      await getBlogPosts()
    })

    return {
      blogPosts,
      orderBy,
      getBlogPosts,
      searchTerm,
    }
  },
})
</script>

<style lang="scss" scoped>
.blog-page {
  &__heading {
    padding: 3rem 0;
  }
  .sf-divider {
    margin-top: 2rem;
  }

  &__filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 1rem;

    .sf-search-bar {
      --search-bar-width: 12rem;
    }

    ::v-deep .sf-select {
      --select-width: 12rem;
      --select-padding: 0;
      --select-height: 1.625rem;

      &__dropdown {
        font-size: var(--font-size-base);
      }
    }
  }

  &__posts {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 2rem;

    ::v-deep .sf-card {
      margin: 2rem 1rem;
      width: calc(100% - 2rem);
      @include for-desktop {
        margin: 2rem 1rem;
        width: calc(25% - 2rem);
      }

      &__image {
        --image-height: 15rem;
        @include for-desktop {
          --image-height: 10rem;
        }
      }

      &__details {
        height: 7rem;
        @include for-desktop {
          height: 14rem;
        }
      }

      &__created-at {
        margin: 0;
        text-align: right;
        font-size: var(--font-size--xs);
        color: var(--_c-gray-primary);
      }
    }
  }
}
</style>

