import { createI18n } from 'vue-i18n';

import common from './common';

const messages = {
  zh: {
    common: common.zh,
  },
  en: {
    common: common.en,
  },
};

const i18n = createI18n({
  globalInjection: true,
  locale: 'zh',
  legacy: false,
  messages,
});

export default i18n;
