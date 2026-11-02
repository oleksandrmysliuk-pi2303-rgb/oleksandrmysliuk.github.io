const productsContainer = document.querySelector('#products');
const cartButton = document.querySelector('#cart-button');

// ==============================
// Картки товарів
// ==============================
function createCard(product) {
  const card = el('article', 'card');

  if (product.badge === 'new') {
    card.appendChild(el('span', 'badge badge-new', 'НОВИНКА'));
  } else if (product.badge === 'hit') {
    card.appendChild(el('span', 'badge badge-hit', 'ХІТ ПРОДАЖІВ'));
  }

  card.appendChild(el('div', 'card-category', product.category));
  card.appendChild(el('div', 'card-image', product.emoji));
  card.appendChild(el('div', 'card-name', product.name));

  const available = product.available !== false;
  const priceBlock = el('div', 'card-price');

  if (available) {
    if (product.oldPrice) {
      priceBlock.appendChild(el('span', 'old-price', `${product.oldPrice} грн`));
    }
    priceBlock.appendChild(el('span', 'current-price', `${product.price} грн`));
  }
  card.appendChild(priceBlock);

  const button = el('button', 'btn card-btn', available ? 'У корзину' : 'Незабаром у продажі');
  button.type = 'button';

  if (available) {
    button.addEventListener('click', function () {
      handleAddToCart(product);
    });
  } else {
    button.disabled = true;
    button.classList.add('btn-soon');
  }

  card.appendChild(button);
  return card;
}

// ==============================
// Додавання в корзину: вибір кількості -> "Товар додано"
// ==============================
function handleAddToCart(product) {
  askQuantity(
    {
      title: product.name,
      message: 'Вкажіть кількість:',
      initial: 1,
      buttonText: 'Додати до корзини'
    },
    function (qty) {
      addToCart(product.id, qty);
      updateCartBadge();

      showModal({
        title: 'Товар додано',
        content: el('p', 'modal-text', `${product.name} — ${qty} шт.`),
        buttons: [
          {
            text: 'Перейти у корзину',
            onClick: function () {
              window.location.href = 'cart.html';
            }
          },
          { text: 'Повернутись до покупок', secondary: true }
        ]
      });
    }
  );
}

// ==============================
// Іконка корзини: порожня -> модальне вікно, інакше -> сторінка корзини
// ==============================
cartButton.addEventListener('click', function () {
  if (cartItemsCount() === 0) {
    showModal({
      title: 'Корзина пуста',
      buttons: [{ text: 'Закрити' }]
    });
  } else {
    window.location.href = 'cart.html';
  }
});

// ==============================
// Ініціалізація
// ==============================
PRODUCTS.forEach(function (product) {
  productsContainer.appendChild(createCard(product));
});

updateCartBadge();