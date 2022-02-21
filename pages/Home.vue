<template>
  <div id="home">
    <LazyHydrate when-idle>
      <SfHero class="hero">
        <SfHeroItem
          v-for="(hero, i) in heroes"
          :key="i"
          :title="hero.title"
          :subtitle="hero.subtitle"
          :background="hero.background"
          :image="hero.image"
          :class="hero.className"
        />
      </SfHero>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfBannerGrid :banner-grid="1" class="banner-grid">
        <template v-for="item in banners" v-slot:[item.slot]>
          <SfBanner
            :key="item.slot"
            :title="item.title"
            :subtitle="item.subtitle"
            :description="item.description"
            :button-text="item.buttonText"
            :link="localePath(item.link)"
            :image="item.image"
            :class="item.class"
          />
        </template>
      </SfBannerGrid>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <div class="similar-products">
        <SfHeading title="Match with it" :level="2" />
        <nuxt-link :to="localePath('/c/women')" class="smartphone-only">See all</nuxt-link>
      </div>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfCarousel
        class="carousel"
        :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }"
      >
        <template #prev="{go}">
          <SfArrow
            aria-label="prev"
            class="sf-arrow--left sf-arrow--long"
            @click="go('prev')"
          />
        </template>
        <template #next="{go}">
          <SfArrow
            aria-label="next"
            class="sf-arrow--right sf-arrow--long"
            @click="go('next')"
          />
        </template>
        <SfCarouselItem
          class="carousel__item"
          v-for="(product, i) in products"
          :key="i"
        >
          <SfProductCard
            class="carousel__item__product"
            :title="product._name"
            :image="product.images[0].url"
            :regular-price="$n(productGetters.getFormattedPrice(productGetters.getPrice(product).regular), 'currency')"
            :special-price="productGetters.getPrice(product).special && $n(productGetters.getPrice(product).special, 'currency')"
            :is-added-to-cart="isInCart({ product })"
            :is-in-wishlist="isInWishlist({ product })"
            :link="localePath(`/p/${productGetters.getId(product)}/${productGetters.getSlug(product)}`)"
            @click:add-to-cart="addToCart({ product, quantity: 1 })"
            @click:wishlist="!isInWishlist({ product }) ? addItemToWishlist({ product }) : removeProductFromWishlist(product)"
          />
        </SfCarouselItem>
      </SfCarousel>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <SfCallToAction
        title="Subscribe to Newsletters"
        button-text="Subscribe"
        description="Be aware of upcoming sales and events. Receive gifts and special offers!"
        image="/homepage/newsletter.webp"
        class="call-to-action"
      >
        <template #button>
          <SfButton
            class="sf-call-to-action__button"
            data-testid="cta-button"
            @click="handleNewsletterClick"
          >
            {{ $t('Subscribe') }}
          </SfButton>
        </template>
      </SfCallToAction>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <NewsletterModal @email-submitted="onSubscribe" />
    </LazyHydrate>

    <LazyHydrate when-visible>
      <InstagramFeed />
    </LazyHydrate>
  </div>
</template>

<script>
import {
  SfHero,
  SfBanner,
  SfCallToAction,
  SfSection,
  SfCarousel,
  SfProductCard,
  SfImage,
  SfBannerGrid,
  SfHeading,
  SfArrow,
  SfButton
} from '@storefront-ui/vue';
import LazyHydrate from 'vue-lazy-hydration';
import { ref, computed } from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import { useCache, CacheTagPrefix } from '@vue-storefront/cache';
import { useCart, useFacet, facetGetters, productGetters, wishlistGetters, useWishlist } from '@vsf-enterprise/commercetools';

import InstagramFeed from '~/components/InstagramFeed.vue';
import NewsletterModal from '~/components/NewsletterModal.vue';
import { useUiState } from '../composables';
import cacheControl from './../helpers/cacheControl';

