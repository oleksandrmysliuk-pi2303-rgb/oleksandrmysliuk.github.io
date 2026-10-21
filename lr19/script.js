// ==============================
// DOM
// ==============================
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');

// ==============================
// Дані (масив завдань; нові додаються на початок списку)
// ==============================
let tasks = [];

// ==============================
// Допоміжні функції
// ==============================

// Формат дати: 12.12.22, 16:09
function formatDate(date) {
  return date.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function findTask(id) {
  return tasks.find(function (task) {
    return task.id === id;
  });
}

// ==============================
// Додавання завдання (завдання 1-2)
// ==============================
function addTask(text) {
  tasks.unshift({
    id: Date.now(),
    text: text,
    done: false,
    date: formatDate(new Date())
  });
  render();
}

taskInput.addEventListener('keydown', function (event) {
  if (event.key !== 'Enter') {
    return;
  }

  const text = taskInput.value.trim();
  if (text === '') {
    return;
  }

  addTask(text);
  taskInput.value = '';
});

// ==============================
// Відображення списку (завдання 2-5)
// ==============================
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task' + (task.done ? ' done' : '');
  li.dataset.id = task.id;

  // checkbox (завдання 3)
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;

  // текст + дата (завдання 2)
  const body = document.createElement('div');
  body.className = 'task-body';

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;

  const date = document.createElement('span');
  date.className = 'task-date';
  date.textContent = task.date;

  body.appendChild(text);
  body.appendChild(date);

  // хрестик видалення (завдання 5)
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.title = 'Видалити';

  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(deleteBtn);

  return li;
}

function render() {
  taskList.textContent = '';
  tasks.forEach(function (task) {
    taskList.appendChild(createTaskElement(task));
  });
}

// ==============================
// Делегування подій на списку
// ==============================

// Завдання 4: checkbox -> завдання виконане
taskList.addEventListener('change', function (event) {
  if (event.target.type !== 'checkbox') {
    return;
  }

  const li = event.target.closest('.task');
  const task = findTask(Number(li.dataset.id));
  task.done = event.target.checked;
  render();
});

// Завдання 5: видалення
taskList.addEventListener('click', function (event) {
  if (!event.target.classList.contains('delete-btn')) {
    return;
  }

  const id = Number(event.target.closest('.task').dataset.id);
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  render();
});

// Завдання 6: редагування по подвійному кліку
taskList.addEventListener('dblclick', function (event) {
  if (!event.target.classList.contains('task-text')) {
    return;
  }

  startEdit(event.target);
});

function startEdit(textElement) {
  const li = textElement.closest('.task');
  const task = findTask(Number(li.dataset.id));

  // замість тексту з'являється input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = task.text;

  textElement.replaceWith(input);
  input.focus();
  input.select();

  let finished = false;

  function finishEdit(save) {
    if (finished) {
      return;
    }
    finished = true;

    const newText = input.value.trim();
    if (save && newText !== '') {
      task.text = newText;
    }
    render(); // input зникає, показується оновлений текст
  }

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      finishEdit(true);
    } else if (event.key === 'Escape') {
      finishEdit(false);
    }
  });

  // втрата фокусу без Enter — скасування редагування
  input.addEventListener('blur', function () {
    finishEdit(false);
  });
}

render();