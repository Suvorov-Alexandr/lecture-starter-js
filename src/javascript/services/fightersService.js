import { callApi } from '../helpers/apiHelper';

class FighterService {
  #endpoint = 'fighters.json';

  async getFighters() {
    try {
      const apiResult = await callApi(this.#endpoint);
      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id) {
    // todo: implement this method
    // endpoint - `details/fighter/${id}.json`;
    const endpoint = `details/fighter/${id}.json`;

    try {
      const apiResult = await callApi(endpoint);
      return apiResult;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const fighterService = new FighterService();
