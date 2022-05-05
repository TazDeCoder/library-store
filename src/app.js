"use strict";

import "core-js/stable";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
const containerLibrary = document.querySelector(".content__container--hero");
const modalBook = document.querySelector(".modal--book");
const formBook = document.querySelector(".modal__form--book");
const overlay = document.querySelector(".overlay");
// Inputs
const inputTitle = document.querySelector(".form__input--title");
const inputAuthor = document.querySelector(".form__input--author");
const inputPage = document.querySelector(".form__input--pages");
const inputRating = document.querySelector(".form__input--ratings");
const inputRead = document.querySelector(".form__input--read");
// Buttons
const btnNewBook = document.querySelector(".nav__btn--new");
const btnCloseModalBook = modalBook.querySelector(".modal__btn--close");

////////////////////////////////////////////////
////// Book Factory Function
///////////////////////////////////////////////

const Book = function (title, author, pages, ratings, read) {
  const id = String(Date.now()).slice(-4);
  // Methods
  function toggleRead() {
    this.read = !this.read;
  }

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
  #books = [];
  #template = Book("The Maze Runner", "James Dashner", 375, 4, true);

  constructor() {
    // Load app
    this._getLocalStorage();
    if (!this.#books.length) {
      this.#books.push(this.#template);
      this._renderBook(this.#template);
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

  _handleCardEvents(e) {
    const clicked = e.target;
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

  _newBook(e) {
    e.preventDefault();
    const title = inputTitle.value;
    const author = inputAuthor.value;
    const pages = +inputPage.value;
    const ratings = +inputRating.value;
    const read = inputRead.value;
    const book = Book(title, author, pages, ratings, read);
    // Add book to books array
    this.#books.push(book);
    // Render book onto library
    this._renderBook(book);
    // Hide form
    this._hideBookForm();
    // Update library
    this._setLocalStorage();
  }

  _removeBook(clicked) {
    const card = clicked.closest(".container__item--card");
    if (!card) return;
    // Get card id
    const id = card.dataset.id;
    // Find id of book in books array + remove it
    const idx = this.#books.findIndex((book) => book.id === id);
    if (idx > -1) this.#books.splice(idx, 1);
    // Remove card from library
    containerLibrary.removeChild(card);
    // Update library
    this._setLocalStorage();
  }

  _updateBook(clicked) {
    const card = clicked.closest(".container__item--card");
    if (!card) return;
    // Get card id
    const id = card.dataset.id;
    // Find book in books array and update read status
    const book = this.#books.find((book) => book.id === id);
    book.toggleRead();
    // Toggle read status
    clicked.classList.toggle("item__btn--status-active");
    // Update library
    this._setLocalStorage();
  }

  /////////////////////////////////////
  //////////// DOM manipulation

  _renderBook(book) {
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
    localStorage.setItem("books", JSON.stringify(this.#books));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("books"));
    if (!data) return;
    // Gather data
    const restoredData = data.map((item) => Object.assign(Book(), item));
    // Set data to books array
    this.#books = restoredData;
    // Render each book onto library
    this.#books.forEach((book) => this._renderBook(book));
  }
}

const app = new App();
