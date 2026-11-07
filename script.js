// =====================================
// MEEN FEENA - GAME ENGINE
// =====================================

// عناصر الصفحة

const screens = document.querySelectorAll(".screen");

const playerInput = document.getElementById("playerName");
const playerList = document.getElementById("playerList");
const playerCount = document.getElementById("count");

const addPlayerBtn = document.getElementById("addPlayerBtn");
const startBtn = document.getElementById("startBtn");

const drawName = document.getElementById("drawName");
const drawStatus = document.getElementById("drawStatus");

const selectedPlayerName = document.getElementById("selectedPlayerName");
const questionText = document.getElementById("questionText");

const answerBtn = document.getElementById("answerBtn");
const refuseBtn = document.getElementById("refuseBtn");

const answeredPlayerName = document.getElementById("answeredPlayerName");

const judgeName = document.getElementById("judgeName");
const challengeText = document.getElementById("challengeText");

const toast = document.getElementById("toast");


// =====================================
// GAME DATA
// =====================================

let players = [];

let currentPlayer = null;
let currentJudge = null;

let lastPlayer = null;
let lastJudge = null;

let currentRound = 0;

let usedQuestions = [];
let usedChallenges = [];

let drawTimer = null;


// =====================================
// QUESTIONS
// =====================================

const questions = [

    "إيه أكتر موقف محرج حصلك قدام ناس؟",
    "إيه أغرب عادة عندك ومحدش يعرفها؟",
    "إيه أكتر مرة ضحكت فيها في وقت مينفعش تضحك فيه؟",
    "إيه أكتر موقف اتمنيت الأرض تنشق وتبلعك فيه؟",
    "إيه أغرب حاجة عملتها وإنت لوحدك؟",
    "إيه أكتر موقف اتلخبطت فيه قدام شخص؟",
    "إيه أكتر حاجة بتعملها وبتحاول تخبيها عن أصحابك؟",
    "إيه أكتر قرار عشوائي أخدته وندمت عليه؟",
    "لو أصحابك وصفوك في 3 كلمات، تتوقع يقولوا إيه؟",
    "إيه أغرب كذبة بيضا قلتها عشان تخرج من موقف؟",
    "إيه أكتر حاجة بتكسفك بسهولة؟",
    "إيه أكتر موقف ضحكك لدرجة إنك مش قادر تتكلم؟",
    "لو حياتك فيلم، هتسميه إيه؟",
    "إيه أكتر حاجة بتعملها لما تكون متوتر؟",
    "إيه أغرب رسالة كتبتها ومسحتها قبل الإرسال؟",
    "إيه أكتر موقف فهمت فيه حاجة غلط؟",
    "لو تقدر ترجع ليوم واحد في حياتك، تختار أنهي يوم؟",
    "إيه موهبة غريبة عندك؟",
    "إيه أكتر موقف اتصرفت فيه بثقة وإنت مش فاهم حاجة؟",
    "لو أصحابك عملوا لك لقب، تتوقع هيكون إيه؟",
    "إيه أكتر حاجة بتخليك تضحك مهما كنت متضايق؟",
    "إيه أكتر موقف حصل لك ومحدش صدقك لما حكيته؟",
    "إيه أكتر حاجة بتأجلها طول الوقت؟",
    "لو بقيت مشهور يوم واحد، هتعمل إيه؟",
    "إيه أغرب حلم فاكره لحد دلوقتي؟"

];


// =====================================
// CHALLENGES
// =====================================

const challenges = [

    "قلّد صوت مذيع أخبار لمدة 15 ثانية.",
    "اوصف يومك كأنك بتعمل إعلان تلفزيوني.",
    "قول 3 صفات إيجابية عن شخص تختاره.",
    "مثّل تعبير وجه مضحك من غير ما تتكلم.",
    "اخترع اسم لفيلم عن الشلة.",
    "اتكلم لمدة 20 ثانية كأنك روبوت.",
    "احكي قصة قصيرة باستخدام 3 كلمات يختارها أصحابك.",
    "اعمل إعلان عن قلم أو موبايل كأنك بتبيعه بمليون جنيه.",
    "قلّد طريقة كلام شخصية كرتونية لمدة 15 ثانية.",
    "احكي موقف عادي كأنه حدث تاريخي مهم.",
    "قول جملة صعبة 3 مرات بسرعة.",
    "اخترع أغنية قصيرة عن القعدة.",
    "وصف شخصيتك باستخدام 5 إيموجيز واشرحهم.",
    "اتكلم لمدة 20 ثانية من غير ما تستخدم كلمة أنا.",
    "اعمل مقابلة صحفية خيالية مع نفسك."

];


