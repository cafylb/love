const MAX_BOOKS = 40;
const MAX_PAGES_PER_BOOK = 120;
const IMAGE_EXTENSIONS = ["png"];
const CACHE_KEY = "album_books_cache_v2";

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

function loadCachedBooks() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((book) => book && Number.isFinite(book.number) && Array.isArray(book.pages))
      .map((book) => ({
        number: book.number,
        pages: book.pages.filter((p) => typeof p === "string" && p.length > 0)
      }))
      .filter((book) => book.pages.length > 0);
  } catch {
    return [];
  }
}

function saveCachedBooks(items) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(items));
  } catch {}
}

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
    img.src = url;
  });
}

async function findPageImage(bookNumber, pageNumber) {
  for (const ext of IMAGE_EXTENSIONS) {
    const url = `../books/book-${bookNumber}/${pageNumber}.${ext}`;
    if (await imageExists(url)) {
      return url;
    }
  }
  return null;
}

function prefetchImage(url) {
  const img = new Image();
  img.src = url;
}

async function loadRemainingPages(bookNumber, book, startPage) {
  for (let page = startPage; page <= MAX_PAGES_PER_BOOK; page += 1) {
    const pageUrl = await findPageImage(bookNumber, page);
    if (!pageUrl) {
      break;
    }
    book.pages[page - 1] = pageUrl;
    prefetchImage(pageUrl);
    if (books[activeBookIndex] === book) {
      renderSpread();
    }
  }
}

async function discoverBooksProgressive() {
  const result = [];

  for (let bookNumber = 1; bookNumber <= MAX_BOOKS; bookNumber += 1) {
    const firstPage = await findPageImage(bookNumber, 1);
    if (!firstPage) {
      continue;
    }

    const book = {
      number: bookNumber,
      pages: []
    };
    book.pages[0] = firstPage;
    result.push(book);

    const secondPage = await findPageImage(bookNumber, 2);
    if (secondPage) {
      book.pages[1] = secondPage;
      prefetchImage(secondPage);
    }

    if (result.length === 1) {
      books = result;
      renderSpread();
    }

    loadRemainingPages(bookNumber, book, 3);
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
    const loadedPageCount = book.pages.filter(Boolean).length;
    const totalSpreads = Math.max(1, Math.ceil(loadedPageCount / 2));
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

  const loadedPageCount = book.pages.filter(Boolean).length;
  if (activeSpreadStart + 2 >= loadedPageCount) {
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

  const cachedBooks = loadCachedBooks();
  if (cachedBooks.length > 0) {
    books = cachedBooks;
    renderSpread();
  }

  const freshBooks = await discoverBooksProgressive();
  if (freshBooks.length > 0) {
    books = freshBooks;
    saveCachedBooks(freshBooks);
    renderSpread();
  } else if (books.length === 0) {
    renderSpread();
  }
}

init();
