//  * - Пагинация
//  *   - страница и кол-во на странице
//  * - Загружаем статьи при сабмите формы
//  * - Загружаем статьи при нажатии на кнопку «Загрузить еще»
//  * - Обновляем страницу в параметрах запроса
//  * - Рисуем статьи
//  * - Сброс значения при поиске по новому критерию

// import { pictureLoader } from './js/apiService.js';
import photosTpl from './templates/photo.hbs';
import './css/common.css';
import PixabayApiService from './js/apiService';
import LoadMoreBtn from './js/components/load-more-btn';

const pixabayApiService = new PixabayApiService();
console.log(pixabayApiService);

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  articlesContainer: document.querySelector('.js-articles-container'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchPhotos);
const element = loadMoreBtn;

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.query.value;
  console.log(pixabayApiService.query);

  if (pixabayApiService.query === '') {
    return alert('Введи что-то нормальное');
  }

  loadMoreBtn.show();
  pixabayApiService.resetPage();
  clearPhotosContainer();
  fetchPhotos();
}

function fetchPhotos() {
  loadMoreBtn.disable();
  pixabayApiService.fetchPhoto().then(photos => {
    console.log(photos);
    appendPhotosMarkup(photos);
    loadMoreBtn.enable();
    refs.articlesContainer.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  });
}

function appendPhotosMarkup(photos) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', photosTpl(photos));
}

function clearPhotosContainer() {
  refs.articlesContainer.innerHTML = '';
}
