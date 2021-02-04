/**
 * Client for corresponding REST API.
 */
export default class SlinkyApi {
    constructor(config) {
      this._apiBase = config.apiBase;
      this._apiUser = config.apiUser;
      this._apiPass = config.apiPass;

      // TODO remove: hardcoded for testing
      this._token = process.env.VUE_APP_API_TEST_TOKEN;
    }

    async authorize() {
      const endpoint = this._apiBase + 'signin';

      const headers = new Headers({'Authorization': 'Basic ' + btoa(this._apiUser + ':' + this._apiPass)});
      const req = new Request(endpoint, {
        method: 'POST',
        headers: headers,
        credentials: 'omit'
      });
      const response = await fetch(req);
      if (response.status != 200) {
        throw new Error("Error calling SlinkyAPI...");
      }
      const json = await response.json();

      return json.token;
    }
    
    async getTopSitesUrls() {
      //const token = await this.authorize();
      const token = this._token;
      const endpoint = this._apiBase + 'api/links';

      const headers = new Headers({'Authorization': 'Bearer ' + token});
      const req = new Request(endpoint, {
        method: 'GET',
        headers: headers,
        credentials: 'omit'
      });
      const response = await fetch(req);
      const result = this.jsonOrDefault(response, []);

      return result;
    }

    async getTopSitesUrlsFresh() {
      //const token = await this.authorize();
      const token = this._token;
      const endpoint = this._apiBase + 'api/scrape/topsites';

      const headers = new Headers({'Authorization': 'Bearer ' + token});
      const req = new Request(endpoint, {
        method: 'GET',
        headers: headers,
        credentials: 'omit'
      });
      const response = await fetch(req);
      const result = this.jsonOrDefault(response, []);

      return result;
    }

    async getLinkedUrls(link) {
      //const token = await this.authorize();
      const token = this._token;
      const endpoint = this._apiBase + 'api/scrape/links';

      const headers = new Headers({'Authorization': 'Bearer ' + token});
      const req = new Request(endpoint + '?url=' + encodeURIComponent(link), {
        method: 'GET',
        headers: headers,
        credentials: 'omit'
      });
      const response = await fetch(req);
      const result = this.jsonOrDefault(response, []);

      return result;
    }
    
    async getRelatedWords(word, max = 10) {
      //const token = await this.authorize();
      const token = this._token;
      let endpoint = this._apiBase + 'api/words/related';
      const params = { word, max };
      const query = '?' + new URLSearchParams(params).toString();

      const headers = new Headers({'Authorization': 'Bearer ' + token});
      const req = new Request(endpoint + query, {
        method: 'GET',
        headers: headers,
        credentials: 'omit'
      });
      const response = await fetch(req);
      const result = this.jsonOrDefault(response, []);

      return result;
    }

    async jsonOrDefault(response, def) {
      if (response.ok) {
        return response.json();
      }
      console.log ("Error Response: " + response.status);

      return def;
    }
}