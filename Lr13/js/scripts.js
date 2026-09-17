function task1() {
    let userName = prompt("Введіть своє ім'я:");
    alert(`Hello, ${userName}! Welcome to JavaScript`);
}


// Завдання 2


function task2() {
    let age = Number(prompt("Введіть свій вік:"));
    let currentYear = 2026;
    let birthYear = currentYear - age;
    alert(`You were born in ${birthYear}`);
}


// Завдання 3
function task3() {
    let firstName = prompt("Введіть ім'я:");
    let lastName = prompt("Введіть прізвище:");
    console.log(
        "Your full name is " + firstName + " " + lastName
    );
    console.log(
        `Your full name is ${firstName} ${lastName}`
    );
    alert("Повне ім'я виведено в Console.");
}


// ========================================
// РІВЕНЬ 7–9 БАЛІВ


// Завдання 1
function task4() {
    let userName = "Олександр";
    if (true) {
        // Локальна змінна всередині блоку
        let userName = prompt("Введіть інше ім'я:");
        console.log("Inside block:", userName);
    }
    console.log("Outside block:", userName);
    alert(
        "Відкрийте Console (F12), щоб побачити обидва значення."
    );
}


// Завдання 2

function task5() {
    let name = prompt("Введіть своє ім'я:");
    let age = Number(prompt("Введіть свій вік:"));
    let answer = confirm(
        `Hello, ${name}! Your age is ${age}. Continue?`
    );
    if (answer) {
        alert("Welcome!");
    } else {
        alert("Goodbye!");
    }
}


// Завдання 3

function task6() {
    let number = Number(prompt("Введіть число:"));
    if (number % 2 === 0) {
        alert("Number is even");
    } else {
        alert("Number is odd");
    }
}