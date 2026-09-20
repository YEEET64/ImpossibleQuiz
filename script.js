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
const bombStatus = document.getElementById("bombStatus");
const bombImage = document.getElementById("bombImage");
const debugLevelForm = document.getElementById("debugLevelForm");
const debugLevelInput = document.getElementById("debugLevelInput");
const pistolShotSound = new Audio("sonstiges/Sounds/PistolShot.wav");
pistolShotSound.volume = 0.5;
const dingSound = new Audio("sonstiges/Sounds/DingSound.mp3");
dingSound.volume = 0.5;
let levelnumber = 0;
let lives = 3;
let level12BlinkTimeout;
let level12BlinkResetTimeout;
let bombTimerId = null;
let bombCounter = 10;
let animationClickCount = 0;
let animationImageHandler = null;
let levelTransitionTimeout = null;
let hasShownFirstLevel = false;

function playPistolShotSound() {
    pistolShotSound.currentTime = 0;
    pistolShotSound.play().catch(function() {});
}

function playDingSound() {
    dingSound.currentTime = 0;
    dingSound.play().catch(function() {});
}

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
        question: "WIE VIELE LÖCHER HAT EIN POLO?",
        answers: [
            "EINS",
            "ZWEI",
            "DREI",
            "VIER"
        ],
        correctAnswer: 4
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
    },
    16: {
        question: "OH! EINE BOMBE!",
        bomb: true,
        answers: [
            "BUMM",
            "TÜRKEN GRRRR",
            "BOMBASTISCH",
            "SKIP"
        ],
        correctAnswer: 4
    },
    17: {
        question: "WAS IST DIE ERSTE REGEL?",
        bomb: false,
        answers: [
            "KANN ICH NICHT SAGEN",
            "AUGE FÜR AUGE, ZAHN FÜR ZAHN",
            "IMMER BITTE UND DANKE SAGEN",
            "DIE RECHTSFÄHIGKEIT DES MENSCHEN BEGINNT BEI DER GEBURT"
        ],
        correctAnswer: 1
    },
    18: {
        question: "WER IST DAS?",
        image: true,
        imageBorder: true,
        answers: [
            "EINE GANZ NORMALE PERSON",
            "EIN LINKEDIN-PROFIL",
            "EIN KRIEGSVERBRECHER",
            "EIN DELEGIERTER"
        ],
        correctAnswer: 3
    },
    19: {
        question: "WAS DAVON IST KEINE DEUTSCHE STADT?",
        image: false,
        imageBorder: false,
        answers: [
            "GEILENKIRCHEN",
            "ARSCHLOCHWINKEL",
            "WIXHAUSEN",
            "BERLIN"
        ],
        correctAnswer: 2
    },
    20: {
        question: "BENCHE 60!",
        image: true,
        imageBorder: false,
        animation: true,
        bomb: true,
    },
    21: {
        question: "WAS IST DIE BESTE STAATSFORM?",
        image: false,
        imageBorder: false,
        answers: [
            "DEMOKRATIE",
            "DIKTATUR",
            "ARISTOKRATIE",
            "MONARCHIE"
        ],
        correctAnswer: 2
    },
    22: {
        question: "WAS IST DIE WURZEL ALLES BÖSENS?",
        answers: [
            "ZWIEBEL",
            "SATAN",
            "MEINE SCHWESTER",
            "25,81"
        ],
        correctAnswer: 4
    },
    23: {
        question: "LADE DIE SEITE NEU!",
        bomb: true,
    },
    24: {
        question: "WAS IST DAS?",
        image: true,
        imageBorder: false,
        answers: [
            "EFFEKTE VON PESTIZIDE",
            "EINE BAND",
            "DIE PFEFFERKÖRNER IN DEN MID 20s",
            "MEINE ERBSEN IM TIEFKÜHLSCHRANK"
        ],
        correctAnswer: 2
    },
    25: {
        question: "WIE BEKOMMT MAN DEN DEUTSCHEN PASS?",
        image: false,
        answers: [
            "DURCH MUTTI MERKEL",
            "EINE DEUTSCHE FRAU HEIRATEN",
            "PER FAX ANFRAGEN",
            "BLAUE AUGEN UND BLONDE HAARE HABEN"
        ],
        correctAnswer: 1
    },
    26: {
        question: "WAS PASSIERT SOBALD MAN 20 IST?",
        answers: [
            "KRUMMER RÜCKEN GARANTIERT",
            "KEINEN LEBENSWILLEN MEHR HABEN",
            "UNC",
            "ALL OF THE ABOVE"
        ],
        correctAnswer: 4
    },
    27: {
        question: "FINDE!",
        bomb: true,
    },
    28: {
        question: "WAS IST DIE ANTWORT?",
        answers: [
            "DAS HIER!",
            "NEIN, DAS HIER!",
            "DAS ERSTE!",
            "ANTWORT"
        ],
        correctAnswer: null
    },
    29: {
        question: "WAS TAT DIE DEUTSCHE ARMEE IN EINER RUSSISCHEN STADT 1942? SIE...",
        answers: [
            "HABEN MOSKAU ANGEGRIFFEN",
            "FÖRDERTEN FRIEDEN",
            "MACHTEN URLAUB",
            "STALINGRAD"
        ],
        correctAnswer: 4
    },
    30: {
        question: "WER HAT DEN KEKS AUS DER DOSE GEKLAUT?",
        answers: [
            "[INSERT NAME] HAT DEN KEKS AUS DER DOSE GEKLAUT",
            "JAMAL",
            "LUIS",
            "CLANKERS"
        ],
        correctAnswer: 1
    },
    31: {
        question: "WO WAR DIE RICHTIGE ANTWORT IN FRAGE 1?",
        answers: [
            "DAS HIER!",
            "HIER VIELLEICHT",
            "ODER HIER?",
            "NE, HIER!"
        ],
        correctAnswer: 3
    },
    32: {
        question: "",
        bomb: true
    },
    33: {
        question: "WIE NENNT MAN EINE FLÜGELLOSE FLIEGE?",
        answers: [
            "JASON",
            "EINE GEHE",
            "EIN HAUFEN",
            "EINE DATTEL"
        ],
        correctAnswer: 2
    },
    34: {
        question: "WAS IST UNESSBAR?",
        answers: [
            "SURSSTRÖMMING",
            "VEGEMITE",
            "OLIVEN",
            "ESCARGOT"
        ],
        correctAnswer: 3
    },
    35: {
        question: "WIE MACHST DU DIESES KIND GLÜCKLICH?",
        image: true,
        imageBorder: false,
        answers: [
            "NEN EURO SPENDEN",
            "INS GESICHT SPUCKEN",
            "+500 ROBUX",
            "67"
        ],
        correctAnswer: 1
    },
    36: {
        question: "BIST DU RASSISTISCH?",
        image: false,
        answers: [
            "NEIN",
            "JA",
            "VIELLEICHT",
            "DIE MENSCHEN SIND NUR ALLE ZU SANFT"
        ],
        correctAnswer: 1
    },
    37: {
        question: "WARUM HAST DU DANN DAS KIND GELD GEGEBEN?",
        answers: [
            "WEIL ER WIE EIN JUDE AUSSAH",
            "WARUM NICHT?",
            "ICH MAG KINDER",
            "WEIL ALLE KINDER GELD MÖGEN"
        ],
        correctAnswer: 4
    },
    38: {
        question: "ERINNERE DICH AN WAS DU EINKAUFEN MUSST:",
    },
    39: {
        question: "TRANSPORTMITTEL?",
        answers: [
            "DADDY",
            "USA",
            "TAX",
            "USB"
        ],
        correctAnswer: 4
    },
    40: {
        question: "SICHERLICH HAST DU GEMERKT IN WELCHEM LEVEL DU GERADE BIST",
        answers: [
            "38",
            "40",
            "39",
            "41"
        ],
        correctAnswer: 2
    },
    41: {
        question: "DU HAST 40€ IN DER EINEN HAND UND 20€ IN DER ANDEREN. WAS HAST DU?",
        answers: [
            "DEPRESSIONEN",
            "60 EURO",
            "AIDS",
            "DEIN MONATLICHES EINKOMMEN"
        ],
        correctAnswer: 3
    },
    42: {
        question: "WAS IST TAYLOR SWIFT?",
        answers: [
            "EXTREMS HÄSSLICH",
            "EINE PLAYERIN",
            "DIE BESTE MUSIKERIN JEMALS",
            "RADIOAKTIV"
        ],
        correctAnswer: 4
    },
    43: {
        question: "SHANGHAII?",
        answers: [
            "HAUPTSTADT CHINAS",
            "EXISTIERT NICHT",
            "WARUM IST DA EIN FRAGEZEICHEN?",
            "20M ÜBER DEM MEERESSPIEGEL"
        ],
        correctAnswer: 2
    },
    44  : {
        question: "WAS IST DAS?",
        image: true,
        answers: [
            "EIN TEUFLISCHER KÄFER",
            "INSEKTEN HALT",
            "EKELHAFT",
            "DIE AMEISEN IN MEINEM KELLER"
        ],
        correctAnswer: 2
    },
    45  : {
        question: "WIE NENNT MAN RUNDE SÄUGETIERE?",
        image: false,
        answers: [
            "FETTSÄCKE",
            "BLOBS",
            "OVALE",
            "KAUTSCHUK"
        ],
        correctAnswer: 3
    },
    46  : {
        question: "WOFÜR STEHT TAMS NAME?",
        bomb: true,
        answers: [
            "HERZ & GEFÜHL",
            "SCHWARZE SEELE",
            "TAMAM TAMAM, VOR DER TÜR STEHEN ZEHNTAUSEND MANN",
            "PREFIX VON PON"
        ],
        correctAnswer: 1
    },
    47  : {
        question: "FÜNFHUNDERT PLUS ZEHN",
        bomb: false,
        answers: [
            "XD",
            "XP",
            "DX",
            "8D"
        ],
        correctAnswer: 3
    },
    48  : {
        question: "MERKE DIR: ROT, BLAU, ROT, GELB",
        answers: [
            "O.K.",
            "SIMON SAYS LOL",
            "SKITTLES",
            "NÖ"
        ],
        correctAnswer: 1
    },
    49  : {
        question: "WAS IST CRICKET?",
        answers: [
            "SCHWULE TYPEN, DIE MIT BÄLLEN SPIELEN",
            "INDIEN",
            "BALLING",
            "*STILLE*"
        ],
        correctAnswer: 4
    }



};

