const startButton = document.getElementById("startButton");
const startContainer = document.querySelector(".start-container");
const quizScreen = document.getElementById("quizScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answerButtons");
const levelNumberElement = document.getElementById("levelNumber");
const livesNumberElement = document.getElementById("livesNumber");
let levelnumber = 0;
let lives = 3;

const quizLevels = {
    1: {
        question: "WIE GEWINNT MAN DIESES SPIEL?",
        answers: [
            "INDEM MAN GEWINNT",
            "GAR NICHT",
            "ICH ERREICHE LEVEL 100",
            "ICH HABE BEREITS GEWONNEN"
        ],
        correctAnswer: 3
    }
};

function showLevel(level) {
    const levelData = quizLevels[level];

    levelNumberElement.textContent = level;
    questionElement.textContent = levelData.question;
    answerButtons.replaceChildren();

    levelData.answers.forEach(function(answer, index) {
        const answerButton = document.createElement("button");

        answerButton.className = "answer-button";
        answerButton.type = "button";
        answerButton.textContent = answer;
        answerButton.addEventListener("click", function() {
            if (index + 1 === levelData.correctAnswer) {
                levelnumber += 1;
                levelNumberElement.textContent = levelnumber;
            } else {
                lives -= 1;
                livesNumberElement.textContent = lives;

                if (lives === 0) {
                    quizScreen.hidden = true;
                    gameOverScreen.hidden = false;
                }
            }
        });

        answerButtons.appendChild(answerButton);
    });
}

startButton.addEventListener("click", function() {
    levelnumber = 1;
    lives = 3;
    startContainer.hidden = true;
    quizScreen.hidden = false;
    showLevel(levelnumber);
});