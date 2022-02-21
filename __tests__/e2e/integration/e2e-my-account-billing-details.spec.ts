import requests from '../api/requests';
import page from '../pages/factory';
import generator from '../utils/data';
import intercept from '../utils/network';

context(['billing-details', 'my-account', 'regression'], '[MyAccount] Billing details', () => {
  beforeEach(function () {
    cy.fixture('test-data/e2e-my-account-billing-details').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });
  });
  it('Should successfully add new address', function () {
    const data = this.fixtures.data;
    data.customer.email = generator.email();
    const addBillingAddressRequest = intercept.addBillingAddress();
    requests.customerSignMeUp(data.customer);
    page.myAccount.billingDetails.visit();
    page.myAccount.billingDetails.addNewAddressButton.click();
    page.myAccount.billingDetails.form.fill(data.customer);
    page.myAccount.billingDetails.form.addTheAddressButton.click().then(() => {
      cy.wait(addBillingAddressRequest).then((interception) => {
        expect(interception.response.statusCode).equal(200);
      });
    });
    page.myAccount.billingDetails.address.should('be.visible');
  });

  it('Should display correct address', function () {
    const data = this.fixtures.data;
    data.customer.email = generator.email();
    requests.customerSignMeUp(data.customer);
    requests.addBillingAddress(data.customer);
    page.myAccount.billingDetails.visit();
    page.myAccount.billingDetails.address.should('contain.text', data.customer.firstName)
      .should('contain.text', data.customer.lastName)
      .should('contain.text', data.customer.address.billing.streetName)
      .should('contain.text', data.customer.address.billing.streetNumber)
      .should('contain.text', data.customer.address.billing.city)
      .should('contain.text', data.customer.address.billing.state)
      .should('contain.text', data.customer.address.billing.postalCode)
      .should('contain.text', generator.countryName(data.customer.address.billing.country))
      .should('contain.text', data.customer.address.billing.phone);
  });

  it('Should delete address', function () {
    const data = this.fixtures.data;
    data.customer.email = generator.email();
    const deleteAddressRequest = intercept.deleteBillingAddress();
    requests.customerSignMeUp(data.customer);
    requests.addBillingAddress(data.customer);
    page.myAccount.billingDetails.visit();
    page.myAccount.billingDetails.deleteButton.click().then(() => {
      cy.wait(deleteAddressRequest).then((interception) => {
        expect(interception.response.statusCode).equal(200);
      });
    });
    page.myAccount.billingDetails.address.should('not.exist');
  });

  it('Should update address', function () {
    const data = this.fixtures.data;
    data.customer.email = generator.email();
    const updateAddressRequest = intercept.updateBillingAddress();
    requests.customerSignMeUp(data.customer);
    requests.addBillingAddress(data.customer);
    page.myAccount.billingDetails.visit();
    page.myAccount.billingDetails.changeButton.click();
    page.myAccount.billingDetails.form.fill(data[this.test.title].customer);
    page.myAccount.billingDetails.form.updateTheAddressButton.click().then(() => {
      cy.wait(updateAddressRequest).then((interception) => {
        expect(interception.response.statusCode).equal(200);
      });
    });
  });
});
