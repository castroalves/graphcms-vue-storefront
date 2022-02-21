import generator from './data';

type Options = {
  as?: string;
  fixture?: any
}

function _intercept(path: string, options?: Options) {
  const as = options?.as ?? generator.uuid();
  options?.fixture ? cy.intercept(path, { fixture: options?.fixture }).as(as) : cy.intercept(path).as(as);
  return `@${as}`;
}

const intercept = {
  addBillingAddress(options?: Options): string {
    return _intercept('**/addBillingAddress', options);
  },

  addShippingAddress(options?: Options): string {
    return _intercept('**/addShippingAddress', options);
  },

  customerChangeMyPassword(options?: Options): string {
    return _intercept('**/customerChangeMyPassword', options);
  },

  customerUpdateMe(options?: Options): string {
    return _intercept('**/customerUpdateMe', options);
  },

  customerSignMeIn(options?: Options): string {
    return _intercept('**/customerSignMeIn', options);
  },

  deleteBillingAddress(options?: Options): string {
    return _intercept('**/deleteBillingAddress', options);
  },

  deleteShippingAddress(options?: Options): string {
    return _intercept('**/deleteShippingAddress', options);
  },

  getMe(options?: Options): string {
    return _intercept('**/getMe', options);
  },

  getOrders(options?: Options) {
    return _intercept('**/getOrders', options);
  },

  getProduct(options?: Options): string {
    return _intercept('**/getProduct', options);
  },

  updateBillingAddress(options?: Options): string {
    return _intercept('**/updateBillingAddress', options);
  },

  updateCartQuantity(options?: Options): string {
    return _intercept('**/updateCartQuantity', options);
  },

  updateShippingAddress(options?: Options): string {
    return _intercept('**/updateShippingAddress', options);
  }
};

export default intercept;
