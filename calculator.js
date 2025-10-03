const operators = ["+", "-", "*", "/", "ln", "log", "(", ")"]
const priorityList = [
    ["+", 1],
    ["-", 1],
    ["*", 2],
    ["/", 2],
    ["ln", 3],
    ["log", 3],
    ["(", 0],
    [")", 0],
]

function getBaseLog(base, num) {
    return Math.log(num) / Math.log(base);
}

function process(stringExpression) {

    let expression = lex(stringExpression)
    return evaluate(expression)
}

function evaluate(expression) {
    //console.log(expression)
    if (expression.length === 1)
        return expression[0]

    const priority = new Map(priorityList)

    let highestIndex = 0;
    let highestPriority = -1

    for (let i = 0; i < expression.length; i++) {
        const token = expression[i]
        if (priority.get(token) > highestPriority) {
            highestPriority = priority.get(token)
            highestIndex = i
        }

        if (token === "("){
            let end = expression.length - 1
            while (expression[end] !== ")"){
                end--
            }

            return evaluate([...expression.slice(0, i), evaluate(expression.slice(i + 1, end)), ...expression.slice(end + 1)])
        }
    }

    let result
    const operator = expression[highestIndex]

    if (["+", "-", "*", "/"].includes(operator)) {
        switch (operator) {
            case "+":
                result = expression[highestIndex - 1] + expression[highestIndex + 1]
                break

            case "-":
                result = expression[highestIndex - 1] - expression[highestIndex + 1]
                break

            case "/":
                result = expression[highestIndex - 1] / expression[highestIndex + 1]
                break

            case "*":
                result = expression[highestIndex - 1] * expression[highestIndex + 1]
                break
        }

        const newExpression = [...expression.slice(0, highestIndex - 1), result, ...expression.slice(highestIndex + 2)]
        return evaluate(newExpression)
    }
    else if (["ln"].includes(operator)) {
        switch (operator) {
            case "ln":
                result = Math.log(expression[highestIndex + 1])
                break
        }
        const newExpression = [...expression.slice(0, highestIndex), result, ...expression.slice(highestIndex + 2)]
        return evaluate(newExpression)
    }
    else if (["log"].includes(operator)) {
        switch (operator) {
            case "log":
                result = getBaseLog(expression[highestIndex + 1], expression[highestIndex + 2])
                break
        }
        const newExpression = [...expression.slice(0, highestIndex), result, ...expression.slice(highestIndex + 3)]
        return evaluate(newExpression)
    }
}

function lex(string) {
    let expression = []
    let numBuf = ""
    let last = "op"
    let step = 1

    for (let i = 0; i < string.length; i += step) {
        let char = string[i]

        step = 1
        if (char === "_")
            continue

        else if (char === "-" && last === "op"){
            numBuf = "-"
            last = "num"
        }

        else if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", ","].includes(char)) {

            if (last === "op") {
                numBuf = char
                last = "num"
            }
            else {
                numBuf += char
            }
        }
        //dump numbuf at space
        else if (char === " " && last === "num") {
            if (numBuf != "") {
                expression.push(parseFloat(numBuf))
                numBuf = ""
            }

        }
        //match an operator
        else {
            for (let operator of operators) {
                if (i + operator.length > string.length)
                    continue

                if (string.slice(i, i + operator.length) !== operator)
                    continue

                if (numBuf != "") {
                    expression.push(parseFloat(numBuf))
                    numBuf = ""
                }

                step = operator.length
                last = "op"
                expression.push(operator)
                break
            }
        }
    }

    if (numBuf != "")
        expression.push(parseFloat(numBuf))

    return expression
}

function updateValue(value){
    console.log("something");
    
    result.textContent = `Result: ${value}`
}

const result = document.querySelector(".result")

const form = document.querySelector("form")
const input = form.querySelector("input")
input.addEventListener("input", () => {updateValue(process(input.value))})