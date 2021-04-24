const gameEl = document.getElementById("game");
const menuEl = document.getElementById("menu");


function toggleVisibility(showGame) {
    if (showGame) {
        gameEl.style.display = "flex";
        menuEl.style.display = "none";
    } else {
        gameEl.style.display = "none";
        menuEl.style.display = "flex";
    }
}

function now() {
    return window.performance.now();
}

function getIntFromLocalStorage(key) {
    const num = localStorage.getItem(key);
    return num === null ? 0 : Number.parseInt(num);
}


const scoreEls = document.getElementsByClassName("normal-score");
const highScoreEls = document.getElementsByClassName("highscore");
function displayScore(score) {
    for (const scoreEl of scoreEls) {
        scoreEl.innerHTML = " " + score;
    }
    const highscore = getIntFromLocalStorage("highscore");
    for (const highscoreEl of highScoreEls) {
        highscoreEl.innerHTML = " " + highscore;
    }
}

displayScore(getIntFromLocalStorage("score"));
