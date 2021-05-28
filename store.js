export const store = {
  firstname: "",
  lastname: "",
  email: "",
  property_type: "",
  monthly_electric_bill: "",
  sunlight_amount: "",
  credit_score: "",
  address: "",
  phone: "",
};

function loadData() {
  for (let fieldName in store) {
    const value = localStorage.getItem(fieldName);
    if (value) store[fieldName] = value;

    setSelectedField(fieldName, value);
  }
}

function setSelectedField(fieldName, fieldValue) {
  const step = document.querySelector(`[propname="${fieldName}"]`);
  if (step) {
    const btns = step.querySelectorAll(".answer-button");

    btns.forEach((btn) => {
      if (btn.textContent.trim() === fieldValue) btn.classList.add("selected");
      else btn.classList.remove("selected");
    });
  }
}

export function setField(fieldName, fieldValue) {
  store[fieldName] = fieldValue;
  localStorage.setItem(fieldName, fieldValue);
  setSelectedField(fieldName, fieldValue);
}

loadData();
