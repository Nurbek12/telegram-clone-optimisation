<template>
    <div v-if="!message.sender" class="message-wrapper" v-intersect="!message.view&&viewMess(message)">
      <div class="message-alert">{{ message.text }}</div>
    </div>
    <div v-else :id="message._id" v-intersect="!message.view&&viewMess(message)" @contextmenu="(e) => changeMess(e, message)" :class="`message-wrapper ${(message.sender._id !== user_id)||(room.roomType==='chanel')? 'out': 'me'}`">
      <div class="message-image"  v-if="room.roomType === 'group' &&message.sender._id !== user_id">
        <div class="imgbox">
          <v-avatar :color="message.sender.usercolor" size="39">
            <v-img v-if="message.sender.image?.length !== 0" :src="message.sender?.image[0]" />
            <span v-else class="white--text" style="text-transform: uppercase;">{{ message.sender.name[0] }}{{ message.sender.name[1] || '' }}</span>
          </v-avatar>
        </div>
      </div>

      <div :class="`message ${(message.sender._id !== user_id)||(room.roomType==='chanel')? 'out': 'me'} ${['.jpg','.bmp','.jfif','.gif','.png','.mp4','.3pg','.mov','.avi','.wmv'].includes(message.filetype)?'has-image':'name-none'}`">
        <span class="name" usn :style="`color: ${message.sender.usercolor}`"
          v-if="(room.roomType === 'group' && message.sender !== null &&message.sender._id !== user_id)">
          {{ message.sender.name }}
        </span>
        <span class="name" usn :style="`color: ${room.usercolor}`"
          v-else-if="room.roomType==='chanel'">
          {{ room.name }}
        </span>
        <div block v-if="message.reply" @click="scrollToReply(message.reply._id)" text tile class="replyed mt-1" 
          small v-ripple >
          <span text-active text-bold>{{ message.reply.sender.name }}</span>
          <span>{{ message.reply.text }}</span>
        </div>
        <MessageFile :file="message.file" :filetype="message.filetype" v-if="message.file" />
        <p class="mb-0">
          {{ message.text }}
          <span v-if="message.sender !== null" :style="`color: var(--${(message.sender._id === user_id)&&(room.roomType!=='chanel') ? 'active-color' : 'lead-text'});`" class="mess-time">
            <span v-show="message.createdAt.toString() !== message.updatedAt.toString()" style="font-size: 11px; margin-right: 3px;">изменено</span>
            {{ new Date(message.date).toString().slice(16, 21) }}
            <v-icon v-if="(message.sender._id === user_id)&&(room.roomType!=='chanel')" class="ml-1" small text-active>{{!message.view?'mdi-check':'mdi-check-all'}}</v-icon>
          </span>
        </p>
      </div>
    </div>
</template>

<script>
import MessageFile from './MessageFile.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
    props: ['message', 'i', 'd'],
    data: () => ({}),
    components: {
      MessageFile
    },
    computed: mapGetters(['user_id', 'room']),
    methods: {
      ...mapActions(['viewMessage']),
      ...mapMutations(['change_mm_post', 'change_message']),
      changeMess(e, mess){
        e.preventDefault()
        this.change_message({...mess, i: this.i, d: this.d})
        this.change_mm_post({x: e.clientX, y: e.clientY})
      },
      viewMess(mess){
        if(this.user_id !== mess.sender?._id) this.viewMessage({ ...mess, i: this.i, d: this.d })
      },
      scrollToReply(id){
        const reply = document.getElementById(id)
        const chatbox = document.getElementById('box')
        if (reply) {
            reply.style.background = '#fff3'
            const messageRect = reply.getBoundingClientRect();
            const boxRect = chatbox.getBoundingClientRect();
            const offsetTop = messageRect.top - chatbox.clientHeight / 2 - boxRect.top + chatbox.scrollTop;
            // const offsetTop = messageRect.top + messageRect.height / 2 - boxRect.top - chatbox.clientHeight / 2;
            chatbox.scrollTo({ top: offsetTop });
              setTimeout(() => {
                reply.style.background = 'transparent'
              }, 2000)
        }
      }
    },
}
</script>

<style>

</style>