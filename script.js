const DEBUG_ENABLED = false;

const startButton = document.getElementById("startButton");
const startContainer = document.querySelector(".start-container");
const quizScreen = document.getElementById("quizScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const questionElement = document.getElementById("question");
const questionArea = document.querySelector(".question-area");
const levelImage = document.getElementById("levelImage");
const answerButtons = document.getElementById("answerButtons");
const answerFeedback = document.getElementById("answerFeedback");
const levelStatus = document.getElementById("levelStatus");
const levelNumberElement = document.getElementById("levelNumber");
const livesNumberElement = document.getElementById("livesNumber");
const livesWrapper = document.querySelector(".lives-wrapper");
const bombStatus = document.getElementById("bombStatus");
const bombImage = document.getElementById("bombImage");
const debugLevelForm = document.getElementById("debugLevelForm");
const debugLevelInput = document.getElementById("debugLevelInput");
debugLevelForm.hidden = !DEBUG_ENABLED;
const pistolShotSound = new Audio("sonstiges/Sounds/PistolShot.wav");
pistolShotSound.volume = 0.5;
const dingSound = new Audio("sonstiges/Sounds/DingSound.mp3");
dingSound.volume = 0.5;
const alarmSound = new Audio("sonstiges/Sounds/Alarm.mp3");
const woofSound = new Audio("sonstiges/Sounds/Woof.mp3");
const rockySound = new Audio("sonstiges/Sounds/Rocky.mp3");
rockySound.volume = 0.8;
rockySound.loop = true;
const bomb10Sound = new Audio("sonstiges/Sounds/Bombe10.mp3");
const bomb5Sound = new Audio("sonstiges/Sounds/Bombe5.mp3");
const fnafSound = new Audio("sonstiges/Sounds/fnaf.mp3");
const honkSound = new Audio("sonstiges/Sounds/honk.mp3");
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
let level58SecondAnswerClicks = 0;
let level59Timeout = null;
let level86BlinkInterval = null;
let level86GreenTimeout = null;
let level86FinishTimeout = null;
let level87StartTimeout = null;
let level87AnimationTimeout = null;
let level93SequenceTimeout = null;
let level92ImageHandler = null;
let level98NormalMode = false;

function playPistolShotSound() {
    pistolShotSound.currentTime = 0;
    pistolShotSound.play().catch(function() {});
}

function playDingSound() {
    dingSound.currentTime = 0;
    dingSound.play().catch(function() {});
}

function stopRockySound() {
    rockySound.pause();
    rockySound.currentTime = 0;
}

const gameOverObserver = new MutationObserver(function() {
    if (!gameOverScreen.hidden) {
        stopRockySound();
    }
});
gameOverObserver.observe(gameOverScreen, { attributes: true, attributeFilter: ["hidden"] });

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
    },
    50  : {
        question: "VON KLEIN ZU GROß:",
        bomb: true
    },
    51  : {
        question: "KANN ANTON BOXEN?",
        answers: [
            "AUF JEDEN FALL",
            "MIT MÜHE VIELLEICHT",
            "NEIN, ABER JACK KANN",
            "MIKE TYSON"
        ],
        correctAnswer: 3
    },
    52  : {
        question: "LICHT?",
        bomb: true
    },
    53  : {
        question: "WAS SIND DIE HAUPTBESTANDTEILE VON SHAMPOO?",
        answers: [
            "FEENSTAUB UND MAYONNAISE",
            "KOFFEIN UND MELATONIN",
            "GESCHLECHTSORGANE UND MENSCHLICHER KOT",
            "EIN GEMISCH AUS 31 STEINSORTEN"
        ],
        correctAnswer: 3
    },
    54  : {
        question: "この質問は日本語です.",
        answers: [
            "それは質問ではありません",
            "私は日本が嫌いだ",
            "かわいいーーーーー",
            "私はバカだ"
        ],
        correctAnswer: 1
    },
    55  : {
        question: "WIE VIELE BITS SIND IN EINEM BYTE?",
        answers: [
            "NERD",
            "4 GB",
            "JE NACHDEM WIE GROß DEIN MAUL IST",
            "128"
        ],
        correctAnswer: 3
    },
    56  : {
        question: "AAAAAAAHHHHHHH!!! DIEE SCHMERRZZEEENN!!!",
        bomb: true,
        answers: [
            "H2O2",
            "C2H5OH",
            "CH3COOH",
            "NaCl"
        ],
        correctAnswer: 2
    },
    57  : {
        question: "WIE LANGE BRAUCHST DU UM EIN HARTES EI ZU KOCHEN?",
        answers: [
            "5 MINUTEN",
            "KOMMT AUF MEIN BAUCHGEFÜHL AN",
            "12 MINUTEN",
            "HEHE EIER..."
        ],
        correctAnswer: 1
    },
    58  : {
        question: "WIE KOMMT MAN AUS DEN BACKROOMS RAUS?",
        answers: [
            "DURCH BACKSHOTS",
            "ES GIBT KEIN ENTKOMMEN",
            "ALT + F4",
            "ICH GLITCHE MICH DURCH EIN SPALT DURCH"
        ],
        correctAnswer: 2
    },
    59  : {
        question: "",
    },
    60  : {
        question: "DU WÜRFELST EINE 6. WAS MACHST DU?",
        answers: [
            "ICH DARF EIN HAUFEN AUF DAS BRETT LEGEN",
            "YAHTZEEE!!!",
            "ICH STEHLE EIN SCHAF VON MEINEM MITSPIELER",
            "DIE CHAUSEESTRAßE KAUFEN"
        ],
        correctAnswer: 4
    },
    61  : {
        question: "WARUM HAT DER SENSENMANN EINE SENSE?",
        answers: [
            "BESSER ALS SEINE OPFER ANZUFASSEN",
            "UND WARUM HAST DU EINEN P****?",
            "UM AURA ZU FARMEN",
            "SONST WÄRE ER NUR EIN MANN"
        ],
        correctAnswer: 3
    },
    62  : {
        question: "WARUM?",
        answers: [
            "AURA FARMEN",
            "WARUM NICHT?",
            "WARUM SCHON?",
            "GEHÖRT ES NOCH ZU DER ANDEREN FRAGE?"
        ],
        correctAnswer: 1
    },
    63  : {
        question: "WAS DAVON IST HALAL?",
        answers: [
            "BUGS BUNNY",
            "EINE GEILE SCHWEINSHAXE",
            "NEN GIN TONIC",
            "EINE LIDL-LASAGNE"
        ],
        correctAnswer: 1
    },
    64  : {
        question: "WIE VIELE BUCHSTABEN IN DIESEM SATZ?",
        answers: [
            "30",
            "31",
            "4",
            "88"
        ],
        correctAnswer: 3
    },
    65  : {
        question: "BIN ICH REAL?",
        answers: [
            "ICH DENKE",
            "THE ONE PIECE!!!!!!",
            "ICH GLAUBE",
            "NEIN, ICH BIN KUCHEN"
        ],
        correctAnswer: 1
    },
    66  : {
        question: "WAS IST DAS HIER?",
        image: true,
        answers: [
            "BRO, ICH WEIß ES AUCH NICHT MAN",
            "EIN BAGGER",
            "POLNISCHE FREIZEITAKTIVITÄTEN",
            "Ü50 WELTMEISTERSCHAFTEN"
        ],
        correctAnswer: 2
    },
    67  : {
        question: "WAS IST ES WAS JUNGS WIRKLICH WOLLEN?",
        image: false,
        answers: [
            "TUNGSTEN CUBE",
            "LEGO-SETS",
            "WERTSCHÄTZUNG (SOWIE ALLE ANDEREN SACHEN)",
            "JEAN PAUL GAULTIER"
        ],
        correctAnswer: 3
    },
    68  : {
        question: "WAS DAVON WURDE NOCH NICHT IN DIE LUFT GESPRENGT?",
        bomb: true,
        answers: [
            "DIE TWIN TOWERS",
            "SPRINGFIELD",
            "TÜRME VON HANOI",
            "NIKI LAUDA"
        ],
        correctAnswer: 3
    },
    69  : {
        question: "LÖSE:",
        bomb: true
    },
    70  : {
        question: "WAS IST WIRKLICH WIRKLICH HÄSSLICH?",
        bomb: false,
        answers: [
            "DU",
            "BELLA RAMSEY",
            "ANDROID",
            "AKAZIEN HOLZ"
        ],
        correctAnswer: 4
    },
    71  : {
        question: "WARUM SAUGT DRACULA BLUT?",
        answers: [
            "BESSER ALS SPERMA",
            "ER IST VEGETARIER",
            "ER HAT EINEN KINK",
            "WEGEN EISENMANGEL"
        ],
        correctAnswer: 4
    },
    72: {
        question: "WOFÜR STEHT LRS?",
        answers: [
            "LECKERE RINDSCHWEINE",
            "RECHTS-LINKS-SCHWÄCHE",
            "LANDESRECHNUNGSHOF",
            "LESE-RECHTSCHREIB-STÖRUNG"
        ],
        correctAnswer: 2
    },
    73: {
        question: "WER IST DAS?",
        image:true,
        answers: [
            "ASUKA LANGLEY",
            "ZIVILIST NR. 1.002.332",
            "KIKI",
            "OH Nein... MEIN SCHWIEGERVATER..."
        ],
        correctAnswer: 3
    },
    74: {
        question: "WAS IST EIGENTLICH MIT ASH KETCHUM PASSIERT?",
        answers: [
            "WER IST DAS?",
            "PIKACHU! ZAHL MEINE STEUERN!",
            "ER HAT SEINEN MASTER",
            "KETCHUP"
        ],
        correctAnswer: 3
    },
    75: {
        question: "WAS DAVON IST KEIN STUDIENGANG?",
        answers: [
            "ANGEWANDTE FREIZEITWISSENSCHAFTEN",
            "PUPPENSPIEL :)",
            "GENDER STUDIES",
            "SOCIAL ENGINEERING"
        ],
        correctAnswer: 4
    },
    76: {
        question: "WAS UNTERSCHEIDET EIN MENSCH VON EINEM ROBOTER?",
        answers: [
            "SIE KÖNNEN SINFONIEN SCHREIBEN",
            "SIE KÖNNEN SICH MIT JOGHURT EINSCHMIEREN",
            "SIE TRÄUMEN",
            "SIE KÖNNEN MALEN"
        ],
        correctAnswer: 2
    },
    77: {
        question: "WO HAT DICH DIESES QUIZ BISHER BERÜHRT?",
    },
    78: {
        question: "WIE VIELE LEBEN HAST DU?",
        answers: [
            "DREI",
            "1",
            "ZWEI",
            "KEINS, BIN BEI LEVEL 78 UND SPIELE TAMS DUMME SPIELE"
        ],
        correctAnswer: 4
    },
    79: {
        question: "WOFÜR STEHT DAS F IN F. SCOTT FITZGERALD?",
        answers: [
            "FITZGERALD",
            "FISH",
            "FUCK",
            "GAR NICHTS"
        ],
        correctAnswer: 3
    },
    80: {
        question: "WIE ENTSTEHT EINE TIGERENTE?",
        answers: [
            "INDEM SICH ZWEI FURRIES PAAREN",
            "WIE PINOCHIO",
            "SCHWERE TIERHALTUNG",
            "GRRRRRRRR..."
        ],
        correctAnswer: 2
    },
    81: {
        question: "WILLST DU MEIN ÜBERDIMENSIONALES RIESENPFERD HABEN?",
        bomb: true,
        answers: [
            "JA, BITTE",
            "AUF GAR KEINEN FALL",
            "HÜÜÜÜÜÜÜÜÜÜÜ PPPFPFPFPPFFF",
            "PABLO"
        ],
        correctAnswer: 2
    },
    82: {
        question: "WAS IST EINS UND EINS GEMEINSAM?",
        answers: [
            "WLAN",
            "11",
            "TECHTELMECHTEL",
            "M"
        ],
        correctAnswer: 1
    },
    83: {
        question: "WAS IST DEUTSCHES ENTERTAINMENT?",
        answers: [
            "STÜCK BROT",
            "STEFAN RAAAAB",
            "DIE ZEHNTAUSENDSTE FOLGE GALILEO",
            "DZE PENNY EF DE REEPERBEHN"
        ],
        correctAnswer: 1
    },
    84: {
        question: "WAS IST DAS?",
        image: true,
        answers: [
            "KNEIPENSPIELE",
            "100!!!",
            "TIERQUÄLEREI",
            "DEUTSCHER SCHÄFERHUND"
        ],
        correctAnswer: 2
    },
    85: {
        question: "''ÜBERALL NUR IDIOTEN''",
        answers: [
            "-ARISTOTELES",
            "-EINSTEIN",
            "-GEORGE W. BUSH",
            "-GREG"
        ],
        correctAnswer: 4
    },
    86: {
        question: "WO IST ES?",
        answers: ["", "", "", ""],
    },
    87: {
        question: "",
        answers: [
            "WOOF",
            "WOOF WOOF ",
            "WOOF WOOF WOOF ",
            "WOOF WOOF WOOF WOOF "
        ],
        correctAnswer: 3
    },
    88: {
        question: "WAS MACHT DAS KLEINE KÜKEN?",
        answers: [
            "SIE PICKT DIR INS GESICHT!!!?!??!",
            "ÜBER DIE STRAßE GEHEN",
            "PIEP",
            "SIE WIRD STRAßENRAPPER"
        ],
        correctAnswer: 3
    },
    89: {
        question: "WAS TUN GEGEN HAARAUSFALL?",
        answers: [
            "ALPICIN KOFFEIN SHAMPOO",
            "ZU LIEBEN EIßT AUFZUGEBEN",
            "EINE HAARTRANSPLANTATION IN TÜRKEI",
            "MINOXIDIL"
        ],
        correctAnswer: 2
    },
    90: {
        question: "WIE BEREITETST DU DICH AUF DIE LETZTEN 10 FRAGEN VOR?",
        answers: [
            "MIT VIEL ELAN UND EUPHORIE",
            "EIN PREP-MEAL ZU SICH NEHMEN",
            "GAR NICHT",
            "MEINE FINGER KNACKSEN LASSEN"
        ],
        correctAnswer: 3
    },
    91: {
        question: "LICHT?????",
        bomb: true
    },
    92: {
        question: "HAMPELMANN 70!",
        bomb: true
    },
    93: {
        question: "RECHNE!",
        bomb: true,
        answers: ["", "", "", ""],
        correctAnswer: 1
    },
    94: {
        question: "MACHE DAS GEGENTEIL! : DRÜCKE NICHT AUF DIE GELBE GLÜCKLICHE GROßE SONNE",
        bomb: true
    },
    95: {
        question: "ERINNERE DICH:",
        bomb: true
    },
    96: {
        question: "WAS IST DAS?!?!?",
        bomb: true,
        image: true,
        imageBorder: false,
        answers: [
            "EIN WORTSPIEL",
            "EINE FETTE HUMMEL",
            "ICH BIN EINE BIEEENE!",
            "BZZZ BZZZ"
        ],
        correctAnswer: 2
    },
    97: {
        question: "",
        bomb: true,
        image: true
    },
    98: {
        question: "WIE GEHT ES DIR?",
        answers: [
            "GUT! DANKE DER NACHFRAGE",
            "AHHHAHAHHHAHAHAH",
            "SCHWEIß UND ARSCHWASSER",
            ">:((((((("
        ],
        correctAnswer: 2
    },
    99: {
        question: "VIEL GLÜCK",
        bomb: true,
        answers: [
            "SÄRGE",
            "CHILLI CHEESE",
            "BARCELONA",
            "SALAMIS",
            "POCAHONTAS",
            "IMAC",
            "LUFTBALLONS",
            "STALIN"
        ],
        correctAnswer: 7
    },
    100: {
        question: "",
        answers: []
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

    bomb10Sound.pause();
    bomb10Sound.currentTime = 0;
    bomb5Sound.pause();
    bomb5Sound.currentTime = 0;
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
    bomb10Sound.currentTime = 0;
    bomb10Sound.play().catch(function() {});
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

function startLevel86Bomb() {
    bombCounter = 5;
    updateBombDisplay();

    if (bombStatus) {
        bombStatus.hidden = false;
    }

    stopBombTimer();
    bomb5Sound.currentTime = 0;
    bomb5Sound.play().catch(function() {});
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

function stopLevel59Animation() {
    if (level59Timeout !== null) {
        clearTimeout(level59Timeout);
        level59Timeout = null;
    }
}

function stopLevel86Sequence() {
    if (level86BlinkInterval !== null) {
        clearInterval(level86BlinkInterval);
        level86BlinkInterval = null;
    }

    if (level86GreenTimeout !== null) {
        clearTimeout(level86GreenTimeout);
        level86GreenTimeout = null;
    }

    if (level86FinishTimeout !== null) {
        clearTimeout(level86FinishTimeout);
        level86FinishTimeout = null;
    }
}

function stopLevel87Animation() {
    if (level87StartTimeout !== null) {
        clearTimeout(level87StartTimeout);
        level87StartTimeout = null;
    }

    if (level87AnimationTimeout !== null) {
        clearTimeout(level87AnimationTimeout);
        level87AnimationTimeout = null;
    }

    woofSound.pause();
    woofSound.currentTime = 0;
}

function stopLevel93Sequence() {
    if (level93SequenceTimeout !== null) {
        clearTimeout(level93SequenceTimeout);
        level93SequenceTimeout = null;
    }
}

function stopLevel92Image() {
    if (level92ImageHandler !== null) {
        levelImage.removeEventListener("click", level92ImageHandler);
        level92ImageHandler = null;
    }
}

function setupLevel87Animation() {
    const imagePath = "sonstiges/Bilder/Level 87/Unbenanntes_Projekt";

    levelImage.hidden = false;
    levelImage.classList.remove("has-border", "animation-image");
    levelImage.alt = "Hund";
    levelImage.src = `${imagePath} (1).png`;

    level87StartTimeout = setTimeout(function() {
        level87StartTimeout = null;
        woofSound.currentTime = 0;
        woofSound.play().catch(function() {});

        let cycle = 0;
        function showNextDogState() {
            if (cycle >= 3) {
                level87AnimationTimeout = null;
                return;
            }

            levelImage.src = `${imagePath} (2).png`;
            const stateTwoDuration = cycle === 0 ? 1000 : 1200;
            level87AnimationTimeout = setTimeout(function() {
                levelImage.src = `${imagePath} (1).png`;
                cycle += 1;
                level87AnimationTimeout = setTimeout(showNextDogState, 200);
            }, stateTwoDuration);
        }

        showNextDogState();
    }, 10000);
}

function setupLevel87Answers(levelData) {
    levelData.answers.forEach(function(answer, index) {
        const answerButton = document.createElement("button");

        answerButton.className = "answer-button";
        answerButton.type = "button";
        answerButton.textContent = answer;
        answerButton.addEventListener("click", function() {
            if (index + 1 === levelData.correctAnswer) {
                levelnumber += 1;
                showLevel(levelnumber);
                return;
            }

            playPistolShotSound();
            lives -= 1;
            livesNumberElement.textContent = lives;

            if (lives === 0) {
                stopBombTimer();
                quizScreen.hidden = true;
                gameOverScreen.hidden = false;
            }
        });
        answerButtons.appendChild(answerButton);
    });
}

function setupLevel86Buttons(levelData) {
    const buttons = [];
    let highlightedIndex = 0;
    let finalIndex = null;
    let sequenceFinished = false;

    questionElement.hidden = true;

    for (let index = 0; index < levelData.answers.length; index += 1) {
        const answerButton = document.createElement("button");

        answerButton.className = "answer-button level-86-button";
        answerButton.type = "button";
        answerButton.addEventListener("click", function() {
            if (!sequenceFinished) {
                return;
            }

            if (index + 1 === finalIndex + 1) {
                resetBombState();
                levelnumber += 1;
                showLevel(levelnumber);
            } else {
                playPistolShotSound();
                lives -= 1;
                livesNumberElement.textContent = lives;

                if (lives === 0) {
                    stopBombTimer();
                    quizScreen.hidden = true;
                    gameOverScreen.hidden = false;
                }
            }
        });
        buttons.push(answerButton);
        answerButtons.appendChild(answerButton);
    }

    buttons[highlightedIndex].classList.add("is-highlighted");
    level86BlinkInterval = setInterval(function() {
        buttons[highlightedIndex].classList.remove("is-highlighted");
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * buttons.length);
        } while (nextIndex === highlightedIndex);
        highlightedIndex = nextIndex;
        buttons[highlightedIndex].classList.add("is-highlighted");
    }, 50);

    const greenDelay = 1000 + Math.random() * 1000;
    const finishDelay = Math.max(greenDelay + 100, 2000 + Math.random() * 1000);

    level86GreenTimeout = setTimeout(function() {
        level86GreenTimeout = null;
        clearInterval(level86BlinkInterval);
        level86BlinkInterval = null;
        const redIndex = highlightedIndex;
        do {
            finalIndex = Math.floor(Math.random() * buttons.length);
        } while (finalIndex === redIndex);
        buttons[redIndex].classList.remove("is-highlighted");
        buttons[finalIndex].classList.add("is-green");

        setTimeout(function() {
            buttons[finalIndex].classList.remove("is-green");
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * buttons.length);
            } while (nextIndex === finalIndex);
            highlightedIndex = nextIndex;
            buttons[highlightedIndex].classList.add("is-highlighted");
            level86BlinkInterval = setInterval(function() {
                buttons[highlightedIndex].classList.remove("is-highlighted");
                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * buttons.length);
                } while (nextIndex === highlightedIndex);
                highlightedIndex = nextIndex;
                buttons[highlightedIndex].classList.add("is-highlighted");
            }, 50);
        }, 50);
    }, greenDelay);

    level86FinishTimeout = setTimeout(function() {
        level86FinishTimeout = null;
        clearInterval(level86BlinkInterval);
        level86BlinkInterval = null;
        buttons[highlightedIndex].classList.remove("is-highlighted");
        sequenceFinished = true;
        questionElement.hidden = false;
            startLevel86Bomb();
    }, finishDelay);
}