// =====================================
// SCREEN MANAGEMENT
// =====================================

function showScreen(screenId) {

    screens.forEach(screen => {
        screen.classList.add("hidden");
    });

    document.getElementById(screenId).classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================
// TOAST
// =====================================

function showToast(message) {

    toast.textContent = message;

    toast.classList.remove("hidden");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.add("hidden");
    }, 2500);
}


// =====================================
// ADD PLAYER
// =====================================

function addPlayer() {

    const name = playerInput.value.trim();

    if (!name) {
        showToast("اكتب اسم اللاعب الأول!");
        return;
    }

    const exists = players.some(player =>
        player.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        showToast("الاسم ده موجود بالفعل!");
        return;
    }

    if (players.length >= 20) {
        showToast("وصلت للحد الأقصى للاعبين!");
        return;
    }

    players.push(name);

    playerInput.value = "";

    renderPlayers();

    playerInput.focus();
}


// =====================================
// REMOVE PLAYER
// =====================================

function removePlayer(index) {

    const removedPlayer = players[index];

    players.splice(index, 1);

    if (lastPlayer === removedPlayer) {
        lastPlayer = null;
    }

    if (lastJudge === removedPlayer) {
        lastJudge = null;
    }

    renderPlayers();
}


// =====================================
// RENDER PLAYERS
// =====================================

function renderPlayers() {

    playerCount.textContent = players.length;

    startBtn.disabled = players.length < 2;

    if (players.length === 0) {

        playerList.innerHTML = `
            <div class="empty-state">
                <span>👥</span>
                <p>لسه مفيش لاعبين.. ضيف أول لاعب!</p>
            </div>
        `;

        return;
    }

    playerList.innerHTML = "";

    players.forEach((player, index) => {

        const item = document.createElement("div");

        item.className = "player-item";

        const info = document.createElement("div");
        info.className = "player-info";

        const avatar = document.createElement("div");
        avatar.className = "player-avatar";
        avatar.textContent = player.charAt(0);

        const name = document.createElement("span");
        name.textContent = player;

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-player";
        removeBtn.textContent = "×";
        removeBtn.setAttribute("aria-label", "حذف اللاعب");

        removeBtn.addEventListener("click", () => {
            removePlayer(index);
        });

        info.appendChild(avatar);
        info.appendChild(name);

        item.appendChild(info);
        item.appendChild(removeBtn);

        playerList.appendChild(item);

    });

}


// =====================================
// RANDOM PICK
// =====================================

function randomPick(list) {

    const index = Math.floor(Math.random() * list.length);

    return list[index];
}


// =====================================
// PICK PLAYER
// =====================================

function pickPlayer() {

    let availablePlayers = [...players];

    if (
        lastPlayer &&
        availablePlayers.length > 1
    ) {

        availablePlayers = availablePlayers.filter(
            player => player !== lastPlayer
        );

    }

    return randomPick(availablePlayers);
}


// =====================================
// GET RANDOM QUESTION
// =====================================

function getQuestion() {

    if (usedQuestions.length === questions.length) {
        usedQuestions = [];
    }

    const available = questions.filter(
        question => !usedQuestions.includes(question)
    );

    const selected = randomPick(available);

    usedQuestions.push(selected);

    return selected;
}


// =====================================
// GET RANDOM CHALLENGE
// =====================================

function getChallenge() {

    if (usedChallenges.length === challenges.length) {
        usedChallenges = [];
    }

    const available = challenges.filter(
        challenge => !usedChallenges.includes(challenge)
    );

    const selected = randomPick(available);

    usedChallenges.push(selected);

    return selected;
}


// =====================================
// START GAME
// =====================================

function startGame() {

    if (players.length < 2) {
        showToast("لازم يكون فيه لاعبين على الأقل!");
        return;
    }

    currentRound = 0;

    lastPlayer = null;
    lastJudge = null;

    usedQuestions = [];
    usedChallenges = [];

    startNextRound();
}


