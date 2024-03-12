const axios = require('axios');
const { mockClaimsList } = require('../mock-server/mock-data/claim_list');
const { mockClaimDetails } = require('../mock-server/mock-data/claim_details');
const { ACCEPTED_BASE_EP_CODES } = require('../modules/statics');

class Lighthouse {
  constructor(values) {
    if (process.env.LOCAL_DEBUG === 'false' || !process.env.LOCAL_DEBUG) {
      this.baseUrl = values.apiUrl;
      this.csrfToken = values.csrfToken;
      this.apiCookie = values.apiSession;
    }
  }

  createRequestObj() {
    return {
      headers: {
        'X-CSRF-TOKEN': this.csrfToken,
        Cookie: `api_session=${this.apiCookie}`,
      },
    };
  }

  static filterClaimsByEpCode(claims) {
    return claims.filter(
      (c) =>
        ACCEPTED_BASE_EP_CODES.indexOf(c.attributes.baseEndProductCode) >= 0
    );
  }

  async fetchClaimsList() {
    return this.performFetch(
      `${this.baseUrl}/v0/virtual_agent/claims`,
      (response) => response.data.data,
      () => mockClaimsList
    );
  }

  async fetchSingleClaim(id) {
    return this.performFetch(
      `${this.baseUrl}/v0/virtual_agent/claims/${id}`,
      (response) => response.data.data.data,
      () => mockClaimDetails.find((c) => c.id === id)
    );
  }

  async performFetch(url, thenFn, mockDataFn) {
    try {
      const response =
        // this is accounting for the env variable coming back as a false boolean or 'false'
        process.env.LOCAL_DEBUG === 'false' || !process.env.LOCAL_DEBUG
          ? await axios.get(url, this.createRequestObj()).then(thenFn)
          : mockDataFn();
      return response;
    } catch (e) {
      console.log('e.message: ', e.message);
      console.log('e.stack: ', e.stack);
      console.log('e.config.url ', e.config?.url);
      console.log('e.config.method: ', e.config?.method);
      console.log('e.response.status: ', e.response?.status);
      console.log('e.response.statusText: ', e.response?.statusText);
      console.log(`entire error message: ${e}`);
      return null;
    }
  }
}

module.exports.Lighthouse = Lighthouse;
