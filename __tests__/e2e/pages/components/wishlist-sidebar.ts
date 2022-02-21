import { el } from '../utils/element';
import { Sidebar } from './sidebar';

class Wishlist extends Sidebar {
  product(name?: string): Cypress.Chainable {
    const product = el('collected-product');
    return name === undefined ? product : product.contains(name).parents('[data-e2e="collected-product"]');
  }

  removeProduct(name?: string): Cypress.Chainable {
    return this.product(name).find('.sf-collected-product__remove--circle-icon').click();
  }
}

export default new Wishlist();
