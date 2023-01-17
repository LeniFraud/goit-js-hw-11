import { PixabayAPI } from './js/pixabay-api';
import { createGalleryCardsMarkup } from './js/gallery-markup';
import { onWindowScroll, onUpBtnClick, onPageScroll } from './js/scroll';
import { simpleLightboxGallery } from './js/simple-lightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchFormRef: document.querySelector('.js-search-form'),
  galleryCardsRef: document.querySelector('.js-gallery'),
  loadMoreBtnRef: document.querySelector('.js-load-more'),
  searchBtnRef: document.querySelector('.js-search'),
  infScrollObserveRef: document.querySelector('.js-observe'),
  loaderRef: document.querySelector('.js-loader'),
  endOfContentMessage: document.querySelector('.js-load-end'),
};

const pixabayAPI = new PixabayAPI();

refs.searchFormRef.addEventListener('submit', onSearchFormSubmit);
// refs.loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);
refs.galleryCardsRef.addEventListener('click', e => e.preventDefault());

onWindowScroll();
onUpBtnClick();

const observer = new IntersectionObserver(
  async (entries, observer) => {
    if (entries[0].isIntersecting) {
      refs.loaderRef.classList.remove('is-hidden');
      pixabayAPI.page += 1;

      try {
        const { hits } = await pixabayAPI.getPicturesByQuery();

        if (hits.length === 0) {
          alertEndOfSearchResults();
          showEndOfContentMessage();
          observer.unobserve(refs.infScrollObserveRef);
        }

        refs.galleryCardsRef.insertAdjacentHTML(
          'beforeend',
          createGalleryCardsMarkup(hits)
        );
        simpleLightboxGallery.refresh();
        onPageScroll();
      } catch (error) {
        console.log(error);
      } finally {
        refs.loaderRef.classList.add('is-hidden');
      }
    }
  },
  {
    root: null,
    rootMargin: '0px 0px 150px 0px',
    threshold: 1,
  }
);

async function onSearchFormSubmit(e) {
  e.preventDefault();

  if (pixabayAPI.query === e.target.elements.searchQuery.value) {
    return;
  }

  if (pixabayAPI.query !== null) {
    hideEndOfContentMessage();
  }

  refs.searchBtnRef.disabled = true;

  pixabayAPI.query = e.target.elements.searchQuery.value;
  pixabayAPI.page = 1;

  try {
    const { hits, totalHits } = await pixabayAPI.getPicturesByQuery();
    if (hits.length === 0) {
      alertFailureOnFindingImages();
      e.target.reset();
      refs.galleryCardsRef.innerHTML = '';
      return;
    }
    // if (totalHits > pixabayAPI.queryAmt) {
    //   refs.loadMoreBtnRef.classList.remove('is-hidden');
    // }
    alertSuccessOnFindingImages(totalHits);
    refs.galleryCardsRef.innerHTML = createGalleryCardsMarkup(hits);
    simpleLightboxGallery.refresh();

    observer.observe(refs.infScrollObserveRef);
  } catch (error) {
    console.log(error);
  } finally {
    refs.searchBtnRef.disabled = false;
  }
}

/*
async function onLoadMoreBtnClick() {
  refs.loadMoreBtnRef.disabled = true;

  pixabayAPI.page += 1;

  try {
    const { hits } = await pixabayAPI.getPicturesByQuery();

    if (hits.length === 0) {
      refs.loadMoreBtnRef.classList.add('is-hidden');
      alertEndOfSearchResults();
    }
    refs.galleryCardsRef.insertAdjacentHTML(
      'beforeend',
      createGalleryCardsMarkup(hits)
    );
    simpleLightboxGallery.refresh();
    onPageScroll();
  } catch (error) {
    console.log(error);
  } finally {
    refs.loadMoreBtnRef.disabled = false;
  }
}
*/

function alertFailureOnFindingImages() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertSuccessOnFindingImages(amount) {
  Notify.success(`Hooray! We found ${amount} images.`);
}

function alertEndOfSearchResults() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}

function hideEndOfContentMessage() {
  refs.endOfContentMessage.classList.add('is-hidden');
}

function showEndOfContentMessage() {
  refs.endOfContentMessage.classList.remove('is-hidden');
}
