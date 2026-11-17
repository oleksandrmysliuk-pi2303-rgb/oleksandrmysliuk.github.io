
const SUPABASE_URL = 'https://miyrqyklrhvikdtalzxr.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_FGuwhP4GJFs9HyWzQZvvYQ_XS-yyjq5';

const appElement = document.querySelector('#app');
const authStatus = document.querySelector('#auth-status');
const authForms = document.querySelector('#auth-forms');
const userPanel = document.querySelector('#user-panel');
const userInfo = document.querySelector('#user-info');
const adminPanel = document.querySelector('#admin-panel');

const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');
const logoutButton = document.querySelector('#logout-button');

const orderForm = document.querySelector('#order-form');
const orderIdInput = document.querySelector('#order-id');
const submitButton = document.querySelector('#submit-button');
const cancelButton = document.querySelector('#cancel-button');
const formMessage = document.querySelector('#form-message');

const ordersList = document.querySelector('#orders-list');
const listMessage = document.querySelector('#list-message');
const refreshButton = document.querySelector('#refresh-button');

const extraText = {
  uk: {
    authPrompt: 'Увійди, щоб керувати замовленнями.',
    roleAdmin: 'Адміністратор',
    roleUser: 'Звичайний користувач',
    signedUp: 'Обліковий запис створено. Тепер увійди.',
    confirmEmail: 'Перевір пошту та підтвердь адресу перед входом.',
    loggedIn: 'Вхід виконано.',
    loggedOut: 'Вихід виконано.',
    authError: 'Не вдалося перевірити користувача.',
    roleError: 'Не вдалося перевірити роль. Адміністративні функції приховано.',
    registerError: 'Не вдалося створити обліковий запис.',
    loginError: 'Не вдалося увійти.',
    logoutError: 'Не вдалося вийти.',
    save: 'Опублікувати замовлення',
    saving: 'Зберігаємо…',
    update: 'Зберегти зміни',
    added: 'Замовлення додано.',
    updated: 'Зміни збережено.',
    deleted: 'Замовлення видалено.',
    deleteConfirm: 'Видалити це замовлення?',
    edit: 'Редагувати',
    delete: 'Видалити',
    cancel: 'Скасувати редагування',
    adminOnly: 'Ця дія доступна лише адміністратору.',
    noUpdate: 'Замовлення не знайдено або змінювати його заборонено.',
    noDelete: 'Замовлення не знайдено або видаляти його заборонено.'
  },
  en: {
    authPrompt: 'Sign in to manage orders.',
    roleAdmin: 'Administrator',
    roleUser: 'Regular user',
    signedUp: 'Account created. You can now sign in.',
    confirmEmail: 'Check your email and confirm your address before signing in.',
    loggedIn: 'Signed in.',
    loggedOut: 'Signed out.',
    authError: 'Could not verify the user.',
    roleError: 'Could not verify the role. Admin controls are hidden.',
    registerError: 'Could not create the account.',
    loginError: 'Could not sign in.',
    logoutError: 'Could not sign out.',
    save: 'Post order',
    saving: 'Saving…',
    update: 'Save changes',
    added: 'Order added.',
    updated: 'Changes saved.',
    deleted: 'Order deleted.',
    deleteConfirm: 'Delete this order?',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel editing',
    adminOnly: 'This action is available to the administrator only.',
    noUpdate: 'Order not found or editing is not allowed.',
    noDelete: 'Order not found or deletion is not allowed.'
  }
};

let supabaseClient = null;
let currentUser = null;
let isAdmin = false;
let cachedOrders = null;
let ordersLoadFailed = false;
let appInitialized = false;

function language() {
  return window.getCurrentLanguage?.() === 'en' ? 'en' : 'uk';
}

function text(key) {
  return extraText[language()][key] || key;
}

function translate(key, fallback = '', values = {}) {
  const translated = window.i18nTranslate?.(key, values);

  if (translated && translated !== key) {
    return translated;
  }

  return fallback.replace(
    /\{\{(\w+)\}\}/g,
    (_, name) => values[name] ?? ''
  );
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
  const missingConfig =
    !SUPABASE_URL.startsWith('https://') ||
    SUPABASE_URL.includes('ТУТ_') ||
    SUPABASE_PUBLISHABLE_KEY.includes('ТУТ_') ||
    !SUPABASE_PUBLISHABLE_KEY;

  if (missingConfig || !window.supabase?.createClient) {
    return null;
  }

  return window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
}

function makeMetaTag(value, className = '') {
  const tag = document.createElement('span');
  tag.className = className ? `meta-tag ${className}` : 'meta-tag';
  tag.textContent = value;
  return tag;
}