function loseLevel59Life() {
    stopLevel59Animation();
    playPistolShotSound();
    lives -= 1;
    livesNumberElement.textContent = lives;

    if (lives === 0) {
        quizScreen.hidden = true;
        gameOverScreen.hidden = false;
        return;
    }

    setupLevel59Animation();
}

function setupLevel59Animation() {
    let phase = 1;
    const continueButton = document.createElement("button");

    stopLevel59Animation();
    levelImage.src = "sonstiges/Bilder/Level 59/Unbenanntes_Projekt (1).png";
    answerButtons.replaceChildren();

    continueButton.className = "answer-button";
    continueButton.type = "button";
    continueButton.textContent = "WEITER";
    continueButton.addEventListener("click", function() {
        if (phase === 3 || phase === 4) {
            stopLevel59Animation();
            levelnumber += 1;
            showLevel(levelnumber);
            return;
        }

        loseLevel59Life();
    });
    answerButtons.appendChild(continueButton);

    level59Timeout = setTimeout(function() {
        phase = 2;
        levelImage.src = "sonstiges/Bilder/Level 59/Unbenanntes_Projekt (2).png";

        level59Timeout = setTimeout(function() {
            phase = 3;
            levelImage.src = "sonstiges/Bilder/Level 59/Unbenanntes_Projekt (3).png";

            level59Timeout = setTimeout(function() {
                phase = 4;
                levelImage.src = "sonstiges/Bilder/Level 59/Unbenanntes_Projekt (1).png";

                level59Timeout = setTimeout(function() {
                    loseLevel59Life();
                }, 500);
            }, 350);
        }, 1000);
    }, 5000);
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
    submitButton.textContent = "WEITER";

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

function setupLevel97Input() {
    const input = document.createElement("input");
    const continueButton = document.createElement("button");

    input.className = "level-32-input";
    input.type = "text";
    input.autocomplete = "off";
    input.autocapitalize = "none";
    input.spellcheck = false;
    input.setAttribute("aria-label", "Antwort für Level 97");

    continueButton.className = "answer-button level-32-submit";
    continueButton.type = "button";
    continueButton.textContent = "WEITER";
    continueButton.addEventListener("click", function() {
        if (input.value.trim().toLowerCase() === "deutscher schäferhund") {
            stopBombTimer();
            bombCounter = 10;
            if (bombStatus) {
                bombStatus.hidden = true;
            }
            updateBombDisplay();
            showLevelTransition(98);
            return;
        }

        playPistolShotSound();
        lives -= 1;
        livesNumberElement.textContent = lives;
        input.value = "";

        if (lives <= 0) {
            stopBombTimer();
            bombCounter = 10;
            if (bombStatus) {
                bombStatus.hidden = true;
            }
            updateBombDisplay();
            quizScreen.hidden = true;
            gameOverScreen.hidden = false;
        } else {
            input.focus();
        }
    });

    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            continueButton.click();
        }
    });

    answerButtons.append(input, continueButton);
    input.focus();
}