export default {
  name: 'Home',
  middleware: cacheControl({
    'max-age': 60,
    'stale-when-revalidate': 5
  }),
  setup() {
    const { addTags } = useCache();
    const { toggleNewsletterModal } = useUiState();

    const {
      isInCart,
      addItem: addItemToCart
    } = useCart();
    const { result, search } = useFacet();
    const { addItem: addItemToWishlist, isInWishlist, removeItem: removeItemFromWishlist, wishlist } = useWishlist();

    const products = computed(() => facetGetters.getProducts(result.value));

    onSSR(async () => {
      await search({
        filters: {},
        page: 1,
        itemsPerPage: 12,
        sort: 'latest',
        phrase: ''
      });

      if (products.value) {
        const productTags = products.value.map((prod) => {
          return { prefix: CacheTagPrefix.Product, value: prod._id };
        });

        addTags(productTags);
      }

      addTags([
        { prefix: CacheTagPrefix.View, value: 'home' }
      ]);
    });

    const mocks = {
      heroes: [
        {
          title: 'Colorful summer dresses are already in store',
          subtitle: 'SUMMER COLLECTION 2019',
          background: '#eceff1',
          image: '/homepage/bannerH.webp'
        },
        {
          title: 'Colorful summer dresses are already in store',
          subtitle: 'SUMMER COLLECTION 2019',
          background: '#efebe9',
          image: '/homepage/bannerA.webp',
          className:
            'sf-hero-item--position-bg-top-left sf-hero-item--align-right'
        },
        {
          title: 'Colorful summer dresses are already in store',
          subtitle: 'SUMMER COLLECTION 2019',
          background: '#fce4ec',
          image: '/homepage/bannerB.webp'
        }
      ],
      banners: [
        {
          slot: 'banner-A',
          subtitle: 'Dresses',
          title: 'Cocktail & Party',
          description: 'Find stunning women\'s cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses from all your favorite brands.',
          buttonText: 'Shop now',
          image: {
            mobile: '/homepage/bannerB.webp',
            desktop: '/homepage/bannerF.webp'
          },
          class: 'sf-banner--slim desktop-only',
          link: '/c/women/women-clothing-skirts'
        },
        {
          slot: 'banner-B',
          subtitle: 'Dresses',
          title: 'Linen Dresses',
          description: 'Find stunning women\'s cocktail dresses and party dresses. Stand out in lace and metallic cocktail dresses from all your favorite brands.',
          buttonText: 'Shop now',
          image: '/homepage/bannerE.webp',
          class: 'sf-banner--slim banner-central desktop-only',
          link: '/c/women/women-clothing-dresses'
        },
        {
          slot: 'banner-C',
          subtitle: 'T-Shirts',
          title: 'The Office Life',
          image: '/homepage/bannerC.webp',
          class: 'sf-banner--slim banner__tshirt',
          link: '/c/women/women-clothing-shirts'
        },
        {
          slot: 'banner-D',
          subtitle: 'Summer Sandals',
          title: 'Eco Sandals',
          image: '/homepage/bannerG.webp',
          class: 'sf-banner--slim',
          link: '/c/women/women-shoes-sandals'
        }
      ]
    };

    const heroes = ref(mocks.heroes);
    const banners = ref(mocks.banners);

    const handleNewsletterClick = () => {
      toggleNewsletterModal();
    };

    const onSubscribe = (emailAddress) => {
      console.log(`Email ${emailAddress} was added to newsletter.`);
      toggleNewsletterModal();
    };

    const addToCart = ({ product, quantity }) => {
      const { id, sku } = product;
      addItemToCart({
        product: { id, sku },
        quantity
      });
    };

    const removeProductFromWishlist = (productItem) => {
      const productsInWhishlist = computed(() => wishlistGetters.getItems(wishlist.value));
      const product = productsInWhishlist.value.find(wishlistProduct => wishlistProduct.variant.sku === productItem.sku);
      removeItemFromWishlist({ product });
    };

    return {
      heroes,
      banners,
      products,
      productGetters,
      handleNewsletterClick,
      onSubscribe,
      isInCart,
      addToCart,
      addItemToWishlist,
      isInWishlist,
      removeProductFromWishlist
    };
  },
  components: {
    InstagramFeed,
    SfHero,
    SfBanner,
    SfCallToAction,
    SfSection,
    SfCarousel,
    SfProductCard,
    SfImage,
    SfBannerGrid,
    SfHeading,
    SfArrow,
    SfButton,
    NewsletterModal,
    LazyHydrate
  }
};
</script>

<style lang="scss">
.carousel__item__product {
  .sf-product-card__title {
    margin: var(--spacer-base) 0 var(--spacer-xs) 0;
  }

  .sf-product-card__add-button {
    margin-bottom: var(--spacer-xl);
  }
}
</style>

<style lang="scss" scoped>
#home {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    max-width: 1240px;
    padding: 0;
    margin: 0 auto;
  }
}

.hero {
  margin: var(--spacer-xl) auto var(--spacer-lg);
  --hero-item-background-position: center;
  @include for-desktop {
    margin: var(--spacer-xl) auto var(--spacer-2xl);
  }
  .sf-hero-item {
    &:nth-child(even) {
      --hero-item-background-position: left;
      @include for-mobile {
        --hero-item-background-position: 30%;
        ::v-deep .sf-hero-item__subtitle,
        ::v-deep .sf-hero-item__title {
          text-align: right;
          width: 100%;
          padding-left: var(--spacer-sm);
        }
      }
    }
  }
  ::v-deep .sf-hero__control {
    &--right,
    &--left {
      display: none;
    }
  }
}

.banner-grid {
  --banner-container-width: 50%;
  margin: var(--spacer-xl) 0;
  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
    ::v-deep .sf-link {
      --button-width: auto;
      text-decoration: none;
    }
  }
}

.banner {
  &__tshirt {
    background-position: left;
  }
  &-central {
    @include for-desktop {
      --banner-container-flex: 0 0 70%;
    }
  }
}

.similar-products {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacer-2xs);
  --heading-padding: 0;
  border-bottom: 1px var(--c-light) solid;
  @include for-desktop {
    border-bottom: 0;
    justify-content: center;
    padding-bottom: 0;
  }
}

.call-to-action {
  background-position: right;
  margin: var(--spacer-xs) 0;
  @include for-desktop {
    margin: var(--spacer-xl) 0 var(--spacer-2xl) 0;
  }
}

.carousel {
  margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.375rem 0 2.5rem 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
    }
    &__product {
      --product-card-add-button-transform: translate3d(0, 30%, 0);
    }
  }
  ::v-deep .sf-arrow--long .sf-arrow--right {
    --arrow-icon-transform: rotate(180deg);
    -webkit-transform-origin: center;
    transform-origin: center;
  }
}
</style>
