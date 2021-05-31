import { setField, store } from "./store.js";

const API_ENDPOINT = "https://api.ca-energy.org";

let currentStep = 0;
let submitted = false;

function setStep(stepNumber) {
  const finishedElem = document.querySelector(".finished");
  hide(finishedElem);
  // don't show steps when already submitted
  if (submitted) return;

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

function hideAllSteps() {
  const steps = document.querySelectorAll(".step");

  steps.forEach((stepElem) => {
    stepElem.style.display = "none";
  });
}

function nextStep() {
  if (currentStep >= getMaxSteps() - 1) return;

  currentStep++;
  setStep(currentStep);
  history.pushState({ step: currentStep }, null, "form.html");
}

// Register events on all form-buttons
function registerFormButtons() {
  const btns = document.querySelectorAll(".form-button");

  btns.forEach((btnElem) => {
    btnElem.addEventListener("click", () => {
      if (!btnElem.classList.contains("unqualified-button")) nextStep();
    });
  });

  const answerBtns = document.querySelectorAll(".answer-button");
  answerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stepValue = btn.innerText.trim();
      const fieldName = btn.parentElement.getAttribute("propName");
      setField(fieldName, stepValue);
    });
  });

  const unqualified = document.querySelectorAll(".unqualified-button");
  unqualified.forEach((btn) => {
    btn.addEventListener("click", () => {
      hideAllSteps();
      submitted = true;
      // Reset navigation state
      history.go((currentStep - 1) * -1);
      updateArrowVisibility();
      const stepController = document.querySelector(".step-controller");
      hide(stepController);
      showUnqualified();
    });
  });

  // -- continues
  const continueBtns = document.querySelectorAll(".continue-button");
  continueBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stepValue = document.getElementById(btn.getAttribute("for")).value;
      const fieldName = btn.parentElement.getAttribute("propName");
      setField(fieldName, stepValue);
    });
  });

  const finalBtn = document.querySelectorAll(".final-button");
  finalBtn.forEach((btn) =>
    btn.addEventListener("click", () => {
      const fNameElem = document.getElementById("first-name");
      const lNameElem = document.getElementById("last-name");
      const phoneElem = document.getElementById("phone-number");

      setField("firstname", fNameElem.value);
      setField("lastname", lNameElem.value);
      setField("phone", phoneElem.value);

      submit();
    })
  );
}

//-------------------- Sliders --------------------
function registerSliders() {
  const monthly_electric_bill = document.querySelector(
    "#monthly_electric_bill"
  );
  const electricBillDisplay = document.querySelector("#electricBillDisplay");
  monthly_electric_bill.addEventListener("input", () => {
    const val = monthly_electric_bill.value;
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
  if (currentStep < 1 || submitted) bArrow.style.visibility = "hidden";
  else bArrow.style.visibility = "visible";

  const fArrow = document.getElementById("forward-arrow");
  if (currentStep >= getMaxSteps() - 1 || submitted) {
    fArrow.style.visibility = "hidden";
  } else fArrow.style.visibility = "visible";
}

function getMaxSteps() {
  return document.querySelectorAll(".step").length;
}

async function submit() {
  const finishedElem = document.querySelector(".finished");
  const loadingIcon = document.querySelector(".loading-icon");
  const success = document.getElementById("success");
  const error = document.getElementById("error");

  // Hide all steps
  hideAllSteps();

  // show loading
  show(finishedElem);

  // send request
  const response = await fetch(`${API_ENDPOINT}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(store),
  }).catch((err) => console.log("Error: ", err));

  // Hide loading
  hide(loadingIcon);

  if (!response) {
    setErrorMessage("Connection refused. Server might be down");
    show(error);
    return;
  }

  if (response.status === 200 || response.status === 201) {
    show(success);
    submitted = true;
    // Reset navigation state
    history.go((getMaxSteps() - 1) * -1);
    updateArrowVisibility();
    const stepController = document.querySelector(".step-controller");
    hide(stepController);
  } else {
    const errorObj = await response.json();
    if (errorObj) setErrorMessage(errorObj.msg);
    show(error);
  }
}

function hide(element) {
  element.classList.add("hidden");
}

function show(element) {
  element.classList.remove("hidden");
}

function setErrorMessage(msg) {
  error.getElementsByTagName("p").item(0).innerText = msg;
}

function syncBillSlider() {
  const slider = document.getElementById("monthly_electric_bill");
  const electricBillDisplay = document.querySelector("#electricBillDisplay");
  electricBillDisplay.textContent = `$${slider.value}`;
}

function showUnqualified() {
  const el = document.getElementById("unqualified");
  const steps = document.querySelector(".step-container");
  const progress = document.querySelector("#progress-bar");
  hide(steps);
  show(el);
  hide(progress);
  const container = document.querySelector(".container");
  container.classList.add("center");
}

function initMap() {
  const input = document.getElementById("address");
  const center = { lat: 38.664, lng: -121.36035 };
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["address_components", "icon", "name"],
    origin: center,
    strictBounds: false,
  };
  const autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.setFields(["place_id", "geometry", "name"]);
}

window.addEventListener("load", () => {
  registerFormButtons();
  registerSliders();
  setStep(currentStep);
  // hideAllSteps();
  registerArrowButtons();
  initMap();
  syncBillSlider();
  history.replaceState({ step: currentStep }, null, "form.html");
});

window.onpopstate = (event) => {
  if (event.state) {
    const { step } = event.state;
    if (step !== null && step !== undefined) {
      if (!submitted) setStep(step);
    }
  } else {
    setStep(0);
  }
};
