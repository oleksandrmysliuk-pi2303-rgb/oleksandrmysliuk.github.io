const LANGUAGE_KEY = 'orders-app-language';
const SUPPORTED_LANGUAGES = ['uk', 'en'];

const app = document.querySelector('#app');
const languageDialog = document.querySelector('#language-dialog');
const initialLanguage = document.querySelector('#initial-language');
const languageSwitch = document.querySelector('#language-switch');
const confirmLanguageButton = document.querySelector('#confirm-language');

let currentLanguage = 'uk';
let currentTranslations = {};

function getTranslation(key, values = {}) {
  const result = key
    .split('.')
    .reduce((value, part) => value?.[part], currentTranslations);

  if (typeof result !== 'string') return key;

  return result.replace(/\{\{(\w+)\}\}/g, (_, name) => values[name] ?? '');
}

window.t = getTranslation;
window.getCurrentLanguage = () => currentLanguage;

function translatePage() {
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = getTranslation(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = getTranslation(element.dataset.i18nPlaceholder);
  });

  if (languageSwitch) languageSwitch.value = currentLanguage;
  if (initialLanguage) initialLanguage.value = currentLanguage;
}

async function changeLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) return;

  try {
    const response = await fetch(`locales/${language}.json`);
    if (!response.ok) {
      throw new Error(`Не вдалося завантажити locales/${language}.json`);
    }

    currentTranslations = await response.json();
    currentLanguage = language;
    translatePage();

    localStorage.setItem(LANGUAGE_KEY, language);
    app.hidden = false;

    if (languageDialog.open) languageDialog.close();

    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language }
    }));
  } catch (error) {
    console.error('Помилка завантаження перекладу:', error);
    showLanguageError('Не вдалося завантажити файл перекладу. Запусти сторінку через локальний сервер.');
  }
}

function showLanguageError(message) {
  let errorMessage = languageDialog.querySelector('.language-error');

  if (!errorMessage) {
    errorMessage = document.createElement('p');
    errorMessage.className = 'language-error';
    errorMessage.setAttribute('role', 'alert');
    languageDialog.querySelector('.dialog-content').append(errorMessage);
  }

  errorMessage.textContent = message;
}

confirmLanguageButton.addEventListener('click', () => {
  changeLanguage(initialLanguage.value);
});

languageSwitch.addEventListener('change', () => {
  changeLanguage(languageSwitch.value);
});

async function startApp() {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

  if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
    await changeLanguage(savedLanguage);
    return;
  }

  try {
    const response = await fetch('locales/uk.json');
    if (!response.ok) {
      throw new Error('Не вдалося завантажити locales/uk.json');
    }

    currentTranslations = await response.json();
    currentLanguage = 'uk';
    translatePage();

    app.hidden = true;
    initialLanguage.value = 'uk';
    languageDialog.showModal();
  } catch (error) {
    console.error('Помилка завантаження перекладу:', error);
    showLanguageError('Не вдалося завантажити переклад. Запусти сторінку через локальний сервер.');
  }
}

startApp();