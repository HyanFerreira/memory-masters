// terms.js

// Array de termos (pares)
const terms = ["html5", "html5", "css", "css"]; // Adicione mais termos se necessário

// Função para embaralhar os termos usando o algoritmo de Fisher-Yates
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // Enquanto houver elementos para embaralhar...
  while (currentIndex !== 0) {
    // Pega um elemento restante
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // E troca com o elemento atual
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}

// Função para associar termos embaralhados às cartas
function assignTermsToCards(cards) {
  const shuffledTerms = shuffle(terms); // Embaralha os termos
  cards.forEach((card, index) => {
    card.dataset.term = shuffledTerms[index]; // Associa os termos embaralhados
  });
}

export { assignTermsToCards };
