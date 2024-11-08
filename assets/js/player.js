document.addEventListener("DOMContentLoaded", function() {
  const playerName = document.getElementById("name");
  const nextButton = document.getElementById("next-button");
  const formLogin = document.getElementById("form-player");
  const playerNameContent = document.querySelector(".playerName");
  const playerOptionContent = document.querySelector(".playerOption");
  const prevButton = document.getElementById("prev-button");
  const playButton = document.getElementById("play-button");
  const clearName = document.querySelector(".clear-name");

  const toggleClearButton = () => {
    if (playerName.value.length > 0) {
      clearName.classList.add("active");
    } else {
      clearName.classList.remove("active");
    }
  };

  playerName.addEventListener("input", toggleClearButton);

  clearName.addEventListener("click", () => {
    playerName.value = "";
    clearName.classList.remove("active");
    nextButton.setAttribute("disabled", "");
  });

  const savedPlayerName = localStorage.getItem("player");
  if (savedPlayerName) {
    playerName.value = savedPlayerName;
    nextButton.removeAttribute("disabled");
    toggleClearButton();
  }

  const validatePlayerName = ({ target }) => {
    if (target.value.length > 2) {
      nextButton.removeAttribute("disabled");
      return;
    }

    nextButton.setAttribute("disabled", "");
  };

  function controlForm() {
    playerNameContent.classList.toggle("active");
    playerOptionContent.classList.toggle("active");
  }

  function saveOptionGame() {
    const choice = document.querySelector('input[name="option"]:checked').value;
    localStorage.setItem("choice_game", choice);
    sessionStorage.setItem('startTime', Date.now());
    window.location.href = "../pages/game.html";
  }

  const handleSubmit = event => {
    event.preventDefault();
    localStorage.setItem("player", playerName.value);
    controlForm();
  };

  playerName.addEventListener("input", validatePlayerName);
  formLogin.addEventListener("submit", handleSubmit);
  prevButton.addEventListener("click", controlForm);
  playButton.addEventListener("click", saveOptionGame);
});
