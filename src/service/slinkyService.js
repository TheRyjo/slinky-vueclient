import SlinkyApi from '../api/slinkyApi.js'

/**
 * Service monolith for app.
 */
export default class SlinkyService {
    constructor() {
        const apiConfig = {
            apiBase: process.env.VUE_APP_API_BASEPATH,
            apiUser: process.env.VUE_APP_API_USER,
            apiPass: process.env.VUE_APP_API_PASS
        };
        this._api = new SlinkyApi(apiConfig);
    }
    
    async getTopSitesUrls() {
        const topSites = await this._api.getTopSitesUrls();
        return topSites;
    }

    async getLinkedUrls(url) {
        const linkedUrls = await this._api.getLinkedUrls(url);
        return linkedUrls.map(l => this._stripQueryhash(l))
                         .map(l => this._toAbsoluteURL(l, url));
    }
    
    async getRelatedWords(word) {
        const related = await this._api.getRelatedWords(word);
        const synonymFilter = entry => entry.tags && entry.tags.indexOf("syn") != -1;
        const wordExtractor = entry => entry.word;

        return related.filter(synonymFilter).map(wordExtractor);
    }

    _stripQueryhash(url) {
        return url.split(/[?#]/)[0];
    }

    _toAbsoluteURL(url, base) {
        return new URL(url, base).href;
    }

    _shuffle(arr) {
      let curr = arr.length;
      let tmp;
      let randIdx;
      while (0 !== curr) {
        randIdx = Math.floor(Math.random() * curr);
        curr -= 1;
        tmp = arr[curr];
        arr[curr] = arr[randIdx];
        arr[randIdx] = tmp;
      }
    
      return arr;
    }
}