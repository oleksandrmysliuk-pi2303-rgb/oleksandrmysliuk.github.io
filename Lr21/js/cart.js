const cartContent = document.querySelector('#cart-content');
const payLink = document.querySelector('#pay-link');

function formatPrice(value) {
  return value.toFixed(2);
}

// Допоміжна функція: посилання-дія в клітинці таблиці
function createActionLink(text, onClick) {
  const link = el('a', 'action-link', text);
  link.href = '#';
  link.addEventListener('click', function (event) {
    event.preventDefault();
    onClick();
  });
  return link;
}

function render() {
  cartContent.textContent = '';
  const cart = getCart();

  if (cart.length === 0) {
    cartContent.appendChild(el('h2', 'cart-title', 'Корзина пуста'));
    payLink.classList.add('disabled');
    return;
  }
  payLink.classList.remove('disabled');

  cartContent.appendChild(el('h2', 'cart-title', 'Ви обрали:'));

  const table = el('table', 'cart-table');

  // Заголовок таблиці
  const headRow = el('tr');
  ['№', 'Назва товару', 'Ціна за од.', 'К-сть:', 'Сума:', ''].forEach(function (title) {
    headRow.appendChild(el('th', '', title));
  });
  table.appendChild(headRow);

  let total = 0;

  cart.forEach(function (item, index) {
    const product = findProduct(item.id);
    const sum = product.price * item.qty;
    total += sum;

    const row = el('tr');
    row.appendChild(el('td', '', `${index + 1}.`));
    row.appendChild(el('td', '', product.name));
    row.appendChild(el('td', '', formatPrice(product.price)));

    // К-сть + (змінити к-сть)
    const qtyCell = el('td');
    qtyCell.appendChild(document.createTextNode(`${item.qty} `));
    qtyCell.appendChild(createActionLink('(змінити к-сть)', function () {
      askQuantity(
        {
          title: product.name,
          message: 'Вкажіть нову кількість:',
          initial: item.qty,
          buttonText: 'Зберегти'
        },
        function (qty) {
          setQty(item.id, qty);
          render();
        }
      );
    }));
    row.appendChild(qtyCell);

    row.appendChild(el('td', '', formatPrice(sum)));

    // (видалити)
    const deleteCell = el('td');
    deleteCell.appendChild(createActionLink('(видалити)', function () {
      removeFromCart(item.id);
      render();
    }));
    row.appendChild(deleteCell);

    table.appendChild(row);
  });

  // Підсумок
  const totalRow = el('tr', 'total-row');
  const label = el('td', 'total-label', 'Разом до оплати:');
  label.colSpan = 4;
  totalRow.appendChild(label);
  totalRow.appendChild(el('td', '', `${formatPrice(total)} грн.`));
  totalRow.appendChild(el('td'));
  table.appendChild(totalRow);

  cartContent.appendChild(table);
}

// ==============================
// Оплата
// ==============================
payLink.addEventListener('click', function (event) {
  event.preventDefault();

  const cart = getCart();
  if (cart.length === 0) {
    return;
  }

  const total = cart.reduce(function (sum, item) {
    return sum + findProduct(item.id).price * item.qty;
  }, 0);

  showModal({
    title: 'Дякуємо за замовлення!',
    content: el('p', 'modal-text', `Сума до сплати: ${formatPrice(total)} грн.`),
    buttons: [
      {
        text: 'До покупок',
        onClick: function () {
          clearCart();
          window.location.href = 'index.html';
        }
      }
    ]
  });
});

render();