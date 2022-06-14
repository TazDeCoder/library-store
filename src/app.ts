"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
const containerLibrary: HTMLElement = document.querySelector(
  ".content__container--hero"
);
const modalBook: HTMLElement = document.querySelector(".modal--book");
const formBook: HTMLElement = document.querySelector(".modal__form--book");
const overlay: HTMLElement = document.querySelector(".overlay");
// Inputs
const inputTitle: HTMLInputElement = document.querySelector(
  ".form__input--title"
);
const inputAuthor: HTMLInputElement = document.querySelector(
  ".form__input--author"
);
const inputPage: HTMLInputElement = document.querySelector(
  ".form__input--pages"
);
const inputRating: HTMLInputElement = document.querySelector(
  ".form__input--ratings"
);
const inputRead: HTMLInputElement =
  document.querySelector(".form__input--read");
// Buttons
const btnNewBook: HTMLButtonElement = document.querySelector(".nav__btn--new");
const btnCloseModalBook: HTMLButtonElement =
  modalBook.querySelector(".modal__btn--close");

////////////////////////////////////////////////
////// Book Factory Function
///////////////////////////////////////////////

interface BookSchema {
  id?: string;
  title: string;
  author: string;
  pages: number;
  ratings: number;
  read: boolean;
  toggleRead?: () => void;
}

const Book = function ({
  id = String(Date.now()).slice(-4),
  title,
  author,
  pages,
  ratings,
  read,
}: BookSchema): BookSchema {
  const toggleRead = function () {
    this.read = !this.read;
  };

  return {
    id,
    title,
    author,
    pages,
    ratings,
    read,
    toggleRead,
  };
};

////////////////////////////////////////////////
////// App Architecture
///////////////////////////////////////////////

class App {
  books: BookSchema[] = [];
  template = Book({
    title: "The Maze Runner",
    author: "James Dashner",
    pages: 375,
    ratings: 4,
    read: true,
  });

  constructor() {
    // Load app
    this._getLocalStorage();
    if (this.books.length === 0) {
      this.books.push(this.template);
      this._renderBook(this.template);
    }
    // Add event handlers
    containerLibrary.addEventListener(
      "click",
      this._handleCardEvents.bind(this)
    );
    btnNewBook.addEventListener("click", this._showBookForm);
    btnCloseModalBook.addEventListener("click", this._hideBookForm);
    formBook.addEventListener("submit", this._newBook.bind(this));
  }

  /////////////////////////////////////
  //////////// Handler functions

  _handleCardEvents(e: Event) {
    const clicked = e.target as HTMLElement;
    if (!clicked) return;
    // Remove button triggered
    if (clicked.classList.contains("item__btn--remove"))
      return this._removeBook.call(this, clicked);
    // Status button triggered
    if (clicked.classList.contains("item__btn--status"))
      return this._updateBook.call(this, clicked);
  }

  _showBookForm() {
    modalBook.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  _hideBookForm() {
    // prettier-ignore
    inputTitle.value = inputAuthor.value = inputPage.value = inputRating.value = "";
    inputRead.checked = false;
    modalBook.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  /////////////////////////////////////
  //////////// App logic

  _newBook(e: Event) {
    e.preventDefault();
    // Gathering inputs from fields
    const title = inputTitle.value;
    const author = inputAuthor.value;
    const pages = +inputPage.value;
    const ratings = +inputRating.value;
    const read = inputRead.checked;
    // Create book object
    const book = Book({ title, author, pages, ratings, read });
    // Add book object to books array
    this.books.push(book);
    // Render book to library
    this._renderBook(book);
    // Hide book form
    this._hideBookForm();
    // Update library storage
    this._setLocalStorage();
  }

  _removeBook(clicked: HTMLInputElement) {
    const cardEl = clicked.closest(".container__item--card") as HTMLElement;
    if (!cardEl) return;
    // Get card id
    const id = cardEl.dataset.id;
    // Find id of book from books array
    const idx = this.books.findIndex((book) => book.id === id);
    // Remove book if exists
    if (idx !== -1) this.books.splice(idx, 1);
    // Remove card from library
    containerLibrary.removeChild(cardEl);
    // Update library storage
    this._setLocalStorage();
  }

  _updateBook(clicked: HTMLInputElement) {
    const cardEl = clicked.closest(".container__item--card") as HTMLElement;
    if (!cardEl) return;
    // Get card id
    const id = cardEl.dataset.id;
    // Find book in books array and update read status
    const book = this.books.find((book) => book.id === id);
    book.toggleRead();
    // Toggle read status
    clicked.classList.toggle("item__btn--status-active");
    // Update library storage
    this._setLocalStorage();
  }

  /////////////////////////////////////
  //////////// DOM manipulation

  _renderBook(book: BookSchema) {
    const html = `
      <div class="container__item container__item--card" data-id="${book.id}">
        <p class="item__label item__label--author">${book.author}</p>
        <p class="item__label item__label--title">${book.title}</p>
        <p class="item__label item__label--pages">${book.pages}</p>
        <p class="item__label item__label--rating">${"⭐".repeat(
          book.ratings
        )}</p>
        <button class="item__btn item__btn--remove btn">Remove</button>
        <button class="item__btn item__btn--status ${
          book.read ? "item__btn--status-active" : ""
        } btn">Read</button>
      </div>
    `;
    containerLibrary.insertAdjacentHTML("beforeend", html);
  }

  /////////////////////////////////////
  //////////// Local storage API

  _setLocalStorage() {
    localStorage.setItem("books", JSON.stringify(this.books));
  }

  _getLocalStorage() {
    const data: object[] = JSON.parse(localStorage.getItem("books"));
    if (!data) return;
    // Gather data
    const restoredData: BookSchema[] = data.map((item: BookSchema) =>
      Book(item)
    );
    // Replace books array with data
    this.books = restoredData;
    // Render each book onto library
    this.books.map((book) => this._renderBook(book));
  }
}

const app = new App();
