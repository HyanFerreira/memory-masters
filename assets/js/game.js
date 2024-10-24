document.addEventListener("DOMContentLoaded", () => {
  const memoryGame = document.querySelector(".content-game");
  const correctButton = document.getElementById("btn-correct");
  const btnExit = document.getElementById("btn-exit");
  let hasFlippedCard = false;
  let firstCard, secondCard;
  let lockBoard = false;
  let canCheckForMatch = false;

  btnExit.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  // Função para embaralhar as cartas
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ];
    }

    return array;
  }

  // Função para gerar as cartas
  function gerarCards(modelo) {
    memoryGame.innerHTML = "";

    modelo.forEach(item => {
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

      memoryGame.innerHTML += cardStructure;
    });

    let cards = Array.from(memoryGame.children);
    cards = shuffle(cards); // Embaralhar as cartas

    // Adicionar as cartas embaralhadas ao DOM
    cards.forEach(card => memoryGame.appendChild(card));

    // Adicionar o evento de clique para virar as cartas
    cards.forEach(card => card.addEventListener("click", flipCard));
  }

  // Função para virar a carta
  function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add("flipped");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    hasFlippedCard = false;
    lockBoard = true;

    setTimeout(() => {
      correctButton.removeAttribute("disabled");
      canCheckForMatch = true;
    }, 400);
  }

  // Função para verificar se há correspondência entre as cartas
  function checkForMatch() {
    if (!canCheckForMatch || !firstCard || !secondCard) return;

    if (firstCard.dataset.term === secondCard.dataset.term) {
      disableCards();
    } else {
      unflipCards();
    }

    canCheckForMatch = false;
    correctButton.setAttribute("disabled", "");
  }

  // Desativar cartas correspondentes
  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    firstCard.classList.add("disable");
    secondCard.classList.add("disable");
    resetBoard();
  }

  // Virar as cartas de volta se não corresponderem
  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }

  // Resetar as variáveis de controle do jogo
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  // Configurações iniciais do jogador e escolha do jogo
  const playerName = localStorage.getItem("player");
  const choiceGame = localStorage.getItem("choice_game");

  document.getElementById("player-display").innerText = playerName;
  document.getElementById("choice-display").innerText = choiceGame;

  // Selecionar o modelo correto com base na escolha do jogo
  let modelo;
  switch (choiceGame) {
    case "modeloHTML":
      modelo = modeloHTML;
      break;
    case "modeloCSS":
      modelo = modeloCSS;
      break;
    case "modeloJS":
      modelo = modeloJS;
      break;
  }

  // Gerar e embaralhar as cartas
  gerarCards(modelo);

  // Eventos
  correctButton.addEventListener("click", checkForMatch);

  // Tecla de atalho para verificar a correspondência (espaço)
  document.addEventListener("keydown", event => {
    if (event.code === "Space") {
      checkForMatch();
    }
  });
});
