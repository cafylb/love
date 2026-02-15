const MAX_BOOKS = 40;
const MAX_PAGES_PER_BOOK = 120;
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"];

const heartsRoot = document.querySelector(".hearts");
const bookElement = document.getElementById("book");
const coverButton = document.getElementById("cover-btn");
const leftPageButton = document.getElementById("left-page");
const rightPageButton = document.getElementById("right-page");
const leftImage = document.getElementById("left-image");
const rightImage = document.getElementById("right-image");
const statusText = document.getElementById("status-text");

let books = [];
let activeBookIndex = 0;
let activeSpreadStart = 0;
let isOpen = false;
let isFlipping = false;

function createHearts() {
  for (let i = 0; i < 24; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "❤";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${8 + Math.random() * 8}s`;
    heart.style.animationDelay = `${Math.random() * 8}s`;
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    heartsRoot.appendChild(heart);
  }
}

function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = `${url}?v=${Date.now()}`;
  });
}

async function findPageImage(bookNumber, pageNumber) {
  for (const ext of IMAGE_EXTENSIONS) {
    const url = `../books/book-${bookNumber}/${pageNumber}.${ext}`;
    // eslint-disable-next-line no-await-in-loop
    if (await imageExists(url)) {
      return url;
    }
  }
  return null;
}

async function loadBookPages(bookNumber) {
  const pages = [];

  for (let page = 1; page <= MAX_PAGES_PER_BOOK; page += 1) {
    // eslint-disable-next-line no-await-in-loop
    const pageUrl = await findPageImage(bookNumber, page);
    if (!pageUrl) {
      break;
    }
    pages.push(pageUrl);
  }

  return pages;
}

async function discoverBooks() {
  const result = [];

  for (let book = 1; book <= MAX_BOOKS; book += 1) {
    // eslint-disable-next-line no-await-in-loop
    const firstPage = await findPageImage(book, 1);
    if (!firstPage) {
      break;
    }

    // eslint-disable-next-line no-await-in-loop
    const pages = await loadBookPages(book);
    if (pages.length > 0) {
      result.push({
        number: book,
        pages
      });
    }
  }

  return result;
}

function renderSpread() {
  const book = books[activeBookIndex];
  if (!book) {
    leftImage.removeAttribute("src");
    rightImage.removeAttribute("src");
    if (statusText) {
      statusText.textContent = "В папке books пока нет книг.";
    }
    return;
  }

  const left = book.pages[activeSpreadStart] || "";
  const right = book.pages[activeSpreadStart + 1] || "";

  if (left) {
    leftImage.src = left;
  } else {
    leftImage.removeAttribute("src");
  }

  if (right) {
    rightImage.src = right;
  } else {
    rightImage.removeAttribute("src");
  }

  if (statusText) {
    const currentSpread = Math.floor(activeSpreadStart / 2) + 1;
    const totalSpreads = Math.max(1, Math.ceil(book.pages.length / 2));
    statusText.textContent = `Книга ${book.number}. Разворот ${currentSpread} из ${totalSpreads}`;
  }
}

function toggleBook() {
  isOpen = !isOpen;
  bookElement.classList.toggle("open", isOpen);
}

function flipForward() {
  const book = books[activeBookIndex];
  if (!book) {
    return;
  }

  if (activeSpreadStart + 2 >= book.pages.length) {
    return;
  }

  if (isFlipping) {
    return;
  }

  isFlipping = true;
  bookElement.classList.add("flipping");

  setTimeout(() => {
    activeSpreadStart += 2;
    renderSpread();
  }, 170);

  setTimeout(() => {
    isFlipping = false;
    bookElement.classList.remove("flipping");
  }, 380);
}

function flipBackward() {
  if (activeSpreadStart === 0) {
    isOpen = false;
    bookElement.classList.remove("open");
    return;
  }

  if (isFlipping) {
    return;
  }

  isFlipping = true;
  bookElement.classList.add("flipping-back");

  setTimeout(() => {
    activeSpreadStart = Math.max(0, activeSpreadStart - 2);
    renderSpread();
  }, 170);

  setTimeout(() => {
    isFlipping = false;
    bookElement.classList.remove("flipping-back");
  }, 380);
}

function bindEvents() {
  coverButton.addEventListener("click", () => {
    toggleBook();
  });

  const onLeftPageClick = () => {
    if (!isOpen) {
      return;
    }
    flipBackward();
  };

  const onRightPageClick = () => {
    if (!isOpen) {
      return;
    }
    flipForward();
  };

  leftPageButton.addEventListener("click", onLeftPageClick);
  rightPageButton.addEventListener("click", onRightPageClick);
}

async function init() {
  createHearts();
  bindEvents();

  books = await discoverBooks();
  renderSpread();
}

init();
