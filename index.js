let inputField = document.getElementById("inputField");
const buttons = document.querySelectorAll(".btn");
const operators = document.querySelectorAll(".operator");
const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const backspaceButton = document.getElementById("backspace");

function precedence(op) {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    if (op === '^') return 3;
    return 0;
}

function applyOp(a, b, op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        case '^': return Math.pow(a, b);
    }
}

function calculate(expression) {
    let values = [];
    let ops = [];

    for (let i = 0; i < expression.length; i++) {
        let ch = expression[i];

        if (ch === ' ') continue;

        // Unary minus
        if (ch === '-' && (i === 0 || "()+-*/^".includes(expression[i-1]))) {
            let j = i + 1;
            while (j < expression.length && (!isNaN(expression[j]) || expression[j] === '.')) j++;
            let val = parseFloat(expression.slice(i, j));
            values.push(val);
            i = j - 1;
            continue;
        }

        // Implicit multiplication
        if (i > 0) {
            let prev = expression[i - 1];

            if (
                // number or ')' before
                (!isNaN(prev) || prev === ')') &&
                // '(' or number after
                (ch === '(' || !isNaN(ch))
            ) {
                while (ops.length && precedence(ops[ops.length-1]) >= precedence('*')) {
                    let b = values.pop();
                    let a = values.pop();
                    let op = ops.pop();
                    values.push(applyOp(a, b, op));
                }
                ops.push('*');
            }
        }

        // Number
        if (!isNaN(ch) || ch === '.') {
            let val = 0;
            let frac = 1;
            let decimal = false;
            while (i < expression.length && (!isNaN(expression[i]) || expression[i] === '.')) {
                if (expression[i] === '.') decimal = true;
                else if (!decimal) val = val * 10 + (expression[i]-'0');
                else { frac /= 10; val += (expression[i]-'0')*frac; }
                i++;
            }
            values.push(val);
            i--;
        }

        // '('
        else if (ch === '(') {
            ops.push(ch);
        }

        // ')'
        else if (ch === ')') {
            while (ops.length && ops[ops.length-1] !== '(') {
                let b = values.pop();
                let a = values.pop();
                let op = ops.pop();
                values.push(applyOp(a, b, op));
            }
            ops.pop();
        }

        // Percentage
        else if (ch === '%') {
            let val = values.pop();
            values.push(val / 100);

            if (
                i + 1 < expr.length &&
                (/\d/.test(expr[i + 1]) || expr[i + 1] === '(')
            ) {
                operators.push('*');
            }
        }


        else {
            while (ops.length && precedence(ops[ops.length-1]) >= precedence(ch)) {
                let b = values.pop();
                let a = values.pop();
                let op = ops.pop();
                values.push(applyOp(a, b, op));
            }
            ops.push(ch);
        }
    }

    while (ops.length) {
        let b = values.pop();
        let a = values.pop();
        let op = ops.pop();
        values.push(applyOp(a, b, op));
    }

    return values[0];
}

function calculator(button){
    if (button.id === "clear") {
            inputField.value = "";
            console.log("Clear button clicked");
        } 
        else if (button.id === "equals") {
               try {
                // 1. Calculate the result FIRST
                const result = calculate(inputField.value);
                
                console.log(`Result: ${result}`);
                
                // 3. Update the display
                inputField.value = result;
                } catch (error) {
                    console.error("Math Error:", error);
                    inputField.value = "Error";
                }
            }
            else if(button.id === "%"){
                inputField.value += "%";
                console.log(`Button ${button.id} clicked`);
            }
            else{
                inputField.value += button.id;
                console.log(`Button ${button.id} clicked`);
            }
}
buttons.forEach(button => {
    button.addEventListener("click", () => {
        calculator(button);
        }
    );
});

document.addEventListener("keydown", (event) => {
   event.preventDefault();
    if (event.key === "Enter") {
         // Prevents accidental form submissions
        const equalsBtn = document.getElementById("equals");
        calculator(equalsBtn);
        return;
    }

    // 2. Handle "Escape" as clear
    if (event.key === "Escape") {
        const clearBtn = document.getElementById("clear");
        calculator(clearBtn);
        return;
    }

    // 3. Handle "Backspace" 
    if (event.key === "Backspace") {
        inputField.value = inputField.value.slice(0, -1);
        return;
    }

    // 4. Handle numbers and operators
    buttons.forEach(button => {
        if (event.key === button.id) {
            calculator(button);
        }
  
        
    });
});



