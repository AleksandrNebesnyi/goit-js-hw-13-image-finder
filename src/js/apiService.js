const API_KEY = '23744407-6e41977eb223c860dbad454a0';
const BASE_URL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal&';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 12;
  }

  // fetchPhoto() {
  //   console.log(this);
  //   const url = `${BASE_URL}q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}&key=${API_KEY}`;
  //   return fetch(url)
  //     .then(response => response.json())
  //     .then(photo => {
  //       this.incrementPage();
  //       return photo.hits;
  //     });
  // }

  async fetchPhoto() {
    try {
      // console.log(this);
      const response = await fetch(
        `${BASE_URL}q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}&key=${API_KEY}`,
      );
      const photo = await response.json();

      this.incrementPage();
      return photo.hits;
    } catch (error) {
      console.log(error.message);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
