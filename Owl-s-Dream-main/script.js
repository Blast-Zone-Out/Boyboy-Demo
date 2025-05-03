document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name-input");
  const startButton = document.getElementById("start-button");
  const gameContainer = document.getElementById("game-container");
  const questionElement = document.getElementById("question");
  const answerButtons = document.getElementById("answer-buttons");
  const nextButton = document.getElementById("next-button");
  const scoreElement = document.getElementById("score");
  const timerElement = document.getElementById("timer");
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const leaderboardList = document.getElementById("leaderboard-list");
  const leaderboardButton = document.getElementById("leaderboard-button");
  const backButton = document.getElementById("back-button");

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  let timeLeft = 15;
  let playerName = "";

  const allQuestions = {
    easy: [
      { question: "What is the place value of 5 in 154?", answers: ["5", "50", "500", "0.5"], correct: "50" },
      { question: "Which digit is in the hundreds place in 438?", answers: ["8", "3", "4", "0"], correct: "4" },
      { question: "In 5,672, what digit is in the hundreds place?", answers: ["2", "6", "7", "5"], correct: "6" },
      { question: "What is the place value of 8 in 4,815?", answers: ["800", "80", "8", "8,000"], correct: "800" },
      { question: "What is the digit in the ones place in 1,347?", answers: ["1", "22", "4", "7"], correct: "7" },
      { question: "What is the value of 5 in 5,013?", answers: ["50", "5,000", "500", "5"], correct: "5,000" },
      { question: "What is the place value of 1 in 1,504?", answers: ["1", "10", "1,000", "100"], correct: "1,000" },
      { question: "What is the value of 4 in 2,348?", answers: ["40", "400", "4", "4,000"], correct: "400" },
      { question: "What is the value of 3 in the number 3,245?", answers: ["2", "6", "7", "3,000"], correct: "3,000" }
    ],
    hard: [
      { question: "What is the value of the 7 in 7,234?", answers: ["7000", "700", "70", "7"], correct: "7000" },
      { question: "Identify the place value of 6 in 6,789.", answers: ["6", "60", "600", "6000"], correct: "6000" },
      { question: "In 4,061,829, what is the place value of 6?", answers: ["Ten thousands", "Millions", "Thousands", "Hundred thousands"], correct: "Hundred thousands" },
      { question: "What is the value of the digit 1 in 7,814,203?", answers: ["6", "25", "600", "6000"], correct: "25" },
      { question: "What is the place value of the 2 in 2,402,305?", answers: ["Millions", "Ten thousands", "Thousands", "Hundred thousands"], correct: "Hundred thousands" },
      { question: "What is the place value of 7 in 7,032,814?", answers: ["700,000", "7,000,000", "70,000", "7,000"], correct: "7,000,000" },
      { question: "In 3,480,120, what is the value of the digit 4?", answers: ["400,000", "4,000,000", "4,000", "40,000"], correct: "400,000" },
      { question: "In 1,205,630, the digit 2 is in which place?", answers: ["Thousands", "Million", "Ten thousands", "Hundred thousands"], correct: "Hundred thousands" }
    ]
  };

  const startScreen = document.getElementById("start-screen");
 
  startButton.addEventListener("click", () => {
    playerName = nameInput.value.trim();
    if (!playerName) {
      alert("Please enter your name to start the quiz.");
      return;
    }
  
    // Fade out the start screen
    startScreen.classList.add("fade-out");
  
    // Show game after animation
    setTimeout(() => {
      startScreen.classList.add("hidden");
      gameContainer.classList.remove("hidden");
    }, 500); // 0.5s to match fadeOut animation
  
    leaderboardContainer.classList.add("hidden");
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    currentQuestionIndex = 0;
  
    const combinedQuestions = [...allQuestions.easy, ...allQuestions.hard];
    questions = getRandomQuestions(combinedQuestions, 10);
  
    showQuestion();
    startTimer();
  });
 
 // New code to set playerNameInput value and make it read-only
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser && currentUser.role === "student" && currentUser.username) {
    nameInput.value = currentUser.username;
    nameInput.readOnly = true;
  }
});
  
  
  

  function getRandomQuestions(questionArray, num) {
    const shuffled = questionArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  function startTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timerElement.textContent = `Time: ${timeLeft}`;
    timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = `Time: ${timeLeft}`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        disableAnswers();
        nextButton.classList.remove("hidden");
      }
    }, 1000);
  }

  function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    currentQuestion.answers.forEach(answer => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.classList.add("btn");
      button.addEventListener("click", () => selectAnswer(button, currentQuestion));
      answerButtons.appendChild(button);
    });
  }

  function resetState() {
    clearInterval(timer);
    startTimer();
    nextButton.classList.add("hidden");
    while (answerButtons.firstChild) {
      answerButtons.removeChild(answerButtons.firstChild);
    }
  }

  function selectAnswer(button, question) {
    const selectedAnswer = button.textContent;
    const correct = selectedAnswer === question.correct;
    if (correct) {
      score += 10;
      scoreElement.textContent = `Score: ${score}`;
      button.classList.add("correct");
      nextButton.classList.remove("hidden");
    } else {
      button.classList.add("wrong");
      Array.from(answerButtons.children).forEach(btn => {
        if (btn.textContent === question.correct) {
          btn.classList.add("correct");
        }
        btn.disabled = true;
      });
      showTutorialPrompt(question);
    }
    clearInterval(timer);
    disableAnswers();
  }

  function disableAnswers() {
    Array.from(answerButtons.children).forEach(button => {
      button.disabled = true;
    });
  }

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      endGame();
    }
  });

  function endGame() {
    clearInterval(timer);
    alert(`Game Over! Your score: ${score}`);
    saveHighScore(playerName, score);
    showLeaderboard();
  }

  function saveHighScore(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  
    // Check if the name already exists
    const existing = leaderboard.find(entry => entry.name.toLowerCase() === name.toLowerCase());
  
    if (existing) {
      // Only update the score if the new score is higher
      if (score > existing.score) {
        existing.score = score;
      }
    } else {
      leaderboard.push({ name, score });
    }
  
    // Sort and limit to top 5
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
  
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }
  

  function showLeaderboard() {
    gameContainer.classList.add("hidden");
    leaderboardContainer.classList.remove("hidden");
    leaderboardList.innerHTML = "";
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
    leaderboard.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.name}: ${entry.score}`;
      leaderboardList.appendChild(li);
    });
  }

  leaderboardButton.addEventListener("click", showLeaderboard);
  backButton.addEventListener("click", () => {
    leaderboardContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
  });

  function showTutorialPrompt(question) {
    const promptBox = document.createElement("div");
    promptBox.classList.add("tutorial-prompt");
    promptBox.innerHTML = `
      <p>Need help? Would you like a tutorial?</p>
      <button id="yes-tutorial">Step-by-Step Tutorial</button>
      <button id="no-tutorial">No Thanks</button>
      <a href="https://www.youtube.com/watch?v=uedvwH6Ay18" target="_blank" style="display: block; margin-top: 10px; color: blue; text-decoration: underline;">📺 Watch a Video Tutorial</a>
    `;
    document.body.appendChild(promptBox);
  
    document.getElementById("yes-tutorial").onclick = () => {
      document.body.removeChild(promptBox);
      showTutorialSteps(question);
    };
  
    document.getElementById("no-tutorial").onclick = () => {
      document.body.removeChild(promptBox);
      nextButton.classList.remove("hidden");
    };
  }
  

  function showTutorialSteps(question) {
    const tutorialBox = document.createElement("div");
    tutorialBox.classList.add("tutorial-box");

    const steps = getTutorialSteps(question);
    let stepIndex = 0;

    function updateStep() {
      if (stepIndex >= steps.length) {
        document.body.removeChild(tutorialBox);
        nextButton.classList.remove("hidden");
        return;
      }

      tutorialBox.innerHTML = `
        <p><strong>Step ${stepIndex + 1}:</strong> ${steps[stepIndex]}</p>
        <button id="next-step">Next</button>
      `;
      document.getElementById("next-step").onclick = () => {
        stepIndex++;
        updateStep();
      };
    }

    document.body.appendChild(tutorialBox);
    updateStep();
  }

  function getTutorialSteps(question) {
    if (question.question.includes("place value")) {
      return [
        "Identify the digit's position from right to left (ones, tens, hundreds, thousands, ten thousands, hundred thousands, millions...).",
        "Match the digit with its place value.",
        "Multiply the digit by its place value.",
        "You get the final value."
      ];
    } else if (question.question.includes("digit in the")) {
      return [
        "Start from the rightmost digit.",
        "Count positions based on the question (e.g., hundreds, thousands).",
        "Note which digit lands in that position.",
        "That's your answer."
      ];
    }
    return [
      "Break the question down into smaller parts.",
      "Try to eliminate the clearly wrong answers.",
      "Use logic or place value rules to guide your choice."
    ];
  }
});
