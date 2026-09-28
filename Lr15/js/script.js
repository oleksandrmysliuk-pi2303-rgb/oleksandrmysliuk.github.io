 // Допоміжна функція: показати текст у блоці на сторінці
  function show(id, text) {
    document.getElementById(id).textContent = text;
  }
 
  /* Властивості марки: country, year, denomination, theme, isExchanged */
 
  // ---------- 1. Об'єкт stamp ----------
  let stamp = {
    country: 'Україна',
    year: 1992,
    denomination: '30 коп.',
    theme: 'Державна символіка',
    isExchanged: false,
    stampInfo() {
      const text = `Країна: ${this.country}, Рік випуску: ${this.year}, Номінал: ${this.denomination}, Тема: ${this.theme}, Обміняна: ${this.isExchanged ? 'Так' : 'Ні'}`;
      console.log(text);
      return text;
    }
  };
 
  document.getElementById('btnS1').addEventListener('click', () => {
    stamp.isExchanged = false;             // вихідний стан, щоб кожен запуск був однаковим
    const before = stamp.stampInfo();
    stamp.isExchanged = !stamp.isExchanged; // змінюємо на протилежне значення
    const after = stamp.stampInfo();
    show('outS1', before + '\n' + after);
  });
 
  // ---------- 2. Масив collection ----------
  // Фабрика створює марку зі своїми методами stampInfo та markAsExchanged
  function createStamp(country, year, denomination, theme, isExchanged) {
    return {
      country,
      year,
      denomination,
      theme,
      isExchanged,
      stampInfo() {
        const text = `Країна: ${this.country}, Рік випуску: ${this.year}, Номінал: ${this.denomination}, Тема: ${this.theme}, Обміняна: ${this.isExchanged ? 'Так' : 'Ні'}`;
        console.log(text);
        return text;
      },
      // Позначити марку як обміняну
      markAsExchanged() {
        this.isExchanged = true;
      }
    };
  }
 
  let collection = [
    createStamp('Україна', 1992, '30 коп.', 'Державна символіка', false),
    createStamp('Польща', 1978, '5 зл.', 'Космос', true),
    createStamp('Німеччина', 1965, '20 пфенігів', 'Архітектура', false),
    createStamp('Японія', 1985, '60 єн', 'Природа', false)
  ];
 
  // Перебирає collection і виводить інформацію через stampInfo
  function displayCollection(outId) {
    const lines = [];
    collection.forEach(item => {
      lines.push(item.stampInfo());
    });
    if (outId) show(outId, lines.join('\n'));
  }
 
  document.getElementById('btnS2Show').addEventListener('click', () => {
    displayCollection('outS2');
  });
 
  let canadaAdded = false;
  document.getElementById('btnS2Push').addEventListener('click', () => {
    if (!canadaAdded) {
      collection.push(createStamp('Канада', 2001, '47 центів', 'Фауна', false));
      canadaAdded = true;
    }
    displayCollection('outS2');
  });
 
  // ---------- 3. sort, filter, find ----------
  document.getElementById('btnS3Sort').addEventListener('click', () => {
    collection.sort((a, b) => a.year - b.year);
    console.log('Марки, відсортовані за роком випуску:', collection);
    show('outS3',
      'Відсортовані за роком випуску:\n' +
      collection.map(s => `  ${s.year} — ${s.country}, ${s.denomination} (${s.theme})`).join('\n'));
  });
 
  document.getElementById('btnS3Filter').addEventListener('click', () => {
    let notExchanged = collection.filter(s => !s.isExchanged);
    console.log('Необміняні марки:', notExchanged);
    show('outS3',
      'Необміняні марки:\n' +
      notExchanged.map(s => `  ${s.country}, ${s.year}, ${s.denomination} (${s.theme})`).join('\n'));
  });
 
  document.getElementById('btnS3Find').addEventListener('click', () => {
    const country = prompt('Введіть країну марки:', 'Японія');
    if (country === null) return;
    let found = collection.find(s => s.country.toLowerCase() === country.trim().toLowerCase());
    console.log('Знайдена марка:', found);
    show('outS3', found
      ? `Знайдена марка:\n  ${found.country}, ${found.year}, ${found.denomination} (${found.theme})`
      : 'Марку не знайдено');
  });
 
  // ---------- 4. Взаємодія з користувачем ----------
  function addStampToCollection() {
    let country = prompt('Введіть країну марки:');
    if (country === null) return;
    let year = +prompt('Введіть рік випуску марки:');
    let denomination = prompt('Введіть номінал марки:');
    if (denomination === null) return;
    let theme = prompt('Введіть тему марки:');
    if (theme === null) return;
    let isExchanged = confirm('Чи обміняна марка?');
 
    collection.push(createStamp(country, year, denomination, theme, isExchanged));
    displayCollection('outS4');
  }
  document.getElementById('btnS4').addEventListener('click', addStampToCollection);
 
  // ---------- Додаткові функції ----------
  document.getElementById('btnSMark').addEventListener('click', () => {
    const country = prompt('Марку якої країни позначити як обміняну?', 'Україна');
    if (country === null) return;
    const found = collection.find(s => s.country.toLowerCase() === country.trim().toLowerCase());
    if (!found) {
      show('outSExtra', 'Марку не знайдено');
      return;
    }
    found.markAsExchanged();
    show('outSExtra', found.stampInfo());
  });
 
  // Середній рік випуску всіх марок у collection
  function calculateAverageYear() {
    const sum = collection.reduce((total, s) => total + s.year, 0);
    return sum / collection.length;
  }
 
  document.getElementById('btnSAvg').addEventListener('click', () => {
    const avg = calculateAverageYear();
    console.log('Середній рік випуску марок:', avg);
    show('outSExtra', `Середній рік випуску марок: ${avg.toFixed(1)}`);
  });