function renderOrders(orders) {
  ordersList.replaceChildren();

  if (!orders || orders.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = translate(
      'messages.empty',
      'Поки що замовлень немає. Можеш додати перше через форму.'
    );
    ordersList.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const order of orders) {
    const card = document.createElement('article');
    card.className = 'order-card';

    const title = document.createElement('h3');
    title.textContent = order.title || translate('messages.noTitle', 'Без назви');

    const description = document.createElement('p');
    description.className = 'order-description';
    description.textContent =
      order.description || translate('messages.noDescription', 'Опис не вказано.');

    const meta = document.createElement('div');
    meta.className = 'order-meta';

    if (order.budget !== null && order.budget !== undefined && order.budget !== '') {
      const amount = new Intl.NumberFormat(language(), {
        maximumFractionDigits: 2
      }).format(Number(order.budget));

      meta.append(makeMetaTag(
        translate('budget.label', 'Бюджет: {{amount}} USD', { amount })
      ));
    }

    if (order.technology) {
      meta.append(makeMetaTag(order.technology));
    }

    if (order.status) {
      const translatedStatus = translate(`status.${order.status}`, order.status);
      meta.append(makeMetaTag(translatedStatus, 'status'));
    }

    card.append(title, description, meta);

    if (isAdmin) {
      const actions = document.createElement('div');
      actions.className = 'book-actions';

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.textContent = text('edit');
      editButton.addEventListener('click', () => startEditing(order));

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = text('delete');
      deleteButton.addEventListener('click', () => deleteOrder(order.id));

      actions.append(editButton, deleteButton);
      card.append(actions);
    }

    fragment.append(card);
  }

  ordersList.append(fragment);
}

async function loadOrders() {
  if (!supabaseClient) {
    setMessage(listMessage, translate(
      'messages.configMissing',
      'Перевір Project URL і Publishable key у js/app.js.'
    ), 'error');
    return false;
  }

  setMessage(listMessage, translate('messages.loading', 'Завантаження замовлень…'));

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
      data.length
        ? translate('messages.found', 'Знайдено замовлень: {{count}}', {
            count: data.length
          })
        : ''
    );

    return true;
  } catch (error) {
    console.error('Помилка завантаження замовлень:', error);
    ordersLoadFailed = true;

    setMessage(
      listMessage,
      `${translate(
        'messages.loadError',
        'Не вдалося завантажити замовлення.'
      )} ${error.message || ''}`.trim(),
      'error'
    );

    return false;
  }
}

function updateAuthLabels() {
  if (!currentUser) {
    setMessage(authStatus, text('authPrompt'));
    return;
  }

  const role = isAdmin ? text('roleAdmin') : text('roleUser');
  userInfo.textContent = `${currentUser.email} — ${role}`;
}

async function updateAuthState() {
  if (!supabaseClient) {
    authForms.hidden = false;
    userPanel.hidden = true;
    adminPanel.hidden = true;
    setMessage(authStatus, translate(
      'messages.configMissing',
      'Перевір Project URL і Publishable key у js/app.js.'
    ), 'error');
    await loadOrders();
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;

    currentUser = data.user || null;
    isAdmin = false;

    if (currentUser) {
      const { data: roleResult, error: roleError } =
        await supabaseClient.rpc('check_admin');

      if (roleError) {
        console.error('Помилка перевірки ролі:', roleError);
        setMessage(authStatus, text('roleError'), 'error');
      } else {
        isAdmin = roleResult === true;
        setMessage(authStatus, '');
      }
    }

    authForms.hidden = Boolean(currentUser);
    userPanel.hidden = !currentUser;
    adminPanel.hidden = !isAdmin;

    updateAuthLabels();
    renderOrders(cachedOrders || []);
    await loadOrders();
  } catch (error) {
    console.error('Помилка перевірки сеансу:', error);
    currentUser = null;
    isAdmin = false;
    authForms.hidden = false;
    userPanel.hidden = true;
    adminPanel.hidden = true;
    setMessage(authStatus, `${text('authError')} ${error.message || ''}`, 'error');
    await loadOrders();
  }
}

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('#register-email').value.trim();
  const password = document.querySelector('#register-password').value;

  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;

    registerForm.reset();

    setMessage(
      authStatus,
      data.session ? text('signedUp') : text('confirmEmail'),
      'success'
    );
  } catch (error) {
    console.error('Помилка реєстрації:', error);
    setMessage(authStatus, `${text('registerError')} ${error.message || ''}`, 'error');
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('#login-email').value.trim();
  const password = document.querySelector('#login-password').value;

  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    loginForm.reset();
    setMessage(authStatus, text('loggedIn'), 'success');
    await updateAuthState();
  } catch (error) {
    console.error('Помилка входу:', error);
    setMessage(authStatus, `${text('loginError')} ${error.message || ''}`, 'error');
  }
});

