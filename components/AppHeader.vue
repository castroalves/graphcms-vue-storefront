<template>
  <div>
    <SfHeader
      class="sf-header--has-mobile-search"
      :class="{ 'header-on-top': isSearchOpen }"
      :isNavVisible="isMobileMenuOpen"
    >
      <!-- TODO: add mobile view buttons after SFUI team PR -->
      <template #logo>
        <Logo />
      </template>
      <template #navigation>
        <CmsHeaderNavigation :isMobile="isMobile" />
      </template>
      <template #aside>
        <StoreLocaleSelector class="smartphone-only" />
      </template>
      <template #header-icons>
        <div class="sf-header__icons">
          <SfButton
            v-e2e="'app-header-account'"
            class="sf-button--pure sf-header__action"
            @click="handleAccountClick"
          >
            <SfIcon :icon="accountIcon" size="1.25rem" />
          </SfButton>
          <SfButton
            class="sf-button--pure sf-header__action"
            @click="toggleWishlistSidebar"
          >
            <SfIcon
              class="sf-header__icon"
              :icon="wishlistIcon"
              size="1.25rem"
            />
            <SfBadge
              v-if="wishlistTotalItems"
              class="sf-badge--number cart-badge"
              >{{ wishlistTotalItems }}</SfBadge
            >
          </SfButton>
          <SfButton
            v-e2e="'app-header-cart'"
            class="sf-button--pure sf-header__action"
            @click="toggleCartSidebar"
          >
            <SfIcon class="sf-header__icon" icon="empty_cart" size="1.25rem" />
            <SfBadge
              v-if="cartTotalItems"
              class="sf-badge--number cart-badge"
              >{{ cartTotalItems }}</SfBadge
            >
          </SfButton>
        </div>
      </template>
      <template #search>
        <SfSearchBar
          ref="searchBarRef"
          :placeholder="$t('Search for items')"
          aria-label="Search"
          class="sf-header__search"
          :value="term"
          @input="handleSearch"
          @keydown.enter="handleSearch($event)"
          @focus="isSearchOpen = true"
          @keydown.esc="closeSearch"
          v-click-outside="closeSearch"
        >
          <template #icon>
            <SfButton
              v-if="!!term"
              class="sf-search-bar__button sf-button--pure"
              @click="closeOrFocusSearchBar"
            >
              <span class="sf-search-bar__icon">
                <SfIcon color="var(--c-text)" size="18px" icon="cross" />
              </span>
            </SfButton>
            <SfButton
              v-else
              class="sf-search-bar__button sf-button--pure"
              @click="
                isSearchOpen ? (isSearchOpen = false) : (isSearchOpen = true)
              "
            >
              <span class="sf-search-bar__icon">
                <SfIcon color="var(--c-text)" size="20px" icon="search" />
              </span>
            </SfButton>
          </template>
        </SfSearchBar>
      </template>
    </SfHeader>
    <SearchResults
      :visible="isSearchOpen"
      :result="result"
      :term="term"
      @close="closeSearch"
      @removeSearchResults="removeSearchResults"
    />
    <SfOverlay :visible="isSearchOpen" />
  </div>
</template>

