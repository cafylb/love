const petalsRoot = document.getElementById("petals");
const openLetterButton = document.getElementById("open-letter");
const letter = document.getElementById("letter");

function createPetals() {
  for (let i = 0; i < 34; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = "✿";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${7 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 6}s`;
    petal.style.setProperty("--drift", `${-45 + Math.random() * 90}px`);
    petalsRoot.appendChild(petal);
  }
}

function bindLetter() {
  openLetterButton.addEventListener("click", () => {
    letter.classList.toggle("hidden");
    openLetterButton.textContent = letter.classList.contains("hidden")
      ? "Открыть письмо"
      : "Свернуть письмо";
  });
}

createPetals();
bindLetter();
