'use strict';

export { onWindowScroll, onUpBtnClick, onPageScroll };

const upBtnRef = document.querySelector('.js-up-btn');

window.addEventListener('scroll', onWindowScroll);
upBtnRef.addEventListener('click', onUpBtnClick);

function onWindowScroll() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    upBtnRef.classList.remove('is-hidden');
  } else {
    upBtnRef.classList.add('is-hidden');
  }
}

function onUpBtnClick() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onPageScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
