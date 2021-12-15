"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
// --- GENERAL ---
const containerLibrary = document.querySelector(".content__container--hero");
const sidebarNotes = document.querySelector(".sidebar--aside");
const sidebarList = document.querySelector(".sidebar__list");
const overlay = document.querySelector(".overlay");
// --- MODALS ---
const modalNote = document.querySelector(".modal--note");
const modalBook = document.querySelector(".modal--book");
// --- FORMS ---
const formBook = document.querySelector(".modal__form--book");
const formNote = document.querySelector(".modal__form--note");
// Inputs
// --- LIBRARY ---
const inputTitle = document.querySelector(".form__input--title");
const inputAuthor = document.querySelector(".form__input--author");
const inputPages = document.querySelector(".form__input--pages");
const inputRating = document.querySelector(".form__input--rating");
const inputRead = document.querySelector(".form__input--read");
// --- NOTES ---
const inputNote = document.querySelector(".form__input--note");
// Buttons
// --- GENERAL ---
const btnNewBook = document.querySelector(".nav__btn--new");
const btnSaveBooks = document.querySelector(".nav__btn--save");
const btnNewNote = document.querySelector(".sidebar__btn--new");
// --- MODALS ---
const btnCloseNote = modalNote.querySelector(".modal__btn--close");
const btnCloseBook = modalBook.querySelector(".modal__btn--close");

////////////////////////////////////////////////
////// Book Constructor
///////////////////////////////////////////////

class Book {
  constructor(title, author, pages, rating, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.rating = rating;
    this.isRead = isRead;
  }

  toggleRead() {
    this.isRead = !this.isRead;
  }
}

////////////////////////////////////////////////
////// App Architecture
///////////////////////////////////////////////

class App {
  #books = [];
  #template = new Book("The Maze Runner", "James Dashner", 375, 4, true);

  constructor() {
    // Loading app...
    this._getLocalStorage();
    if (!this.#books.length) {
      this.#books.push(this.#template);
      this._renderBook(this.#template);
    }
    // Add event handlers
    containerLibrary.addEventListener(
      "click",
      this._handleLibraryEvents.bind(this)
    );
    btnSaveBooks.addEventListener("click", this._storeBooks.bind(this));
    btnNewBook.addEventListener("click", this._showBookForm);
    btnCloseBook.addEventListener("click", this._hideBookForm);
    formBook.addEventListener("submit", this._newBook.bind(this));
    btnNewNote.addEventListener("click", this._showNoteForm);
    btnCloseNote.addEventListener("click", this._hideNoteForm);
    formNote.addEventListener("submit", this._newNote.bind(this));
  }

  _handleLibraryEvents(e) {
    const clicked = e.target;
    if (!clicked) return;
    if (clicked.classList.contains("item__btn--remove"))
      return this._removeBook.call(this, clicked);
    if (clicked.classList.contains("item__btn--status"))
      return clicked.classList.toggle("item__btn--status-active");
    if (clicked.closest(".item").classList.contains("item"))
      return sidebarNotes.classList.toggle("hidden");
  }

  _storeBooks() {
    this._setLocalStorage();
    return alert("Library has been successfully saved!");
  }

  _showBookForm() {
    modalBook.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  _hideBookForm() {
    // prettier-ignore
    inputTitle.value = inputAuthor.value = inputPages.value = inputRating.value = "";
    inputRead.checked = false;
    modalBook.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  _newBook(e) {
    e.preventDefault();
    const title = inputTitle.value;
    const author = inputAuthor.value;
    const pages = +inputPages.value;
    const rating = +inputRating.value;
    const isRead = inputRead.value;
    const desc = [title, author, pages, rating, isRead];
    // Validate input fields
    if (desc.some((ipt) => !ipt))
      return alert("Some fields are left empty. Please fill them in");
    const book = new Book(...desc);
    this.#books.push(book);
    this._renderBook(book);
    this._hideBookForm();
    this._setLocalStorage();
  }

  _removeBook(clicked) {
    const card = clicked.closest(".item");
    const idx = +card.dataset.index;
    if (idx > -1) this.#books.splice(idx, 1);
    containerLibrary.removeChild(card);
    this._setLocalStorage();
  }

  _renderBook(book) {
    const html = `
    <div class="container__item item" data-index="${
      containerLibrary.childNodes.length
    }">
      <p class="item__label item__label--author">${book.author}</p>
      <p class="item__label item__label--title">${book.title}</p>
      <p class="item__label item__label--pages">${book.pages}</p>
      <p class="item__label item__label--rating">${"⭐".repeat(book.rating)}</p>
      <button class="item__btn item__btn--remove btn">Remove</button>
      <button class="item__btn item__btn--status ${
        book.isRead ? "item__btn--status-active" : ""
      } btn">Read</button>
    </div>
    `;
    containerLibrary.insertAdjacentHTML("beforeend", html);
  }

  _showNoteForm() {
    modalNote.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  _hideNoteForm() {
    inputNote.value = "";
    modalNote.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  _newNote(e) {
    e.preventDefault();
    const note = inputNote.value;
    if (!note) return;
    this._renderNote(note);
    this._hideNoteForm();
  }

  _renderNote(txt) {
    const li = document.createElement("li");
    li.classList.add("list__item", "item");
    li.textContent = txt;
    sidebarList.appendChild(li);
  }

  _setLocalStorage() {
    localStorage.setItem("books", JSON.stringify(this.#books));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("books"));
    if (!data) return;
    const restoredData = data.map((item) => Object.assign(new Book(), item));
    this.#books = restoredData;
    this.#books.forEach((book) => this._renderBook(book));
  }
}

const app = new App();
