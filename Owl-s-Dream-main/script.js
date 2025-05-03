const startBtn = document.getElementById("start-btn");
const playerNameInput = document.getElementById("playerName");
const difficultyScreen = document.getElementById("difficulty-screen");
const quizContainer = document.getElementById("quiz-container");
const startScreen = document.getElementById("start-screen");
const resultScreen = document.getElementById("result-screen");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const finalScore = document.getElementById("final-score");
const timeDisplay = document.getElementById("time");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let playerName = "";
let difficulty = "";
let answeredQuestions = []; // To track answered questions

const allQuestions = {
  easy: [
    { question: "What is the value of 3 in the number 3,245?", answers: [
        { text: "3,000", correct: true },
        { text: "30", correct: false },
        { text: "300", correct: false },
        { text: "3", correct: false }
    ]},
    { question: "In 5,672, what digit is in the hundreds place?", answers: [
        { text: "2", correct: false },
        { text: "6", correct: true },
        { text: "7", correct: false },
        { text: "5", correct: false }
    ]},
    { question: "What is the place value of 8 in 4,815?", answers: [
        { text: "800", correct: true },
        { text: "80", correct: false },
        { text: "8", correct: false },
        { text: "8,000", correct: false }
    ]},
    { question: "What is the digit in the ones place in 1,347?", answers: [
        { text: "7", correct: true },
        { text: "4", correct: false },
        { text: "3", correct: false },
        { text: "1", correct: false }
    ]},
    { question: "What is the value of 5 in 5,013?", answers: [
        { text: "5,000", correct: true },
        { text: "50", correct: false },
        { text: "500", correct: false },
        { text: "5", correct: false }
    ]},
    { question: "What is the place value of 1 in 1,504?", answers: [
        { text: "1,000", correct: true },
        { text: "10", correct: false },
        { text: "1", correct: false },
        { text: "100", correct: false }
    ]},
    { question: "What is the digit in the tens place in 2,146?", answers: [
        { text: "4", correct: false },
        { text: "6", correct: true },
        { text: "2", correct: false },
        { text: "1", correct: false }
    ]},
    { question: "In 6,580, the digit 8 has what value?", answers: [
        { text: "800", correct: false },
        { text: "8,000", correct: false },
        { text: "80", correct: true },
        { text: "8", correct: false }
    ]},
    { question: "What is the place value of 7 in 7,238?", answers: [
        { text: "7,000", correct: true },
        { text: "700", correct: false },
        { text: "70", correct: false },
        { text: "7", correct: false }
    ]},
    { question: "What is the value of 4 in 2,348?", answers: [
        { text: "40", correct: false },
        { text: "400", correct: true },
        { text: "4", correct: false },
        { text: "4,000", correct: false }
    ]}
  ],
  hard: [
    { question: "In 4,061,829, what is the place value of 6?", answers: [
        { text: "Hundred thousands", correct: true },
        { text: "Ten thousands", correct: false },
        { text: "Thousands", correct: false },
        { text: "Hundreds", correct: false }
    ]},
    { question: "What is the value of the digit 1 in 7,814,203?", answers: [
        { text: "25", correct: true },
        { text: "10", correct: false },
        { text: "100", correct: false },
        { text: "1,000", correct: false }
    ]},
    { question: "What is the place value of the 2 in 2,402,305?", answers: [
        { text: "Hundred thousands", correct: true },
        { text: "Thousands", correct: false },
        { text: "Millions", correct: false },
        { text: "Ten thousands", correct: false }
    ]},
    { question: "What is the value of 9 in the number 894,216?", answers: [
        { text: "90,000", correct: true },
        { text: "900,000", correct: false },
        { text: "9,000", correct: false },
        { text: "9", correct: false }
    ]},
    { question: "What is the place value of 7 in 7,032,814?", answers: [
        { text: "7,000,000", correct: true },
        { text: "700,000", correct: false },
        { text: "70,000", correct: false },
        { text: "7,000", correct: false }
    ]},
        { question: "In 3,480,120, what is the value of the digit 4?", answers: [
          { text: "400,000", correct: true },
          { text: "4,000,000", correct: false },
          { text: "4,000", correct: false },
          { text: "40,000", correct: false }
      ]},
      { question: "In 1,205,630, the digit 2 is in which place?", answers: [
          { text: "Hundred thousands", correct: true },
          { text: "Ten thousands", correct: false },
          { text: "Thousands", correct: false },
          { text: "Millions", correct: false }
      ]},
      { question: "What is the value of 2 in 2,003,478?", answers: [
          { text: "2,000,000", correct: true },
          { text: "20,000", correct: false },
          { text: "2,000", correct: false },
          { text: "2", correct: false }
      ]},
      { question: "What digit is in the ten thousands place in 9,283,147?", answers: [
          { text: "8", correct: true },
          { text: "3", correct: false },
          { text: "2", correct: false },
          { text: "1", correct: false }
      ]},
      { question: "What is the digit in the hundred thousands place in 964,321?", answers: [
          { text: "6", correct: true },
          { text: "9", correct: false },
          { text: "4", correct: false },
          { text: "3", correct: false }
      ]},
      { question: "What is the digit in the thousands place in 645,209?", answers: [
          { text: "5", correct: true },
          { text: "2", correct: false },
          { text: "4", correct: false },
          { text: "0", correct: false }
      ]},
      { question: "What is the value of 5 in 4,356,190?", answers: [
          { text: "50,000", correct: true },
          { text: "500,000", correct: false },
          { text: "5,000,000", correct: false },
          { text: "5,000", correct: false }
      ]},
      { question: "In 1,000,000, which digit has a value of 1,000,000?", answers: [
          { text: "1", correct: true },
          { text: "0", correct: false },
          { text: "None", correct: false },
          { text: "Cannot be determined", correct: false }
    ]}
  ]
};

startBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Please enter your name");
    return;
  }
  startScreen.classList.add("hidden");
  difficultyScreen.classList.remove("hidden");
});

// New code to set playerNameInput value and make it read-only
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser && currentUser.role === "student" && currentUser.username) {
    playerNameInput.value = currentUser.username;
    playerNameInput.readOnly = true;
  }
});

function setDifficulty(level) {
  difficulty = level;
  questions = getRandomQuestions(allQuestions[difficulty], 10);
  difficultyScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  startQuiz();
}

function getRandomQuestions(questionSet, num) {
  const shuffled = [...questionSet].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function startQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  answeredQuestions = [];
  nextButton.classList.add("hidden");
  showQuestion();
  startTimer();
}

function showQuestion() {
  resetState();
  const question = questions[currentQuestionIndex];
  questionElement.innerHTML = `<span class="question-number">Question ${currentQuestionIndex + 1}:</span> ${question.question}`;

  question.answers.forEach((ans) => {
    const btn = document.createElement("button");
    btn.innerText = ans.text;
    btn.classList.add("btn");
    if (ans.correct) btn.dataset.correct = "true";
    btn.addEventListener("click", selectAnswer);
    answerButtons.appendChild(btn);
  });
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hidden");
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const correct = selectedBtn.dataset.correct === "true";
  const currentQuestion = questions[currentQuestionIndex];

  answeredQuestions.push({
    question: currentQuestion.question,
    answers: currentQuestion.answers,
    selected: selectedBtn.innerText,
    isCorrect: correct
  });

  if (correct) {
    score += difficulty === "easy" ? 2 : 5;
  }

  setStatusClass(selectedBtn, correct);
  Array.from(answerButtons.children).forEach((btn) => {
    btn.disabled = true;
    setStatusClass(btn, btn.dataset.correct === "true");
  });
  nextButton.classList.remove("hidden");
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  element.classList.add(correct ? "correct" : "wrong");
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});

function startTimer() {
  timeLeft = 30;
  timeDisplay.innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timer);
  quizContainer.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  finalScore.innerText = `${playerName}, your score: ${score}`;
  saveToLeaderboard(playerName, score);
  showAnswerSummary();
}

function saveToLeaderboard(name, score) {
  const normalizedName = name.trim().toLowerCase();
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  // Remove any existing entries with the same normalized name
  leaderboard = leaderboard.filter(entry => entry.name.trim().toLowerCase() !== normalizedName);
  // Add the current attempt's score with normalized name
  leaderboard.push({ name: name.trim(), score });
  leaderboard.sort((a, b) => b.score - a.score);
  const top5 = leaderboard.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(top5));
}

function showAnswerSummary() {
  const summaryContainer = document.createElement("div");
  summaryContainer.classList.add("summary");

  answeredQuestions.forEach((entry, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("summary-question");

    const correctAnswer = entry.answers.find(a => a.correct).text;

    qDiv.innerHTML = `
      <h4>Q${index + 1}: ${entry.question}</h4>
      <p>Your answer: <strong class="${entry.isCorrect ? 'correct' : 'wrong'}">${entry.selected}</strong></p>
      ${entry.isCorrect ? '' : `<p>Correct answer: <strong class="correct">${correctAnswer}</strong></p>`}
      <hr>
    `;

    summaryContainer.appendChild(qDiv);
  });

  resultScreen.appendChild(summaryContainer);
}

const backToDashboardBtn = document.getElementById("backToDashboardBtn");
function redirectToDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || !currentUser.role) {
    window.location.href = "../index.html";
    return;
  }
  switch (currentUser.role) {
    case "student":
      window.location.href = "../pages/student-dashboard.html";
      break;
    case "teacher":
      window.location.href = "../pages/teacher-dashboard.html";
      break;
    case "admin":
      window.location.href = "../pages/admin-dashboard.html";
      break;
    default:
      window.location.href = "../index.html";
  }
}
if (backToDashboardBtn) {
  backToDashboardBtn.addEventListener("click", redirectToDashboard);
}

const fixedBackToDashboardBtn = document.getElementById("fixedBackToDashboardBtn");
if (fixedBackToDashboardBtn) {
  fixedBackToDashboardBtn.addEventListener("click", redirectToDashboard);
}

//For Animations icon
const introImage = document.getElementById("intro-image");
const floatingGreeting = document.getElementById("floating-greeting");

// Switch to second image after 5 seconds
setTimeout(() => {
  introImage.src = "./assets/start_instruction.png";

  // Hide the whole container after another 3 seconds
  setTimeout(() => {
    floatingGreeting.style.transition = "opacity 0.5s ease";
    floatingGreeting.style.opacity = "0";

    // Remove it from DOM completely
    setTimeout(() => {
      floatingGreeting.remove();
    }, 500); // wait for fade out
  }, 3000);
}, 5000);
