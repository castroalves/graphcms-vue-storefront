import { el } from '../utils/element';

class CategoryAccordion {
  get container(): Cypress.Chainable {
    return el('categories-accordion');
  }

  get categories(): Cypress.Chainable {
    return el('categories-accordion', 'button');
  }

  category(name: string): Cypress.Chainable {
    return this.categories.contains(name);
  }

  subcategory(category: string, subcategory: string): Cypress.Chainable {
    return this.category(category).parent('.sf-accordion-item').contains(subcategory);
  }
}

export default new CategoryAccordion();
