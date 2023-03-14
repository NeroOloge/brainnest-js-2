// const displayContainer = document.getElementById("display").children[0];
const firstValueContainer = document.getElementById("first-value");
const firstOperatorContainer = document.getElementById("first-operator");
const secondValueContainer = document.getElementById("second-value");
const buttons = document.getElementById("buttons").children;
// let display = "";
let firstValue;
let secondValue;
let firstOperator;
let error = false;
// let secondOperator;

window.addEventListener("keyup", function (e) {
  if (e.code.startsWith("Digit") && e.key !== "*") {
    inputValue(e.key);
  } else if (e.key === "-") {
    inputOperator("-");
  } else if (e.key === "+") {
    inputOperator("+");
  } else if (e.key === "/") {
    inputOperator("/");
  } else if (e.key === "*") {
    inputOperator("*");
  } else if (e.key === "Enter" || e.key === "=") {
    equals();
  } else if (e.key === ".") {
    inputDot();
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "%") {
    inputPercent();
  } else if (e.code === "KeyC") {
    clearDisplay();
  }
});

for (const button of buttons) {
  button.addEventListener("click", function () {
    if (button.classList.value === "operator") {
      inputOperator(button.id);
    } else if (button.classList.value === "operand") {
      inputValue(button.id);
    } else if (button.id === "equals") {
      equals();
    }
  });
}

function inputValue(value) {
  if (value === ".") {
    inputDot();
    return;
  }
  if (value === "%") {
    inputPercent();
    return;
  }
  if (firstOperator === undefined) {
    if (firstValue === undefined) {
      firstValue = value;
    } else {
      firstValue += value;
    }
    error = false;
    // display += value;
  } else if (firstOperator !== undefined) {
    if (secondValue === undefined) {
      secondValue = value;
    } else {
      secondValue += value;
    }
    // display += value;
  }
  console.log(value);
  updateDisplay();
}

function inputOperator(operator) {
  if (operator === "clear") {
    clearDisplay();
    return;
  } else if (operator === "backspace") {
    backspace();
    return;
  }
  if (firstValue === undefined) {
    if (operator === "-") {
      firstValue = "-";
      updateDisplay();
    }
    return;
    // prevents from entering operator if first value contains only '-'
  } else if (!isNaN(parseInt(firstValue)) && secondValue === undefined) {
    if (operator === "-" && firstOperator !== undefined) {
      secondValue = "-";
      updateDisplay();
      return;
    }
    firstOperator = operator;
    // display += `${firstOperator}`;
    // console.log(display);
    updateDisplay();
  } else if (secondValue !== undefined) {
    const tempSolution = operate(
      firstOperator,
      parseFloat(firstValue),
      parseFloat(secondValue)
    );
    if (error) return;
    secondValue = undefined;
    firstValue = tempSolution;
    firstOperator = operator;
    // display = `${tempSolution}${operator}`;
    updateDisplay();
  }
}

function inputDot() {
  console.log(".");
  if (firstOperator === undefined) {
    if (firstValue === undefined) firstValue = "0.";
    else {
      if (firstValue.includes(".")) return;
      firstValue += ".";
    }
  } else if (firstOperator !== undefined) {
    if (secondValue === undefined) secondValue = "0.";
    else {
      if (secondValue.includes(".")) return;
      secondValue += ".";
    }
  }
  updateDisplay();
}

function inputPercent() {
  console.log("%");
  if (secondValue === undefined && firstOperator === undefined) {
    if (firstValue !== undefined && !isNaN(parseFloat(firstValue))) {
      firstValue = firstValue / 100;
      updateDisplay();
    }
  } else {
    const tempSolution = operate(
      firstOperator,
      parseFloat(firstValue),
      parseFloat(secondValue) / 100
    );
    if (error) return;
    secondValue = undefined;
    firstValue = tempSolution;
    firstOperator = undefined;
    // display = `${tempSolution}${operator}`;
    updateDisplay();
  }
}

function backspace() {
  console.log("back");
  if (secondValue !== undefined) {
    secondValue = secondValue.slice(0, secondValue.length - 1);
    if (secondValue === "") secondValue = undefined;
  } else if (firstOperator !== undefined) {
    firstOperator = undefined;
  } else if (firstValue !== undefined) {
    console.log(firstValue);
    firstValue = firstValue.slice(0, firstValue.length - 1);
    if (firstValue === "") firstValue = undefined;
  }
  updateDisplay();
  error = false;
}

function operate(operator, num1, num2) {
  if (operator === "+") {
    return sanitizeOutput(num1 + num2);
  } else if (operator === "-") return sanitizeOutput(num1 - num2);
  else if (operator === "/") {
    if (num2 === 0) {
      displayError();
      return;
    }
    return sanitizeOutput(num1 / num2);
  } else if (operator === "*") return sanitizeOutput(num1 * num2);
  else return "Invalid operator";
}

function clearCurrentHistory() {
  firstValue = undefined;
  secondValue = undefined;
  firstOperator = undefined;
  // secondOperator = undefined;
}

function displayError() {
  clearCurrentHistory();
  firstOperator = "Error can't divide by 0";
  error = true;
  updateDisplay();
  firstOperator = undefined;
}

function clearDisplay() {
  // display = "";
  clearCurrentHistory();
  updateDisplay();
  error = false;
}

function updateDisplay() {
  // displayContainer.textContent = display;
  firstOperatorContainer.textContent =
    firstOperator !== undefined ? firstOperator : "";
  firstValueContainer.textContent = firstValue !== undefined ? firstValue : "";
  secondValueContainer.textContent =
    secondValue !== undefined ? secondValue : "";
}

function equals() {
  if (
    firstValue === undefined ||
    secondValue === undefined ||
    firstOperator === undefined
  ) {
    return;
  }
  const solution = operate(
    firstOperator,
    parseFloat(firstValue),
    parseFloat(secondValue)
  );
  if (error) return;
  // clearCurrentHistory();
  // display = solution;
  firstValue = solution;
  secondValue = undefined;
  firstOperator = undefined;
  updateDisplay();
  // display = "";
}

function sanitizeOutput(output) {
  const outputValue = output.toPrecision(9).split("");
  // console.log(outputValue.split(""));
  for (let i = outputValue.length - 1; i >= 0; i--) {
    if (outputValue[i] == 0) outputValue.splice(i, 1);
    else break;
  }
  if (outputValue[outputValue.length - 1] === ".")
    outputValue.splice(outputValue.length - 1, 1);
  return outputValue.join("");
}
