
const SUPABASE_URL = 'https://miyrqyklrhvikdtalzxr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_FGuwhP4GJFs9HyWzQZvvYQ_XS-yyjq5';

const ordersList = document.querySelector('#orders-list');
const listMessage = document.querySelector('#list-message');
const orderForm = document.querySelector('#order-form');
const formMessage = document.querySelector('#form-message');
const submitButton = document.querySelector('#submit-button');
const refreshButton = document.querySelector('#refresh-button');

let supabaseClient = null;

function setMessage(element, message, type = '') {
  element.textContent = message;
  if (type) {
    element.dataset.type = type;
  } else {
    delete element.dataset.type;
  }
}

function createSupabaseClient() {
  const configIsMissing =
    !SUPABASE_URL.startsWith('https://') ||
    SUPABASE_URL.includes('ВСТАВ_') ||
    SUPABASE_PUBLISHABLE_KEY.includes('ВСТАВ_') ||
    SUPABASE_PUBLISHABLE_KEY.length === 0;

  if (configIsMissing) {
    setMessage(
      listMessage,
      'Додай власні Project URL і Publishable key у js/app.js, щоб підключити Supabase.',
      'error'
    );
    return null;
  }

  if (!window.supabase?.createClient) {
    setMessage(listMessage, 'Не вдалося завантажити бібліотеку Supabase. Перевір підключення до інтернету.', 'error');
    return null;
  }

  return window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

function formatBudget(value) {
  if (value === null || value === undefined || value === '') return '';
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';

  return new Intl.NumberFormat('uk-UA', {
    maximumFractionDigits: 2
  }).format(amount) + ' USD';
}

function makeMetaTag(text, extraClass = '') {
  const tag = document.createElement('span');
  tag.className = extraClass ? `meta-tag ${extraClass}` : 'meta-tag';
  tag.textContent = text;
  return tag;
}

function renderOrders(orders) {
  ordersList.replaceChildren();

  if (!orders || orders.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'Поки що замовлень немає. Можеш додати перше через форму.';
    ordersList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const order of orders) {
    const card = document.createElement('article');
    card.className = 'order-card';

    const title = document.createElement('h3');
    title.textContent = order.title || 'Без назви';

    const description = document.createElement('p');
    description.className = 'order-description';
    description.textContent = order.description || 'Опис не вказано.';

    const meta = document.createElement('div');
    meta.className = 'order-meta';

    const budget = formatBudget(order.budget);
    if (budget) meta.append(makeMetaTag(`Бюджет: ${budget}`));
    if (order.technology) meta.append(makeMetaTag(order.technology));
    if (order.status) meta.append(makeMetaTag(order.status, 'status'));

    card.append(title, description, meta);
    fragment.append(card);
  }

  ordersList.append(fragment);
}

async function loadOrders() {
  if (!supabaseClient) return false;

  setMessage(listMessage, 'Завантаження замовлень…');
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('id, title, description, budget, technology, status')
      .order('id', { ascending: false });

    if (error) throw error;

    renderOrders(data);
    setMessage(listMessage, data.length ? `Знайдено замовлень: ${data.length}` : '');
    return true;
  } catch (error) {
    console.error('Помилка завантаження замовлень:', error);
    setMessage(listMessage, `Не вдалося завантажити замовлення. ${error.message || 'Перевір з’єднання та налаштування доступу.'}`, 'error');
    return false;
  }
}

function readAndValidateForm() {
  const formData = new FormData(orderForm);
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const budgetText = String(formData.get('budget') || '').trim();
  const technology = String(formData.get('technology') || '').trim();

  if (!title || !description) {
    throw new Error('Заповни назву й опис замовлення.');
  }
  if (title.length > 150) {
    throw new Error('Назва має містити не більше 150 символів.');
  }
  if (description.length > 1000) {
    throw new Error('Опис має містити не більше 1000 символів.');
  }
  if (technology.length > 100) {
    throw new Error('Назва технології має містити не більше 100 символів.');
  }

  let budget = null;
  if (budgetText !== '') {
    budget = Number(budgetText);
    if (!Number.isFinite(budget) || budget < 0) {
      throw new Error('Бюджет має бути невід’ємним числом.');
    }
  }

  return {
    title,
    description,
    budget,
    technology: technology || null,
    status: 'open'
  };
}

orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(formMessage, '');

  if (!supabaseClient) {
    setMessage(formMessage, 'Спочатку вкажи власні Project URL і Publishable key у js/app.js.', 'error');
    return;
  }

  let order;
  try {
    order = readAndValidateForm();
  } catch (error) {
    setMessage(formMessage, error.message, 'error');
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Додаємо…';
  setMessage(formMessage, 'Зберігаємо замовлення…');

  try {
    const { error } = await supabaseClient.from('orders').insert(order);
    if (error) throw error;

    orderForm.reset();
    const refreshed = await loadOrders();
    setMessage(
      formMessage,
      refreshed
        ? 'Замовлення успішно додано.'
        : 'Замовлення додано, але список не оновився. Скористайся кнопкою «Оновити список».',
      'success'
    );
  } catch (error) {
    console.error('Помилка додавання замовлення:', error);
    setMessage(formMessage, `Не вдалося додати замовлення. ${error.message || 'Перевір з’єднання та політику INSERT.'}`, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Опублікувати замовлення';
  }
});

refreshButton.addEventListener('click', loadOrders);

supabaseClient = createSupabaseClient();
if (supabaseClient) loadOrders();
