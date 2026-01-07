class I18n {
  constructor() {
    this.translations = {};
    this.currentLang = this.detectLanguage();
  }

  detectLanguage() {
    const saved = localStorage.getItem('language');
    if (saved) return saved;

    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['ru', 'en'];

    return supportedLangs.includes(browserLang) ? browserLang : 'en';
  }

  async loadTranslations() {
    try {
      const response = await fetch('translations.yaml');
      const yamlText = await response.text();
      this.translations = jsyaml.load(yamlText);
      return true;
    } catch (error) {
      console.error('Failed to load translations:', error);
      return false;
    }
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    return value || key;
  }

  translatePage() {
    const pattern = /\{\{(.+?)\}\}/g;

    const translateNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Сохраняем оригинальный ключ если его еще нет
        if (!node._i18nKey) {
          const match = node.textContent.match(pattern);
          if (match) {
            node._i18nKey = node.textContent;
          }
        }

        // Переводим из сохраненного ключа
        if (node._i18nKey) {
          node.textContent = node._i18nKey.replace(pattern, (match, key) => {
            return this.t(key.trim());
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Обрабатываем атрибут title
        if (node.hasAttribute('title')) {
          if (!node._i18nTitleKey) {
            const title = node.getAttribute('title');
            if (pattern.test(title)) {
              node._i18nTitleKey = title;
            }
          }

          if (node._i18nTitleKey) {
            node.setAttribute(
              'title',
              node._i18nTitleKey.replace(pattern, (match, key) => {
                return this.t(key.trim());
              })
            );
          }
        }

        Array.from(node.childNodes).forEach(translateNode);
      }
    };

    translateNode(document.body);

    // Обрабатываем title страницы
    if (!document._i18nTitleKey) {
      if (pattern.test(document.title)) {
        document._i18nTitleKey = document.title;
      }
    }

    if (document._i18nTitleKey) {
      document.title = document._i18nTitleKey.replace(pattern, (match, key) => {
        return this.t(key.trim());
      });
    }
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    this.translatePage();
  }

  getCurrentLanguage() {
    return this.currentLang;
  }

  getAvailableLanguages() {
    return Object.keys(this.translations);
  }
}

const i18n = new I18n();
