 // ===================== ЗАВДАННЯ 1 =====================
 
  const products = [
    { name: 'Ноутбук',    category: 'Електроніка', price: 28000, inStock: 5 },
    { name: 'Смартфон',   category: 'Електроніка', price: 18000, inStock: 0 },
    { name: 'Навушники',  category: 'Аксесуари',   price: 1500,  inStock: 12 },
    { name: 'Клавіатура', category: 'Аксесуари',   price: 1200,  inStock: 0 },
    { name: 'Монітор',    category: 'Електроніка', price: 7500,  inStock: 3 },
    { name: 'Миша',       category: 'Аксесуари',   price: 600,   inStock: 20 }
  ];
 
  // Товари, яких є на складі більше 0: filter
  function getAvailableProducts(list) {
    return list.filter(product => product.inStock > 0);
  }
 
  // Пошук товару за назвою: find
  function findProductByName(list, name) {
    const found = list.find(
      product => product.name.toLowerCase() === name.trim().toLowerCase()
    );
    return found ? found : 'Товар не знайдено';
  }
 
  function formatProduct(p) {
    return `${p.name} (${p.category}) — ${p.price} грн, на складі: ${p.inStock}`;
  }
 
  document.getElementById('btnAvailable').addEventListener('click', () => {
    const available = getAvailableProducts(products);
    console.log(available);
    document.getElementById('out1').textContent =
      'Товари в наявності:\n' + available.map(formatProduct).join('\n');
  });
 
  document.getElementById('btnFindProduct').addEventListener('click', () => {
    const name = prompt('Введіть назву товару', 'Ноутбук');
    if (name === null) return;
    const result = findProductByName(products, name);
    console.log(result);
    document.getElementById('out1').textContent =
      typeof result === 'string' ? result : formatProduct(result);
  });
 
  // ===================== ЗАВДАННЯ 2 =====================
 
  const students = [
    { name: 'Олена',   age: 19, grade: 10, group: 'ПР-21' },
    { name: 'Максим',  age: 20, grade: 8,  group: 'ПР-22' },
    { name: 'Софія',   age: 19, grade: 12, group: 'ПР-21' },
    { name: 'Дмитро',  age: 21, grade: 6,  group: 'ПР-23' },
    { name: 'Ірина',   age: 20, grade: 9,  group: 'ПР-22' },
    { name: 'Богдан',  age: 19, grade: 11, group: 'ПР-23' }
  ];
 
  // Групування за групою: reduce + push
  function groupBy(list) {
    return list.reduce((groups, student) => {
      if (!groups[student.group]) {
        groups[student.group] = [];
      }
      groups[student.group].push(student);
      return groups;
    }, {});
  }
 
  // Новий масив, відсортований за оцінкою (спадання): копія + sort
  function sortStudentsByGrade(list) {
    return [...list].sort((a, b) => b.grade - a.grade);
  }
 
  document.getElementById('btnGroup').addEventListener('click', () => {
    const groups = groupBy(students);
    console.log(groups);
    let text = '';
    for (const groupName in groups) {
      text += `Група ${groupName}:\n`;
      text += groups[groupName].map(s => `  ${s.name}, ${s.age} р., оцінка ${s.grade}`).join('\n') + '\n';
    }
    document.getElementById('out2').textContent = text;
  });
 
  document.getElementById('btnSortGrade').addEventListener('click', () => {
    const sorted = sortStudentsByGrade(students);
    console.log(sorted);
    document.getElementById('out2').textContent =
      'Студенти за оцінкою (спадання):\n' +
      sorted.map(s => `${s.name} (${s.group}) — ${s.grade}`).join('\n');
  });
 
  // ===================== ЗАВДАННЯ 3 =====================
 
  const employees = [
    { name: 'Олександр', position: 'Розробник',    salary: 32000, years: 4 },
    { name: 'Марія',     position: 'Дизайнер',     salary: 27000, years: 3 },
    { name: 'Іван',      position: 'Тімлід',       salary: 55000, years: 9 },
    { name: 'Наталія',   position: 'Тестувальник', salary: 24000, years: 2 },
    { name: 'Андрій',    position: 'Менеджер',     salary: 41000, years: 7 }
  ];
 
  // Середня зарплата: reduce підсумовує зарплати, потім ділимо на кількість
  function getAverageSalary(list) {
    const total = list.reduce((sum, employee) => sum + employee.salary, 0);
    return total / list.length;
  }
 
  // Працівник з найбільшим досвідом: reduce зберігає "кращого" на поточному кроці
  function findMostExperiencedEmployee(list) {
    return list.reduce((best, employee) =>
      employee.years > best.years ? employee : best
    );
  }
 
  document.getElementById('btnAvgSalary').addEventListener('click', () => {
    const avg = getAverageSalary(employees);
    const text = `Середня зарплата: ${avg.toFixed(2)} грн`;
    console.log(text);
    document.getElementById('out3').textContent = text;
  });
 
  document.getElementById('btnMostExp').addEventListener('click', () => {
    const e = findMostExperiencedEmployee(employees);
    console.log(e);
    document.getElementById('out3').textContent =
      `Найбільший досвід має:\n${e.name}, ${e.position}, ${e.years} років, зарплата ${e.salary} грн`;
  });
 
  // ===================== ЗАВДАННЯ 4 =====================
 
  const books = [
    { title: 'Кобзар',                author: 'Тарас Шевченко',         year: 1840, rating: 5,   isRead: true  },
    { title: 'Тіні забутих предків',  author: 'Михайло Коцюбинський',   year: 1911, rating: 4.5, isRead: false },
    { title: 'Лісова пісня',          author: 'Леся Українка',          year: 1911, rating: 4.8, isRead: true  },
    { title: 'Intermezzo',            author: 'Михайло Коцюбинський',   year: 1909, rating: 4,   isRead: true  },
    { title: 'Contra spem spero',     author: 'Леся Українка',          year: 1890, rating: 3.9, isRead: false },
    { title: 'Захар Беркут',          author: 'Іван Франко',            year: 1883, rating: 4.7, isRead: false },
    { title: 'Місто',                 author: "Валер'ян Підмогильний",  year: 1928, rating: 4.2, isRead: false }
  ];
 
  // Назви непрочитаних книг: reduce + push
  function getUnreadBooks(list) {
    return list.reduce((titles, book) => {
      if (!book.isRead) {
        titles.push(book.title);
      }
      return titles;
    }, []);
  }
 
  // Книги автора, відсортовані за роком зростання: reduce + push + sort
  function getBooksByAuthor(list, author) {
    return list
      .reduce((result, book) => {
        if (book.author === author) {
          result.push(book);
        }
        return result;
      }, [])
      .sort((a, b) => a.year - b.year);
  }
 
  // Книги з рейтингом > 4, за рейтингом спадання: reduce + push + sort
  function getTopRatedBooks(list) {
    return list
      .reduce((result, book) => {
        if (book.rating > 4) {
          result.push(book);
        }
        return result;
      }, [])
      .sort((a, b) => b.rating - a.rating);
  }
 
  function formatBooks(list) {
    if (list.length === 0) return 'Нічого не знайдено';
    return list
      .map(b => `«${b.title}» — ${b.author}, ${b.year}, рейтинг ${b.rating}`)
      .join('\n');
  }
 
  document.getElementById('btnUnread').addEventListener('click', () => {
    const titles = getUnreadBooks(books);
    console.log(titles);
    document.getElementById('out4').textContent =
      'Непрочитані книги:\n' + titles.map(t => `«${t}»`).join('\n');
  });
 
  document.getElementById('btnByAuthor').addEventListener('click', () => {
    const author = prompt("Введіть ім'я автора", 'Леся Українка');
    if (author === null) return;
    const result = getBooksByAuthor(books, author.trim());
    console.log(result);
    document.getElementById('out4').textContent =
      `Книги автора «${author}» (за роком зростання):\n` + formatBooks(result);
  });
 
  document.getElementById('btnTopRated').addEventListener('click', () => {
    const result = getTopRatedBooks(books);
    console.log(result);
    document.getElementById('out4').textContent =
      'Книги з рейтингом вище 4 (за спаданням):\n' + formatBooks(result);
  });