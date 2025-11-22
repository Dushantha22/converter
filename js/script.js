// --- Start Screen Animation ---
const getStartedBtn = document.querySelector(".getStartedBtn");
const startScreen = document.querySelector(".start-screen");
const navbar = document.querySelector(".navbar");
getStartedBtn.addEventListener("click", () => {
  startScreen.animate(
    [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }],
    {
      duration: 1000,
      fill: "forwards",
    }
  );
  navbar.classList.remove("d-none");
  navbar.animate(
    [{ transform: "translateY(-100%)" }, { transform: "translateY(0)" }],
    {
      duration: 1000,
      fill: "forwards",
    }
  );
});
const conversionTypes = {
  Length: {
    icon: "rulers",
    baseUnit: "m",
    units: ["km", "m", "cm", "mm", "inch", "foot", "yard", "mile"],
    rates: {
      km: 1000,
      m: 1,
      cm: 0.01,
      mm: 0.001,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34,
    },
  },
  Temperature: {
    icon: "thermometer-half",
    baseUnit: "C",
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    rates: {},
  },
};

let currentTypeId = null;

function renderConversionUI(title, units) {
  const id = title.toLowerCase().replace(/\s+/g, "-");
  const unitOptions = units
    .map((unit) => `<option value="${unit}">${unit}</option>`)
    .join("");

  const html = `
  <div id="${id}" class="conversion-interface bg-dark-custom p-3 p-md-4 rounded-4 shadow-lg border border-secondary">
  <h2 class="fs-4 fw-bold text-primary mb-3 text-center">${title} Converter</h2>

  <div class="row g-2 g-md-3 align-items-center">
    <!-- Input Section -->
    <div class="col-12 col-md-5">
      <div class="input-group-compact">
        <label class="input-label">From</label>
        <input type="number" id="${id}-from-value" 
               class="form-control form-control-lg text-primary text-end fw-bold"
               placeholder="0" oninput="triggerConversion()" />
        <div class="input-sub-label">Enter value</div>
      </div>
      
      <div class="input-group-compact mt-2">
        <label class="input-label">Unit</label>
        <select id="${id}-from-unit" class="form-select form-select-lg" onchange="triggerConversion()">
          ${unitOptions}
        </select>
        <div class="input-sub-label">Select unit</div>
      </div>
    </div>

    <!-- Switch Button -->
    <div class="col-12 col-md-2 d-flex justify-content-center py-2 py-md-0">
      <button id="switch-button" onclick="swapUnits()" 
              class="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
              style="width: 45px; height: 45px;">
        <i class="bi bi-arrow-left-right fs-6"></i>
      </button>
    </div>

    <!-- Output Section -->
    <div class="col-12 col-md-5">
      <div class="input-group-compact">
        <label class="input-label text-success">To</label>
        <input type="text" id="${id}-to-result" 
               class="form-control form-control-lg text-success text-end fw-bold result-field"
               placeholder="0" readonly />
        <div class="input-sub-label text-success">Converted result</div>
      </div>
      
      <div class="input-group-compact mt-2">
        <label class="input-label">Unit</label>
        <select id="${id}-to-unit" class="form-select form-select-lg" onchange="triggerConversion()">
          ${unitOptions}
        </select>
        <div class="input-sub-label">Select unit</div>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="d-flex justify-content-center gap-3 mt-4">
    <button onclick="clearConversion()" 
            class="btn btn-outline-secondary btn-sm rounded-pill px-4 shadow-sm d-flex align-items-center">
      <i class="bi bi-x-lg me-2"></i>Clear
    </button>
    <button onclick="copyResult()" 
            class="btn btn-outline-primary btn-sm rounded-pill px-4 shadow-sm d-flex align-items-center">
      <i class="bi bi-clipboard me-2"></i>Copy
    </button>
  </div>
</div>
  `;

  document.getElementById("conversion-panel").innerHTML = html;

  document.getElementById(`${id}-from-unit`).selectedIndex = 0;
  document.getElementById(`${id}-to-unit`).selectedIndex = units.length > 1 ? 1 : 0;
}

