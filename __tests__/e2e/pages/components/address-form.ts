import { Customer } from '../../types/types';

type AddressType = 'shipping' | 'billing'

export class AddressForm {

  private _type: AddressType;

  constructor(type: AddressType) {
    this._type = type;
  }

  get firstName(): Cypress.Chainable {
    return cy.get('#firstName');
  }

  get lastName(): Cypress.Chainable {
    return cy.get('#lastName');
  }

  get streetName(): Cypress.Chainable {
    return cy.get('#streetName');
  }

  get streetNumber(): Cypress.Chainable {
    return cy.get('#apartment');
  }

  get city(): Cypress.Chainable {
    return cy.get('#city');
  }

  get country(): Cypress.Chainable {
    return cy.get('#Country');
  }

  get state(): Cypress.Chainable {
    return cy.get('[id^=State]');
  }

  get postalCode(): Cypress.Chainable {
    return cy.get('#zipCode');
  }

  get phone(): Cypress.Chainable {
    return cy.get('#phone');
  }

  get addTheAddressButton(): Cypress.Chainable {
    return cy.contains('button.form__button', 'Add the address');
  }

  get updateTheAddressButton(): Cypress.Chainable {
    return cy.contains('button.form__button', 'Update the address');
  }

  fill(customer: Customer) {
    if (customer.firstName) this.firstName.clear().type(customer.firstName);
    if (customer.lastName) this.lastName.clear().type(customer.lastName);
    if (customer.address[this._type].streetName) this.streetName.clear().type(customer.address[this._type].streetName);
    if (customer.address[this._type].streetNumber) this.streetNumber.clear().type(customer.address[this._type].streetNumber);
    if (customer.address[this._type].city) this.city.clear().type(customer.address[this._type].city);
    if (customer.address[this._type].country) this.country.select(customer.address[this._type].country);
    if (customer.address[this._type].state) this.state.select(customer.address[this._type].state);
    if (customer.address[this._type].postalCode) this.postalCode.clear().type(customer.address[this._type].postalCode);
    if (customer.address[this._type].phone) this.phone.clear().type(customer.address[this._type].phone);
  }
}
