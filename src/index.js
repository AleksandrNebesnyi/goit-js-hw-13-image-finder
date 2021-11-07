//  * - Загружаем фото при сабмите формы
//  * - Загружаем фото при нажатии на кнопку «Загрузить еще»
//  * - Обновляем страницу в параметрах запроса
//  * - Рисуем
//  * - Сброс значения при поиске по новому критерию

import photosTpl from './templates/photo.hbs';
import './scss/main';
import PixabayApiService from './js/apiService';
import LoadMoreBtn from './js/components/load-more-btn';

// Импорты pnotify

import {
  info,
  success,
  error,
  defaultModules,
  defaults,
  Stack,
} from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';

defaults.delay = 1000;
defaultModules.set(PNotifyMobile, {});

// Экземпляр класса запроса на  Pixabay
const pixabayApiService = new PixabayApiService();

// Экземпляр класса кнопки загрузить еще
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  articlesContainer: document.querySelector('.js-articles-container'),
  sentinel: document.querySelector('#sentinel'),
};

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.query.value;
  console.log(pixabayApiService.query);
  if (pixabayApiService.query.trim() === '') {
    return info({
      title: 'Введите валидный поисковый запрос.',
      stack: new Stack({
        dir1: 'down',
        dir2: 'right', // Position from the top left corner.
        firstpos1: document.documentElement.clientHeight / 2,
        firstpos2: document.documentElement.clientWidth / 2 - 190, // 90px from the top, 200px from the left.
      }),
      modules: new Map([
        [
          ...defaultModules,
          [
            PNotifyMobile,
            {
              swipeDismiss: false,
            },
          ],
        ],
      ]),
    });
  }
  pixabayApiService.resetPage();
  clearPhotosContainer();
  fetchPhotos();
  clearSerchForm();
}

function fetchPhotos() {
  pixabayApiService
    .fetchPhoto()
    .then(photos => {
      if (photos.length === 0) {
        return info({
          title: 'Введите валидный поисковый запрос.',
          stack: new Stack({
            dir1: 'down',
            dir2: 'right', // Position from the top left corner.
            firstpos1: document.documentElement.clientHeight / 2,
            firstpos2: document.documentElement.clientWidth / 2 - 190, // 90px from the top, 200px from the left.
          }),
          modules: new Map([
            [
              ...defaultModules,
              [
                PNotifyMobile,
                {
                  swipeDismiss: false,
                },
              ],
            ],
          ]),
        });
      }
      appendPhotosMarkup(photos);
      success({
        title: `Загружено`,
        stack: new Stack({
          dir1: 'down',
          dir2: 'right', // Position from the top left corner.
          firstpos1: document.documentElement.clientHeight / 2,
          firstpos2: document.documentElement.clientWidth / 2 - 190, // 90px from the top, 200px from the left.
        }),
        modules: new Map([
          [
            ...defaultModules,
            [
              PNotifyMobile,
              {
                swipeDismiss: false,
              },
            ],
          ],
        ]),
      });
      // refs.articlesContainer.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'end',
      // });
      error =>
        info({
          title: 'Введите валидный поисковый запрос.',
          stack: new Stack({
            dir1: 'down',
            dir2: 'right', // Position from the top left corner.
            firstpos1: document.documentElement.clientHeight / 2,
            firstpos2: document.documentElement.clientWidth / 2 - 190, // 90px from the top, 200px from the left.
          }),
          modules: new Map([
            [
              ...defaultModules,
              [
                PNotifyMobile,
                {
                  swipeDismiss: false,
                },
              ],
            ],
          ]),
        });
    })
    .catch(errorMessage => console.log(errorMessage));
}

function appendPhotosMarkup(photos) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', photosTpl(photos));
  refs.articlesContainer.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function clearPhotosContainer() {
  refs.articlesContainer.innerHTML = '';
}
function clearSerchForm() {
  refs.searchForm.reset();
}

const onEntry = entries => {
  entries.forEach(async entry => {
    if (entry.isIntersecting && pixabayApiService.query !== '') {
      let photos = await pixabayApiService.fetchPhoto();
      appendPhotosMarkup(photos);
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  threshold: 0.5,
});
observer.observe(refs.sentinel);
