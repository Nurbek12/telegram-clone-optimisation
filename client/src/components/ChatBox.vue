<template>
  <transition name="chatbox">
    <div class="chat-box" :style="chatbg&&`background: url(${chatbg});`" v-if="room || ws>=600">
      <div class="message-alert" v-if="!room">
        Выберите, кому хотели бы написать
      </div>
      <MessageBox v-else />
    </div>
  </transition>
</template>
<!-- :class="room&&'d-block'"  -->
<script>
import MessageBox from "./MessageBox.vue";
import { mapGetters } from "vuex";
export default {
  props: ['ws'],
  name: "ChatBox",
  computed: mapGetters(["room", "chatbg"]),
  components: {
    MessageBox,
  },
};
</script>

<style>
@media screen and (max-width: 600px) {
  .chatbox-enter-active,
  .chatbox-leave-active {
    transition: 0.1s;
    transform: translateX(0px);
  }
  
  .chatbox-enter,
  .chatbox-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
}
</style>
  