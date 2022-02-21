import { el } from '../utils/element';

class Header {

  get account(): Cypress.Chainable {
    return this.icons.eq(0);
  }

  get wishlist(): Cypress.Chainable {
    return this.icons.eq(1);
  }

  get wishlistBadge(): Cypress.Chainable {
    return this.wishlist.find('.sf-badge');
  }

  get cart(): Cypress.Chainable {
    return this.icons.eq(2);
  }

  get categories(): Cypress.Chainable {
    return cy.get('[data-e2e*="app-header"]');
  }

  get category() {
    return {
      women: () => el('app-header-url_women'),
      men: () => el('app-header-url_men')
    };
  }

  private get icons(): Cypress.Chainable {
    return el('header-icons').children();
  }

  openCart(): Cypress.Chainable {
    const click = $el => $el.click();
    return this.cart.pipe(click).should(() => {
      expect(Cypress.$('[data-e2e="sidebar-cart"]')).to.exist;
    });
  }

  openLoginModal(): Cypress.Chainable {
    const click = $el => $el.click();
    return this.account.pipe(click).should(() => {
      expect(Cypress.$('[data-e2e="login-modal"]')).to.exist;
    });
  }

  openWishlist(): Cypress.Chainable {
    const click = $el => $el.click();
    return this.wishlist.pipe(click).should(() => {
      expect(Cypress.$('[data-e2e="sidebar-wishlist"]')).to.exist;
    });
  }

}

export default new Header();
