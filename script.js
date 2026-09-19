const startButton = document.getElementById("startButton");
const startContainer = document.querySelector(".start-container");
const quizScreen = document.getElementById("quizScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answerButtons");
const answerFeedback = document.getElementById("answerFeedback");
const levelStatus = document.getElementById("levelStatus");
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
    },
    
    2: {
        question: "NEBEIRHCSEG STRÄWKCÜR EDRUW EGARF ESEID",
        answers: [
            "KO",
            "TF????",
            "TSBLES HCIM ESSAH HCI",
            "SALAMI"
        ],
        correctAnswer: 1
    },
    
    3: {
        question: "WAS IST DER SINN DES LEBENS?",
        answers: [
            "ES GIBT KEINEN",
            "JESUS IST IMMER DIE ANTWORT",
            "42",
            "ESSEN, TRINKEN, SCHLAFEN"
        ],
        correctAnswer: 2
    },
    4: {
        question: "(13 + 72 : 8 − 20) * 2 = ?",
        answers: [
            "-18,75",
            "8",
            "3,99",
            "JESUS"
        ],
        correctAnswer: null
    }, 
    5: {
        question: "IN WELCHEM LAND TRINKEN DIE MENSCHEN AM MEISTEN BIER?",
        answers: [
            "DEUTSCHLAND",
            "CZECH",
            "RUSSLAND",
            "SCOTLAND FOREVEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEER"
        ],
        correctAnswer: 2
    }, 
};

function showLevel(level) {
    const levelData = quizLevels[level];

    levelNumberElement.textContent = level;
    answerFeedback.textContent = "";
    levelStatus.classList.toggle("is-clickable", level === 4);

    if (!levelData) {
        questionElement.textContent = "DIESES LEVEL KOMMT BALD";
        answerButtons.replaceChildren();
        return;
    }

    questionElement.textContent = levelData.question;
    answerButtons.replaceChildren();

    levelData.answers.forEach(function(answer, index) {
        const answerButton = document.createElement("button");

        answerButton.className = "answer-button";
        answerButton.type = "button";
        answerButton.textContent = answer;
        answerButton.addEventListener("click", function() {
            if (level === 3 && index + 1 === 3) {
                answerFeedback.textContent = "NERD";
            }

            if (index + 1 === levelData.correctAnswer) {
                levelnumber += 1;
                showLevel(levelnumber);
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

levelStatus.addEventListener("click", function() {
    if (levelnumber === 4) {
        levelnumber = 5;
        showLevel(levelnumber);
    }
});