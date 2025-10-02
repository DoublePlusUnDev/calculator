function process(stringExpression){
    
    let expression = parse(stringExpression)
    console.log(expression)
}

function parse(stringExpression){
    let expression = []
    let numBuf = ""
    let last = "op"
    let step = 1

    for (let i = 0; i < stringExpression.length; i += step) {
        char = stringExpression[i]
        step = 1
        if (char in [" ", "_"])
            continue

        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char)){

            if (last === "op"){
                numBuf = char
                last = "num"
            }
            else{
                numBuf += char
            }
        }
        else{
            for (operator of ["+", "-", "*", "/", "log", "(", ")"]){
                if (i + operator.length > stringExpression.length)
                     continue
                
                if (stringExpression.slice(i, i + operator.length) !== operator)
                    continue

                if (numBuf != "") {
                    expression.push(numBuf)
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
        expression.push(numBuf)

    return expression
}

process("5 + 4 + log(4+7)")