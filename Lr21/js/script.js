// ==============================
// Каталог товарів (тема: автомобільні запчастини)
// ==============================
const PRODUCTS = [
  { id: 1, category: 'Мастила',     name: 'Моторна олива 5W-30, 4 л',         price: 1150, emoji: '🛢️', badge: 'hit' },
  { id: 2, category: 'Фільтри',     name: 'Масляний фільтр',                  price: 180,  emoji: '🔩' },
  { id: 3, category: 'Гальма',      name: 'Гальмівні колодки передні',        price: 950,  oldPrice: 1100, emoji: '🛞', badge: 'hit' },
  { id: 4, category: 'Електрика',   name: 'Акумулятор 60 Аг',                 price: 3200, emoji: '🔋', badge: 'new' },
  { id: 5, category: 'Двигун',      name: 'Свічки запалювання (4 шт)',        price: 420,  emoji: '⚡' },
  { id: 6, category: 'Кузов',       name: 'Щітки склоочисника (комплект)',    price: 350,  emoji: '🧽' },
  { id: 7, category: 'Освітлення',  name: 'Лампи H7 (пара)',                  price: 280,  emoji: '💡' },
  { id: 8, category: 'Підвіска',    name: 'Амортизатор передній',             price: 0,    emoji: '🔧', available: false }
];

const CART_KEY = 'autoPartsCart';

// ==============================
// Допоміжна функція створення елементів
// ==============================
function el(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

// ==============================
// Корзина (зберігається в localStorage, щоб переходити між сторінками)
// ==============================
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function findProduct(id) {
  return PRODUCTS.find(function (product) {
    return product.id === id;
  });
}

function addToCart(id, qty) {
  const cart = getCart();
  const item = cart.find(function (i) { return i.id === id; });
  if (item) {
    item.qty += qty;
  } else {
    cart.push({ id: id, qty: qty });
  }
  saveCart(cart);
}

function setQty(id, qty) {
  const cart = getCart();
  const item = cart.find(function (i) { return i.id === id; });
  if (item) {
    item.qty = qty;
    saveCart(cart);
  }
}

function removeFromCart(id) {
  saveCart(getCart().filter(function (i) { return i.id !== id; }));
}

function clearCart() {
  saveCart([]);
}

// Кількість найменувань (а не штук)
function cartItemsCount() {
  return getCart().length;
}

function updateCartBadge() {
  const badge = document.querySelector('#cart-count');
  if (badge) {
    badge.textContent = cartItemsCount();
  }
}

// ==============================
// Модальні вікна
// ==============================
// options: { title, content (Node), buttons: [{ text, secondary, onClick }] }
// Якщо onClick повертає false — вікно не закривається (валідація).
function showModal(options) {
  const overlay = el('div', 'modal-overlay');
  const modal = el('div', 'modal');

  if (options.title) {
    modal.appendChild(el('h3', 'modal-title', options.title));
  }
  if (options.content) {
    modal.appendChild(options.content);
  }

  function close() {
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      close();
    }
  }

  const actions = el('div', 'modal-actions');
  const buttonEls = [];

  options.buttons.forEach(function (config) {
    const btn = el('button', 'btn' + (config.secondary ? ' btn-secondary' : ''), config.text);
    btn.type = 'button';
    btn.addEventListener('click', function () {
      if (config.onClick && config.onClick() === false) {
        return;
      }
      close();
    });
    actions.appendChild(btn);
    buttonEls.push(btn);
  });

  modal.appendChild(actions);
  overlay.appendChild(modal);

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) {
      close();
    }
  });
  document.addEventListener('keydown', onKeyDown);

  document.body.appendChild(overlay);
  return { close: close, buttonEls: buttonEls };
}

// Модальне вікно з полем вибору кількості
function askQuantity(config, onConfirm) {
  const content = el('div');
  content.appendChild(el('p', 'modal-text', config.message));

  const input = el('input', 'qty-input');
  input.type = 'number';
  input.min = '1';
  input.max = '99';
  input.value = String(config.initial || 1);
  content.appendChild(input);

  const error = el('p', 'modal-error');
  content.appendChild(error);

  const modal = showModal({
    title: config.title,
    content: content,
    buttons: [
      {
        text: config.buttonText,
        onClick: function () {
          const value = Number(input.value);
          if (!Number.isInteger(value) || value < 1 || value > 99) {
            error.textContent = 'Введіть ціле число від 1 до 99';
            return false;
          }
          onConfirm(value);
        }
      },
      { text: 'Скасувати', secondary: true }
    ]
  });

  // Enter у полі = натискання головної кнопки
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      modal.buttonEls[0].click();
    }
  });

  input.focus();
  input.select();
}