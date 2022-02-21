enum IsoCountryMapping {
  US = 'United States'
}

const generator = {
  email(): string {
    return `cypress.${Date.now()}@vuestorefront.test`;
  },

  uuid(): string {
    return 'xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, () => {
      const random = Math.floor(Math.random() * 16);
      return random.toString(16);
    });
  },

  countryName(isoCode: IsoCountryMapping) {
    return IsoCountryMapping[isoCode];
  }

};

export default generator;
