document.addEventListener("DOMContentLoaded", function() {
  const playerName = document.getElementById("name");
  const nextButton = document.getElementById("next-button");
  const formLogin = document.getElementById("form-player");

  const validatePlayerName = ({ target }) => {
    if (target.value.length > 2) {
      nextButton.removeAttribute("disabled");
      return;
    }

    nextButton.setAttribute("disabled", "");
  };

  const handleSubmit = event => {
    event.preventDefault();
    localStorage.setItem("player", playerName.value);
  };

  playerName.addEventListener("input", validatePlayerName);
  formLogin.addEventListener("submit", handleSubmit);
});
