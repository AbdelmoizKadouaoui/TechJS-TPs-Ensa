let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

let user_move = document.querySelector('.user_move')
let cpu_move = document.querySelector('.cpu_move')

let isAutoPlay = false
let start = null;

user_move.setAttribute("src", "");
cpu_move.setAttribute("src", "");

updateScoreElement();

document.querySelector('.js-rock-button')
  .addEventListener('click', () => {
    playGame('rock');
    console.log("rock")
});

document.querySelector('.js-paper-button')
  .addEventListener('click', () => {
    playGame('paper');
    console.log("paper")
});

document.querySelector('.js-scissors-button')
  .addEventListener('click', () => {
    playGame('scissors');
    console.log("scissors")
});

  /*
    Add an event listener
    if the user presses the key r => play rock
    if the user presses the key p => play paper
    if the user presses the key s => play scissors
  */

document.addEventListener('keydown', function(event) {
  if (event.key === 'r') {
    playGame('rock');
  }
  if (event.key === 'p') {
    playGame('paper');
  }
  if (event.key === 's') {
    playGame('scissors');
  }
})


function playGame(playerMove) {
  const computerMove = pickComputerMove();

  let result = '';

  if (playerMove === computerMove) { score.ties +=1}
  else if (playerMove == "rock" &&  computerMove == "scissors") { score.wins +=1}
  else if (playerMove == "rock" &&  computerMove == "paper") { score.losses +=1}
  else if (playerMove == "paper" &&  computerMove == "rock") { score.wins +=1}
  else if (playerMove == "paper" &&  computerMove == "scissors") { score.losses +=1}
  else if (playerMove == "scissors" &&  computerMove == "rock") { score.losses +=1}
  else if (playerMove == "scissors" &&  computerMove == "paper") { score.wins +=1}
  console.log(score)
  updateScoreElement();

  if (playerMove == "rock") {user_move.setAttribute("src", "images/rock-emoji.png");}
  if (playerMove == "paper") {user_move.setAttribute("src", "images/paper-emoji.png");}
  if (playerMove == "scissors") {user_move.setAttribute("src", "images/scissors-emoji.png");}
}

function updateScoreElement() {
  document.querySelector('.js-score')
    .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function resetImage() {
  cpu_move.setAttribute("src", "");
  user_move.setAttribute("src", "");
}

function pickComputerMove() {
  const randomNumber = Math.random();

  let computerMove = '';

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = 'scissors';
  }

  if (computerMove == "rock") {cpu_move.setAttribute("src", "images/rock-emoji.png");}
  if (computerMove == "paper") {cpu_move.setAttribute("src", "images/paper-emoji.png");}
  if (computerMove == "scissors") {cpu_move.setAttribute("src", "images/scissors-emoji.png");}

  return computerMove;
}


function AutoPlay(){
    isAutoPlay = !isAutoPlay
    if (isAutoPlay == true){
      start = setInterval(() => {
        playGame(pickComputerMove())
      }, 500); 
      document.querySelector('.autoPlayButton').textContent = "Auto Play ON"
    }
    else{ 
      clearInterval(start);
      start = null
      document.querySelector('.autoPlayButton').textContent = "Auto Play OFF"
    }

    console.log(isAutoPlay)



}
