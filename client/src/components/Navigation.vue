<template>
  <v-navigation-drawer app @input="open_nav" :value="nav_drawer" width="275px" temporary bg-color>
    <div class="navigation-head">
      <div class="user-img" @click="open = !open">
        <v-avatar size="45" :color="user.usercolor">
          <v-img v-if="user?.image?.[0]" :src="user?.image[0]"></v-img>
          <span v-else style="text-transform: uppercase;" class="white--text" usn>{{ user.name[0]+(user.name[1]||'') }}</span>
        </v-avatar>
      </div>
      <div class="user-info">
        <div @click="open = !open">
          <h5>{{ user.name }}</h5>
          <span>{{ user.email }}</span>
        </div>
        <div class="nav-drop-down" @click="open = !open">
          <v-icon :style="`transform: rotate(${open?0:180}deg)`" txt-lead>mdi-chevron-up</v-icon>
        </div>
      </div>
    </div>
    <div class="logout px-0" @click="logout">
      <v-list-item dense link>
        <v-list-item-icon class="mr-5 ml-1">
          <v-chip small dark class="px-1" color="#56b3f5">
            <v-icon small>mdi-logout-variant</v-icon>
          </v-chip>
        </v-list-item-icon>
  
        <v-list-item-content>
          <v-list-item-title font-sans>Выход из аккаунта</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
    <div :class="`setting-bar ${open ? 'down' : ''}`">
      <v-list dense>
        <v-list-item v-for="(link, i) in links" :key="i" link @click="navClick(i)">
          <v-list-item-icon class="mr-5">
            <v-chip label dark small class="px-1 ml-1" :color="link.color">
              <v-icon small :style="`transform: rotate(${link.theme?-37:0}deg)`">{{ link.icon }}</v-icon>
            </v-chip>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title font-sans>{{ link.title }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-action v-if="link.theme">
            <div :class="`checkbox ${!theme ? 'active' : ''}`">
              <div class="circle"></div>
            </div>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <!-- <div class="setting-link blue1" @click="store.commit('changeTheme')">
        <i class="fa bx bxs-moon"></i>
        <h5>Ночной режим</h5>
      </div> -->
    </div>
    <!-- <div class="navig-links">
      <a href="https://telegram.org"><b>Telegram Desktop</b></a
      ><br />
      <a href="#">Версия 4.0.2 x64</a> <span>-</span>
      <a href="#">О программе</a>
    </div> -->
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: "Navigation",
  data: () => ({
    drawer: true,
    open: false,
    links: [
      { icon: 'mdi-account-multiple', title: 'Создать пруппу', color: '#56b3f5' },
      { icon: 'mdi-bugle', title: 'Создать канал', color: '#ed9f20' },
      { icon: 'mdi-account', title: 'Контакты', color: '#f06964' },
      { icon: 'mdi-phone', title: 'Звонки', color: '#6dc534' },
      { icon: 'mdi-bookmark', title: 'Избранное', color: '#56b3f5' },
      { icon: 'mdi-cog', title: 'Настройки', color: '#b580e2' },
      { icon: 'mdi-moon-waning-crescent', title: 'Ночной режим', action: "change_theme", color: '#7595ff', theme: true },
    ]
  }),
  computed: mapGetters(['nav_drawer', 'theme', 'user']),
  methods: {
    ...mapMutations(['open_nav', 'change_theme', 'logout', 'set_molads']),
    navClick(n){
      switch(n){
        case 0: 
          this.set_molads(['modal_create_group', true]);
          this.open_nav(false)
          break;
        case 1: 
          this.set_molads(['modal_create_chanel', true]);
          this.open_nav(false)
          break;
        case 5: 
          this.set_molads(['modal_setting', true]);
          this.open_nav(false)
          break;
        case 6: return this.change_theme((th) => {
          document.body.classList.toggle('light-theme', !th)
          this.$vuetify.theme.dark = th;
        });
      }
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer >>> .v-navigation-drawer__border {
  display: none
}
</style>