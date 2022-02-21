module.exports = {
  integrations: {
    shopify: {
      location: '@vue-storefront/shopify-api/server',
      configuration: {
        api: {
          domain: process.env.SHOPIFY_DOMAIN,
          storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN
        },
        currency: 'USD',
        country: 'US'
      }
    },
    graphcms: {
      location: '@vsf-enterprise/graphcms/server',
      configuration: {
        endpointUrl: process.env.GRAPHCMS_ENDPOINT_URL
      }
    }
  }
};