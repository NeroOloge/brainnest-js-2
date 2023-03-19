const firstValueContainer = document.getElementById("first-value");
const firstOperatorContainer = document.getElementById("first-operator");
const secondValueContainer = document.getElementById("second-value");
const buttons = document.getElementById("buttons").children;
let firstValue;
let secondValue;
let firstOperator;
let error = false;

window.addEventListener("keyup", function (e) {
  if (e.code.startsWith("Digit") && e.shiftKey === false) {
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
  } else if (firstOperator !== undefined) {
    if (secondValue === undefined) {
      secondValue = value;
    } else {
      secondValue += value;
    }
  }
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
    updateDisplay();
  }
}

function inputDot() {
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
    updateDisplay();
  }
}

function backspace() {
  if (secondValue !== undefined) {
    secondValue = secondValue.slice(0, secondValue.length - 1);
    if (secondValue === "") secondValue = undefined;
  } else if (firstOperator !== undefined) {
    firstOperator = undefined;
  } else if (firstValue !== undefined) {
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
}

function displayError() {
  clearCurrentHistory();
  firstOperator = "Error can't divide by 0";
  error = true;
  updateDisplay();
  firstOperator = undefined;
}

function clearDisplay() {
  clearCurrentHistory();
  updateDisplay();
  error = false;
}

function updateDisplay() {
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
  firstValue = solution;
  secondValue = undefined;
  firstOperator = undefined;
  updateDisplay();
}

function sanitizeOutput(output) {
  // convert number to precision string of 9 s.f.
  // and split all characters into array
  const outputValue = output.toPrecision(9).split("");
  // if value includes e, i.e: exponent
  if (outputValue.includes("e")) {
    let [value, exp] = outputValue.join("").split("e");
    // remove zeroes from value
    // function `removeInSignificantZeroes` works with arrays
    // so value has to be split
    value = removeInSignificantZeroes(value.split(""));
    // then join value into string and combine with exp
    return `${value.join("")}e${exp}`;
  }
  // if value is whole number return
  if (!outputValue.includes(".")) return outputValue.join("");
  // remove insignificant zeroes from decimal value
  removeInSignificantZeroes(outputValue);
  return outputValue.join("");
}

// removes extra zeroes from value which is a splitted string
function removeInSignificantZeroes(value) {
  for (let i = value.length - 1; i >= 0; i--) {
    if (value[i] == 0) value.splice(i, 1);
    else break;
  }
  if (value[value.length - 1] === ".") value.splice(value.length - 1, 1);
  return value;
}
