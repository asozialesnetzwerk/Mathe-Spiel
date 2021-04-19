const problem = document.getElementById("problem");
const fields = document.getElementsByClassName("field");

function createProblems() {
    const obj = {};
}

//problem obj: {calc:["1", "+|-|*|/", "2"],number:69}
function createProblemObj(solution) {
    const obj = {calc:[]};
    const opIndex = Math.floor(Math.random() * 4);
}

const reversedOperators = ["-", "+", "/", "*"];
const operators = ["+", "-", "*", "/"];
function getRandomOperator() {
    return operators[Math.floor(Math.random() * 4)];
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

// returns arr of 2 numbers
function createCalculationNumbers(solution, operatorIndex) {
    const operator = reversedOperators[operatorIndex];
    const n2 = getRandomInt();
    const n1 = calculateOperation(solution, n2, operator).sol;

    if (Math.floor(n1) !== n1) return createCalculationNumbers(solution, operatorIndex);

    return [n1, n2];
}


function getRandomInt() {
    // between -150 and 150 without 0!!
    let rand = Math.floor(Math.random() * 150) + 1;
    return Math.random() >= 0.5 ? rand : -1 * rand;
}

function replaceStringAndOperator(str) {
    return str.replace("+-", "-").replace("--", "+")
}

const count  = 1_000_000;
for (let j = 0; j < 4; j++) {
    const time = performance.now();
    for (let i = 0; i < count; i++) {
        const solution = getRandomInt();
        const arr = createCalculationNumbers(solution, j);
        //console.log(arr[0] + replaceStringAndOperator(operators[j] + arr[1]) + "=" + solution)
    }
    console.log(operators[j] + ": " + ((performance.now() - time)/count));
}
