// import { info, success, error, defaultModules, defaults } from '@pnotify/core';
// import '@pnotify/core/dist/PNotify.css';
// import '@pnotify/core/dist/BrightTheme.css';
// import * as PNotifyMobile from '@pnotify/mobile';
// import '@pnotify/mobile/dist/PNotifyMobile.css';

// defaults.delay = 1000;

// defaultModules.set(PNotifyMobile, {});

// import PixabayApiService from './js/apiService';
// const pixabayApiService = new PixabayApiService();

// // function appendPhotosMarkup(photos) {
// //   refs.articlesContainer.insertAdjacentHTML('beforeend', photosTpl(photos));
// // }
// console.log(appendPhotosMarkup);

// // ждем полной загрузки страницы
// window.onload = () => {
//   // устанавливаем настройки
//   const options = {
//     // родитель целевого элемента - область просмотра
//     root: null,
//     // без отступов
//     rootMargin: '0px',
//     // процент пересечения - половина изображения
//     threshold: 0.75,
//   };

//   // создаем наблюдатель
//   const observer = new IntersectionObserver((entries, observer) => {
//     entries.forEach(async entry => {
//       // если элемент является наблюдаемым
//       if (entry.isIntersecting && pixabayApiService.page > 1) {
//         console.log('Дошли до конца списка, загружаем еще партию картинок...');
//         try {
//           let photos = await pixabayApiService.fetchPhoto();
//           if (photos.hits.length === 0) {
//             info({
//               title: 'Ничего не найдено! Попробуйте изменить поисковый запрос.',
//               modules: new Map([
//                 [
//                   ...defaultModules,
//                   [
//                     PNotifyMobile,
//                     {
//                       swipeDismiss: false,
//                     },
//                   ],
//                 ],
//               ]),
//             });
//           } else {
//             success({
//               title: `Загружено ${data.hits.length} шт.`,
//               modules: new Map([
//                 [
//                   ...defaultModules,
//                   [
//                     PNotifyMobile,
//                     {
//                       swipeDismiss: false,
//                     },
//                   ],
//                 ],
//               ]),
//             });
//             appendPhotosMarkup(photos);
//             pixabayApiService.nextPage();
//           }
//         } catch (e) {
//           error({
//             title:
//               'Ошибка при загрузке картинок! Проверьте правильность поискового запроса.',
//             modules: new Map([
//               [
//                 ...defaultModules,
//                 [
//                   PNotifyMobile,
//                   {
//                     swipeDismiss: false,
//                   },
//                 ],
//               ],
//             ]),
//           });
//         }
//       }
//     });
//   }, options);

//   //следим за кнопкой
//   const target = document.querySelector('.load-more');
//   observer.observe(target);
// };

//  * - Загружаем статьи при сабмите формы
//  * - Загружаем статьи при нажатии на кнопку «Загрузить еще»
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

  if (pixabayApiService.query.trim() === '') {
    return info({
      title: 'Введите валидный поисковый запрос.',
      stack: new Stack({
        dir1: 'down',
        dir2: 'right', // Position from the top left corner.
        firstpos1: 90,
        firstpos2: 200, // 90px from the top, 200px from the left.
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
            firstpos1: 90,
            firstpos2: 200, // 90px from the top, 200px from the left.
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
          firstpos1: 90,
          firstpos2: 200, // 90px from the top, 200px from the left.
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
      refs.articlesContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
      error =>
        info({
          title: 'Введите валидный поисковый запрос.',
          stack: new Stack({
            dir1: 'down',
            dir2: 'right', // Position from the top left corner.
            firstpos1: 90,
            firstpos2: 200, // 90px from the top, 200px from the left.
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
}

function clearPhotosContainer() {
  refs.articlesContainer.innerHTML = '';
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && pixabayApiService.query !== '') {
      // console.log('Пора грузить еще' + Date.now());
      pixabayApiService.fetchPhoto().then(photos => {
        appendPhotosMarkup(photos);
        pixabayApiService.incrementPage();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.sentinel);
