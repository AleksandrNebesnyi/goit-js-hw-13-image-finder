/*
 * - Пагинация
 *   - страница и кол-во на странице
 * - Загружаем статьи при сабмите формы
 * - Загружаем статьи при нажатии на кнопку «Загрузить еще»
 * - Обновляем страницу в параметрах запроса
 * - Рисуем статьи
 * - Сброс значения при поиске по новому критерию
 *
 * https://newsapi.org/
 * 4330ebfabc654a6992c2aa792f3173a3
 * http://newsapi.org/v2/everything?q=cat&language=en&pageSize=5&page=1
 */

import photosTpl from './templates/photo.hbs';
import './css/common.css';
import PixabayApiService from './js/apiService';
import LoadMoreBtn from './js/components/load-more-btn';

const pixabayApiService = new PixabayApiService();

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  articlesContainer: document.querySelector('.js-articles-container'),
};
// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });

refs.searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', fetchPhotos);

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.query.value;
  console.log(pixabayApiService.query);

  if (pixabayApiService.query === '') {
    return alert('Введи что-то нормальное');
  }

  // loadMoreBtn.show();
  pixabayApiService.resetPage();
  clearArticlesContainer();
  fetchPhotos();
}

function fetchPhotos() {
  // loadMoreBtn.disable();
  pixabayApiService.fetchPhoto().then(photos => {
    appendArticlesMarkup(photos);
    // loadMoreBtn.enable();
  });
}

// function appendArticlesMarkup(photos) {
//   refs.articlesContainer.insertAdjacentHTML('beforeend', photosTpl(photos));
// }

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}
