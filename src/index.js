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
};

const pixabayAPI = new PixabayAPI();

refs.searchFormRef.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);
refs.galleryCardsRef.addEventListener('click', e => e.preventDefault());

onWindowScroll();
onUpBtnClick();

async function onSearchFormSubmit(e) {
  e.preventDefault();

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
    if (totalHits > pixabayAPI.queryAmt) {
      refs.loadMoreBtnRef.classList.remove('is-hidden');
    }
    alertSuccessOnFindingImages(totalHits);
    refs.galleryCardsRef.innerHTML = createGalleryCardsMarkup(hits);
    simpleLightboxGallery.refresh();
  } catch (error) {
    console.log(error);
  } finally {
    refs.searchBtnRef.disabled = false;
  }
}

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
