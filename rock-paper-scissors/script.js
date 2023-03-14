const msgContainer = document.getElementById("msg");
const winnerContainer = document.getElementById("winner");
const computerPlayContainer = document.getElementById("computer-play");
const options = document.getElementsByClassName("options")[0];
const playerScore = document.getElementById("player-score");
const computerScore = document.getElementById("computer-score");

const playOptions = ["ROCK", "SCISSORS", "PAPER"];

let wins = 0;
let losses = 0;

function computerPlay() {
  const randInt = Math.floor(Math.random() * 3);
  const play = playOptions[randInt];
  computerPlayContainer.textContent = "Computer played: ".concat(play);
  console.log("Computer played: ".concat(play));
  return play;
}

function playRound(player, computer) {
  if (!player) return { msg: "You lose! No selection", win: false };
  if (!playOptions.includes(player))
    return { msg: "You lose! Invalid selection", win: false };
  if (player === "ROCK" && computer === "SCISSORS") {
    return { msg: "You win! Rock beats Scissors", win: true };
  } else if (player === "SCISSORS" && computer === "ROCK") {
    return { msg: "You lose! Rock beats Scissors", win: false };
  } else if (player === "SCISSORS" && computer === "PAPER") {
    return { msg: "You win! Scissors beats Paper", win: true };
  } else if (player === "PAPER" && computer === "SCISSORS") {
    return { msg: "You lose! Scissors beats Paper", win: false };
  } else if (player === "PAPER" && computer === "ROCK") {
    return { msg: "You win! Paper beats Rock", win: true };
  } else if (player === "ROCK" && computer === "PAPER") {
    return { msg: "You lose! Paper beats Rock", win: false };
  } else {
    return { msg: "It's a tie" };
  }
}

document.getElementById("restart").addEventListener("click", function () {
  window.location.reload();
});

for (const button of options.children) {
  button.addEventListener("click", function () {
    if (wins >= 5 || losses >= 5) return;
    const computer = computerPlay().toUpperCase();
    const player = button.id.toUpperCase();
    const { msg, win } = playRound(player, computer);
    if (win) wins++;
    else if (win === false) losses++;
    playerScore.textContent = wins;
    computerScore.textContent = losses;
    msgContainer.textContent = msg;
    if (wins === 5) {
      winnerContainer.textContent = "You won! Congratulations!";
      disableButtons();
    } else if (losses === 5) {
      winnerContainer.textContent = "You lost! Computer won!";
      disableButtons();
    }
  });
}

function disableButtons() {
  for (const button of options.children) {
    button.disabled = true;
  }
}