// =====================================
// NEXT ROUND
// =====================================

function startNextRound() {

    if (players.length < 2) {

        showScreen("home");

        showToast("محتاجين لاعبين على الأقل!");

        return;
    }

    currentRound++;

    document.getElementById("roundNumber").textContent =
        String(currentRound).padStart(2, "0");

    currentPlayer = pickPlayer();

    showScreen("draw");

    drawStatus.textContent = "جاري سحب الاسم...";

    let counter = 0;

    clearInterval(drawTimer);

    drawTimer = setInterval(() => {

        const temporaryPlayer = randomPick(players);

        drawName.textContent = temporaryPlayer;

        counter++;

        if (counter >= 15) {

            clearInterval(drawTimer);

            finishDraw();

        }

    }, 120);

}


// =====================================
// FINISH DRAW
// =====================================

function finishDraw() {

    drawName.textContent = currentPlayer;

    drawStatus.textContent = "الاسم اتسحب! 🔥";

    lastPlayer = currentPlayer;

    setTimeout(() => {

        selectedPlayerName.textContent = currentPlayer;

        questionText.textContent = getQuestion();

        showScreen("question");

    }, 1000);

}


// =====================================
// ANSWER
// =====================================

function answerQuestion() {

    answeredPlayerName.textContent = currentPlayer;

    showScreen("answer");

}


// =====================================
// REFUSE
// =====================================

function refuseQuestion() {

    const availableJudges = players.filter(
        player => player !== currentPlayer
    );

    if (availableJudges.length === 0) {
        showScreen("noJudge");
        return;
    }

    let possibleJudges = [...availableJudges];

    if (
        lastJudge &&
        possibleJudges.length > 1
    ) {
        possibleJudges = possibleJudges.filter(
            player => player !== lastJudge
        );
    }

    currentJudge = randomPick(possibleJudges);
    lastJudge = currentJudge;

    judgeName.textContent = currentJudge;

    challengeText.textContent =
        `${currentPlayer} يختار تحدي مناسب من القائمة بموافقة الحكم.`;

    showScreen("judge");

}


// =====================================
// EVENT LISTENERS
// =====================================

addPlayerBtn.addEventListener("click", addPlayer);

playerInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addPlayer();
    }
});

startBtn.addEventListener("click", startGame);

answerBtn.addEventListener("click", answerQuestion);
refuseBtn.addEventListener("click", refuseQuestion);

function handleNextRound() {

    clearInterval(drawTimer);

    if (players.length < 2) {
        showScreen("home");
        showToast("لازم يكون فيه لاعبين على الأقل!");
        return;
    }

    startNextRound();
}

document.getElementById("nextAfterAnswerBtn")
    .onclick = handleNextRound;

document.getElementById("finishChallengeBtn")
    .onclick = handleNextRound;

document.getElementById("nextNoJudgeBtn")
    .onclick = handleNextRound;


// =====================================
// SOUND & VISUAL EFFECTS
// =====================================

// الصوت بيتولد داخل المتصفح بدون ملفات خارجية.

let gameAudioContext = null;

function playGameSound(type = "tick") {

    try {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!gameAudioContext) {
            gameAudioContext = new AudioContextClass();
        }

        if (gameAudioContext.state === "suspended") {
            gameAudioContext.resume();
        }

        const now = gameAudioContext.currentTime;

        const oscillator = gameAudioContext.createOscillator();
        const gain = gameAudioContext.createGain();

        const sounds = {

            tick: {
                frequency: 520,
                duration: 0.045,
                volume: 0.035,
                wave: "sine"
            },

            reveal: {
                frequency: 880,
                duration: 0.22,
                volume: 0.10,
                wave: "triangle"
            },

            question: {
                frequency: 660,
                duration: 0.18,
                volume: 0.075,
                wave: "sine"
            },

            judge: {
                frequency: 740,
                duration: 0.32,
                volume: 0.09,
                wave: "triangle"
            },

            answer: {
                frequency: 590,
                duration: 0.16,
                volume: 0.07,
                wave: "sine"
            }

        };

        const sound = sounds[type] || sounds.tick;

        oscillator.type = sound.wave;

        oscillator.frequency.setValueAtTime(
            sound.frequency,
            now
        );

        if (type === "reveal" || type === "judge") {

            oscillator.frequency.exponentialRampToValueAtTime(
                sound.frequency * 1.35,
                now + sound.duration
            );

        }

        gain.gain.setValueAtTime(0.0001, now);

        gain.gain.exponentialRampToValueAtTime(
            sound.volume,
            now + 0.015
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + sound.duration
        );

        oscillator.connect(gain);
        gain.connect(gameAudioContext.destination);

        oscillator.start(now);

        oscillator.stop(now + sound.duration + 0.02);

    } catch (error) {

        // لو الصوت غير مدعوم، اللعبة تكمل بشكل طبيعي.

    }

}


