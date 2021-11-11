"use strict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

// Inputs
const inputFormTitle = document.querySelector(".form__input--title");
const inputFormAuthor = document.querySelector(".form__input--author");
const inputFormPages = document.querySelector(".form__input--pages");
const inputFormRating = document.querySelector(".form__input--rating");
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

let myLibrary;

class Book {
  constructor(
    title = "Unknown",
    author = "Unknown",
    pages = 0,
    rating = 1,
    read = false
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.rating = rating;
    this.read = read;
  }
  toggleRead() {
    this.read = !this.read;
  }
}

(() => init())();

function init() {
  myLibrary = [];
  const template = new Book("The Maze Runner", "James Dashner", 375, 4, true);
  addBookToLibrary(template);
}

////////////////////////////////////////////////
////// App UI Setup
///////////////////////////////////////////////

function addBookToLibrary(book) {
  // Creating parent element
  const div = document.createElement("div");
  div.classList.add("cards__item");
  div.setAttribute("data-index", cards.childNodes.length);
  // Creating child elements
  // Book author
  const author = document.createElement("p");
  author.classList.add("cards__label--author");
  author.innerHTML = book.author;
  // Book title label
  const title = document.createElement("p");
  title.classList.add("cards__label--title");
  title.innerHTML =
    String(book.title).length <= 48
      ? book.title
      : String(book.title).substring(0, 48).concat("...");
  // Book pages label
  const pages = document.createElement("p");
  pages.classList.add("cards__label--pages");
  pages.innerHTML =
    book.pages < 4 ? book.pages : String(book.pages).substring(0, 4);
  // Book rating meter
  const rating = document.createElement("p");
  rating.classList.add("cards__label--rating");
  rating.innerHTML =
    book.rating < 5 ? "⭐".repeat(book.rating) : "⭐".repeat(5);
  // Remove book button
  const remove = document.createElement("button");
  remove.classList.add("cards__btn", "cards__btn--remove");
  remove.innerHTML = "Remove";
  remove.addEventListener("click", function () {
    removeBookFromLibrary(div);
  });
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
  div.appendChild(author);
  div.appendChild(title);
  div.appendChild(pages);
  div.appendChild(rating);
  div.appendChild(remove);
  div.appendChild(status);
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
  const title = inputFormTitle.value ? inputFormTitle.value : undefined;
  const author = inputFormAuthor.value ? inputFormAuthor.value : undefined;
  const pages = inputFormPages.value ? +inputFormPages.value : undefined;
  const rating = inputFormRating.value ? +inputFormPages.value : undefined;
  const book = new Book(title, author, pages, rating);
  addBookToLibrary(book);
  // Reset input fields
  inputFormTitle.value =
    inputFormAuthor.value =
    inputFormPages.value =
    inputFormRating.value =
      "";
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});

btnCloseModal.addEventListener("click", function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});
