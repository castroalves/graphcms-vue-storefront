import requests from '../api/requests';
import page from '../pages/factory';
import generator from '../utils/data';
import intercept from '../utils/network';

context(['my-account', 'regression', 'shipping-details'], '[MyAccount] Shipping details', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-my-account-shipping-details').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });

  it('Should successfully add new address', function () {
    const data = this.fixtures.data;
    data.customer.email = generator.email();
    const addShippingAddressRequest = intercept.addShippingAddress();
    requests.customerSignMeUp(data.customer);
    page.myAccount.shippingDetails.visit();
    page.myAccount.shippingDetails.addNewAddressButton.click();
    page.myAccount.shippingDetails.form.fill(data.customer);
    page.myAccount.shippingDetails.form.addTheAddressButton.click().then(() => {
      cy.wait(addShippingAddressRequest).then((interception) => {
        expect(interception.response.statusCode).equal(200);
      });
    });
    page.myAccount.shippingDetails.address.should('be.visible');
  });

  it('Should display correct address', function () {
    const data = this.fixtures.data;
    data.customer.email = generator.email();
    requests.customerSignMeUp(data.customer);
    requests.addShippingAddress(data.customer);
    page.myAccount.shippingDetails.visit();
    page.myAccount.shippingDetails.address.should('contain.text', data.customer.firstName)
      .should('contain.text', data.customer.lastName)
      .should('contain.text', data.customer.address.shipping.streetName)
      .should('contain.text', data.customer.address.shipping.streetNumber)
      .should('contain.text', data.customer.address.shipping.city)
      .should('contain.text', data.customer.address.shipping.state)
      .should('contain.text', data.customer.address.shipping.postalCode)
      .should('contain.text', generator.countryName(data.customer.address.shipping.country))
      .should('contain.text', data.customer.address.shipping.phone);
  });

  it('Should delete address', function () {
    const data = this.fixtures.data;
    data.customer.email = generator.email();
    const deleteAddressRequest = intercept.deleteShippingAddress();
    requests.customerSignMeUp(data.customer);
    requests.addShippingAddress(data.customer);
    page.myAccount.shippingDetails.visit();
    page.myAccount.shippingDetails.deleteButton.click().then(() => {
      cy.wait(deleteAddressRequest).then((interception) => {
        expect(interception.response.statusCode).equal(200);
      });
    });
    page.myAccount.shippingDetails.address.should('not.exist');
  });

  it('Should update address', function () {
    const data = this.fixtures.data;
    data.customer.email = generator.email();
    const updateAddressRequest = intercept.updateShippingAddress();
    requests.customerSignMeUp(data.customer);
    requests.addShippingAddress(data.customer);
    page.myAccount.shippingDetails.visit();
    page.myAccount.shippingDetails.changeButton.click();
    page.myAccount.shippingDetails.form.fill(data[this.test.title].customer);
    page.myAccount.shippingDetails.form.updateTheAddressButton.click().then(() => {
      cy.wait(updateAddressRequest).then((interception) => {
        expect(interception.response.statusCode).equal(200);
      });
    });
  });
});
