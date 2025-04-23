const COLOR_MODE_ITEM_KEY = "colorMode";
const toggleLabelElement = document.querySelector(".toggle label");
const toggleButtonElement = document.querySelector(".toggle__button");
const darkRadioElement = document.querySelector("#dark");
const lightRadioElement = document.querySelector("#dark");

const radioButtons = document.querySelectorAll("input[name=theme]");

const colorMode = getColorMode();
console.log("localStorage", colorMode);
if (colorMode) {
  if (colorMode === "dark") {
    darkRadioElement.checked = true;
    lightRadioElement.checked = false;
    setDarkMode();
  } else if (colorMode === "light") {
    lightRadioElement.checked = true;
    darkRadioElement.checked = false;
    setLightMode();
  } else {
    setDarkMode();
  }
}

radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", (event) => {
    if (darkRadioElement.checked) {
      setDarkMode();
    } else {
      setLightMode();
    }
  });
});

function getColorMode() {
  return localStorage.getItem(COLOR_MODE_ITEM_KEY);
}
function setColorMode(mode) {
  localStorage.setItem(COLOR_MODE_ITEM_KEY, mode);
}

function setLightMode() {
  document.body.classList = "light";
  toggleLabelElement.textContent = "Dark mode";
  setColorMode("light");

  toggleButtonElement.style.left = "90%";
  toggleButtonElement.style.right = "3px";
  toggleButtonElement.style.transform = "translateX(-90%)";
}
function setDarkMode() {
  document.body.classList = "dark";
  toggleLabelElement.textContent = "Light mode";
  setColorMode("dark");
  toggleButtonElement.style.left = "3px";
  toggleButtonElement.style.right = "9%";
  toggleButtonElement.style.transform = "translateX(-9%)";
}
