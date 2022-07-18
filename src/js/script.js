('use strict');

const select = {
  templateOf: {
    books: '#template-book',
  },
  containerOf: {
    books: '.books-list',
    filters: '.filters',
  },
  book: {
    image: '.book__image',
  },
};
const templates = {
  bookTemplate: Handlebars.compile(
    document.querySelector(select.templateOf.books).innerHTML
  ),
};
class BooksList {
  constructor() {
    this.initData();
    this.getElements();
    this.render();
    this.initActions();
    this.determineRatingBgc();
  }

  initData() {
    this.data = dataSource.books;
  }
  getElements() {
    this.filters = [];
    this.favoriteBooks = [];
    this.bookContainer = document.querySelector(select.containerOf.books);
    this.filterContainer = document.querySelector(select.containerOf.filters);
  }

  render() {
    for (let book of this.data) {
      const ratingWidthTemp = 10 * book.rating;
      const ratingBgcTemp = this.determineRatingBgc(book.rating);

      const bookHTML = templates.bookTemplate({
        id: book.id,
        price: book.price,
        name: book.name,
        image: book.image,
        rating: book.rating,
        ratingWidth: ratingWidthTemp,
        ratingBgc: ratingBgcTemp,
      });
      const bookDOM = utils.createDOMFromHTML(bookHTML);
      this.bookContainer.appendChild(bookDOM);
    }
  }
  determineRatingBgc(rating) {
    let background = '';
    if (rating < 6) {
      background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
    }
    if (rating > 6 && rating <= 8) {
      background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
    }
    if (rating > 8 && rating <= 9) {
      background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
    }
    if (rating > 9) {
      background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
    }
    return background;
  }
  initActions() {
    const thisBooksList = this;
    const favoriteBooks = this.favoriteBooks;
    this.bookContainer.addEventListener('dblclick', function (event) {
      event.preventDefault();
      const clickedElement = event.target.offsetParent;
      if (clickedElement.classList.contains(select.book.image.substring(1))) {
        clickedElement.classList.toggle('favorite');
        let imageID = clickedElement.getAttribute('data-id');
        if (!favoriteBooks.includes(imageID)) favoriteBooks.push(imageID);
        else if (favoriteBooks.includes(imageID))
          favoriteBooks.splice(favoriteBooks.indexOf(imageID, 1));
      }
    });
    thisBooksList.filterContainer.addEventListener('click', function (event) {
      const clickedElement = event.target;
      if (
        clickedElement.tagName === 'INPUT' &&
        clickedElement.name === 'filter' &&
        clickedElement.type === 'checkbox'
      ) {
        if (clickedElement.checked)
          thisBooksList.filters.push(clickedElement.value);
        if (!clickedElement.checked)
          thisBooksList.filters.splice(
            thisBooksList.filters.indexOf(clickedElement.value, 1)
          );
      }
      thisBooksList.filterBooks();
    });
  }
  filterBooks() {
    const thisBooksList = this;
    for (let book of thisBooksList.data) {
      let shouldBeHidden = false;
      for (let filter of thisBooksList.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }
      const bookDataID = document.querySelector(
        select.book.image + '[data-id="' + book.id + '"]'
      );
      if (shouldBeHidden) bookDataID.classList.add('hidden');
      else bookDataID.classList.remove('hidden');
    }
  }
}

const app = {
  init: function () {
    new BooksList();
  },
};

app.init();
  