// =====================================
// REPLAY ANIMATION
// =====================================

function replayEffect(element, className) {

    if (!element) return;

    element.classList.remove(className);

    void element.offsetWidth;

    element.classList.add(className);

}


// =====================================
// DRAW ANIMATION & SOUND
// =====================================

startNextRound = function () {

    if (players.length < 2) {

        showScreen("home");

        showToast("محتاجين لاعبين على الأقل!");

        return;
    }

    currentRound++;

    document.getElementById("roundNumber").textContent =
        String(currentRound).padStart(2, "0");

    currentPlayer = pickPlayer();

    showScreen("draw");

    drawStatus.textContent = "جاري سحب الاسم...";

    drawName.textContent = "جاهزين؟";

    const drawCard = document.querySelector(".draw-card");

    replayEffect(drawCard, "draw-pulse");

    let counter = 0;

    clearInterval(drawTimer);

    drawTimer = setInterval(() => {

        const temporaryPlayer = randomPick(players);

        drawName.textContent = temporaryPlayer;

        playGameSound("tick");

        replayEffect(drawName, "name-flash");

        counter++;

        if (counter >= 15) {

            clearInterval(drawTimer);

            finishDraw();

        }

    }, 120);

};


// =====================================
// FINAL PLAYER REVEAL
// =====================================

finishDraw = function () {

    drawName.textContent = currentPlayer;

    drawStatus.textContent = "الاسم اتسحب! 🔥";

    lastPlayer = currentPlayer;

    playGameSound("reveal");

    const finalDrawCard = document.querySelector(".draw-card");

    if (finalDrawCard) {
        finalDrawCard.classList.remove("draw-pulse");
    }

    replayEffect(finalDrawCard, "winner-reveal");

    replayEffect(drawName, "winner-name");

    setTimeout(() => {

        selectedPlayerName.textContent = currentPlayer;

        questionText.textContent = getQuestion();

        showScreen("question");

        playGameSound("question");

        replayEffect(
            document.querySelector(".question-card"),
            "card-reveal"
        );

    }, 1000);

};


// =====================================
// ANSWER EFFECT
// =====================================

answerQuestion = function () {

    answeredPlayerName.textContent = currentPlayer;

    showScreen("answer");

    playGameSound("answer");

    replayEffect(
        document.querySelector("#answer .success-icon"),
        "icon-pop"
    );

};


// =====================================
// JUDGE REVEAL
// =====================================

refuseQuestion = function () {

    const availableJudges = players.filter(
        player => player !== currentPlayer
    );

    if (availableJudges.length === 0) {

        showScreen("noJudge");

        return;
    }

    let possibleJudges = [...availableJudges];

    if (lastJudge && possibleJudges.length > 1) {

        possibleJudges = possibleJudges.filter(
            player => player !== lastJudge
        );

    }

    currentJudge = randomPick(possibleJudges);

    lastJudge = currentJudge;

    judgeName.textContent = currentJudge;

    // التحدي يختاره الحكم من القائمة.

    challengeText.textContent = getChallenge();

    showScreen("judge");

    playGameSound("judge");

    replayEffect(
        document.querySelector(".judge-card"),
        "judge-reveal"
    );

    replayEffect(judgeName, "winner-name");

};


// =====================================
// NEW CHALLENGE BUTTON
// =====================================

const newChallengeButton =
    document.getElementById("newChallengeBtn");

if (newChallengeButton) {

    newChallengeButton.addEventListener("click", () => {

        challengeText.textContent = getChallenge();

        playGameSound("question");

        replayEffect(
            document.querySelector(".challenge-card"),
            "card-reveal"
        );

    });

}