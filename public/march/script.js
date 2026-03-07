const revealItems = document.querySelectorAll('.reveal');
const petalsHost = document.getElementById('petals');
const petalButton = document.getElementById('petalBtn');
const albumPages = Array.from(document.querySelectorAll('.album-page'));
const albumPrev = document.getElementById('albumPrev');
const albumNext = document.getElementById('albumNext');
const albumCurrent = document.getElementById('albumCurrent');
const albumTotal = document.getElementById('albumTotal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 120}ms`;
  observer.observe(item);
});

function createPetal({ burst = false } = {}) {
  const petal = document.createElement('span');
  petal.className = 'petal';

  const left = Math.random() * 100;
  const duration = burst ? 3 + Math.random() * 2 : 7 + Math.random() * 3;
  const delay = burst ? Math.random() * 0.6 : 0;
  const scale = 0.7 + Math.random() * 0.9;
  const drift = -20 + Math.random() * 40;

  petal.style.left = `${left}vw`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.transform = `translate(${drift}px, -12vh) scale(${scale})`;

  petalsHost.appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, (duration + delay + 0.2) * 1000);
}

function burstPetals(amount = 28) {
  for (let i = 0; i < amount; i += 1) {
    createPetal({ burst: true });
  }
}

petalButton.addEventListener('click', () => {
  burstPetals();
});

setInterval(() => {
  createPetal();
}, 1200);

setTimeout(() => {
  burstPetals(20);
}, 500);

if (albumPages.length > 0 && albumPrev && albumNext && albumCurrent && albumTotal) {
  let currentPage = 0;

  albumTotal.textContent = String(albumPages.length);

  function setAlbumPage(index) {
    currentPage = (index + albumPages.length) % albumPages.length;
    albumCurrent.textContent = String(currentPage + 1);

    albumPages.forEach((page, pageIndex) => {
      page.classList.remove('is-active', 'is-prev', 'is-next');

      if (pageIndex === currentPage) {
        page.classList.add('is-active');
      } else if (pageIndex === (currentPage - 1 + albumPages.length) % albumPages.length) {
        page.classList.add('is-prev');
      } else if (pageIndex === (currentPage + 1) % albumPages.length) {
        page.classList.add('is-next');
      }
    });
  }

  albumPrev.addEventListener('click', () => {
    setAlbumPage(currentPage - 1);
  });

  albumNext.addEventListener('click', () => {
    setAlbumPage(currentPage + 1);
  });

  setAlbumPage(0);
}
