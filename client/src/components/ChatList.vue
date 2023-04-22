<template>
  <div class="chat-list">
    <div class="chat-list-head">
        <v-btn icon @click="open_nav(true)">
            <v-icon dense txt-lead>mdi-menu</v-icon>
        </v-btn>
        <div class="search-input-wrapper">
          <input type="text" class="search-input" 
            v-model="search" placeholder="Поиск"
            @input="searching">
          <div class="icons" v-if="search">
            <v-progress-circular v-if="searchLoading" txt-lead
              indeterminate width="2" size="20" class="mr-1"
            ></v-progress-circular>
            <v-btn v-else absolute icon small txt-lead @click="clearing">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
        <v-btn icon>
          <v-icon txt-lead>mdi-lock-open-variant</v-icon>
        </v-btn>
    </div>
    <div class="chat-items">
        <v-subheader v-if="this.search.trim()" class="text-caption" txt-lead>{{ this.searchchats.length !== 0 ? 'Результаты поиска' :  'Нечего не найдено'}}</v-subheader>
        <v-list dense class="pa-0" color="transparent">
          <ChatListItem v-for="(chat, j) in chatList" :key="j" :chat="chat"/>
        </v-list>
    </div>
    <div :class="`button-up ${scrolling > 500 ? 'up' : ''}`" @click="$refs.list.scrollTop = 0">
      <v-icon txt-lead>mdi-chevron-up</v-icon>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import ChatListItem from "./ChatListItem.vue";

export default {
    name: "ChatList",
    data: () => ({
      search: "",
      chatIndex: undefined,
      searchchats: [],
      scrolling: 0,
      searchLoading: false,
    }),
    watch: {
      search() {
        if (this.search === "") this.clearing();
      }
    },
    methods: {
        ...mapActions(["searchUsers"]),
        ...mapMutations(["open_nav"]),
        async searching() {
          if (!this.search.trim() || this.searchLoading)
          return this.searchchats = [];
          this.searchLoading = true;
          const data = await this.searchUsers(this.search);
          this.searchchats = data;
          setTimeout(() => {
              this.searchLoading = false;
          }, 500);
        },
        clearing() {
          this.search = "";
          this.searchchats = [];
          this.searchLoading = false;
        }
    },
    computed: {
      ...mapGetters(["user", 'sorted_rooms', 'rooms']),
      chatList() {
        if(!this.search.trim()) return this.sorted_rooms
        return this.searchchats;
      }
    },
    components: { ChatListItem }
};
</script>
<style scoped>
.v-sheet.v-list:not(.v-sheet--outlined) {
    box-shadow: none;
}
.v-subheader {
    height: 25px !important;
}
</style>