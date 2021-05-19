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

  // Update step counter
  const stepCounter = document.getElementById("step-counter");
  stepCounter.innerText = `${stepNumber + 1}/${steps.length}`;

  currentStep = stepNumber;
  updateArrowVisibility();
}

function nextStep() {
  if (currentStep >= getMaxSteps() - 1) return;

  currentStep++;
  setStep(currentStep);
  history.pushState({ step: currentStep }, null, "form.html");
}

function prevStep() {}

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

function registerArrowButtons() {
  const backArrow = document.getElementById("back-arrow");
  backArrow.addEventListener("click", () => history.back());

  const forwardArrow = document.getElementById("forward-arrow");
  forwardArrow.addEventListener("click", nextStep);

  updateArrowVisibility();
}

function updateArrowVisibility() {
  const bArrow = document.getElementById("back-arrow");
  if (currentStep < 1) bArrow.style.visibility = "hidden";
  else bArrow.style.visibility = "visible";

  const fArrow = document.getElementById("forward-arrow");
  if (currentStep >= getMaxSteps() - 1) {
    fArrow.style.visibility = "hidden";
  } else fArrow.style.visibility = "visible";
}

function getMaxSteps() {
  return document.querySelectorAll(".step").length;
}

window.addEventListener("load", () => {
  registerFormButtons();
  registerSliders();
  setStep(currentStep);
  registerArrowButtons();
  history.replaceState({ step: currentStep }, null, "form.html");
});

window.onpopstate = (event) => {
  if (event.state) {
    const { step } = event.state;
    if (step !== null && step !== undefined) setStep(step);
  } else {
    setStep(0);
  }
};
