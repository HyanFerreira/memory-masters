document.addEventListener("DOMContentLoaded", () => {
  const memoryGame = document.querySelector(".content-game");
  const correctButton = document.getElementById("btn-correct");
  const btnExit = document.getElementById("btn-exit");
  const hamburguer = document.querySelector(".hamburguer");
  const asideMenu = document.getElementById("aside-menu");
  const btnCloseMenu = document.getElementById("btn-close-menu");
  const btnReset = document.getElementById("btn-reset");
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const asideFinishGame = document.querySelector(".aside-finish-game");
  const btnResetFG = document.getElementById("btn-reset-fg");
  const btnExitFG = document.getElementById("btn-exit-fg");
  let hasFlippedCard = false;
  let firstCard, secondCard;
  let lockBoard = false;
  let canCheckForMatch = false;
  let timer;
  let seconds = 0;
  let timeRun = true;
  let landscapeModeActivated = false;

  const displayAllCards = () => {
    const allCards = document.querySelectorAll(".card");

    setTimeout(() => {
      allCards.forEach(item => {
        item.classList.add("flipped");
      });
    }, 500);
    setTimeout(() => {
      allCards.forEach(item => {
        item.classList.remove("flipped");
      });
      startTimer();
    }, 4000);
  };

  const reloadPage = () => {
    location.reload();
  };

  btnReset.addEventListener("click", reloadPage);
  btnResetFG.addEventListener("click", reloadPage);

  const hamburguerMenu = () => {
    const allCards = document.querySelectorAll(".card");
    const allMatched = Array.from(allCards).every(card =>
      card.classList.contains("disable")
    );

    if (!allMatched) {
      if (timeRun) {
        stopTimer();
        timeRun = false;
        console.log(timeRun);
      } else {
        startTimer();
        timeRun = true;
        console.log(timeRun);
      }
    }

    if (!allMatched) {
      asideMenu.classList.toggle("active");
      modal.classList.toggle("active");
      hamburguer.classList.toggle("active");
    }
  };

  hamburguer.addEventListener("click", hamburguerMenu);
  btnCloseMenu.addEventListener("click", hamburguerMenu);
  modal.addEventListener("click", hamburguerMenu);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(remainingSeconds).padStart(2, "0")
    );
  };

  const startTimer = () => {
    if (!timer) {
      timer = setInterval(() => {
        seconds++;
        document.getElementById("timer-display").innerHTML = formatTime(
          seconds
        );
      }, 1000);
    }
  };

  const stopTimer = () => {
    clearInterval(timer);
    timer = null;
  };

  btnExit.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  btnExitFG.addEventListener("click", () => {
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

  // Função para criptografar o termo com base no ID
  function hashTerm(term, id) {
    if (id % 2 === 0) {
      return btoa([...term].reverse().join("")); // Para IDs pares, inverter o termo antes de codificar
    }
    return btoa(term); // Para IDs ímpares, codificar normalmente
  }

  // Função para descriptografar o termo com base no ID
  function unhashTerm(hashedTerm, id) {
    if (id % 2 === 0) {
      return [...atob(hashedTerm)].reverse().join(""); // Para IDs pares, decodificar e reverter
    }
    return atob(hashedTerm); // Para IDs ímpares, decodificar normalmente
  }

  function gerarCards(modelo) {
    memoryGame.innerHTML = "";

    modelo.forEach(item => {
      // Criptografa o dataTerm com base no ID
      let hashedTerm = hashTerm(item.dataTerm, item.id);

      // Gera o card com o dataTerm criptografado
      let cardStructure = `
          <div class="card" data-id="${item.id}" data-term="${hashedTerm}">
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

    setTimeout(() => {
      // Adicionar o evento de clique para virar as cartas
      cards.forEach(card => card.addEventListener("click", flipCard));
    }, 2500);
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

  function checkForMatch() {
    if (!canCheckForMatch || !firstCard || !secondCard) return;

    // Pega os IDs das cartas
    const firstCardId = parseInt(firstCard.dataset.id, 10);
    const secondCardId = parseInt(secondCard.dataset.id, 10);

    // Descriptografa os data-term com base nos IDs
    const firstTerm = unhashTerm(firstCard.dataset.term, firstCardId);
    const secondTerm = unhashTerm(secondCard.dataset.term, secondCardId);

    if (firstTerm === secondTerm) {
      disableCards();
    } else {
      unflipCards();
    }

    canCheckForMatch = false;
    correctButton.setAttribute("disabled", "");
  }

  // Função que verifica se todas as cartas estão desativadas
  function checkIfGameIsComplete() {
    const allCards = document.querySelectorAll(".card");
    const allMatched = Array.from(allCards).every(card =>
      card.classList.contains("disable")
    );

    if (allMatched) {
      setTimeout(() => {
        stopTimer();
        overlay.classList.add("active");
        asideFinishGame.classList.add("active");
      }, 400);
    }
  }

  // Desativar cartas correspondentes
  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    firstCard.classList.add("disable");
    secondCard.classList.add("disable");
    resetBoard();

    // Chama a função para verificar se o jogo foi completado
    checkIfGameIsComplete();
  }

  // Virar as cartas de volta se não corresponderem
  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 100);
  }

  // Habilitar modo paisagem nos cards
  const landscapeMode = () => {
    const memoryGame = document.querySelector(".content-game");
    const faceReverse = document.querySelectorAll(".face-reverse");
    const allCards = document.querySelectorAll(".card");

    memoryGame.classList.add("landscape-mode");
    faceReverse.forEach(item => {
      item.classList.add("landscape-mode");
    });
    allCards.forEach(item => {
      item.classList.add("landscape-mode");
    });
  };

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
      landscapeModeActivated = true;
      break;
    case "modeloGeografia":
      modelo = modeloGeografia;
      landscapeModeActivated = true;
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

  // Tecla de atalho para pausar o jogo
  document.addEventListener("keydown", event => {
    if (event.code === "Escape") {
      hamburguerMenu();
    }
  });

  displayAllCards();

  if (landscapeModeActivated) {
    landscapeMode();
  }
});
