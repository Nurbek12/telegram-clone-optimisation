<template>
  <v-app>
    <Navigation />
    <v-main>
      <v-container fluid class="pa-0" v-resize="onResize">
        <ChatList />
        <ChatBox :ws="windowSize" />
        <audio id="sound" :src="require('@/assets/telegram_desktop.mp3')"></audio>
      </v-container>
    </v-main>
    <Dialogs />
    <SlideOverlay />
  </v-app>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import ChatList from '@/components/ChatList.vue';
import ChatBox from '@/components/ChatBox.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Dialogs from '@/components/Dialogs.vue';
import SlideOverlay from '@/components/dialogs/SlideOverlay.vue';

export default {
  data: () => ({
    settingModal: false,
    contactsModal: false,
    createChanelModal: false,
    settingGroupModal: false,
    windowSize: 0,
    // settingModal: false,
  }),
  components: {
    Navigation,
    ChatList,
    ChatBox,
    Dialogs,
    SlideOverlay
},
  computed: {
    ...mapGetters(['nav_drawer'])
  },
  methods: {
    ...mapActions(['getAllChat', 'socketConnection']),
    ...mapMutations(['open_nav', 'change_room']),
    onResize () {
      this.windowSize = window.innerWidth
    },
  },
  mounted(){
    this.onResize()
    this.socketConnection()
    this.getAllChat() 
    window.addEventListener('keyup', (e) => {
      if(e.key.toLowerCase() === 'escape') this.change_room(null)
    })
  }
}
</script>

<style>

</style>