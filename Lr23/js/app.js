
const SUPABASE_URL = 'https://miyrqyklrhvikdtalzxr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_FGuwhP4GJFs9HyWzQZvvYQ_XS-yyjq5';

const ordersList = document.querySelector('#orders-list');
const listMessage = document.querySelector('#list-message');
const orderForm = document.querySelector('#order-form');
const formMessage = document.querySelector('#form-message');
const submitButton = document.querySelector('#submit-button');
const refreshButton = document.querySelector('#refresh-button');

let supabaseClient = null;
let cachedOrders = null;
let ordersLoadFailed = false;

function t(key, values = {}) {
  return window.i18Translate
    ? window.i18nTranslate(key, values)
    : key;
}

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
    !window.supabase?.createClient;

  if (configIsMissing) {
    setMessage(listMessage, t('messages.configMissing'), 'error');
    return null;
  }

  return window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
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
    emptyState.textContent = t('messages.empty');
    ordersList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  const language = window.getCurrentLanguage?.() || 'uk';

  for (const order of orders) {
    const card = document.createElement('article');
    card.className = 'order-card';

    const title = document.createElement('h3');
    title.textContent = order.title || t('messages.noTitle');

    const description = document.createElement('p');
    description.className = 'order-description';
    description.textContent = order.description || t('messages.noDescription');

    const meta = document.createElement('div');
    meta.className = 'order-meta';

    if (order.budget !== null && order.budget !== undefined && order.budget !== '') {
      const amount = new Intl.NumberFormat(language, {
        maximumFractionDigits: 2
      }).format(Number(order.budget));

      meta.append(makeMetaTag(t('budget.label', { amount })));
    }

    if (order.technology) {
      meta.append(makeMetaTag(order.technology));
    }

    if (order.status) {
      const translatedStatus = t(`status.${order.status}`);
      meta.append(makeMetaTag(
        translatedStatus === `status.${order.status}`
          ? order.status
          : translatedStatus,
        'status'
      ));
    }

    card.append(title, description, meta);
    fragment.append(card);
  }

  ordersList.append(fragment);
}

async function loadOrders() {
  if (!supabaseClient) return false;

  setMessage(listMessage, t('messages.loading'));

  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('id, title, description, budget, technology, status')
      .order('id', { ascending: false });

    if (error) throw error;
  cachedOrders = data;
  ordersLoadFailed = false;
    renderOrders(data);
    setMessage(
      listMessage,
      data.length ? t('messages.found', { count: data.length }) : ''
    );
  ordersLoadFailed = true;
    return true;
  } catch (error) {
    console.error('Помилка завантаження замовлень:', error);
    setMessage(
      listMessage,
      `${t('messages.loadError')} ${error.message || ''}`.trim(),
      'error'
    );
    return false;
  }
}

function getOrderFromForm() {
  const formData = new FormData(orderForm);
  const title = String(formData.get('title') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const budgetText = String(formData.get('budget') || '').trim();
  const technology = String(formData.get('technology') || '').trim();

  if (!title || !description) {
    throw new Error(t('messages.required'));
  }

  if (title.length > 150) {
    throw new Error(t('messages.titleTooLong'));
  }

  if (description.length > 1000) {
    throw new Error(t('messages.descriptionTooLong'));
  }

  if (technology.length > 100) {
    throw new Error(t('messages.technologyTooLong'));
  }

  let budget = null;

  if (budgetText !== '') {
    budget = Number(budgetText);

    if (!Number.isFinite(budget) || budget < 0) {
      throw new Error(t('messages.invalidBudget'));
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
    setMessage(formMessage, t('messages.configMissing'), 'error');
    return;
  }

  let order;

  try {
    order = getOrderFromForm();
  } catch (error) {
    setMessage(formMessage, error.message, 'error');
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = t('form.submitting');
  setMessage(formMessage, t('messages.saved'));

  try {
    const { error } = await supabaseClient
      .from('orders')
      .insert(order);

    if (error) throw error;

    orderForm.reset();

    const refreshed = await loadOrders();
    setMessage(
      formMessage,
      refreshed
        ? t('messages.added')
        : t('messages.addedRefreshFailed'),
      'success'
    );
  } catch (error) {
    console.error('Помилка додавання замовлення:', error);
    setMessage(
      formMessage,
      `${t('messages.insertError')} ${error.message || ''}`.trim(),
      'error'
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = t('form.submit');
  }
});

refreshButton.addEventListener('click', loadOrders);

window.addEventListener('languageChanged', () => {
  setMessage(formMessage, '');

  if (!supabaseClient) return;

  if (cachedOrders === null || ordersLoadFailed) {
    loadOrders();
    return;
  }

  renderOrders(cachedOrders);
  setMessage(
    listMessage,
    cachedOrders.length ? t('messages.found', { count: cachedOrders.length }) : ''
  );
});

supabaseClient = createSupabaseClient();