export class Sidebar {

  get yourBagIsEmptyHeading(): Cypress.Chainable {
    return cy.contains('Your bag is empty');
  }

}
