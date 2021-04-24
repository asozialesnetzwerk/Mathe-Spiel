const gameEl = document.getElementById("game");
const menuEl = document.getElementById("menu");

const maxTimeMs = 10_000;

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

function writeObjToLocalStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function getArrFromLocalStorage(key) {
    const arr = localStorage.getItem(key);
    if (arr === null) {
        return [];
    }
    const obj = JSON.parse(arr);
    if (Array.isArray(obj)) {
        return obj;
    } else {
        return [];
    }
}

const historyListEl = document.getElementById("history-list");
function displayHistoryList() {
    historyListEl.innerHTML = "";
    const historyArr = getArrFromLocalStorage("history");

    console.log(historyArr);
    for (const problem of historyArr) {
        const li = document.createElement("li");
        const solution = problem.sol;
        const time = Math.round(problem.time ? problem.time : maxTimeMs);
        const score = problem.score ? problem.score : 0;
        const clicked = typeof problem.clicked === "undefined" ? null : problem.ans[problem.clicked];
        const clickedStr = clicked === null ? " - " : `${clicked.calc} = ${clicked.sol}`;

        let colorClass;
        if (problem.score) { // ans was correct:
            colorClass = "green";
        } else {
            colorClass = "red";
        }

        let wrongAnswers = [];
        let correctAns = {};
        for (const ans of problem.ans) {
            if (ans.sol === solution) {
                correctAns = ans;
            } else {
                wrongAnswers.push(`<b class="red">${ans.calc} = ${ans.sol}</b>`);
            }
        }

        li.innerHTML = `<p>
            Aufgabe:           <b>${solution}</b><br>
            Antwort:           <b class="${colorClass}">${clickedStr}</b><br>
            Richtige Antwort:  <b class="green">${correctAns.calc} = ${correctAns.sol}</b><br>
            Falsche Antworten: ${wrongAnswers.join(", ")}<br>
            
            Zeit:              <b class="${time < maxTimeMs ? "green" : "red"}">${time/1000}s</b> / ${maxTimeMs/1000}s<br>
            Punkte:            <b class="${colorClass}">${score}</b><br>
            </p>
        `;

        historyListEl.appendChild(li);
    }
}

displayHistoryList();
