const resultSpanEl = document.getElementById('result');
const lengthInputEl = document.getElementById('password-length');
const uppercaseInputChEl = document.getElementById('uppercase');
const lowercaseInputChEl = document.getElementById('lowercase');
const numbersInputChEl = document.getElementById('numbers');
const symbolsInputChEl = document.getElementById('symbols');
const generateBtnEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');

const randomFn = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

const generatePassword = (length, lower, upper, number, symbol) => {
  let generatedPassword = '';

  const typesCount = lower + upper + number + symbol;
  if (typesCount === 0) return '';

  const typesArray = [{ lower }, { upper }, { number }, { symbol }]
    .sort(() => Math.random() - 0.5)
    .filter((item) => Object.values(item)[0]);

  for (let i = 0; i < length; i += typesCount) {
    typesArray.forEach((type) => {
      const fnName = Object.keys(type)[0];
      generatedPassword += randomFn[fnName]();
    });
  }

  const finalPassword = generatedPassword.slice(0, length);

  return finalPassword;
};

clipboardEl.addEventListener('click', () => {
  const textareaEl = document.createElement('textarea');
  const password = resultSpanEl.textContent;

  if (!password) return '';

  textareaEl.value = password;
  document.body.appendChild(textareaEl);
  textareaEl.select();
  document.execCommand('copy');
  textareaEl.remove();
  alert(`Password copied! -| ${password} |-`);
});

generateBtnEl.addEventListener('click', (ev) => {
  const length = +lengthInputEl.value;
  const hasLower = lowercaseInputChEl.checked;
  const hasUpper = uppercaseInputChEl.checked;
  const hasNumber = numbersInputChEl.checked;
  const hasSymbol = symbolsInputChEl.checked;

  resultSpanEl.textContent = generatePassword(
    length,
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol
  );
});

function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  // a97-z122
}
function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  // a65
}
function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
  // a65
}
function getRandomSymbol() {
  const symbols = '!@#$%&/(){}[]<>=,./^';
  return symbols[Math.floor(Math.random() * symbols.length)];
}
