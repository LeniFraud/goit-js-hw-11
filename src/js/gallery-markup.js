export const createGalleryCardsMarkup = pictures =>
  pictures
    .map(el => {
      return `
            <div class="gallery__card">
                <a href="${el.largeImageURL}" class="gallery__link">
                    <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" class="gallery__img" />
                </a>
                <div class="card__info">
                    <p class="card__meta">
                        <b>Likes</b>${el.likes}
                    </p>
                    <p class="card__meta">
                        <b>Views</b>${el.views}
                    </p>
                    <p class="card__meta">
                        <b>Comments</b>${el.comments}
                    </p>
                    <p class="card__meta">
                        <b>Downloads</b>${el.downloads}
                    </p>
                </div>
            </div>
            `;
    })
    .join('');
