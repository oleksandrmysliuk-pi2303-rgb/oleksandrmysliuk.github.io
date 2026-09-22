 // ===================== РІВЕНЬ 4-6 =====================
 
  // Завдання 1
  function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }
 
  function showGreeting(fullName, age) {
    return `Hello, ${fullName}! You are ${age} years old.`;
  }
 
  document.getElementById('btn1').addEventListener('click', () => {
    const firstName = prompt("Введіть ваше ім'я");
    const lastName = prompt('Введіть ваше прізвище');
    const age = prompt('Введіть ваш вік');
 
    const fullName = getFullName(firstName, lastName);
    const message = showGreeting(fullName, age);
 
    document.getElementById('out1').textContent = message;
  });
 
  // Завдання 2
  function getStudentInfo() {
    const name = prompt("Введіть ім'я студента");
    const score = Number(prompt('Введіть бал студента (0–12)'));
    return { name, score };
  }
 
  function checkGrade(score) {
    if (score >= 10 && score <= 12) return 'Excellent';
    if (score >= 7 && score <= 9) return 'Good';
    if (score >= 4 && score <= 6) return 'Satisfactory';
    return 'Fail';
  }
 
  function showResult(name, grade) {
    return `Student: ${name}\nGrade: ${grade}`;
  }
 
  document.getElementById('btn2').addEventListener('click', () => {
    const student = getStudentInfo();
    const grade = checkGrade(student.score);
    const result = showResult(student.name, grade);
 
    document.getElementById('out2').textContent = result;
  });
 
  // Завдання 3
  function calculateTip(amount, percent = 10) {
    return (amount * percent) / 100;
  }
 
  function showTipResult(amount, tip, percent) {
    const total = amount + tip;
    return `Bill: ${amount} грн\nTip (${percent}%): ${tip} грн\nTotal: ${total} грн`;
  }
 
  document.getElementById('btn3').addEventListener('click', () => {
    const amount = Number(prompt('Введіть загальну суму рахунку (грн)'));
    const percentInput = prompt('Введіть відсоток чайових (Enter — за замовчуванням 10%)');
    const percent = percentInput ? Number(percentInput) : 10;
 
    const tip = calculateTip(amount, percent);
    const result = showTipResult(amount, tip, percent);
 
    document.getElementById('out3').textContent = result;
  });
 
  // ===================== РІВЕНЬ 7-9 =====================
 
  // Завдання 1
  function startGreetingTimer(message, seconds, callback) {
    document.getElementById('out4').textContent = 'Очікування...';
    setTimeout(() => {
      document.getElementById('out4').textContent = message;
      callback();
    }, seconds * 1000);
  }
 
  document.getElementById('btn4').addEventListener('click', () => {
    const message = prompt('Введіть повідомлення');
    const seconds = Number(prompt('Через скільки секунд його показати?'));
 
    // стрілкова функція як колбек
    startGreetingTimer(message, seconds, () => {
      alert('Time is up!');
    });
  });
 
  // Завдання 2
  function calculate(a, b, operation) {
    switch (operation) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: return 'Invalid operation';
    }
  }
 
  function showResultCalc() {
    const a = Number(prompt('Введіть перше число'));
    const b = Number(prompt('Введіть друге число'));
    const operation = prompt("Введіть операцію (+, -, *, /)");
 
    const result = calculate(a, b, operation);
    alert(`Результат: ${result}`);
  }
 
  document.getElementById('btn5').addEventListener('click', showResultCalc);
 
  // Завдання 3
  function createClickCounter() {
    let count = 0;
    return function () {
      count++;
      console.log(`Count: ${count}`);
      return count;
    };
  }
 
  const clickCounter = createClickCounter();
 
  document.getElementById('btn6').addEventListener('click', () => {
    const current = clickCounter();
    document.getElementById('out6').textContent = `Поточне значення лічильника: ${current}`;
  });