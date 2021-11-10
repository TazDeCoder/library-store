"use strict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

// Inputs
const inputFormTitle = document.querySelector(".form__input--title");
const inputFormAuthor = document.querySelector(".form__input--author");
const inputFormPages = document.querySelector(".form__input--pages");
// Buttons
const btnNewBook = document.querySelector(".btn--new-book");
const btnSubmit = document.querySelector(".form__btn--submit");
const btnCloseModal = document.querySelector(".btn--close-modal");
// Parents
const cards = document.querySelector(".cards");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

////////////////////////////////////////////////
////// Global variables
///////////////////////////////////////////////

let myLibrary = [];

class Book {
  constructor(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
  toggleRead() {
    this.isRead = !this.isRead;
  }
}

const template = new Book("Book Title", "Author Name", 0, false);

addBookToLibrary(template);

////////////////////////////////////////////////
////// App UI Setup
///////////////////////////////////////////////

function addBookToLibrary(book) {
  const div = document.createElement("div");
  div.classList.add("cards__item");
  div.setAttribute("data-index", cards.childNodes.length);
  const title = document.createElement("p");
  title.classList.add("cards__label--title");
  title.innerHTML = book.title;
  const author = document.createElement("p");
  author.classList.add("cards__label--author");
  author.innerHTML = book.author;
  const status = document.createElement("button");
  status.innerHTML = "Read";
  status.classList.add("cards__btn--status");
  if (book.isRead) status.classList.add("cards__btn--status-active");
  status.addEventListener("click", function () {
    book.toggleRead();
    status.classList.toggle("cards__btn--status-active");
  });
  const remove = document.createElement("button");
  remove.innerHTML = "Remove Book";
  remove.classList.add("cards__btn--remove");
  remove.addEventListener("click", function () {
    removeBookFromLibrary(div);
  });
  // Adding elements to card item
  div.appendChild(title);
  div.appendChild(author);
  div.appendChild(status);
  div.appendChild(remove);
  cards.appendChild(div);
}

function removeBookFromLibrary(node) {
  const idx = node.dataset.index;
  myLibrary.pop(idx);
  cards.removeChild(node);
}

myLibrary.map((book) => addBookToLibrary(book));

////////////////////////////////////////////////
////// Event Handlers
///////////////////////////////////////////////

btnNewBook.addEventListener("click", function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

btnSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  const title = inputFormTitle.value;
  const author = inputFormAuthor.value;
  const pages = +inputFormPages.value;
  const book = new Book(title, author, pages, false);
  addBookToLibrary(book);
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});

btnCloseModal.addEventListener("click", function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});