// --- Initialize App ---
function initializeApp() {
  const selectorContainer = document.getElementById("converter-buttons-container");
  selectorContainer.innerHTML = "";

  Object.entries(conversionTypes).forEach(([title, config]) => {
    const id = title.toLowerCase().replace(/\s+/g, "-");
    const button = document.createElement("button");
    button.className = "btn btn-outline-light converter-select-button fw-medium";
    button.setAttribute("data-target", id);

    button.onclick = () => {
      selectConverter(title);
      // collapse menu on mobile
      const navbar = document.querySelector("#navbarContent");
      const bsCollapse = bootstrap.Collapse.getInstance(navbar);
      if (bsCollapse) bsCollapse.hide();
    };

    button.innerHTML = `<i class="bi bi-${config.icon} me-2"></i><span>${title}</span>`;
    selectorContainer.appendChild(button);
  });

  selectConverter(Object.keys(conversionTypes)[0]);
}

// --- Select Converter ---
function selectConverter(title) {
  const pageId = title.toLowerCase().replace(/\s+/g, "-");
  const config = conversionTypes[title];
  if (!config) return;

  currentTypeId = pageId;
  renderConversionUI(title, config.units);

  document.querySelectorAll(".converter-select-button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`button[data-target="${pageId}"]`).classList.add("active");

  triggerConversion();
}

// --- Swap Units ---
function swapUnits() {
  if (!currentTypeId) return;
  const fromSelect = document.getElementById(`${currentTypeId}-from-unit`);
  const toSelect = document.getElementById(`${currentTypeId}-to-unit`);
  if (!fromSelect || !toSelect) return;

  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  triggerConversion();
}

// --- Conversion Logic ---
function triggerConversion() {
  if (!currentTypeId) return;
  const config = conversionTypes[
    Object.keys(conversionTypes).find(
      (key) => key.toLowerCase().replace(/\s+/g, "-") === currentTypeId
    )
  ];
  if (!config) return;

  const fromValue = parseFloat(document.getElementById(`${currentTypeId}-from-value`).value);
  const fromUnit = document.getElementById(`${currentTypeId}-from-unit`).value;
  const toUnit = document.getElementById(`${currentTypeId}-to-unit`).value;
  const resultInput = document.getElementById(`${currentTypeId}-to-result`);

  if (isNaN(fromValue)) {
    resultInput.value = "";
    return;
  }

  let result;
  if (currentTypeId === "temperature") {
    result = convertTemperature(fromValue, fromUnit, toUnit);
  } else {
    result = fromValue * (config.rates[fromUnit] / config.rates[toUnit]);
  }

  resultInput.value = result.toLocaleString("en-US", {
    maximumFractionDigits: 6,
  });
}

// --- Temperature Conversion ---
function convertTemperature(value, from, to) {
  if (from === to) return value;

  if (from === "Celsius") {
    if (to === "Fahrenheit") return value * 9 / 5 + 32;
    if (to === "Kelvin") return value + 273.15;
  }
  if (from === "Fahrenheit") {
    if (to === "Celsius") return (value - 32) * 5 / 9;
    if (to === "Kelvin") return (value - 32) * 5 / 9 + 273.15;
  }
  if (from === "Kelvin") {
    if (to === "Celsius") return value - 273.15;
    if (to === "Fahrenheit") return (value - 273.15) * 9 / 5 + 32;
  }

  return value;
}

// --- Clear Conversion ---
function clearConversion() {
  if (!currentTypeId) return;
  document.getElementById(`${currentTypeId}-from-value`).value = "";
  document.getElementById(`${currentTypeId}-to-result`).value = "";
}

// --- Initialize on Load ---
document.addEventListener("DOMContentLoaded", initializeApp);
