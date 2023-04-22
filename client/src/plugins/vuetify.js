import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);
const AppTheme = JSON.parse(localStorage.getItem('telegram-clone-theme'));
document.body.classList.toggle('light-theme', AppTheme)

export default new Vuetify({
    theme: {
        dark: !AppTheme,
    }
});