function updateBombDisplay() {
    if (bombImage) {
        bombImage.src = `sonstiges/Bilder/Bombe/Unbenanntes_Projekt (${bombCounter}).png`;
    }
}

function stopBombTimer() {
    if (bombTimerId !== null) {
        clearInterval(bombTimerId);
        bombTimerId = null;
    }
}

function resetBombState() {
    stopBombTimer();
    bombCounter = 10;

    if (bombStatus) {
        bombStatus.hidden = true;
    }

    updateBombDisplay();
}

function startBombLevel(levelData) {
    if (!levelData || !levelData.bomb) {
        resetBombState();
        return;
    }

    bombCounter = 10;
    updateBombDisplay();

    if (bombStatus) {
        bombStatus.hidden = false;
    }

    stopBombTimer();
    bombTimerId = setInterval(function() {
        if (bombCounter <= 0) {
            stopBombTimer();
            return;
        }

        bombCounter -= 1;
        updateBombDisplay();

        if (bombCounter === 0) {
            stopBombTimer();
            playPistolShotSound();
            lives = 0;
            livesNumberElement.textContent = lives;
            quizScreen.hidden = true;
            gameOverScreen.hidden = false;
        }
    }, 1000);
}

function completeAnimationLevel() {
    stopBombTimer();
    bombCounter = 10;
    if (bombStatus) {
        bombStatus.hidden = true;
    }
    updateBombDisplay();
    levelnumber += 1;
    levelNumberElement.textContent = levelnumber;
    questionElement.textContent = "";
    levelImage.hidden = true;
    answerButtons.replaceChildren();
    answerFeedback.textContent = "";

    levelTransitionTimeout = setTimeout(function() {
        levelTransitionTimeout = null;
        showLevel(levelnumber);
    }, 1000);
}

