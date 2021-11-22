"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Inputs
const inputTitle = document.querySelector(".form__input--title");
const inputAuthor = document.querySelector(".form__input--author");
const inputPages = document.querySelector(".form__input--pages");
const inputRating = document.querySelector(".form__input--rating");
const inputRead = document.querySelector(".form__input--read");
const inputNote = document.querySelector(".form__input--note");
// Buttons
const btnNewNote = document.querySelector(".btn--new-note");
const btnCloseNote = document.querySelector(".btn--close-note");
const btnNewBook = document.querySelector(".btn--new-book");
const btnCloseBook = document.querySelector(".btn--close-book");
// Parents
const cards = document.querySelector(".cards");
const modalBook = document.querySelector(".modal--book");
const formBook = document.querySelector(".modal__form--book");
const notes = document.querySelector(".notes");
const notesList = document.querySelector(".notes__list");
const modalNote = document.querySelector(".modal--note");
const formNote = document.querySelector(".modal__form--note");
const overlay = document.querySelector(".overlay");

////////////////////////////////////////////////
////// Book Constructor
///////////////////////////////////////////////

class Book {
  books = [];

  constructor(title, author, pages, rating, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.rating = rating;
    this.isRead = isRead;
    this.desc = [title, author, pages, rating, isRead];
    this.books.push(...this.desc);
  }

  toggleRead() {
    this.isRead = !this.isRead;
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
    formBook.addEventListener("submit", this._newBook.bind(this));
    btnNewNote.addEventListener("click", this._showNoteForm);
    btnCloseNote.addEventListener("click", this._hideNoteForm);
    formNote.addEventListener("click", this._newNote);
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
    const isRead = inputRead.value;
    const desc = [title, author, pages, rating, isRead];
    const book = new Book(...desc);
    // Validate input fields
    if (desc.some((ipt) => !ipt))
      return alert("Some fields are left empty. Please fill them in");
    // Render book
    this._renderBook(book);
    // prettier-ignore
    inputTitle.value = inputAuthor.value = inputPages.value = inputRating.value = "";
    inputRead.checked = false;
    modalBook.classList.add("hidden");
    overlay.classList.add("hidden");
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
    const labelAuthor = document.createElement("p");
    labelAuthor.classList.add("cards__label", "cards__label--author");
    labelAuthor.innerHTML = book.author;
    const labelTitle = document.createElement("p");
    labelTitle.classList.add("cards__label", "cards__label--title");
    labelTitle.innerHTML = book.title;
    const labelPages = document.createElement("p");
    labelPages.classList.add("cards__label", "cards__label--pages");
    labelPages.innerHTML = book.pages;
    const labelRating = document.createElement("p");
    labelRating.classList.add("cards__label", "cards__label--rating");
    labelRating.innerHTML = "⭐".repeat(book.rating);
    const btnRemove = document.createElement("button");
    btnRemove.classList.add("cards__btn", "cards__btn--remove");
    btnRemove.innerHTML = "Remove";
    btnRemove.addEventListener("click", function () {
      const idx = div.dataset.index;
      book.books.pop(idx);
      cards.removeChild(div);
    });
    const btnStatus = document.createElement("button");
    btnStatus.classList.add("cards__btn", "cards__btn--status");
    btnStatus.innerHTML = "Read";
    if (book.isRead) btnStatus.classList.add("cards__btn--status-active");
    btnStatus.addEventListener("click", function () {
      book.toggleRead();
      btnStatus.classList.toggle("cards__btn--status-active");
    });
    // Adding child elements to parent element
    appendChildren(
      div,
      ...[
        labelAuthor,
        labelTitle,
        labelPages,
        labelRating,
        btnRemove,
        btnStatus,
      ]
    );
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
