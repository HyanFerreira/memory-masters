document.addEventListener('DOMContentLoaded', () => {
  const memoryGame = document.querySelector('.content-game');
  const correctButton = document.getElementById('btn-correct');
  let cards = Array.from(memoryGame.children);
  let hasFlippedCard = false;
  let firstCard, secondCard;
  let lockBoard = false;
  let canCheckForMatch = false;
  let options = document.querySelectorAll('.options button');

  options.forEach(item => {
    item.addEventListener('click', () => {
      options.forEach(item => {
        item.classList.remove('active');
      });
      item.classList.add('active');
      correctButton.style.display = 'flex';
    });
  });

  function gerarCards(modelo) {
    const contentGame = document.querySelector('.content-game');
    contentGame.innerHTML = '';

    modelo.map(item => {
      let cardStructure = `
          <div class="card" data-term="${item.dataTerm}">
              <div class="face front">
                  <div class="face-reverse">
                      <p>${item.text}</p>
                      <img src="${item.img}" alt="">
                  </div>
              </div>
              <div class="face back">
                  <img src="../assets/img/memory_masters_two.svg" alt="">
              </div>
          </div>
      `;

      contentGame.innerHTML += cardStructure;
    });

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => card.addEventListener('click', flipCard));
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    hasFlippedCard = false;

    lockBoard = true;

    setTimeout(() => {
      correctButton.removeAttribute('disabled');
      canCheckForMatch = true;
    }, 400);
  }

  const op1 = document.getElementById('op1');
  const op2 = document.getElementById('op2');

  op1.addEventListener('click', () => {
    gerarCards(modeloHTML);
  });

  op2.addEventListener('click', () => {
    gerarCards(modeloCSS);
  });

  const playerName = localStorage.getItem('player');

  document.getElementById('player-display').innerText = playerName;

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const shuffledCards = shuffle(cards);

  memoryGame.innerHTML = '';

  shuffledCards.forEach(card => memoryGame.appendChild(card));

  cards = document.querySelectorAll('.card');

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    hasFlippedCard = false;

    lockBoard = true;

    setTimeout(() => {
      correctButton.removeAttribute('disabled');
      canCheckForMatch = true;
    }, 400);
  }

  function checkForMatch() {
    if (!canCheckForMatch || !firstCard || !secondCard) return;

    if (firstCard.dataset.term === secondCard.dataset.term) {
      disableCards();
    } else {
      unflipCards();
    }

    canCheckForMatch = false;
    correctButton.setAttribute('disabled', '');
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('disable');
    secondCard.classList.add('disable');
    resetBoard();
  }

  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
    }, 0);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  cards.forEach(card => card.addEventListener('click', flipCard));

  correctButton.addEventListener('click', checkForMatch);

  document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
      checkForMatch();
    }
  });
});