function stopImageAnimation() {
    if (animationImageHandler !== null) {
        levelImage.removeEventListener("click", animationImageHandler);
        animationImageHandler = null;
    }
}

function setupImageAnimation(level) {
    animationClickCount = 0;
    animationImageHandler = function() {
        animationClickCount += 1;

        if (animationClickCount === 60) {
            stopImageAnimation();
            completeAnimationLevel();
            return;
        }

        if (animationClickCount % 10 === 0) {
            const nextImageNumber = animationClickCount / 10 + 1;
            levelImage.src = `sonstiges/Bilder/Level ${level}/Unbenanntes_Projekt (${nextImageNumber}).png`;
        }
    };
    levelImage.addEventListener("click", animationImageHandler);
}

function setupLevel32Input() {
    const inputForm = document.createElement("form");
    const answerInput = document.createElement("input");
    const submitButton = document.createElement("button");

    inputForm.className = "level-32-input-form";
    answerInput.className = "level-32-input";
    answerInput.type = "text";
    answerInput.autocomplete = "off";
    answerInput.autocapitalize = "none";
    answerInput.spellcheck = false;
    answerInput.setAttribute("aria-label", "Antwort für Level 32");
    submitButton.className = "answer-button level-32-submit";
    submitButton.type = "submit";
    submitButton.textContent = "ENTER";

    inputForm.addEventListener("submit", function(event) {
        event.preventDefault();

        if (answerInput.value.trim().toLowerCase() === "chihuahua") {
            stopBombTimer();
            bombCounter = 10;
            if (bombStatus) {
                bombStatus.hidden = true;
            }
            updateBombDisplay();
            levelnumber += 1;
            showLevel(levelnumber);
            return;
        }

        playPistolShotSound();
        lives -= 1;
        livesNumberElement.textContent = lives;
        answerInput.value = "";

        if (lives === 0) {
            stopBombTimer();
            bombCounter = 10;
            if (bombStatus) {
                bombStatus.hidden = true;
            }
            updateBombDisplay();
            quizScreen.hidden = true;
            gameOverScreen.hidden = false;
        } else {
            answerInput.focus();
        }
    });

    inputForm.append(answerInput, submitButton);
    answerButtons.appendChild(inputForm);
    answerInput.focus();
}

