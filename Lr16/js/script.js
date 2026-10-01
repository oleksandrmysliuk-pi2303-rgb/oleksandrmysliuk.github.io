 /* =========================================================
     ЗАВДАННЯ 1. Конвертер температури (Фаренгейт <-> Цельсій)
     C = 5/9 * (F - 32)
     F = 9/5 * C + 32
     ========================================================= */
 
  const fahrenheitInput = document.getElementById('fahrenheit');
  const celsiusInput = document.getElementById('celsius');
 
  function convertFahrenheitToCelsius() {
    const f = parseFloat(fahrenheitInput.value);
    if (isNaN(f)) {
      celsiusInput.value = '';
      return;
    }
    const c = (5 / 9) * (f - 32);
    celsiusInput.value = c.toFixed(2);
  }
 
  function convertCelsiusToFahrenheit() {
    const c = parseFloat(celsiusInput.value);
    if (isNaN(c)) {
      fahrenheitInput.value = '';
      return;
    }
    const f = (9 / 5) * c + 32;
    fahrenheitInput.value = f.toFixed(2);
  }
 
  fahrenheitInput.addEventListener('input', convertFahrenheitToCelsius);
  celsiusInput.addEventListener('input', convertCelsiusToFahrenheit);
 
  /* =========================================================
     ЗАВДАННЯ 2. Тест на знання таблиці множення (текстове поле)
     ========================================================= */
 
  let score2 = { correct: 0, total: 0 };
  let current2 = { a: 0, b: 0, answer: 0 };
 
  function updateScoreDisplay2() {
    const percent = score2.total === 0 ? 0 : Math.round((score2.correct / score2.total) * 100);
    document.getElementById('score2').textContent =
      `Загальний рахунок ${percent}% (${score2.correct} правильних відповідей з ${score2.total})`;
  }
 
  function generateQuestion2() {
    const a = Math.floor(Math.random() * 9) + 2; // 2..10
    const b = Math.floor(Math.random() * 9) + 2;
    current2 = { a, b, answer: a * b };
    document.getElementById('question2').textContent = `${a} × ${b} = `;
    document.getElementById('answer2').value = '';
    document.getElementById('result2').textContent = '';
    document.getElementById('result2').className = 'row result';
  }
 
  function checkAnswer2() {
    const userAnswer = Number(document.getElementById('answer2').value);
    const resultEl = document.getElementById('result2');
    score2.total++;
 
    if (userAnswer === current2.answer) {
      score2.correct++;
      resultEl.textContent = 'Правильно!';
      resultEl.className = 'row result correct';
    } else {
      resultEl.textContent = `Помилка, правильна відповідь «${current2.answer}»`;
      resultEl.className = 'row result wrong';
    }
    updateScoreDisplay2();
  }
 
  document.getElementById('nextBtn2').addEventListener('click', generateQuestion2);
  document.getElementById('checkBtn2').addEventListener('click', checkAnswer2);
 
  // початкова ініціалізація
  updateScoreDisplay2();
  generateQuestion2();
 
  /* =========================================================
     ЗАВДАННЯ 3. Тест на знання таблиці множення (радіокнопки)
     ========================================================= */
 
  let score3 = { correct: 0, total: 0 };
  let current3 = { a: 0, b: 0, answer: 0 };
 
  function updateScoreDisplay3() {
    const percent = score3.total === 0 ? 0 : Math.round((score3.correct / score3.total) * 100);
    document.getElementById('score3').textContent =
      `Загальний рахунок ${percent}% (${score3.correct} правильних відповідей з ${score3.total})`;
  }
 
  // перемішування масиву (Fisher-Yates)
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
 
  function generateQuestion3() {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    const answer = a * b;
    current3 = { a, b, answer };
 
    document.getElementById('question3').textContent = `${a} × ${b} = `;
 
    // генеруємо 3 неправильні варіанти, відмінні від правильної відповіді та одне від одного
    const wrongOptions = new Set();
    while (wrongOptions.size < 3) {
      const delta = Math.floor(Math.random() * 10) - 5;
      const candidate = answer + delta;
      if (candidate > 0 && candidate !== answer) {
        wrongOptions.add(candidate);
      }
    }
 
    const options = shuffle([answer, ...wrongOptions]);
 
    const optionsContainer = document.getElementById('options3');
    optionsContainer.textContent = '';
 
    options.forEach((optionValue, index) => {
      const wrapper = document.createElement('div');
 
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'quiz3answer';
      radio.id = `q3opt${index}`;
      radio.value = String(optionValue);
 
      const label = document.createElement('label');
      label.setAttribute('for', `q3opt${index}`);
      label.style.width = 'auto';
      label.textContent = ' ' + optionValue;
 
      radio.addEventListener('change', () => checkAnswer3(optionValue));
 
      wrapper.appendChild(radio);
      wrapper.appendChild(label);
      optionsContainer.appendChild(wrapper);
    });
 
    document.getElementById('result3').textContent = '';
    document.getElementById('result3').className = 'row result';
  }
 
  function checkAnswer3(selectedValue) {
    const resultEl = document.getElementById('result3');
    score3.total++;
 
    if (selectedValue === current3.answer) {
      score3.correct++;
      resultEl.textContent = 'Правильно!';
      resultEl.className = 'row result correct';
    } else {
      resultEl.textContent = `Помилка, правильна відповідь «${current3.answer}»`;
      resultEl.className = 'row result wrong';
    }
    updateScoreDisplay3();
 
    // лише одна спроба — вимикаємо всі радіокнопки цього завдання
    document.querySelectorAll('input[name="quiz3answer"]').forEach(radio => {
      radio.disabled = true;
    });
  }
 
  document.getElementById('nextBtn3').addEventListener('click', generateQuestion3);
 
  updateScoreDisplay3();
  generateQuestion3();
 
  /* =========================================================
     ЗАВДАННЯ 4. Ротатор зображень
     Тематика варіанту 8 — фрукти.
     Зображення — самодостатні SVG (data URI), щоб сторінка
     працювала без зовнішніх файлів.
     ========================================================= */
 
  function fruitImage(bgColor, label) {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260">` +
      `<rect width="420" height="260" fill="${bgColor}"/>` +
      `<text x="50%" y="50%" font-size="42" font-family="Arial" fill="white" ` +
      `text-anchor="middle" dominant-baseline="middle">${label}</text>` +
      `</svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }
 
  let imagesArray = [
    {
      path: 'image/images.jpg',
      title: 'Яблуко',
      description: 'Стиглі червоні яблука з саду'
    },
    {
      path: "image/banan-imp-500x500.jpeg",
      title: 'Банан',
      description: 'Жовті стиглі банани'
    },
    {
      path: "image/apelysin-fresh.jpg",
      title: 'Апельсин',
      description: 'Соковиті апельсини з Іспанії'
    },
    {
      path: "image/grapes.png",
      title: 'Виноград',
      description: 'Грона темного винограду'
    }
  ];
 
  function initPhotoRotator(containerId, images) {
    const container = document.getElementById(containerId);
    let currentIndex = 0;
 
    function render() {
      // очищуємо контейнер
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
 
      const image = images[currentIndex];
 
      // посилання "Назад"
      const backLink = document.createElement('div');
      backLink.className = 'rotator-nav' + (currentIndex === 0 ? ' hidden' : '');
      backLink.textContent = 'Назад';
      backLink.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          render();
        }
      });
 
      // центральна колонка
      const center = document.createElement('div');
      center.className = 'rotator-center';
 
      const counter = document.createElement('div');
      counter.className = 'rotator-counter';
      counter.textContent = `Фотографія ${currentIndex + 1} з ${images.length}`;
 
      const imageBox = document.createElement('div');
      imageBox.className = 'rotator-image-box';
 
      const imgEl = document.createElement('img');
      imgEl.src = image.path;
      imgEl.alt = image.title;
      imageBox.appendChild(imgEl);
 
      const titleEl = document.createElement('div');
      titleEl.className = 'rotator-title';
      titleEl.textContent = image.title;
 
      const descEl = document.createElement('div');
      descEl.className = 'rotator-description';
      descEl.textContent = image.description;
 
      center.appendChild(counter);
      center.appendChild(imageBox);
      center.appendChild(titleEl);
      center.appendChild(descEl);
 
      // посилання "Вперед"
      const forwardLink = document.createElement('div');
      forwardLink.className = 'rotator-nav' + (currentIndex === images.length - 1 ? ' hidden' : '');
      forwardLink.textContent = 'Вперед';
      forwardLink.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
          currentIndex++;
          render();
        }
      });
 
      container.appendChild(backLink);
      container.appendChild(center);
      container.appendChild(forwardLink);
    }
 
    render();
  }
 
  initPhotoRotator('rotator', imagesArray);
 
  /* =========================================================
     ЗАВДАННЯ 5. Captcha
     ========================================================= */
 
  // bitmap-шрифт цифр 5 рядків x 3 стовпці
  const digitPatterns = {
    '0': ['111', '101', '101', '101', '111'],
    '1': ['010', '010', '010', '010', '010'],
    '2': ['111', '001', '111', '100', '111'],
    '3': ['111', '001', '111', '001', '111'],
    '4': ['101', '101', '111', '001', '001'],
    '5': ['111', '100', '111', '001', '111'],
    '6': ['111', '100', '111', '101', '111'],
    '7': ['111', '001', '001', '001', '001'],
    '8': ['111', '101', '111', '101', '111'],
    '9': ['111', '101', '111', '001', '111']
  };
 
  let captchaDigits = [];
 
  function renderDigitPixels(digit, container) {
    const pattern = digitPatterns[digit];
    const grid = document.createElement('div');
    grid.className = 'captcha-digit-grid';
 
    pattern.forEach(rowStr => {
      for (const ch of rowStr) {
        const pixel = document.createElement('div');
        pixel.className = 'captcha-pixel' + (ch === '1' ? ' on' : '');
        grid.appendChild(pixel);
      }
    });
 
    container.appendChild(grid);
  }
 
  function initCaptcha(digitCount) {
    const pixelsContainer = document.getElementById('captchaPixels');
    pixelsContainer.textContent = '';
 
    const row = document.createElement('div');
    row.className = 'captcha-digit-row';
 
    captchaDigits = [];
    for (let i = 0; i < digitCount; i++) {
      const digit = Math.floor(Math.random() * 10);
      captchaDigits.push(digit);
      renderDigitPixels(String(digit), row);
    }
 
    pixelsContainer.appendChild(row);
 
    document.getElementById('captchaInput').value = '';
    document.getElementById('captchaResult').textContent = '';
    document.getElementById('captchaResult').className = 'row result';
  }
 
  function checkCaptcha() {
    const userInput = document.getElementById('captchaInput').value.trim();
    const correctValue = captchaDigits.join('');
    const resultEl = document.getElementById('captchaResult');
 
    if (userInput === correctValue) {
      resultEl.textContent = 'Правильно';
      resultEl.className = 'row result correct';
    } else {
      resultEl.textContent = 'Помилка';
      resultEl.className = 'row result wrong';
    }
 
    // нова капча після перевірки
    setTimeout(() => initCaptcha(captchaDigits.length), 1200);
  }
 
  document.getElementById('captchaCheckBtn').addEventListener('click', checkCaptcha);
 
  // ініціалізація капчі з 4 цифрами
  initCaptcha(4);