document.addEventListener("DOMContentLoaded", () => {
  const memoryGame = document.querySelector(".content-game");
  const correctButton = document.getElementById("btn-correct");
  let cards = Array.from(memoryGame.children);
  let hasFlippedCard = false;
  let firstCard, secondCard;
  let lockBoard = false; // Variável para bloquear o tabuleiro
  let canCheckForMatch = false; // Controle para só permitir checkForMatch() após meio segundo

  // Recupera o nome do jogador do localStorage
  const playerName = localStorage.getItem("player");

  // Exibe o nome do jogador no elemento HTML
  document.getElementById("player-display").innerText = playerName;

  // Função para embaralhar as cartas usando o algoritmo de Fisher-Yates
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

  // Embaralha as cartas
  const shuffledCards = shuffle(cards);

  // Remove todas as cartas do jogo
  memoryGame.innerHTML = "";

  // Adiciona as cartas embaralhadas de volta ao contêiner
  shuffledCards.forEach(card => memoryGame.appendChild(card));

  // Seleciona novamente as cartas após embaralhar
  cards = document.querySelectorAll(".card");

  // Função para virar a carta
  function flipCard() {
    if (lockBoard) return; // Bloqueia o tabuleiro enquanto duas cartas estão viradas
    if (this === firstCard) return; // Impede clicar na mesma carta duas vezes

    this.classList.add("flipped");

    if (!hasFlippedCard) {
      // Primeira carta clicada
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    // Segunda carta clicada
    secondCard = this;
    hasFlippedCard = false;

    // Bloqueia o tabuleiro até o jogador verificar com o botão "Correto"
    lockBoard = true;

    // Permite chamar checkForMatch() após 1 segundo
    setTimeout(() => {
      correctButton.removeAttribute("disabled");
      canCheckForMatch = true; // Agora é possível chamar checkForMatch()
    }, 400); // meio segundo de espera
  }

  // Função que será executada ao clicar no botão "Correto"
  function checkForMatch() {
    if (!canCheckForMatch || !firstCard || !secondCard) return; // Verifica se pode chamar a função e se as duas cartas estão viradas

    if (firstCard.dataset.term === secondCard.dataset.term) {
      // Par correto
      disableCards();
    } else {
      // Par incorreto - mantém as cartas viradas até o jogador decidir virar outra
      unflipCards();
    }

    canCheckForMatch = false; // Reseta a permissão para impedir várias chamadas seguidas
    correctButton.setAttribute("disabled", "");
  }

  // Desativa as cartas (remover evento de clique)
  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    firstCard.classList.add("disable");
    secondCard.classList.add("disable");
    resetBoard();
  }

  // Função para desvirar as cartas (somente quando o par estiver incorreto e o botão "Correto" for clicado)
  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 0);
  }

  // Reseta as variáveis de controle
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  // Adiciona o evento de clique para as cartas
  cards.forEach(card => card.addEventListener("click", flipCard));

  // Adiciona o evento de clique para o botão "Correto"
  correctButton.addEventListener("click", checkForMatch);

  // Adiciona o evento de pressionar a tecla "Espaço" para verificar o par
  document.addEventListener("keydown", event => {
    if (event.code === "Space") {
      checkForMatch(); // Chama a função quando a tecla Espaço for pressionada
    }
  });
});