function setupLevel38Images() {
    const imageOrder = [1, 4, 5, 6, 7, 2, 8, 3];
    const correctImages = new Set([1, 2, 3]);
    const selectedImages = new Set();
    const imageGrid = document.createElement("div");

    imageGrid.className = "level-38-image-grid";

    imageOrder.forEach(function(imageNumber) {
        const imageButton = document.createElement("button");
        const image = document.createElement("img");

        imageButton.className = "level-38-image-button";
        imageButton.type = "button";
        imageButton.setAttribute("aria-label", `Bild ${imageNumber}`);
        image.src = `sonstiges/Bilder/Level 38/Unbenanntes_Projekt (${imageNumber}).png`;
        image.alt = `Bild ${imageNumber}`;
        imageButton.appendChild(image);
        imageButton.addEventListener("click", function() {
            if (selectedImages.has(imageNumber)) {
                return;
            }

            if (!correctImages.has(imageNumber)) {
                playPistolShotSound();
                lives -= 1;
                livesNumberElement.textContent = lives;

                if (lives === 0) {
                    stopBombTimer();
                    quizScreen.hidden = true;
                    gameOverScreen.hidden = false;
                }
                return;
            }

            selectedImages.add(imageNumber);
            image.setAttribute("src", `sonstiges/Bilder/Level 38/Gruen (${imageNumber}).png?v=1`);
            image.alt = `Bild ${imageNumber}, korrekt ausgewählt`;

            if (selectedImages.size === correctImages.size) {
                levelnumber += 1;
                showLevel(levelnumber);
            }
        });
        imageGrid.appendChild(imageButton);
    });

    answerButtons.appendChild(imageGrid);
}

