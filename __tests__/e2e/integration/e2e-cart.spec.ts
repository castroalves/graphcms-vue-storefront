import requests, { CreateCartResponse } from '../api/requests';
import page from '../pages/factory';

context(['cart', 'category', 'product', 'regression'], '[Cart]', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-cart').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });

  it('Should successfully add product to cart - Category grid view', function() {
    const data = this.fixtures.data[this.test.title];
    const category = page.category(data.product.category);
    category.visit();
    category.addToCartButton(data.product.name).click();
    category.header.openCart();
    page.components.cart.product(data.product.name).should('be.visible');
  });

  it('Should successfully add product to cart - Category list view', function() {
    const data = this.fixtures.data[this.test.title];
    const category = page.category(data.product.category);
    category.visit();
    category.changeView('list');
    category.addToCartButton(data.product.name).click();
    category.header.openCart();
    page.components.cart.product(data.product.name).should('be.visible');
  });

  it('Should successfully add product to cart - Product details page', function() {
    const data = this.fixtures.data[this.test.title];
    page.product(data.product.id, data.product.slug).visit();
    page.product().addToCartButton.click();
    page.product().header.openCart();
    page.components.cart.product(data.product.name).should('be.visible');
  });

  it('Should remove all products from cart', function () {
    const data = this.fixtures.data[this.test.title];
    requests.createCart().then((response: CreateCartResponse) => {
      requests.addToCart(response.body.data.cart.id, data.product, data.product.quantity);
    });
    page.home.visit();
    page.home.header.openCart();
    page.components.cart.product(data.product.name).should('be.visible');
    page.components.cart.removeProduct(data.product.name);
    page.components.cart.product(data.product.name).should('not.exist');
    page.components.cart.yourCartIsEmptyHeading.should('be.visible');
  });

  it('Should remove single product from cart', function () {
    const data = this.fixtures.data[this.test.title];
    requests.createCart().then((response: CreateCartResponse) => {
      data.products.forEach(product => {
        requests.addToCart(response.body.data.cart.id, product, product.quantity);
      });
    });
    page.home.visit();
    page.home.header.openCart();
    page.components.cart.product(data.productToRemove.name).should('be.visible');
    page.components.cart.removeProduct(data.productToRemove.name);
    page.components.cart.product(data.productToRemove.name).should('not.exist');
    data.expectedCart.forEach(product => {
      page.components.cart.product(product.name).should('be.visible');
    });
  });
});
