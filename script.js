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

  // Update progress bar
  const completePercentage = ((stepNumber + 1) / steps.length) * 100;
  const progressElem = document.getElementById("progress-bar");
  progressElem.style.width = `${completePercentage}%`;

  currentStep = stepNumber;
}

function nextStep() {
  const steps = document.querySelectorAll(".step");
  if (currentStep >= steps.length - 1) return;

  currentStep++;
  setStep(currentStep);
  history.pushState({ step: currentStep }, null, "form.html");
}

// Register events on all form-buttons
function registerFormButtons() {
  const btns = document.querySelectorAll(".form-button");

  btns.forEach((btnElem) => {
    btnElem.addEventListener("click", nextStep);
  });
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
  history.replaceState({ step: currentStep }, null, "form.html");
});

window.onpopstate = (event) => {
  if (event.state) {
    console.log("Push state/replaceState", event.state);
    const { step } = event.state;
    if (step !== null && step !== undefined) setStep(step);
  } else {
    setStep(0);
  }
};
