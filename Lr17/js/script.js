// ==============================
// DOM
// ==============================
const tabsContainer = document.querySelector('#tabs');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

const topLeft = document.querySelector('#top-left');
const topRight = document.querySelector('#top-right');
const bottomRight = document.querySelector('#bottom-right');
const bottomLeft = document.querySelector('#bottom-left');

const topLeftValue = document.querySelector('#top-left-value');
const topRightValue = document.querySelector('#top-right-value');
const bottomRightValue = document.querySelector('#bottom-right-value');
const bottomLeftValue = document.querySelector('#bottom-left-value');

// Властивості індивідуального варіанта 8: margin, text-align
const marginInput = document.querySelector('#margin');
const marginValue = document.querySelector('#margin-value');
const textAlignSelect = document.querySelector('#text-align');

const preview = document.querySelector('#preview');
const previewButton = document.querySelector('#preview-button');
const coordinates = document.querySelector('#coordinates');

const cssCode = document.querySelector('#css-code');
const copyButton = document.querySelector('#copy-button');
const copyMessage = document.querySelector('#copy-message');

const presetForm = document.querySelector('#preset-form');
const presetName = document.querySelector('#preset-name');
const presetError = document.querySelector('#preset-error');

const scrollTopButton = document.querySelector('#scroll-top');

// ==============================
// TABS (І рівень, завдання 1-4; делегування — ІІІ рівень, завдання 14)
// ==============================

function hideTabs() {
  tabs.forEach(function (tab) {
    tab.classList.remove('active');
  });
  tabContents.forEach(function (content) {
    content.classList.remove('active');
  });
}

function showTab(tabName) {
  const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
  const tabContent = document.querySelector(`[data-content="${tabName}"]`);

  if (tabButton) {
    tabButton.classList.add('active');
  }
  if (tabContent) {
    tabContent.classList.add('active');
  }
}

// Завдання 14 (ІІІ рівень): один обробник на контейнері замість окремого
// обробника для кожної вкладки (делегування подій).
tabsContainer.addEventListener('click', function (event) {
  if (!event.target.classList.contains('tab')) {
    return;
  }

  // Завдання 4: аналіз об'єкта event
  console.log('type:', event.type);
  console.log('target:', event.target);
  console.log('currentTarget:', event.currentTarget);

  const tabName = event.target.dataset.tab;

  hideTabs();
  showTab(tabName);
});

// ==============================
// BORDER RADIUS (завдання 5-8)
// ==============================

function generateBorderRadius() {
  const topLeftRadius = topLeft.value;
  const topRightRadius = topRight.value;
  const bottomRightRadius = bottomRight.value;
  const bottomLeftRadius = bottomLeft.value;

  const radius = `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`;

  preview.style.borderRadius = radius;

  topLeftValue.textContent = `${topLeftRadius} px`;
  topRightValue.textContent = `${topRightRadius} px`;
  bottomRightValue.textContent = `${bottomRightRadius} px`;
  bottomLeftValue.textContent = `${bottomLeftRadius} px`;

  updateCssCode();
}

topLeft.addEventListener('input', generateBorderRadius);
topRight.addEventListener('input', generateBorderRadius);
bottomRight.addEventListener('input', generateBorderRadius);
bottomLeft.addEventListener('input', generateBorderRadius);

// ==============================
// ІНДИВІДУАЛЬНИЙ ВАРІАНТ 8 (завдання 9): margin, text-align
// ==============================

function generateMargin() {
  const marginSize = marginInput.value;
  preview.style.margin = `${marginSize}px`;
  marginValue.textContent = `${marginSize} px`;
  updateCssCode();
}

marginInput.addEventListener('input', generateMargin);

textAlignSelect.addEventListener('change', function () {
  preview.style.textAlign = textAlignSelect.value;
  updateCssCode();
});

// ==============================
// CSS CODE (завдання 8, доповнене завданням 9)
// ==============================

function updateCssCode() {
  const radius = `${topLeft.value}px ${topRight.value}px ${bottomRight.value}px ${bottomLeft.value}px`;
  const margin = `${marginInput.value}px`;
  const textAlign = textAlignSelect.value;

  cssCode.value =
    `border-radius: ${radius};\n` +
    `margin: ${margin};\n` +
    `text-align: ${textAlign};`;
}

// ==============================
// COPY (завдання 13)
// ==============================

function copyCSS() {
  navigator.clipboard.writeText(cssCode.value)
    .then(function () {
      copyMessage.textContent = 'CSS-код скопійовано';
    })
    .catch(function () {
      copyMessage.textContent = 'Не вдалося скопіювати CSS-код';
    });
}

copyButton.addEventListener('click', copyCSS);

// ==============================
// FORM: focus / blur (завдання 10), submit (завдання 11)
// ==============================

presetName.addEventListener('focus', function () {
  presetName.classList.add('focused');
});

presetName.addEventListener('blur', function () {
  presetName.classList.remove('focused');

  if (presetName.value.trim() === '') {
    presetName.classList.add('error');
    presetError.textContent = 'Введіть назву пресета';
  } else {
    presetName.classList.remove('error');
    presetError.textContent = '';
  }
});

function handlePresetSubmit(event) {
  event.preventDefault();

  if (presetName.value.trim() === '') {
    presetName.classList.add('error');
    presetError.textContent = 'Введіть назву пресета';
    return;
  }

  presetName.classList.remove('error');
  presetError.textContent = '';

  console.log(`Пресет: ${presetName.value}`);
  console.log(cssCode.value);
}

presetForm.addEventListener('submit', handlePresetSubmit);

// ==============================
// KEYBOARD (завдання 12)
// ==============================

function handleKeyDown(event) {
  if (event.key === 'Escape') {
    topLeft.value = 0;
    topRight.value = 0;
    bottomRight.value = 0;
    bottomLeft.value = 0;

    generateBorderRadius();
  }
}

document.addEventListener('keydown', handleKeyDown);

// ==============================
// MOUSE EVENTS (завдання 16-17)
// ==============================

preview.addEventListener('mouseover', function () {
  preview.classList.add('hovered');
});

preview.addEventListener('mouseout', function () {
  preview.classList.remove('hovered');
});

preview.addEventListener('mousemove', function (event) {
  coordinates.textContent = `X: ${event.clientX}; Y: ${event.clientY}`;
  console.log('pageX:', event.pageX, 'pageY:', event.pageY);
});

// Завдання 15: дослідження поширення подій + stopPropagation()
preview.addEventListener('click', function () {
  console.log('Preview click');
});

previewButton.addEventListener('click', function (event) {
  event.stopPropagation();
  console.log('Button click');
});

// ==============================
// SCROLL (завдання 18-19)
// ==============================

function handleScroll() {
  if (window.scrollY > 300) {
    scrollTopButton.classList.add('visible');
  } else {
    scrollTopButton.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleScroll);

scrollTopButton.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ==============================
// ІНІЦІАЛІЗАЦІЯ ПОЧАТКОВОГО СТАНУ
// ==============================

generateBorderRadius();
generateMargin();