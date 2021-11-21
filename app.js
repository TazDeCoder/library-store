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
    this.books.push(title, author, pages, rating, read);
  }
  toggleRead() {
    this.read = !this.read;
  }
}

const template = new Book("The Maze Runner", "James Dashner", 375, 4, true);
addBookToLibrary(template);

////////////////////////////////////////////////
////// App UI Setup
///////////////////////////////////////////////

function addBookToLibrary(book) {
  // Creating parent element
  const div = document.createElement("div");
  div.classList.add("cards__item");
  div.setAttribute("data-index", cards.childNodes.length);
  div.addEventListener("click", showNotes);
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
  template.books.pop(idx);
  cards.removeChild(node);
}

function addNote(txt) {
  const li = document.createElement("li");
  li.classList.add("notes__list__item");
  li.textContent = txt;
  notesList.appendChild(li);
}

function showNotes(e) {
  const clicked = e.target;
  if (!clicked) return;
  if (!clicked.classList.contains("cards__btn"))
    notes.classList.toggle("hidden");
}

////////////////////////////////////////////////
////// Event Handlers
///////////////////////////////////////////////

btnNewBook.addEventListener("click", function () {
  modalBook.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

btnSubmitBook.addEventListener("click", function (e) {
  e.preventDefault();
  const title = inputTitle.value ? inputTitle.value : undefined;
  const author = inputAuthor.value ? inputAuthor.value : undefined;
  const pages = inputPages.value ? +inputPages.value : undefined;
  const rating = inputRating.value ? +inputPages.value : undefined;
  const book = new Book(title, author, pages, rating);
  addBookToLibrary(book);
  // Reset input fields
  inputTitle.value =
    inputAuthor.value =
    inputPages.value =
    inputRating.value =
      "";
  modalBook.classList.add("hidden");
  overlay.classList.add("hidden");
});

btnCloseBook.addEventListener("click", function () {
  modalBook.classList.add("hidden");
  overlay.classList.add("hidden");
});

btnNewNote.addEventListener("click", function () {
  modalNote.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

btnSubmitNote.addEventListener("click", function (e) {
  e.preventDefault();
  const note = inputNote.value ? inputNote.value : "";
  addNote(note);
  inputNote.value = "";
  modalNote.classList.add("hidden");
  overlay.classList.add("hidden");
});

btnCloseNote.addEventListener("click", function () {
  modalNote.classList.add("hidden");
  overlay.classList.add("hidden");
});
