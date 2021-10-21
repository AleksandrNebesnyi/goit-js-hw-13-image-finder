//  * - Загружаем статьи при сабмите формы
//  * - Загружаем статьи при нажатии на кнопку «Загрузить еще»
//  * - Обновляем страницу в параметрах запроса
//  * - Рисуем
//  * - Сброс значения при поиске по новому критерию

import photosTpl from './templates/photo.hbs';
import './scss/main.scss';
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
// console.log(pixabayApiService);

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  articlesContainer: document.querySelector('.js-articles-container'),
};
// Экземпляр класса кнопки загрузить еще
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchPhotos);

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
        firstpos1: 90,
        firstpos2: 200, // 90px from the top, 90px from the left.
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

  loadMoreBtn.show();
  pixabayApiService.resetPage();
  clearPhotosContainer();
  fetchPhotos();
}

function fetchPhotos() {
  loadMoreBtn.disable();
  pixabayApiService
    .fetchPhoto()
    .then(photos => {
      console.log(photos);
      appendPhotosMarkup(photos);
      success({
        title: `Загружено`,
        stack: new Stack({
          dir1: 'down',
          dir2: 'right', // Position from the top left corner.
          firstpos1: 90,
          firstpos2: 200, // 90px from the top, 90px from the left.
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
      loadMoreBtn.enable();
      refs.articlesContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    })
    .catch
    // error({
    //   title: 'Ошибка при загрузке картинок!',
    //   stack: new Stack({
    //     dir1: 'down',
    //     dir2: 'right', // Position from the top left corner.
    //     firstpos1: 90,
    //     firstpos2: 200, // 90px from the top, 90px from the left.
    //   }),
    //   modules: new Map([
    //     [
    //       ...defaultModules,
    //       [
    //         PNotifyMobile,
    //         {
    //           swipeDismiss: false,
    //         },
    //       ],
    //     ],
    //   ]),
    // }),
    ();
}

function appendPhotosMarkup(photos) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', photosTpl(photos));
}

function clearPhotosContainer() {
  refs.articlesContainer.innerHTML = '';
}
