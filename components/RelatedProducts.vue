<template>
  <SfSection :title-heading="title" class="section">
    <SfLoader :class="{ loading }" :loading="loading">
      <SfCarousel
        :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }"
        class="carousel"
      >
        <SfCarouselItem class="carousel__item" v-for="(product, i) in products" :key="i">
          <SfProductCard
            :title="productGetters.getName(product)"
            :image="productGetters.getCoverImage(product)"
            :regular-price="$n(productGetters.getFormattedPrice(productGetters.getPrice(product).regular), 'currency')"
            :special-price="productGetters.getPrice(product).special && $n(productGetters.getPrice(product).special, 'currency')"
            :is-in-wishlist="isInWishlist({ product })"
            :is-added-to-cart="isInCart({ product })"
            :link="localePath(`/p/${productGetters.getId(product)}/${productGetters.getSlug(product)}`)"
            @click:wishlist="!isInWishlist({ product }) ? addItemToWishlist({ product }) : removeProductFromWishlist(product)"
            @click:add-to-cart="addToCart({ product, quantity: 1 })"
          />
        </SfCarouselItem>
      </SfCarousel>
    </SfLoader>
  </SfSection>
</template>

<script lang="ts">

import {
  SfCarousel,
  SfProductCard,
  SfSection,
  SfLoader
} from '@storefront-ui/vue';
import { computed } from '@nuxtjs/composition-api';
import { useCart, useWishlist, wishlistGetters, productGetters } from '@vsf-enterprise/commercetools';

export default {
  name: 'RelatedProducts',
  setup() {
    const { addItem: addItemToCart, isInCart } = useCart();
    const { addItem: addItemToWishlist, isInWishlist, removeItem: removeItemFromWishlist, wishlist } = useWishlist();

    const removeProductFromWishlist = (productItem) => {
      const productsInWhishlist = computed(() => wishlistGetters.getItems(wishlist.value));
      const product = productsInWhishlist.value.find(wishlistProduct => wishlistProduct.variant.sku === productItem.sku);
      removeItemFromWishlist({ product });
    };

    const addToCart = ({ product, quantity }) => {
      const { id, sku } = product;
      addItemToCart({
        product: { id, sku },
        quantity
      });
    };

    return {
      productGetters,
      addItemToWishlist,
      isInWishlist,
      removeProductFromWishlist,
      addToCart,
      isInCart
    };
  },
  components: {
    SfCarousel,
    SfProductCard,
    SfSection,
    SfLoader
  },
  props: {
    title: String,
    products: Array,
    loading: Boolean
  }
};
</script>

<style lang="scss" scoped>
.section {
  margin-top: var(--spacer-base);
}

.carousel {
    margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.9375rem 0 2.4375rem 0;
  }
}

</style>
