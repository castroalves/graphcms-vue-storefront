<template>
  <div class="sf-header__navigation desktop" v-if="!isMobile">
    <SfHeaderNavigationItem
      v-for="category in categories"
      :key="category.id"
      class="nav-item"
      v-e2e="`app-header-url_${category.slug}`"
      :label="category.name"
      :link="localePath(`/c/${category.slug}`)"
    />
  </div>
  <SfModal v-else :visible="isMobileMenuOpen">
    <SfList>
      <SfListItem
        v-for="category in categories"
        :key="category.id"
        class="nav-item sf-header-navigation-item"
        v-e2e="`app-header-url_${category.slug}`"
      >
        <SfMenuItem
          :label="category.name"
          class="sf-header-navigation-item__menu-item"
          :link="localePath(`/c/${category.slug}`)"
          @click.native="toggleMobileMenu"
        />
      </SfListItem>
    </SfList>
  </SfModal>
</template>

<script>
import { onSSR } from '@vue-storefront/core';
import { useCategory } from '@vsf-enterprise/commercetools';
import { SfMenuItem, SfModal, SfList } from '@storefront-ui/vue';
import { useUiState } from '~/composables';

export default {
  name: 'HeaderNavigation',
  components: {
    SfMenuItem,
    SfModal,
    SfList
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { search, categories } = useCategory('menu-categories');
    const { isMobileMenuOpen, toggleMobileMenu } = useUiState();

    onSSR(async () => {
      await search({ onlyParent: true });
    });

    return {
      categories,
      isMobileMenuOpen,
      toggleMobileMenu
    };
  }
};
</script>

<style lang="scss" scoped>
.sf-header-navigation-item {
  ::v-deep &__item--mobile {
    display: block;
  }
}
.sf-list__item {
  @include for-mobile {
    display: block;
  }
}
.sf-modal {
  ::v-deep &__bar {
    display: none;
  }
  ::v-deep &__content {
    padding: var(--modal-content-padding, var(--spacer-base) 0);
  }
}
</style>
