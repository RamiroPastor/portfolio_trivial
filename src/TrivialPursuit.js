

function shuffle(a) {  // shuffle an array, modern version of the Fisher–Yates shuffle algorithm
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}


var decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};


function printNumberList (s) {

  let res = ""

  switch (s.length) {
    case 0:
      break;
    case 1:
      res = "№ " + s[0].toString();
      break;
    default:
      res = "№ " + s[0].toString();
      for (let i = 1; i < s.length - 1; i++) {
        res = res.concat(", № " + s[i].toString());
      }
      res = res.concat(" and № " + s[s.length - 1].toString());
      break;
  }
  return res;
}


// --------------------------------------------------------------------------------------------------


const urlApi = "https://opentdb.com/api.php?type=multiple";
let correctAnswers = [];
let incorrectAnswers = [];
let unanswered = [];

function resetScore() {
  correctAnswers = [];
  incorrectAnswers = [];
  unanswered = [];
  const gameResults$ = document.querySelector("[data-function='gameResults']");
  gameResults$.innerHTML="";
}

function resetGame() {
  resetScore();
  document.querySelector("[data-function='gameResults']").classList.add("displayNone")
  document.querySelector("[data-function='gameBoard']").innerHTML="";
}



function startGame(event) {
  event.preventDefault();
  resetGame();
  const numberOfQuestions$ = document.querySelector("[data-function='NumberOfQuestions']");
  const questionsOutOfRange$ = document.querySelector("[data-function='questionsOutOfRangeMsg']")
  const difficulty$ = document.querySelector("[data-function='Difficulty']");
  const url = urlApi + "&amount=" + numberOfQuestions$.value + "&difficulty=" + difficulty$.value;

  if (numberOfQuestions$.value < 5 || numberOfQuestions$.value > 10 ) {
    questionsOutOfRange$.classList.remove("displayNone");
  }
  else {
    questionsOutOfRange$.classList.add("displayNone");
    fetch(url).then(res => res.json()).then(res => createQuestions(res.results));
  }
}



function createQuestions(questions) {

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    const container$ = document.createElement("fieldset");

    const heading$ = document.createElement("legend");
    heading$.textContent = `Question ${i + 1}:`;
    container$.appendChild(heading$);

    const category$ = document.createElement("p");
    category$.innerHTML = `<span>category</span> <em>${q.category}</em>`;
    container$.appendChild(category$);

    const question$ = document.createElement("label");
    question$.innerHTML = q.question;
    container$.appendChild(question$);

    const div$ = document.createElement("div");
    let answers = [q.correct_answer, ...q.incorrect_answers];
    answers = shuffle(answers);

    for (let j = 0; j < answers.length; j++) {
      const btn$ = document.createElement("input");
      btn$.setAttribute("type", "button");
      btn$.setAttribute("data-function", "answer")
      btn$.setAttribute("value", decodeHTML(answers[j]));
      btn$.setAttribute("title", decodeHTML(answers[j]))
      btn$.setAttribute("class", " ");
      btn$.addEventListener("click", () => {
        for (const a of btn$.parentNode.childNodes) {
          a.classList.remove("selectedAnswer");
          a.classList.remove("correctAnswer");
          a.classList.remove("incorrectAnswer");
        };
        btn$.classList.add("selectedAnswer");
      })

      div$.appendChild(btn$);

    }

    container$.appendChild(div$);
    document.querySelector("[data-function='gameBoard']").appendChild(container$);
    
  }

  const solveGameButton$ = document.createElement("button");
  solveGameButton$.classList.add("solveGameButton");
  solveGameButton$.textContent = "Check Results";
  solveGameButton$.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("[data-function='gameResults']").classList.remove("displayNone");
    solveGame(questions)
  });
  document.querySelector("[data-function='gameBoard']").appendChild(solveGameButton$);
}


function solveGame(questions) {

  resetScore();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const answers = document.querySelectorAll("fieldset")[i].querySelectorAll("[data-function='answer']");
    let userHasAnswered = false;
    for (const a of answers) {
      if (a.classList.contains("selectedAnswer")) {
        userHasAnswered = true;
        break;
      }
    }
    if (!userHasAnswered) {unanswered.push(i+1)}
    else {
      for (const a of answers) {
        if (decodeHTML(q.correct_answer) === a.value) {
          a.classList.add("correctAnswer");
          if (a.classList.contains("selectedAnswer")) {
            correctAnswers.push(i+1);
          }
        } else if (a.classList.contains("selectedAnswer")) {
            a.classList.add("incorrectAnswer");
            incorrectAnswers.push(i+1);
        }
      }
    }
  }

  const gameResults$ = document.querySelector("[data-function='gameResults']");

  const h3$ = document.createElement("h3");
  h3$.innerHTML = "Your score"
  gameResults$.appendChild(h3$);

  const perfectScoreMsg =
    `<strong>
    WOW! 😲😲😵🤪👏👏👏🙌🙌💃💃💃🍻✨
    <img src='./assets/img/fireworks1.gif'>
    <img src='./assets/img/fireworks5.gif'>
    <img src='./assets/img/fireworks5.gif'>
    <img src='./assets/img/fireworks5.gif'>
    <img src='./assets/img/fireworks1.gif'>
    </strong>
    <audio style='display: none;' onplay='this.volume = 0.1' controls autoplay>
      <source src="./assets/audio/happykids.mp3" type="audio/mpeg">
    </audio>
    `

  const score = Math.round(100 * (correctAnswers.length / questions.length));
  const congratsMsg = score === 100 ? perfectScoreMsg : (score > 70 ? "<strong>contratulations! 👍</strong>" : "");
  const global$ = document.createElement("p");
  global$.innerHTML = 
    `You have ${correctAnswers.length} correct answers, 
     ${incorrectAnswers.length} incorrect answers and
     ${unanswered.length} unanswered questions.
     <br>
     Your score is ${score}% ${congratsMsg}
    `
  gameResults$.appendChild(global$);

  const correct$ = document.createElement("p");
  correct$.textContent = "Your correct answers are: " + printNumberList(correctAnswers);
  gameResults$.appendChild(correct$);

  const incorrect$ = document.createElement("p");
  incorrect$.textContent = "Your incorrect answers are: " + printNumberList(incorrectAnswers);
  gameResults$.appendChild(incorrect$);

  const unanswered$ = document.createElement("p");
  unanswered$.textContent = "Your unanswered questions are: " + printNumberList(unanswered);
  gameResults$.appendChild(unanswered$);

  const playAgainBtn$ = document.createElement("a");
  playAgainBtn$.setAttribute("href", "#");
  playAgainBtn$.textContent = "Play Again"
  gameResults$.appendChild(playAgainBtn$);


}


const startGameButton$ = document.querySelector("[data-function='startGame']");

startGameButton$.addEventListener("click", startGame);