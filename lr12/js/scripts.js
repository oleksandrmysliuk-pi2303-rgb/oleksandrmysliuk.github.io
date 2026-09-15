  const journalNumber = 8;         
  const surname = 'Мислюк';
  const firstName = 'Олександр';
  const fullName = `${surname} ${firstName}`;
 
  // ===================== РІВЕНЬ 4-6 =====================
 
  // Завдання 1
  document.getElementById('btn1').addEventListener('click', () => {
    alert('Натисніть ОК, щоб побачити привітання');
    document.getElementById('out1').textContent = `Hello, ${fullName}!`;
  });
 
  // Завдання 2
  document.getElementById('btn2').addEventListener('click', () => {
    const pressedOk = confirm('Натисніть "Ок" або "Відміна"');
    document.getElementById('out2').textContent = pressedOk
      ? 'Ви натиснули кнопку "Ок"'
      : 'Ви натиснули кнопку "Відміна"';
  });
 
  // Завдання 3
  document.getElementById('btn3').addEventListener('click', () => {
    const n = journalNumber % 10;
    let table = '<table class="mult">';
    for (let i = 1; i <= 10; i++) {
      table += `<tr><td>${n} × ${i} = ${n * i}</td></tr>`;
    }
    table += '</table>';
    document.getElementById('out3').innerHTML =
      `Таблиця множення для числа ${n}:` + table;
  });
 
  // ===================== РІВЕНЬ 7-9 =====================
 
  // Завдання 1
  function checkEvenOdd(number) {
    const out = document.getElementById('out4');
    if (number % 2 === 0) {
      out.innerHTML = `<p class="green">Число ${number} — парне</p>`;
    } else {
      out.innerHTML = `<p class="red">Число ${number} — непарне</p>`;
    }
  }
  document.getElementById('btn4').addEventListener('click', () => {
    checkEvenOdd(journalNumber);
  });
 
  // Завдання 2
  function generatePassword(name, number) {
    const prefix = name.slice(0, 3);
    return `${prefix}${number * 2}`;
  }
  document.getElementById('btn5').addEventListener('click', () => {
    const password = generatePassword(firstName, journalNumber);
    document.getElementById('out5').textContent = `Згенерований пароль: ${password}`;
  });
 
  // Завдання 3
  function averageGrade() {
    const grade1 = Number(prompt('Введіть першу оцінку'));
    const grade2 = Number(prompt('Введіть другу оцінку'));
    const grade3 = Number(prompt('Введіть третю оцінку'));
    const avg = (grade1 + grade2 + grade3) / 3;
 
    let div = document.getElementById(String(journalNumber));
    if (!div) {
      div = document.createElement('div');
      div.id = String(journalNumber);
      div.className = 'output';
      document.getElementById('out6').appendChild(div);
    }
    div.textContent = `Середній бал: ${avg.toFixed(2)}`;
  }
  document.getElementById('btn6').addEventListener('click', averageGrade);
 
  // Завдання 4
  document.getElementById('btn7').addEventListener('click', () => {
    const out = document.getElementById('out7');
    out.innerHTML = '';
    const count = Number(prompt('Введіть кількість студентів групи'));
    for (let i = 1; i <= count; i++) {
      const studentSurname = prompt(`Введіть прізвище студента №${i}`);
      const studentName = prompt(`Введіть ім'я студента №${i}`);
      const p = document.createElement('p');
      p.textContent = `${i}. ${studentSurname} ${studentName}`;
      out.appendChild(p);
    }
  });
 
  // ===================== РІВЕНЬ 10-12 =====================
 
  // Завдання 1
  document.getElementById('btn8').addEventListener('click', () => {
    const list = document.getElementById('nameList');
    list.innerHTML = '';
    for (const letter of firstName) {
      const li = document.createElement('li');
      li.textContent = letter;
      li.addEventListener('mouseover', () => {
        alert(letter);
      });
      list.appendChild(li);
    }
  });
 
  // Завдання 2
  document.getElementById('btn9').addEventListener('click', () => {
    const out = document.getElementById('out9');
    out.innerHTML = '';
    let counter = 1;
    while (true) {
      const enteredSurname = prompt(`Введіть прізвище (запис №${counter}), або натисніть "Відміна" щоб завершити`);
      if (enteredSurname === null) break;
      const enteredName = prompt(`Введіть ім'я (запис №${counter})`);
      if (enteredName === null) break;
 
      const p = document.createElement('p');
      p.textContent = `${counter}. ${enteredSurname} ${enteredName}`;
      out.appendChild(p);
      counter++;
    }
  });
 
  // Завдання 3
  document.getElementById('btn10').addEventListener('click', () => {
    const container = document.getElementById('letters');
    if (container.children.length > 0) {
      container.innerHTML = '';
      return;
    }
    for (const letter of surname) {
      const block = document.createElement('div');
      block.className = 'letter-block';
      block.textContent = letter;
      block.addEventListener('mouseover', () => {
        alert(`Це літера ${letter}`);
      });
      container.appendChild(block);
    }
  });