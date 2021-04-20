const problemEl = document.getElementById("problem");
const fields = document.getElementsByClassName("field");

const reversedOperators = ["-", "+", "/", "*"];
const operators = ["+", "-", "*", "/"];

function clickedRight(problem, i, time) {
    console.log(problem, problem.ans[i], time + "ms");
    displayRandomProblem();
}

function clickedWrong(problem, i, time) {
    console.error(problem, problem.ans[i], time + "ms");
    toggleVisibility(false);
}

function displayRandomProblem() {
    const problem = createProblem();
    const time = now();

    problemEl.innerHTML = problem.sol;
    for (let i = 0; i < problem.ans.length; i++) {
        fields[i].innerHTML = problem.ans[i].calc;
        fields[i].onclick = () => {
            if (problem.ans[i].sol === problem.sol) {
                clickedRight(problem, i, now() - time);
            } else {
                clickedWrong(problem, i, now() - time);
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

// returns arr of 2 numbers with operator in between
function createCalculationArr(solution, operatorIndex) {
    // if operator index is defined use it else use random one
    operatorIndex = operatorIndex ? operatorIndex :  Math.floor(Math.random() * 4);

    const operator = reversedOperators[operatorIndex];
    // if multiply n2 has to be smaller or equal than the solution, else it isn't important (halves the average time needed)
    const n2 = getRandomInt(operatorIndex === 2 ? solution : false);
    const n1 = calculateOperation(solution, n2, operator).sol;

    if (Math.floor(n1) !== n1) {
        //happens about 17.5% of the time with multiplication
        return createCalculationArr(solution, operatorIndex);
    }

    console.log(solution, n1, n2, operatorIndex);
    return [n1, operators[operatorIndex], n2];
}

function getRandomInt(max) {
    max = max ? Math.abs(max) : 150; // defaults to 150
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