function showLevel(level) {
    const levelData = quizLevels[level];

    if (hasShownFirstLevel) {
        playDingSound();
    } else {
        hasShownFirstLevel = true;
    }

    clearTimeout(level12BlinkTimeout);
    clearTimeout(level12BlinkResetTimeout);
    clearTimeout(levelTransitionTimeout);
    levelTransitionTimeout = null;
    stopImageAnimation();

    levelNumberElement.textContent = level === 40 ? "???" : level;
    if (!levelData || !levelData.bomb) {
        resetBombState();
    } else {
        startBombLevel(levelData);
    }
    answerFeedback.textContent = "";
    levelStatus.classList.toggle("is-clickable", level === 4);
    questionElement.classList.toggle("level-21-question", level === 21);

    if (!levelData) {
        questionElement.textContent = "DIESES LEVEL KOMMT BALD";
        levelImage.hidden = true;
        levelImage.classList.remove("has-border");
        levelImage.classList.remove("animation-image");
        levelImage.src = "";
        answerButtons.replaceChildren();

        if (level === 23) {
            levelTransitionTimeout = setTimeout(function() {
                levelTransitionTimeout = null;
                const noButton = document.createElement("button");

                noButton.className = "answer-button";
                noButton.type = "button";
                noButton.textContent = "NÖ";
                noButton.addEventListener("click", function() {
                    levelnumber = 24;
                    showLevel(levelnumber);
                });
                answerButtons.appendChild(noButton);
            }, 5000);
        }

        return;
    }

    if (level === 28) {
        const questionWord = document.createElement("button");

        questionWord.className = "question-word-button";
        questionWord.type = "button";
        questionWord.textContent = "WAS";
        questionWord.addEventListener("click", function() {
            levelnumber = 29;
            showLevel(levelnumber);
        });
        questionElement.replaceChildren(questionWord, document.createTextNode(" IST DIE ANTWORT?"));
    } else {
        questionElement.textContent = levelData.question;

        if (level === 32) {
            levelImage.hidden = false;
            levelImage.classList.remove("has-border");
            levelImage.classList.remove("animation-image");
            levelImage.alt = "Bild für Level 32";
            levelImage.src = "sonstiges/Bilder/Bild32.png";
            answerButtons.replaceChildren();
            setupLevel32Input();
            return;
        }

        if (level === 38) {
            levelImage.hidden = true;
            answerButtons.replaceChildren();
            setupLevel38Images();
            return;
        }
    }

    if (level === 23) {
        levelImage.hidden = true;
        answerButtons.replaceChildren();
        levelTransitionTimeout = setTimeout(function() {
            levelTransitionTimeout = null;
            const noButton = document.createElement("button");

            noButton.className = "answer-button";
            noButton.type = "button";
            noButton.textContent = "NÖ";
            noButton.addEventListener("click", function() {
                levelnumber = 24;
                showLevel(levelnumber);
            });
            answerButtons.appendChild(noButton);
        }, 5000);
        return;
    }

    if (level === 27) {
        levelImage.hidden = true;
        answerButtons.replaceChildren();

        const nextLevelButton = document.createElement("button");
        nextLevelButton.className = "level-27-button";
        nextLevelButton.type = "button";
        nextLevelButton.setAttribute("aria-label", "Weiter zu Level 28");
        nextLevelButton.addEventListener("click", function() {
            stopBombTimer();
            bombCounter = 10;
            if (bombStatus) {
                bombStatus.hidden = true;
            }
            updateBombDisplay();
            levelnumber = 28;
            showLevel(levelnumber);
        });
        answerButtons.appendChild(nextLevelButton);
        return;
    }

    levelImage.hidden = !levelData.image;
    levelImage.classList.toggle("has-border", levelData.imageBorder === true);
    levelImage.classList.toggle("animation-image", levelData.animation === true);
    levelImage.alt = "";
    levelImage.src = levelData.image
        ? levelData.animation
            ? `sonstiges/Bilder/Level ${level}/Unbenanntes_Projekt (1).png`
            : `sonstiges/Bilder/Bild${level}.png`
        : "";
    answerButtons.replaceChildren();

    if (levelData.animation) {
        setupImageAnimation(level);
        return;
    }

    levelData.answers.forEach(function(answer, index) {
        const answerButton = document.createElement("button");

        answerButton.className = "answer-button";
        answerButton.type = "button";
        answerButton.textContent = answer.trim() === "" ? "\u00a0" : answer;
        answerButton.addEventListener("click", function() {
            if (level === 42 && index === 2) {
                stopBombTimer();
                playPistolShotSound();
                bombCounter = 10;
                if (bombStatus) {
                    bombStatus.hidden = true;
                }
                updateBombDisplay();
                lives = 0;
                livesNumberElement.textContent = lives;
                quizScreen.hidden = true;
                gameOverScreen.hidden = false;
                return;
            }

            if (level === 37 && index === 2) {
                stopBombTimer();
                playPistolShotSound();
                bombCounter = 10;
                if (bombStatus) {
                    bombStatus.hidden = true;
                }
                updateBombDisplay();
                lives = 0;
                livesNumberElement.textContent = lives;
                quizScreen.hidden = true;
                gameOverScreen.hidden = false;
                return;
            }

            if (level === 16 && index === 0) {
                stopBombTimer();
                playPistolShotSound();
                bombCounter = 10;
                if (bombStatus) {
                    bombStatus.hidden = true;
                }
                updateBombDisplay();
                lives = 0;
                livesNumberElement.textContent = lives;
                quizScreen.hidden = true;
                gameOverScreen.hidden = false;
                return;
            }

            if (level === 10 && index === 0) {
                playPistolShotSound();
                lives = 0;
                livesNumberElement.textContent = lives;
                stopBombTimer();
                bombCounter = 10;
                if (bombStatus) {
                    bombStatus.hidden = true;
                }
                updateBombDisplay();
                quizScreen.hidden = true;
                gameOverScreen.hidden = false;
                return;
            }

            if (level === 3 && index + 1 === 3) {
                answerFeedback.textContent = "NERD";
            }

            if (index + 1 === levelData.correctAnswer) {
                if (levelData.bomb) {
                    stopBombTimer();
                    bombCounter = 10;
                    if (bombStatus) {
                        bombStatus.hidden = true;
                    }
                    updateBombDisplay();
                }

                levelnumber += 1;
                if (level === 21) {
                    answerFeedback.textContent = "GUTE ANTWORT GENOSSE";
                    answerButtons.querySelectorAll("button").forEach(function(button) {
                        button.disabled = true;
                    });
                    levelTransitionTimeout = setTimeout(function() {
                        levelTransitionTimeout = null;
                        showLevel(levelnumber);
                    }, 1000);
                } else {
                    showLevel(levelnumber);
                }
            } else {
                playPistolShotSound();
                lives -= 1;
                livesNumberElement.textContent = lives;

                if (lives === 0) {
                    stopBombTimer();
                    bombCounter = 10;
                    if (bombStatus) {
                        bombStatus.hidden = true;
                    }
                    updateBombDisplay();
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
    hasShownFirstLevel = false;
    bombCounter = 10;
    resetBombState();
    startContainer.hidden = true;
    quizScreen.hidden = false;
    showLevel(levelnumber);
});

debugLevelForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const requestedLevel = Number.parseInt(debugLevelInput.value, 10);

    if (!Number.isInteger(requestedLevel) || requestedLevel < 1) {
        debugLevelInput.focus();
        return;
    }

    levelnumber = requestedLevel;
    lives = 3;
    hasShownFirstLevel = false;
    bombCounter = 10;
    resetBombState();
    startContainer.hidden = true;
    quizScreen.hidden = false;
    gameOverScreen.hidden = true;
    showLevel(levelnumber);
});

levelStatus.addEventListener("click", function() {
    if (levelnumber === 4) {
        levelnumber = 5;
        showLevel(levelnumber);
    }
});