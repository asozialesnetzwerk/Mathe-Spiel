const problemEl = document.getElementById("problem");
const scoreEl = document.getElementById("score");
const fields = document.getElementsByClassName("field");
const progressbar = document.getElementById("progressbar");

const reversedOperators = ["-", "+", "/", "*"];
const operators = ["+", "-", "*", "/"];
const maxTimeMs = 20_000;

let history;
let score;
function startGame() {
    score = 0;
    history = [];

    displayScore();
    startUpdatingProgressbar();
    toggleVisibility(true);
    displayRandomProblem();
}

let startTime = now();
function resetStartTime() {
    startTime = now();
    return startTime;
}

function updateProgressbar() {
    const percentage = Math.max(0.1, Math.min(100, 100 * ((now() - startTime)/maxTimeMs)));
    progressbar.style.width =  percentage + "%";
    if (percentage === 100) {
        timeExpired();
    }
}

let intervalNum;
function startUpdatingProgressbar() {
    if (intervalNum) stopUpdatingProgressbar();
    intervalNum = window.setInterval(updateProgressbar, 50);
}
function stopUpdatingProgressbar() {
    if (intervalNum) {
        window.clearInterval(intervalNum);
        intervalNum = false;
    }
}

function displayScore() {
    scoreEl.innerHTML = " " + score;
}

function clickedRight(problem, i) {
    console.log(problem, problem.ans[i], problem.time + "ms");
    displayRandomProblem();
    score++;
    displayScore();
}

function clickedWrong(problem, i) {
    console.error(problem, problem.ans[i], problem.time + "ms");
    lost(`"${problem.ans[i].calc}" ist falsch. "${getCorrect(problem).calc}" wäre richtig gewesen, da es ${problem.sol} ist.`);
}
function timeExpired() {
    lost("Zeit abgelaufen.");
}
function lost(reason) {
    toggleVisibility(false);
    stopUpdatingProgressbar();

    if (!reason) return;

    console.log(reason);
    console.log(history)
}

function displayRandomProblem() {
    const problem = createProblem();
    const time = resetStartTime();

    problemEl.innerHTML = problem.sol;
    for (let i = 0; i < problem.ans.length; i++) {
        fields[i].innerHTML = problem.ans[i].calc;
        fields[i].onclick = () => {
            problem.time = now() - time;
            problem.clicked = i;
            history.push(problem);
            if (problem.time > maxTimeMs) {
                timeExpired();
                return;
            }
            if (problem.ans[i].sol === problem.sol) {
                clickedRight(problem, i);
            } else {
                clickedWrong(problem, i);
            }
        }
    }
}

function createProblem() {
    const obj = {ans:[], sol:getRandomInt()};

    obj.ans[0] = createAnsObj(obj.sol);
    for (let i = 1; i < fields.length; i++) { // starts at 1
        let num = 0;
        while (num === 0) {
            num = getRandomInt(30) + obj.sol;
        }
        obj.ans[i] = createAnsObj(num);
    }
    shuffleArr(obj.ans);

    return obj;
}
function getCorrect(problem) {
    for (const ans of problem.ans) {
        if (ans.sol === problem.sol) {
            return ans;
        }
    }
}

function shuffleArr(arr) {
    for (let i = 0; i < arr.length; i++) {
        let rI = Math.floor(Math.random() * arr.length);
        if (rI !== i) {
            let tmp = arr[i];
            arr[i] = arr[rI];
            arr[rI] = tmp;
        }
    }
}

function createAnsObj(solution) {
    const obj = {sol:solution}; //ans obj: {calc:"1 * 2",sol:69}

    const calcArr = createCalculationArr(solution);

    if (Math.random() > 0.69) {
        let i = Math.random() >= 0.5 ? 0 : 2; // index of calc arr
        const calcArr2 = createCalculationArr(calcArr[i]);
        calcArr[i] = "%s"; // placeholder

        obj.calc = calcArr.join(" ").replace("%s", "(" + calcArr2.join(" ") + ")")


    } else {
        obj.calc = calcArr.join(" ");
    }

    obj.calc = replaceStringAndOperator(obj.calc);

    return obj;
}

function replaceStringAndOperator(str) {
    return str.replaceAll("+ -", "- ").replaceAll("- -", "+ ")
}

function calculateOperation(n1, n2, op) {
    const obj={n1:n1, op:op, n2:n2};
    switch (op) {
        case "+": {
            obj.sol = n1 + n2;
            break;
        }
        case "-": {
            obj.sol = n1 - n2;
            break;
        }
        case "*": {
            obj.sol = n1 * n2;
            break;
        }
        case "/": {
            obj.sol = n1 / n2;
            break;
        }
        default: {
            obj.op = "+";
            obj.sol = n1 + n2;
        }
    }
    return obj;
}

function getMaxForRandom(operatorIndex, solution) {
    switch (operatorIndex) {
        // if multiply n2 has to be smaller or equal than the solution, else it isn't important (halves the average time needed)
        case 2: return solution;
        // if division everything above is too complicated:
        case 3: return 15;
        // otherwise the default specified in the getRandomInt function is used
        default: return false;
    }
}

// returns arr of 2 numbers with operator in between
function createCalculationArr(solution, operatorIndex) {
    // if operator index is defined use it else use random one
    operatorIndex = operatorIndex ? operatorIndex :  Math.floor(Math.random() * 4);

    const operator = reversedOperators[operatorIndex];
    const n2 = getRandomInt(getMaxForRandom(operatorIndex, solution));
    const n1 = calculateOperation(solution, n2, operator).sol;

    if (Math.floor(n1) !== n1) {
        //happens about 17.5% of the time with multiplication
        return createCalculationArr(solution, operatorIndex);
    }

    console.log(solution, n1, n2, operatorIndex);
    return [n1, operators[operatorIndex], n2];
}

function getRandomInt(max) {
    max = max ? Math.abs(max) : 42 + score; // defaults to 42 + 2 * score
    // between -max and max without 0!!
    let rand = Math.floor(Math.random() * max) + 1;
    return Math.random() >= 0.5 ? rand : -1 * rand;
}

/* //benchmarking calculation creation:
const count  = 10_000_000;
for (let j = 0; j < 4; j++) {
    const time = performance.now();
    for (let i = 0; i < count; i++) {
        const solution = getRandomInt();
        const arr = createCalculationArr(solution, j);
        //console.log(arr[0] + replaceStringAndOperator(operators[j] + arr[1]) + "=" + solution)
    }
    console.log(operators[j] + ": " + ((performance.now() - time)/count));
}*/
