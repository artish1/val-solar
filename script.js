let currentStep = 0;

function setStep(stepNumber) {
  const steps = document.querySelectorAll(".step");

  if (stepNumber >= steps.length) return;

  // Hide all other steps
  steps.forEach((stepElem, index) => {
    if (index !== stepNumber) stepElem.style.display = "none";
  });

  // show step
  steps[stepNumber].style.display = "block";
}

function nextStep() {
  currentStep++;
  setStep(currentStep);
}

// Register events on all form-buttons
function registerFormButtons() {
  const btns = document.querySelectorAll(".form-button");

  btns.forEach((btnElem) => {
    btnElem.addEventListener("click", nextStep);
  });
  for (let i = 0; i < btns.length; i++) {}
}

//-------------------- Sliders --------------------
function registerSliders() {
  const electricBillSlider = document.querySelector("#electricBillSlider");
  const electricBillDisplay = document.querySelector("#electricBillDisplay");
  electricBillSlider.addEventListener("input", (e) => {
    const val = electricBillSlider.value;
    electricBillDisplay.textContent = `$${val}`;
  });
}

window.addEventListener("load", () => {
  registerFormButtons();
  registerSliders();
  setStep(currentStep);
});
