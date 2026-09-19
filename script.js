const startButton = document.getElementById("startButton");
const startContainer = document.querySelector(".start-container");
const quizScreen = document.getElementById("quizScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const questionElement = document.getElementById("question");
const levelImage = document.getElementById("levelImage");
const answerButtons = document.getElementById("answerButtons");
const answerFeedback = document.getElementById("answerFeedback");
const levelStatus = document.getElementById("levelStatus");
const levelNumberElement = document.getElementById("levelNumber");
const livesNumberElement = document.getElementById("livesNumber");
let levelnumber = 0;
let lives = 3;
let level12BlinkTimeout;
let level12BlinkResetTimeout;

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
            "SSCOOOOOOOOOOOTTTLLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAND FOORREVVEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEER"
        ],
        correctAnswer: 2
    }, 
    6: {
        question: "WER HAT DEN KEKS AUS DER DOSE GEKLAUT?",
        answers: [
            "[INSERT NAME] HAT DEN KEKS AUS DER DOSE GEKLAUT",
            "JAMAL",
            "LUIS",
            "CLANKERS"
        ],
        correctAnswer: 1
    },
    7: {
        question: "WAS IST DAS?",
        image: true,
        imageBorder: true,
        answers: [
            "ABSTRAKTER SURREALISMUS",
            "COMPOSITION NO: .I., WITH RED, BLUE, YELLOW AND BLACK",
            "STEUERHINTERZIEHUNG",
            "EIN 5 TAUSEND EURO CHECK"
        ],
        correctAnswer: 2
    },
    8: {
        question: "8 = ?",
        image: false,
        imageBorder: false,
        answers: [
            "ACHT",
            "8",
            "1000",
            "D"
        ],
        correctAnswer: 4
    },
    9: {
        question: "JOB?",
        answers: [
            "HAND?",
            "AAAAAAAAAAAAAAAAHHHHHH!!!!",
            "MAHLZEIT",
            "ICH HASSE ES"
        ],
        correctAnswer: 3
    },
    10: {
        question: "WAS IST IN DEN EPSTEIN FILES?",
        answers: [
            "MICHAEL JACKSON",
            "FANFICTION ZWISCHEN TRUMP UND EPSTEIN",
            "[REDACTED]",
            "ICH MÖCHTE NICHTS MIT POLITIK ZU TUN HABEN"
        ],
        correctAnswer: 3
    },
    11: {
        question: "BA-DA-BA-BA-BAAA",
        answers: [
            "BA BA",
            "TSCHICKA TSCHICKA",
            "MÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄH",
            "ICH LIEBE ES"
        ],
        correctAnswer: 4
    },
    12: {
        question: "java.lang.StackOverflowError",
        answers: [
            " ",
            " ",
            " ",
            " "
        ],
        correctAnswer: 1
    },
    13: {
        question: "WAS IST LUSTIGER?",
        answers: [
            "24",
            "25",
            "DEINE MUTTER",
            "26"
        ],
        correctAnswer: 2
    },
    14: {
        question: "OVERWATCH?",
        answers: [
            "ASS CHEEKS",
            "PORN",
            "ASS CHEEKS ;)",
            "PORN"
        ],
        correctAnswer: 1
    },
    15: {
        question: "SOIAJFHÖOJDSÖÄFP",
        answers: [
            "EINE KATZE AUF DER TASTATUR",
            "ÖANQ WNHJASLKDJAÖS",
            "EIN AFFE, DER GERADE NICHT HAMLET SCHREIBT",
            "BAYRISCH"
        ],
        correctAnswer: 3
    }

};

function showLevel(level) {
    const levelData = quizLevels[level];

    clearTimeout(level12BlinkTimeout);
    clearTimeout(level12BlinkResetTimeout);

    levelNumberElement.textContent = level;
    answerFeedback.textContent = "";
    levelStatus.classList.toggle("is-clickable", level === 4);

    if (!levelData) {
        questionElement.textContent = "DIESES LEVEL KOMMT BALD";
        answerButtons.replaceChildren();
        return;
    }

    questionElement.textContent = levelData.question;
    levelImage.hidden = !levelData.image;
    levelImage.classList.toggle("has-border", levelData.imageBorder === true);
    levelImage.src = levelData.image
        ? `sonstiges/Bilder/Bild${level}.png`
        : "";
    answerButtons.replaceChildren();

    levelData.answers.forEach(function(answer, index) {
        const answerButton = document.createElement("button");

        answerButton.className = "answer-button";
        answerButton.type = "button";
        answerButton.textContent = answer.trim() === "" ? "\u00a0" : answer;
        answerButton.addEventListener("click", function() {
            if (level === 10 && index === 0) {
                lives = 0;
                livesNumberElement.textContent = lives;
                quizScreen.hidden = true;
                gameOverScreen.hidden = false;
                return;
            }

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

        if (level === 12 && index === 0) {
            level12BlinkTimeout = setTimeout(function() {
                answerButton.classList.add("is-blinking");
                level12BlinkResetTimeout = setTimeout(function() {
                    answerButton.classList.remove("is-blinking");
                }, 500);
            }, 12000);
        }
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