logoutButton.addEventListener('click', async () => {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;

    currentUser = null;
    isAdmin = false;
    resetOrderForm();
    await updateAuthState();
    setMessage(authStatus, text('loggedOut'), 'success');
  } catch (error) {
    console.error('Помилка виходу:', error);
    setMessage(authStatus, `${text('logoutError')} ${error.message || ''}`, 'error');
  }
});

function readOrderForm() {
  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();
  const budgetText = document.querySelector('#budget').value.trim();
  const technology = document.querySelector('#technology').value.trim();

  if (!title || !description) {
    throw new Error(translate('messages.required', 'Заповни назву й опис замовлення.'));
  }
  if (title.length > 150) {
    throw new Error(translate('messages.titleTooLong', 'Назва має містити не більше 150 символів.'));
  }
  if (description.length > 1000) {
    throw new Error(translate('messages.descriptionTooLong', 'Опис має містити не більше 1000 символів.'));
  }
  if (technology.length > 100) {
    throw new Error(translate('messages.technologyTooLong', 'Назва технології має містити не більше 100 символів.'));
  }

  let budget = null;

  if (budgetText !== '') {
    budget = Number(budgetText);

    if (!Number.isFinite(budget) || budget < 0) {
      throw new Error(translate('messages.invalidBudget', 'Бюджет має бути невід’ємним числом.'));
    }
  }

  return {
    title,
    description,
    budget,
    technology: technology || null
  };
}

function startEditing(order) {
  if (!isAdmin) return;

  orderIdInput.value = order.id;
  document.querySelector('#title').value = order.title || '';
  document.querySelector('#description').value = order.description || '';
  document.querySelector('#budget').value = order.budget ?? '';
  document.querySelector('#technology').value = order.technology || '';

  submitButton.textContent = text('update');
  cancelButton.hidden = false;
  setMessage(formMessage, '');
  document.querySelector('#title').focus();
}

function resetOrderForm() {
  orderForm.reset();
  orderIdInput.value = '';
  cancelButton.hidden = true;
  submitButton.textContent = text('save');
}

cancelButton.addEventListener('click', resetOrderForm);

orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(formMessage, '');

  if (!currentUser || !isAdmin) {
    setMessage(formMessage, text('adminOnly'), 'error');
    return;
  }

  let order;

  try {
    order = readOrderForm();
  } catch (error) {
    setMessage(formMessage, error.message, 'error');
    return;
  }

  const orderId = orderIdInput.value;
  submitButton.disabled = true;
  submitButton.textContent = text('saving');

  try {
    if (orderId) {
      const { data, error } = await supabaseClient
        .from('orders')
        .update(order)
        .eq('id', Number(orderId))
        .select('id');

      if (error) throw error;
      if (!data?.length) throw new Error(text('noUpdate'));

      setMessage(formMessage, text('updated'), 'success');
    } else {
      const { error } = await supabaseClient
        .from('orders')
        .insert({ ...order, status: 'open' });

      if (error) throw error;
      setMessage(formMessage, text('added'), 'success');
    }

    resetOrderForm();
    await loadOrders();
  } catch (error) {
    console.error('Помилка збереження замовлення:', error);
    setMessage(formMessage, error.message, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = orderIdInput.value ? text('update') : text('save');
  }
});

async function deleteOrder(orderId) {
  if (!isAdmin) return;
  if (!window.confirm(text('deleteConfirm'))) return;

  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .delete()
      .eq('id', Number(orderId))
      .select('id');

    if (error) throw error;
    if (!data?.length) throw new Error(text('noDelete'));

    setMessage(formMessage, text('deleted'), 'success');
    await loadOrders();
  } catch (error) {
    console.error('Помилка видалення замовлення:', error);
    setMessage(formMessage, error.message, 'error');
  }
}

refreshButton.addEventListener('click', loadOrders);

window.addEventListener('languageChanged', () => {
  updateAuthLabels();

  // Перший вибір мови запускає ініціалізацію та одне завантаження.
  if (!appElement.hidden && !appInitialized) {
    initializeApp();
    return;
  }

  // За наступних перемикань перемальовуємо кешований список без запиту до Supabase.
  if (cachedOrders !== null && !ordersLoadFailed) {
    renderOrders(cachedOrders);
    setMessage(
      listMessage,
      cachedOrders.length
        ? translate('messages.found', 'Знайдено замовлень: {{count}}', {
            count: cachedOrders.length
          })
        : ''
    );
  } else if (appInitialized) {
    loadOrders();
  }
});

async function initializeApp() {
  if (appInitialized || appElement.hidden) return;
  appInitialized = true;

  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange(() => {
      setTimeout(updateAuthState, 0);
    });
  }

  await updateAuthState();
}

supabaseClient = createSupabaseClient();

if (!appElement.hidden) {
  initializeApp();
}

