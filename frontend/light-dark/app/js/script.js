const COLOR_MODE_ITEM_KEY = "colorMode";
const toggleLabelElement = document.querySelector(".toggle label");
const darkRadioElement = document.querySelector("#dark");
const radioButtons = document.querySelectorAll("input[name=theme]");

radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", (event) => {
    if (darkRadioElement.checked) {
      document.body.classList = "dark";
      toggleLabelElement.textContent = "Light mode";
      setColorMode("dark");
    } else {
      document.body.classList = "light";
      toggleLabelElement.textContent = "Dark mode";
      setColorMode("light");
    }
  });
});

function getColorMode() {
  return localStorage.getItem(COLOR_MODE_ITEM_KEY);
}
function setColorMode(mode) {
  localStorage.setItem(COLOR_MODE_ITEM_KEY, mode);
}
