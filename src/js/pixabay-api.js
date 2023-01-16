'use strict';

import axios from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '32823425-3cb9791a2d27dd26f71023aa3';

  constructor() {
    this.query = null;
    this.page = 1;
    this.queryAmt = 40;
  }

  async getPicturesByQuery() {
    const searchParams = new URLSearchParams({
      key: PixabayAPI.API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.queryAmt,
    });

    const { data } = await axios.get(`${PixabayAPI.BASE_URL}?${searchParams}`);

    return data;
  }
}