function setupLevel98Answers(levelData) {
    levelData.answers.forEach(function() {
        const answerButton = document.createElement("button");

        answerButton.className = "answer-button";
        answerButton.type = "button";
        answerButton.textContent = "GUT";
        answerButton.addEventListener("click", function() {
            if (level98NormalMode) {
                showLevelTransition(99);
                return;
            }

            playPistolShotSound();
            quizScreen.hidden = true;
            gameOverScreen.hidden = false;

            levelTransitionTimeout = setTimeout(function() {
                levelTransitionTimeout = null;
                level98NormalMode = true;
                gameOverScreen.hidden = true;
                quizScreen.hidden = false;
                showLevel(98);
            }, 5000);
        });
        answerButtons.appendChild(answerButton);
    });
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

function setupLevel50Images() {
    const imageOrder = [3, 1, 4, 2];
    const clickOrder = [1, 2, 3, 4];
    let nextImageIndex = 0;
    const imageStack = document.createElement("div");

    imageStack.className = "level-50-image-stack";

    imageOrder.forEach(function(imageNumber) {
        const imageButton = document.createElement("button");
        const image = document.createElement("img");

        imageButton.className = "level-50-image-button";
        imageButton.type = "button";
        imageButton.setAttribute("aria-label", `Bild ${imageNumber}`);
        image.src = `sonstiges/Bilder/Level 50/Unbenanntes_Projekt (${imageNumber}).png`;
        image.alt = `Bild ${imageNumber}`;
        imageButton.appendChild(image);
        imageButton.addEventListener("click", function() {
            if (imageNumber !== clickOrder[nextImageIndex]) {
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

            nextImageIndex += 1;
            imageButton.disabled = true;

            if (nextImageIndex < imageOrder.length) {
                playDingSound();
            } else {
                levelnumber += 1;
                showLevel(levelnumber);
            }
        });
        imageStack.appendChild(imageButton);
    });

    answerButtons.appendChild(imageStack);
}

function setupLevel77Images() {
    const correctImages = new Set([1, 2, 4, 5, 6, 7, 8, 9]);
    const selectedImages = new Set();
    const imageGrid = document.createElement("div");
    const checkButton = document.createElement("button");

    imageGrid.className = "level-77-image-grid";

    for (let imageNumber = 1; imageNumber <= 9; imageNumber += 1) {
        const imageButton = document.createElement("button");
        const image = document.createElement("img");

        imageButton.className = "level-77-image-button";
        imageButton.type = "button";
        imageButton.setAttribute("aria-label", `Bild ${imageNumber}`);
        image.src = `sonstiges/Bilder/Level 77/Unbenanntes_Projekt (${imageNumber}).png`;
        image.alt = `Bild ${imageNumber}`;
        imageButton.appendChild(image);
        imageButton.addEventListener("click", function() {
            if (selectedImages.has(imageNumber)) {
                selectedImages.delete(imageNumber);
                imageButton.classList.remove("is-selected");
                return;
            }

            selectedImages.add(imageNumber);
            imageButton.classList.add("is-selected");
        });
        imageGrid.appendChild(imageButton);
    }

    checkButton.className = "answer-button level-77-submit";
    checkButton.type = "button";
    checkButton.textContent = "PRÜFEN";
    checkButton.addEventListener("click", function() {
        if (selectedImages.size === correctImages.size && [...correctImages].every(function(imageNumber) {
            return selectedImages.has(imageNumber);
        })) {
            levelnumber += 1;
            showLevel(levelnumber);
            return;
        }

        playPistolShotSound();
        lives -= 1;
        livesNumberElement.textContent = lives;

        if (lives === 0) {
            stopBombTimer();
            quizScreen.hidden = true;
            gameOverScreen.hidden = false;
        }
    });

    answerButtons.append(imageGrid, checkButton);
}

function setupLevel69Hanoi() {
    const towers = [[1, 2, 3], [], []];
    const towerButtons = [];
    let selectedTower = null;
    let selectedRing = null;
    const board = document.createElement("div");
    const selectedRingImage = document.createElement("img");

    board.className = "level-69-board";
    selectedRingImage.className = "level-69-selected-ring";
    selectedRingImage.alt = "Ausgewählter Ring";
    selectedRingImage.hidden = true;

    function getTowerImage(towerIndex) {
        const towerState = towers[towerIndex].slice().sort(function(firstRing, secondRing) {
            return firstRing - secondRing;
        }).join(",");
        const stateImageNumbers = {
            "": 0,
            "1": 1,
            "1,2": 2,
            "1,2,3": 3,
            "2": 4,
            "2,3": 5,
            "3": 6,
            "1,3": 7
        };
        const imageNumber = stateImageNumbers[towerState];
        const fileName = towerIndex === 2
            ? imageNumber === 3
                ? "Znbenanntes_Projekt (3).png"
                : `ZUnbenanntes_Projekt (${imageNumber}).png`
            : `Unbenanntes_Projekt (${imageNumber}).png`;

        return `sonstiges/Bilder/Level 69/${fileName}`;
    }

    function renderTowers() {
        towerButtons.forEach(function(towerButton, towerIndex) {
            const image = towerButton.querySelector("img");
            image.src = getTowerImage(towerIndex);
            image.alt = `Hanoi-Reihe ${towerIndex + 1} mit ${towers[towerIndex].length} Ringen`;
            towerButton.classList.toggle("is-selected", towerIndex === selectedTower);
        });

        selectedRingImage.hidden = selectedRing === null;
        if (selectedRing !== null) {
            selectedRingImage.src = `sonstiges/Bilder/Level 69/Ring${selectedRing}.png`;
            selectedRingImage.style.left = `${towerButtons[selectedTower].offsetLeft}px`;
            selectedRingImage.style.width = `${towerButtons[selectedTower].offsetWidth}px`;
        }
    }

    function loseHanoiLife() {
        playPistolShotSound();
        lives -= 1;
        livesNumberElement.textContent = lives;

        if (lives === 0) {
            quizScreen.hidden = true;
            gameOverScreen.hidden = false;
        }
    }

    function chooseTower(towerIndex) {
        const tower = towers[towerIndex];

        if (selectedRing === null) {
            if (tower.length === 0) {
                return;
            }

            selectedTower = towerIndex;
            selectedRing = tower.pop();
            renderTowers();
            return;
        }

        if (towerIndex === selectedTower) {
            towers[selectedTower].push(selectedRing);
            selectedTower = null;
            selectedRing = null;
            renderTowers();
            return;
        }

        const topRing = tower[tower.length - 1];
        if (topRing !== undefined && topRing > selectedRing) {
            loseHanoiLife();
            return;
        }

        tower.push(selectedRing);
        selectedTower = null;
        selectedRing = null;
        renderTowers();

        if (towers[2].length === 3) {
            levelnumber += 1;
            showLevel(levelnumber);
        }
    }

    [0, 1, 2].forEach(function(towerIndex) {
        const towerButton = document.createElement("button");
        const towerImage = document.createElement("img");

        towerButton.className = "level-69-tower";
        towerButton.type = "button";
        towerButton.setAttribute("aria-label", `Hanoi-Reihe ${towerIndex + 1}`);
        towerImage.alt = "";
        towerButton.appendChild(towerImage);
        towerButton.addEventListener("click", function() {
            chooseTower(towerIndex);
        });
        towerButtons.push(towerButton);
        board.appendChild(towerButton);
    });

    board.appendChild(selectedRingImage);
    answerButtons.appendChild(board);
    renderTowers();
}

function setupLevel52Switch() {
    const switchButton = document.createElement("button");
    const switchImage = document.createElement("img");

    switchButton.className = "level-52-switch-button";
    switchButton.type = "button";
    switchButton.setAttribute("aria-label", "Lichtschalter für Level 53");
    switchImage.src = "sonstiges/Bilder/Bild52.png";
    switchImage.alt = "Lichtschalter";
    switchButton.appendChild(switchImage);
    switchButton.addEventListener("click", function() {
        levelnumber += 1;
        showLevel(levelnumber);
    });

    answerButtons.appendChild(switchButton);
}

function showLevelTransition(nextLevel) {
    stopBombTimer();
    resetBombState();
    stopLevel92Image();

    if (nextLevel === 98) {
        level98NormalMode = false;
    }

    document.body.classList.add("level-92-transition");
    levelStatus.hidden = true;
    livesWrapper.hidden = true;
    questionElement.hidden = true;
    levelImage.hidden = false;
    levelImage.classList.remove("level-90-transition-number", "level-92-image");
    levelImage.classList.add("level-92-transition-number");
    levelImage.src = `sonstiges/Bilder/Zahlen/${nextLevel}.png`;
    answerButtons.replaceChildren();

    levelTransitionTimeout = setTimeout(function() {
        levelnumber = nextLevel;
        showLevel(levelnumber);
    }, 1500);
}

function showLevel99Transition() {
    stopBombTimer();
    resetBombState();
    clearTimeout(levelTransitionTimeout);

    document.body.classList.add("level-99-transition");
    levelStatus.hidden = true;
    livesWrapper.hidden = true;
    questionElement.hidden = true;
    levelImage.hidden = true;
    answerButtons.replaceChildren();

    levelTransitionTimeout = setTimeout(function() {
        questionElement.hidden = false;
        questionElement.textContent = "JETZT KOMMT DIE ALLERLETZTE FRAGE";

        levelTransitionTimeout = setTimeout(function() {
            questionElement.textContent = "ICH WÜNSCHE DIR VIEL GLÜCK";

            levelTransitionTimeout = setTimeout(function() {
                questionElement.textContent = "";
                questionElement.hidden = true;

                levelTransitionTimeout = setTimeout(function() {
                    document.body.classList.remove("level-99-transition");
                    showLevelTransition(100);
                }, 300);
            }, 5000);
        }, 5000);
    }, 2300);
}

function setupLevel100Answers() {
    const questions = [
        { text: "IN WELCHEM LEVEL WAR SHANGHAII?", answer: 43 },
        { text: "IN WELCHEM LEVEL WAR SHAMPOO?", answer: 53 },
        { text: "IN WELCHEM LEVEL WAR OVERWATCH?", answer: 14 },
        { text: "IN WELCHEM LEVEL WAR EIN KÜKEN?", answer: 88 }
    ];
    const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];

    questionElement.hidden = false;
    questionElement.textContent = selectedQuestion.text;
    levelImage.hidden = true;
    answerButtons.replaceChildren();

    for (let answerNumber = 1; answerNumber <= 100; answerNumber += 1) {
        const answerButton = document.createElement("button");

        answerButton.className = "answer-button";
        answerButton.type = "button";
        answerButton.textContent = String(answerNumber);
        answerButton.addEventListener("click", function() {
            if (answerNumber === selectedQuestion.answer) {
                showLevel(101);
                return;
            }

            playPistolShotSound();
            lives -= 1;
            livesNumberElement.textContent = lives;

            if (lives <= 0) {
                stopBombTimer();
                quizScreen.hidden = true;
                gameOverScreen.hidden = false;
            }
        });
        answerButtons.appendChild(answerButton);
    }
}

function setupLevel91Switch() {
    const switchButton = document.createElement("button");
    const switchImage = document.createElement("img");

    switchButton.className = "level-52-switch-button level-91-switch-button";
    switchButton.type = "button";
    switchButton.setAttribute("aria-label", "Lichtschalter für Level 92");
    switchImage.src = "sonstiges/Bilder/Bild52.png";
    switchImage.alt = "Lichtschalter";
    switchButton.appendChild(switchImage);
    switchButton.addEventListener("click", function() {
        stopBombTimer();
        showLevelTransition(92);
    });

    answerButtons.appendChild(switchButton);
}

function setupLevel92Images() {
    let clickCount = 0;
    let stateNumber = 1;
    let isZState = false;

    levelImage.hidden = false;
    levelImage.classList.remove("has-border", "animation-image", "level-92-transition-number");
    levelImage.classList.add("level-92-image");
    levelImage.alt = "Bild für Level 92";

    function updateImage() {
        const prefix = isZState ? "ZUnbenanntes_Projekt" : "Unbenanntes_Projekt";
        levelImage.src = `sonstiges/Bilder/Level 92/${prefix} (${stateNumber}).png`;
    }

    updateImage();
    level92ImageHandler = function() {
        clickCount += 1;
        isZState = !isZState;

        if (clickCount % 14 === 0) {
            stateNumber += 1;
            isZState = false;
        }

        updateImage();

        if (clickCount === 70) {
            showLevelTransition(93);
        }
    };
    levelImage.addEventListener("click", level92ImageHandler);
}

function createLevel93AnswerSet(target) {
    const correctPosition = Math.floor(Math.random() * 4);
    const positionMode = ["lowest", "middle", "highest"][Math.floor(Math.random() * 3)];
    const answerValues = Array(4).fill(0);
    let distractorBase;

    if (positionMode === "lowest") {
        distractorBase = [target + 1, target + 2, target + 3];
    } else if (positionMode === "middle") {
        distractorBase = [target - 1, target + 1, target + 2];
    } else {
        distractorBase = [target - 3, target - 2, target - 1];
    }

    const otherPositions = [0, 1, 2, 3].filter(function(index) {
        return index !== correctPosition;
    });

    answerValues[correctPosition] = target;
    otherPositions.forEach(function(position, index) {
        answerValues[position] = distractorBase[index];
    });

    return {
        correctPosition: correctPosition,
        answerValues: answerValues,
        positionMode: positionMode
    };
}

function setupLevel93Math() {
    document.body.classList.remove("level-92-transition");
    document.body.classList.add("level-93");
    questionElement.hidden = false;
    levelImage.hidden = true;
    answerButtons.replaceChildren();
    questionElement.textContent = "";

    const values = Array.from({ length: 5 }, function() {
        return Math.floor(Math.random() * 9) + 1;
    });
    const target = values.reduce(function(total, value) {
        return total + value;
    }, 0);
    const answerSet = createLevel93AnswerSet(target);
    const answerValues = answerSet.answerValues;
    const correctPosition = answerSet.correctPosition;

    const sequenceSymbols = [];
    values.forEach(function(value, index) {
        sequenceSymbols.push(String(value));
        if (index < values.length - 1) {
            sequenceSymbols.push("+");
        }
    });

    let sequenceIndex = 0;

    function showNextSequencePart() {
        if (sequenceIndex >= sequenceSymbols.length) {
            questionElement.textContent = "RECHNE!";
            answerButtons.replaceChildren();
            startBombLevel(quizLevels[93]);

            answerValues.forEach(function(value, index) {
                const answerButton = document.createElement("button");
                answerButton.className = "answer-button";
                answerButton.type = "button";
                answerButton.textContent = String(value);
                answerButton.addEventListener("click", function() {
                    if (index === correctPosition) {
                        stopBombTimer();
                        showLevelTransition(94);
                        return;
                    }

                    playPistolShotSound();
                    lives -= 1;
                    livesNumberElement.textContent = lives;

                    if (lives <= 0) {
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
                });
                answerButtons.appendChild(answerButton);
            });
            return;
        }

        questionElement.textContent = sequenceSymbols[sequenceIndex];
        sequenceIndex += 1;

        level93SequenceTimeout = setTimeout(function() {
            level93SequenceTimeout = null;
            questionElement.textContent = "";
            level93SequenceTimeout = setTimeout(showNextSequencePart, 90);
        }, 300);
    }

    showNextSequencePart();
}

function setupLevel94Grid() {
    const grid = document.createElement("div");
    grid.className = "level-94-image-grid";

    for (let index = 1; index <= 16; index += 1) {
        const imageButton = document.createElement("button");
        const image = document.createElement("img");

        imageButton.type = "button";
        imageButton.className = "level-94-image-button";
        imageButton.setAttribute("aria-label", `Bild ${index}`);
        image.src = `sonstiges/Bilder/Level 94/Bild${index}.png`;
        image.alt = `Bild ${index}`;

        imageButton.appendChild(image);
        imageButton.addEventListener("click", function() {
            if (index === 4) {
                stopBombTimer();
                showLevelTransition(95);
                return;
            }

            playPistolShotSound();
            lives -= 1;
            livesNumberElement.textContent = lives;

            if (lives <= 0) {
                stopBombTimer();
                bombCounter = 10;
                if (bombStatus) {
                    bombStatus.hidden = true;
                }
                updateBombDisplay();
                quizScreen.hidden = true;
                gameOverScreen.hidden = false;
            }
        });

        grid.appendChild(imageButton);
    }

    answerButtons.appendChild(grid);
}

function setupLevel95Sequence() {
    const correctOrder = [1, 2, 1, 4];
    let sequenceIndex = 0;
    const row = document.createElement("div");
    row.className = "level-95-sequence-row";

    for (let index = 1; index <= 4; index += 1) {
        const imageButton = document.createElement("button");
        const image = document.createElement("img");

        imageButton.type = "button";
        imageButton.className = "level-95-sequence-button";
        imageButton.setAttribute("aria-label", `Bild ${index}`);
        image.src = `sonstiges/Bilder/Level 95/Unbenanntes_Projekt (${index}).png`;
        image.alt = `Bild ${index}`;
        imageButton.appendChild(image);

        imageButton.addEventListener("click", function() {
            if (index !== correctOrder[sequenceIndex]) {
                playPistolShotSound();
                lives -= 1;
                livesNumberElement.textContent = lives;

                if (lives <= 0) {
                    stopBombTimer();
                    bombCounter = 10;
                    if (bombStatus) {
                        bombStatus.hidden = true;
                    }
                    updateBombDisplay();
                    quizScreen.hidden = true;
                    gameOverScreen.hidden = false;
                }
                return;
            }

            if (sequenceIndex < correctOrder.length - 1) {
                playDingSound();
                sequenceIndex += 1;
                return;
            }

            showLevelTransition(96);
        });

        row.appendChild(imageButton);
    }

    answerButtons.appendChild(row);
}

function setupLevel90Transition() {
    stopRockySound();
    document.body.classList.add("level-91");
    levelStatus.hidden = true;
    livesWrapper.hidden = true;
    levelImage.hidden = true;
    answerButtons.replaceChildren();
    questionElement.hidden = false;
    questionElement.classList.add("level-90-transition-text");
    questionElement.textContent = "";
    alarmSound.currentTime = 0;
    alarmSound.play().catch(function() {});

    levelTransitionTimeout = setTimeout(function() {
        questionElement.textContent = "UND JETZT KOMMEN:";
        levelTransitionTimeout = setTimeout(function() {
            questionElement.textContent = "";
            levelTransitionTimeout = setTimeout(function() {
                questionElement.textContent = "DIE LETZTEN 10";
                levelTransitionTimeout = setTimeout(function() {
                    questionElement.textContent = "";
                    levelTransitionTimeout = setTimeout(function() {
                        levelImage.hidden = false;
                        levelImage.classList.add("level-90-transition-number");
                        levelImage.src = "sonstiges/Bilder/Zahlen/91.png";
                        levelTransitionTimeout = setTimeout(function() {
                            levelnumber = 91;
                            showLevel(levelnumber);
                        }, 2000);
                    }, 300);
                }, 5000);
            }, 300);
        }, 5000);
    }, 3000);
}

function showLevel(level) {
    const levelData = quizLevels[level];

    if (level !== 91 && document.body.classList.contains("level-91")) {
        window.scrollTo(0, 0);
    }

    if (hasShownFirstLevel) {
        playDingSound();
    } else {
        hasShownFirstLevel = true;
    }

    clearTimeout(level12BlinkTimeout);
    clearTimeout(level12BlinkResetTimeout);
    clearTimeout(levelTransitionTimeout);
    stopLevel86Sequence();
    stopLevel93Sequence();
    levelTransitionTimeout = null;
    stopImageAnimation();
    stopLevel59Animation();
    stopLevel87Animation();
    stopLevel92Image();

    levelNumberElement.textContent = level === 40 ? "???" : level;
    levelStatus.hidden = false;
    livesWrapper.hidden = false;
    if (level === 93) {
        resetBombState();
    } else if (!levelData || !levelData.bomb) {
        resetBombState();
    } else {
        startBombLevel(levelData);
    }
    answerFeedback.textContent = "";
    levelStatus.classList.toggle("is-clickable", level === 4 || level === 82);
    questionElement.classList.toggle("level-21-question", level === 21);
    document.body.classList.toggle("level-52", level === 52);
    document.documentElement.classList.toggle("level-52", level === 52);
    questionArea.classList.toggle("level-52-question-area", level === 52);
    document.body.classList.toggle("level-58", level === 58);
    document.body.classList.toggle("level-91", level === 91);
    document.documentElement.classList.toggle("level-91", level === 91);
    document.body.classList.toggle("level-92-transition", false);
    document.body.classList.toggle("level-99-transition", false);
    document.body.classList.toggle("level-92", level === 92);
    document.body.classList.toggle("level-93", level === 93);
    document.body.classList.toggle("level-98", level === 98 && !level98NormalMode);
    document.body.classList.toggle("level-101", level === 101);
    document.documentElement.classList.toggle("level-92", level === 92);
    levelImage.classList.toggle("level-59-image", level === 59);
    levelImage.classList.toggle("level-20-image", level === 20);
    levelImage.classList.toggle("level-81-horse-image", level === 81);
    levelImage.classList.remove("level-90-transition-number");
    questionElement.classList.remove("level-90-transition-text");
    questionArea.classList.toggle("level-91-question-area", level === 91);
    questionElement.hidden = false;

    if (level === 58) {
        level58SecondAnswerClicks = 0;
    }

    if (!levelData) {
        if (level === 101) {
            levelStatus.hidden = true;
            livesWrapper.hidden = true;
            questionElement.hidden = true;
            questionElement.textContent = "HERZLICHEN GLÜCKWUNSCH!!! HIER IST DEIN PREIS:";
            questionElement.hidden = false;
            levelImage.hidden = false;
            levelImage.classList.remove("has-border", "animation-image", "level-92-transition-number");
            levelImage.classList.add("level-101-prize");
            levelImage.alt = "Preis";
            levelImage.src = "sonstiges/Bilder/Preis.png";
            levelImage.onclick = function() {
                honkSound.currentTime = 0;
                honkSound.play().catch(function() {});
            };
            answerButtons.replaceChildren();
            fnafSound.currentTime = 0;
            fnafSound.play().catch(function() {});
            return;
        }

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

    if (level === 59) {
        questionElement.hidden = true;
        levelImage.hidden = false;
        levelImage.classList.remove("has-border");
        levelImage.classList.remove("animation-image");
        levelImage.alt = "Ampel für Level 59";
        answerButtons.replaceChildren();
        setupLevel59Animation();
        return;
    }

    if (level === 69) {
        questionElement.textContent = levelData.question;
        levelImage.hidden = true;
        answerButtons.replaceChildren();
        setupLevel69Hanoi();
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

        if (level === 50) {
            levelImage.hidden = true;
            answerButtons.replaceChildren();
            setupLevel50Images();
            return;
        }

        if (level === 52) {
            levelImage.hidden = true;
            answerButtons.replaceChildren();
            setupLevel52Switch();
            return;
        }

        if (level === 91) {
            levelImage.hidden = true;
            answerButtons.replaceChildren();
            setupLevel91Switch();
            setTimeout(function() {
                window.scrollTo(0, 400);
                document.documentElement.scrollTop = 400;
                document.body.scrollTop = 400;
            }, 0);
            return;
        }

        if (level === 92) {
            questionElement.hidden = false;
            answerButtons.replaceChildren();
            setupLevel92Images();
            return;
        }

        if (level === 93) {
            questionElement.hidden = false;
            levelImage.hidden = true;
            answerButtons.replaceChildren();
            setupLevel93Math();
            return;
        }

        if (level === 94) {
            questionElement.hidden = false;
            levelImage.hidden = true;
            answerButtons.replaceChildren();
            questionElement.textContent = levelData.question;
            setupLevel94Grid();
            return;
        }

        if (level === 95) {
            questionElement.hidden = false;
            levelImage.hidden = true;
            answerButtons.replaceChildren();
            questionElement.textContent = levelData.question;
            setupLevel95Sequence();
            return;
        }

        if (level === 96) {
            questionElement.hidden = false;
            levelImage.hidden = false;
            levelImage.classList.remove("has-border", "animation-image", "level-92-transition-number");
            levelImage.classList.toggle("has-border", levelData.imageBorder === true);
            levelImage.alt = "Bild für Level 96";
            levelImage.src = "sonstiges/Bilder/Bild96.png";
            answerButtons.replaceChildren();

            levelData.answers.forEach(function(answer, index) {
                const answerButton = document.createElement("button");

                answerButton.className = "answer-button";
                answerButton.type = "button";
                answerButton.textContent = answer.trim() === "" ? "\u00a0" : answer;
                answerButton.addEventListener("click", function() {
                    if (index + 1 === levelData.correctAnswer) {
                        stopBombTimer();
                        showLevelTransition(97);
                        return;
                    }

                    playPistolShotSound();
                    lives -= 1;
                    livesNumberElement.textContent = lives;

                    if (lives <= 0) {
                        stopBombTimer();
                        bombCounter = 10;
                        if (bombStatus) {
                            bombStatus.hidden = true;
                        }
                        updateBombDisplay();
                        quizScreen.hidden = true;
                        gameOverScreen.hidden = false;
                    }
                });

                answerButtons.appendChild(answerButton);
            });

            return;
        }

        if (level === 97) {
            questionElement.hidden = true;
            levelImage.hidden = false;
            levelImage.classList.remove("has-border", "animation-image", "level-92-transition-number");
            levelImage.alt = "Bild für Level 97";
            levelImage.src = "sonstiges/Bilder/Bild97.webp";
            answerButtons.replaceChildren();
            setupLevel97Input();
            return;
        }

        if (level === 98) {
            questionElement.hidden = false;
            levelImage.hidden = true;
            answerButtons.replaceChildren();
            setupLevel98Answers(levelData);
            return;
        }

        if (level === 100) {
            setupLevel100Answers();
            return;
        }

        if (level === 77) {
            levelImage.hidden = true;
            answerButtons.replaceChildren();
            setupLevel77Images();
            return;
        }

        if (level === 86) {
            levelImage.hidden = true;
            answerButtons.replaceChildren();
            setupLevel86Buttons(levelData);
            return;
        }

        if (level === 87) {
            questionElement.hidden = true;
            levelImage.hidden = false;
            answerButtons.replaceChildren();
            setupLevel87Animation();
            setupLevel87Answers(levelData);
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
            if (level === 81 && index === 0) {
                stopBombTimer();
                bombCounter = 10;
                levelStatus.hidden = true;
                livesWrapper.hidden = true;
                questionElement.hidden = true;
                answerButtons.replaceChildren();
                updateBombDisplay();
                levelImage.hidden = false;
                levelImage.alt = "Überdimensionales Riesenpferd";
                levelImage.src = "sonstiges/Bilder/Pferd.png";
                return;
            }

            if (level === 58) {
                if (index === 1) {
                    if (level58SecondAnswerClicks >= 20) {
                        window.location.reload();
                        return;
                    }

                    playDingSound();
                    level58SecondAnswerClicks += 1;

                    if (level58SecondAnswerClicks === 20) {
                        answerButtons.children[1].textContent = levelData.answers[2];
                        answerButtons.children[2].textContent = "ES GIBT EIN ENTKOMMEN";
                    }

                    return;
                }

                if (index === 2) {
                    if (level58SecondAnswerClicks < 20) {
                        window.location.reload();
                    } else {
                        levelnumber += 1;
                        showLevel(levelnumber);
                    }

                    return;
                }
            }

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
                if (level === 90) {
                    setupLevel90Transition();
                    return;
                }

                if (level === 99) {
                    showLevel99Transition();
                    return;
                }

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
            }, 6000);
        }
    });
}

startButton.addEventListener("click", function() {
    levelnumber = 1;
    lives = 3;
    level98NormalMode = false;
    hasShownFirstLevel = false;
    bombCounter = 10;
    resetBombState();
    startContainer.hidden = true;
    quizScreen.hidden = false;
    rockySound.currentTime = 0;
    rockySound.play().catch(function() {});
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
    level98NormalMode = false;
    hasShownFirstLevel = false;
    bombCounter = 10;
    resetBombState();
    startContainer.hidden = true;
    quizScreen.hidden = false;
    gameOverScreen.hidden = true;
    showLevel(levelnumber);
});

levelStatus.addEventListener("click", function() {
    if (levelnumber === 82) {
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

        return;
    }

    if (levelnumber === 4) {
        levelnumber = 5;
        showLevel(levelnumber);
    }
});