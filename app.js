"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Inputs
const inputTitle = document.querySelector(".form__input--title");
const inputAuthor = document.querySelector(".form__input--author");
const inputPages = document.querySelector(".form__input--pages");
const inputRating = document.querySelector(".form__input--rating");
const inputNote = document.querySelector(".form__input--note");
// Buttons
const btnNewBook = document.querySelector(".btn--new-book");
const btnNewNote = document.querySelector(".btn--new-note");
const btnSubmitBook = document.querySelector(".form__btn--submit-book");
const btnSubmitNote = document.querySelector(".form__btn--submit-note");
const btnCloseBook = document.querySelector(".btn--close-book");
const btnCloseNote = document.querySelector(".btn--close-note");
// Parents
const cards = document.querySelector(".cards");
const notes = document.querySelector(".notes");
const notesList = document.querySelector(".notes__list");
const modalBook = document.querySelector(".modal--book");
const modalNote = document.querySelector(".modal--note");
const overlay = document.querySelector(".overlay");

////////////////////////////////////////////////
////// Book Constructor
///////////////////////////////////////////////

class Book {
  books = [];

  constructor(title, author, pages, rating, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.rating = rating;
    this.read = read;
    this.desc = [title, author, pages, rating, read];
    this.books.push(...this.desc);
  }

  toggleRead() {
    this.read = !this.read;
  }
}

////////////////////////////////////////////////
////// App Architecture
///////////////////////////////////////////////

class App {
  template = new Book("The Maze Runner", "James Dashner", 375, 4, true);

  constructor() {
    this._renderBook(this.template);
    // Add event listeners
    btnNewBook.addEventListener("click", this._showBookForm);
    btnCloseBook.addEventListener("click", this._hideBookForm);
    btnSubmitBook.addEventListener("submit", this._newBook.bind(this));
    btnNewNote.addEventListener("click", this._showNoteForm);
    btnCloseNote.addEventListener("click", this._hideNoteForm);
    btnSubmitNote.addEventListener("submit", this._newNote);
  }

  _showBookForm() {
    modalBook.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  _hideBookForm() {
    modalBook.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  _newBook(e) {
    e.preventDefault();
    const title = inputTitle.value;
    const author = inputAuthor.value;
    const pages = +inputPages.value;
    const rating = +inputRating.value;
    const desc = [title, author, pages, rating];
    const book = new Book(...desc);
    // Validate input fields
    if (desc.some((ipt) => !ipt))
      return alert("Some fields happen to not meet required criteria");
    // Render book
    this._renderBook(book);
    // prettier-ignore
    inputTitle.value = inputAuthor.value = inputPages.value = inputRating.value = "";
    modalBook.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  _removeBook(card) {
    const idx = card.dataset.index;
    this.template.books.pop(idx);
    cards.removeChild(card);
  }

  _renderBook(book) {
    // Helper functions
    const appendChildren = (parent, ...childs) =>
      childs.forEach((node) => {
        parent.appendChild(node);
      });
    // Creating parent element
    const div = document.createElement("div");
    div.classList.add("cards__item");
    div.setAttribute("data-index", cards.childNodes.length);
    div.addEventListener("click", this._showNotes);
    // Creating child elements
    // Book author
    const author = document.createElement("p");
    author.classList.add("cards__label", "cards__label--author");
    author.innerHTML = book.author;
    // Book title label
    const title = document.createElement("p");
    title.classList.add("cards__label", "cards__label--title");
    title.innerHTML =
      String(book.title).length <= 48
        ? book.title
        : String(book.title).substring(0, 48).concat("...");
    // Book pages label
    const pages = document.createElement("p");
    pages.classList.add("cards__label", "cards__label--pages");
    pages.innerHTML =
      book.pages < 4 ? book.pages : String(book.pages).substring(0, 4);
    // Book rating meter
    const rating = document.createElement("p");
    rating.classList.add("cards__label", "cards__label--rating");
    rating.innerHTML =
      book.rating < 5 ? "⭐".repeat(book.rating) : "⭐".repeat(5);
    // Remove book button
    const remove = document.createElement("button");
    remove.classList.add("cards__btn", "cards__btn--remove");
    remove.innerHTML = "Remove";
    remove.addEventListener("click", this._removeBook.bind(this, div));
    // Read status button
    const status = document.createElement("button");
    status.classList.add("cards__btn", "cards__btn--status");
    status.innerHTML = "Read";
    if (book.read) status.classList.add("cards__btn--status-active");
    status.addEventListener("click", function () {
      book.toggleRead();
      status.classList.toggle("cards__btn--status-active");
    });
    // Adding child elements to parent element
    appendChildren(div, ...[author, title, pages, rating, remove, status]);
    cards.appendChild(div);
  }

  _showNoteForm() {
    modalNote.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  _hideNoteForm() {
    modalNote.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  _showNotes(e) {
    const clicked = e.target;
    if (!clicked) return;
    if (!clicked.classList.contains("cards__btn"))
      notes.classList.toggle("hidden");
  }

  _newNote(e) {
    e.preventDefault();
    const note = inputNote.value ? inputNote.value : "";
    this._renderNote(note);
    inputNote.value = "";
    modalNote.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  _renderNote() {
    const li = document.createElement("li");
    li.classList.add("notes__list__item");
    li.textContent = txt;
    notesList.appendChild(li);
  }
}

const app = new App();
