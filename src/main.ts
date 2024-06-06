import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './routers';
import i18n from './i18n';
import '@/shared/styles/element-plus/index.scss';
import '@/shared/styles/index.scss';
import VueDOMPurifyHTML from 'vue-dompurify-html';

import App from './App.vue';
import OpenDesign from 'opendesign';

const app = createApp(App);

app.use(VueDOMPurifyHTML);
app.use(i18n);
app.use(createPinia());
app.use(OpenDesign);
app.use(router);

app.mount('#app');
