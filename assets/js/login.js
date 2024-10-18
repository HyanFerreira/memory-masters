document.addEventListener("DOMContentLoaded", function() {
  const playerName = document.getElementById("name");
  const playButton = document.getElementById("play");
  const formLogin = document.getElementById("form-login");

  const validatePlayerName = ({ target }) => {
    if (target.value.length > 2) {
      playButton.removeAttribute("disabled");
      return;
    }

    playButton.setAttribute("disabled", "");
  };

  const handleSubmit = event => {
    event.preventDefault();
    localStorage.setItem("player", playerName.value);
    window.location = "../../pages/game.html";
  };

  playerName.addEventListener("input", validatePlayerName);
  formLogin.addEventListener("submit", handleSubmit);
});