<script>
import {
  SfHeader,
  SfIcon,
  SfButton,
  SfBadge,
  SfSearchBar,
  SfOverlay,
  SfMenuItem,
  SfLink,
} from '@storefront-ui/vue'
import { useUiState } from '~/composables'
import {
  useCart,
  useWishlist,
  wishlistGetters,
  useUser,
  cartGetters,
  useFacet,
} from '@vsf-enterprise/commercetools'
import { computed, ref, onBeforeUnmount, watch } from '@nuxtjs/composition-api'
import { onSSR } from '@vue-storefront/core'
import { useUiHelpers } from '~/composables'
import StoreLocaleSelector from '~/components/StoreLocaleSelector'
import SearchResults from '~/components/SearchResults'
import CmsHeaderNavigation from '~/components/CmsHeaderNavigation'
import Logo from '~/components/Logo'
import { clickOutside } from '@storefront-ui/vue/src/utilities/directives/click-outside/click-outside-directive.js'
import {
  mapMobileObserver,
  unMapMobileObserver,
} from '@storefront-ui/vue/src/utilities/mobile-observer.js'
import debounce from 'lodash.debounce'
export default {
  components: {
    SfHeader,
    StoreLocaleSelector,
    SfIcon,
    SfButton,
    SfBadge,
    SfSearchBar,
    SearchResults,
    SfOverlay,
    SfMenuItem,
    SfLink,
    CmsHeaderNavigation,
    Logo,
  },
  directives: { clickOutside },
  setup(props, { root }) {
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleLoginModal,
      isMobileMenuOpen,
    } = useUiState()
    const { setTermForUrl, getFacetsFromURL } = useUiHelpers()
    const { result, search } = useFacet('search')
    const { isAuthenticated, load: loadUser } = useUser()
    const { cart, load: loadCart } = useCart()
    const { wishlist, load: loadWishlist } = useWishlist()
    const term = ref(getFacetsFromURL().phrase)
    const isSearchOpen = ref(false)
    const searchBarRef = ref(null)
    const isMobile = ref(mapMobileObserver().isMobile.get())
    const cartTotalItems = computed(() => {
      const count = cartGetters.getTotalItems(cart.value)
      return count ? count.toString() : null
    })
    const wishlistTotalItems = computed(() => {
      const count = wishlistGetters.getTotalItems(wishlist.value)
      return count ? count.toString() : null
    })
    const accountIcon = computed(() =>
      isAuthenticated.value ? 'profile_fill' : 'profile',
    )
    const wishlistIcon = computed(() =>
      wishlistGetters.getTotalItems(wishlist.value) ? 'heart_fill' : 'heart',
    )
    // TODO: https://github.com/DivanteLtd/vue-storefront/issues/4927
    const handleAccountClick = async () => {
      if (isAuthenticated.value) {
        const localeAccountPath = root.localePath({ name: 'my-account' })
        return root.$router.push(localeAccountPath)
      }
      toggleLoginModal()
    }
    onSSR(async () => {
      await loadUser()
      await loadCart()
      await loadWishlist()
    })
    const closeSearch = () => {
      const wishlistClassName = 'sf-product-card__wishlist-icon'
      const isWishlistIconClicked = event.path.find(
        (p) => wishlistClassName.search(p.className) > 0,
      )
      if (isWishlistIconClicked || !isSearchOpen.value) return
      term.value = ''
      isSearchOpen.value = false
    }
    const handleSearch = debounce(async (paramValue) => {
      term.value = paramValue.target?.value || paramValue
      await search({
        filters: {},
        page: 1,
        itemsPerPage: 20,
        sort: 'latest',
        phrase: term.value,
      })
    }, 1000)
    const closeOrFocusSearchBar = () => {
      if (isMobile.value) {
        return closeSearch()
      } else {
        term.value = ''
        return searchBarRef.value.$el.children[0].focus()
      }
    }
    watch(
      () => term.value,
      (newVal, oldVal) => {
        const shouldSearchBeOpened =
          !isMobile.value &&
          term.value.length > 0 &&
          ((!oldVal && newVal) ||
            (newVal.length !== oldVal.length && isSearchOpen.value === false))
        if (shouldSearchBeOpened) {
          isSearchOpen.value = true
        }
      },
    )
    const removeSearchResults = () => {
      result.value = null
    }
    onBeforeUnmount(() => {
      unMapMobileObserver()
    })
    return {
      accountIcon,
      wishlistIcon,
      cartTotalItems,
      wishlistTotalItems,
      handleAccountClick,
      toggleCartSidebar,
      toggleWishlistSidebar,
      setTermForUrl,
      term,
      isSearchOpen,
      closeSearch,
      handleSearch,
      result,
      closeOrFocusSearchBar,
      searchBarRef,
      isMobile,
      isMobileMenuOpen,
      removeSearchResults,
    }
  },
}
</script>

<style lang="scss" scoped>
.sf-header {
  --header-padding: var(--spacer-sm);
  @include for-desktop {
    --header-padding: 0;
  }
  &__logo-image {
    height: 100%;
  }
}
.header-on-top {
  z-index: 2;
}
.nav-item {
  --header-navigation-item-margin: 0 var(--spacer-base);
  .sf-header-navigation-item__item--mobile {
    display: none;
  }
}
.cart-badge {
  position: absolute;
  bottom: 40%;
  left: 40%;
}
</style>
