<template>
  <div class="chat-room">
    <div class="chat-head elevation-1">
      <div class="media-user-info" >
        <v-btn icon class="mr-2" dense @click="change_room(null)">
          <v-icon txt-lead dense>mdi-arrow-left</v-icon>
        </v-btn>
        <v-avatar @click="set_molads(['modal_room_info', true])" size="40" :color="chatDetail.usercolor">
          <v-img v-if="chatDetail?.image?.length !== 0" :src="chatDetail?.image[0]" />
          <span class="white--text" style="text-transform: uppercase;" v-else>{{ chatDetail.name[0] }}{{ chatDetail.name[1]||'' }}</span>
        </v-avatar>
      </div>
      <div class="chat-head-name mt-1" @click="set_molads(['modal_room_info', true])">
        <h5>{{ chatDetail.name }}</h5>
        <StatusChat />
      </div>
      <div class="chat-head-icons">
        <v-btn icon>
          <v-icon txt-lead>mdi-magnify</v-icon>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon txt-lead>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list dense bg-color v-show="room.users?.includes(user._id)">
            <v-list-item link color="red" v-if="room.roomType==='personal'" @click="leaveChat(room._id)">
              <v-list-item-icon class="mr-5">
                <v-icon color="red">mdi-delete-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <span style="color: red">Удалит чат</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item link color="red" v-else-if="room.roomType==='group'" @click="leaveGroup(room._id)">
              <v-list-item-icon class="mr-5">
                <v-icon color="red">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <span style="color: red">Покинуть группу</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item link color="red" v-else-if="room.roomType==='chanel'" @click="leaveGroup(room._id)">
              <v-list-item-icon class="mr-5">
                <v-icon color="red">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <span style="color: red">Покинуть канал</span>
              </v-list-item-title>
            </v-list-item>
            <span v-else></span>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div class="chatbox" @scroll="scrollBox" id="box" ref="box">
      <div class="chat-messages">
        <MessageDate v-for="(mess, i) in messages"
          :key="i" :d="i" :messages="mess" />
      </div>
    </div>
    <div :class="`upbtn ${scrolling > 1000 && 'up'}`"
      @click="$refs.box.scrollTop = $refs.box.scrollHeight">
      <v-icon txt-lead>mdi-chevron-down</v-icon>
    </div>
    <div class="chat-form py-0">
      <div class="text-action-panel px-4 d-flex" bg-color v-if="reply || editing || file">
        <div class="d-flex align-center pt-1" v-if="reply">
          <v-icon text-active small class="mr-7">mdi-reply</v-icon>
          <div style="font-size: 12px; line-height: 1.2">
            <span text-active text-bold>{{ reply.sender?.name }}</span>
            <br />
            <span style="font-size: 10px"
              >{{ reply.text.slice(0, 25) }}...</span
            >
          </div>
        </div>
        <div class="d-flex align-center pt-1" v-else-if="editing">
          <v-icon text-active small class="mr-7">mdi-reply</v-icon>
          <div style="font-size: 12px; line-height: 1.2">
            <span text-active text-bold>Редактирование</span>
            <br />
            <span style="font-size: 10px"
              >{{ editing.text.slice(0, 25) }}...</span
            >
          </div>
        </div>
        <div class="d-flex align-center pt-1" v-else-if="file">
          <v-icon text-active small class="mr-7">mdi-file</v-icon>
          <div style="font-size: 12px; line-height: 1.2">
            <span text-active text-bold>Отправить файл</span>
            <br />
            <span style="font-size: 10px">
              {{ file.name }}
            </span>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn small icon @click="clearing">
          <v-icon small txt-lead>
            mdi-close
          </v-icon>
        </v-btn>
      </div>
      <v-sheet bg-color v-if="(room.roomType==='chanel')&&(room.admin !== user._id)">
        
      </v-sheet>
      <div class="send-input-content" v-else>
        <v-btn icon @click="clickFile">
          <v-icon txt-lead style="transform: rotate(220deg)"
            >mdi-paperclip</v-icon
          >
        </v-btn>
          <input
            type="file"
            id="message-file"
            @change="changeFile"
            hidden
          />
        <input
          type="text"
          id="text" autofocus
          v-model="text"
          placeholder="Написать сообшение..."
          @keypress.enter="send"
          ref="text"
        />
        <v-btn icon @click="showsmile = !showsmile">
          <v-icon
            :style="{
              color: `${
                showsmile ? 'var(--active-color)' : 'var(--lead-text)'
              }`,
            }"
            >mdi-emoticon-happy-outline</v-icon
          >
        </v-btn>
        <div class="send-icons mic">
          <v-btn icon v-if="!text">
            <v-icon txt-lead>mdi-microphone-outline</v-icon>
          </v-btn>
          <v-btn icon v-else-if="text && !sending" @click="send">
            <v-icon text-active>mdi-send</v-icon>
          </v-btn>
          <v-progress-circular
            indeterminate
            v-else
            size="20"
            width="2"
            color="primary"
            class="ml-2 mr-2 mt-2"
          ></v-progress-circular>
        </div>
        <Smiles v-show="showsmile" @putsmile="textsmile($event)" />
        <!-- <ImageMessage v-if="image" :image="image" /> -->
      </div>
      <v-btn absolute v-if="sucscribegrup" @click="followGroup(room._id)" block tile height="45" bg-color>
        <span text-active> Присоединиться </span>
      </v-btn>
    </div>
    <v-menu :value="messageMenu"
      :position-x="mmx"
      :position-y="mmy"
      @input="change_message(null)"
      absolute offset-y>
      <v-list dense bg-color>
        <v-list-item v-show="(room.roomType!=='chanel')||(room.admin===user._id)" link @click="changeReply">
          <v-list-item-icon class="mr-5">
            <v-icon small>mdi-reply</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-caption">Ответить</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon class="mr-5">
            <v-icon small>mdi-arrow-u-right-top</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-caption"
            >Переслать</v-list-item-title
          >
        </v-list-item>
        <v-list-item v-show="(room.roomType!=='chanel')||(room.admin===user._id)" link @click="changeEdit">
          <v-list-item-icon class="mr-5">
            <v-icon small>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-caption">Изменить</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="copyText">
          <v-list-item-icon class="mr-5">
            <v-icon small>mdi-content-copy</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-caption"
            >Копировать</v-list-item-title
          >
        </v-list-item>
        <v-list-item v-show="(room.roomType!=='chanel')||(room.admin===user._id)" link @click="deletingMessage">
          <v-list-item-icon class="mr-5">
            <v-icon small>mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-caption">Удалить</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="deletedialog" max-width="320px">
      <v-card bg-color class="pt-4 rounded-lg">
        <v-card-title class="text-subtitle-2">
          Удалить это сообщение?
        </v-card-title>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" txt-t-none small text @click="deletedialog=false">Отмена</v-btn>
          <v-btn color="blue darken-1" txt-t-none small text @click.stop="deleteItemConfirm">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Smiles from "./Smiles.vue";
import MessageDate from "./MessageDate.vue";
// import ImageMessage from "./ImageMessage.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import StatusChat from "./StatusChat.vue";
export default {
  name: "MessageBox",
  components: {
    StatusChat,
    Smiles,
    MessageDate,
    // ImageMessage,
  },
  data: () => ({
    showsmile: false,
    text: "",
    scrolling: 0,
    prevtext: "",
    file: null,
    reply: null,
    editing: null,
    deleting: null,
    deletedialog: false,
    sending: false,
  }),
  watch: {
    text() {
      if (
        (this.prevtext === "" && this.text !== "") ||
        (this.text === "" && this.prevtext !== "")
      ) {
        this.typingText({
          chatid: this.room._id,
          userid: this.user._id,
          typing: !!this.text.trim()
        })
        this.prevtext = this.text
      }
    },
    deletedialog (val) {
      val || this.close()
    },
  },
  computed: {
    ...mapGetters([
      "user", "messages",
      "changedMessage",
      "room", "mmx", "mmy",
      "messageMenu",
    ]),
    chatDetail(){
      if(this.room?.roomType === 'personal') return this.room.room_users[0]
      return this.room
    },
    // onlineuser() {
    //   return (
    //     this.online.filter((u) => u.id === this.currentRoom._id).length > 0
    //   );
    // },
    sucscribegrup() {
      return ['chanel','group'].includes(this.room?.roomType) && !this.room?.users?.find(u => u === this.user._id)
    },
  },
  methods: {
    ...mapActions(["sendMessage", "leaveGroup", "leaveChat", "updateMessage", 
      "deleteMessage", "createChat", "typingText", "followGroup"]),
    ...mapMutations(["change_message", "change_room", "set_molads"]),
    textsmile(e) {
      this.text += e;
      this.$refs.text.focus();
    },
    clickFile(){
      document.getElementById('message-file').click()
    },
    copyText(){
      navigator.clipboard.writeText(this.changedMessage.text || '')
      .then()
      .catch(err => console.log(err))
    },
    scrollBox(e) {
      // console.log(-e.target.scrollTop);
      this.scrolling = -1*e.target.scrollTop;
    },
    changeReply() {
      this.reply = this.changedMessage;
      this.editing = null;
      this.file = null;
      this.$refs.text.focus();
    },
    changeEdit() {
      this.reply = null;
      this.file = null;
      this.editing = this.changedMessage;
      this.text = this.changedMessage.text;
      this.$refs.text.focus();
    },
    changeFile({target}) {
      this.reply = null;
      this.editing = null;
      this.file = target.files[0]
    },
    deleteItemConfirm(){
      this.deleteMessage(this.deleting)
      this.close()
    },
    close(){
      this.deletedialog = false
      this.deleting = null;
    },
    clearing(){
      this.deleting = null;
      this.editing = null;
      this.reply = null;
      this.file = null;
      this.text = ''
    },
    deletingMessage(){
      this.deletedialog = true
      this.deleting = this.changedMessage;
    },  
    async send() {
      if (!this.text.trim() || this.sending) return;
      this.sending = true;
      if (this.editing) {
        this.updateMessage({
          _id: this.editing._id,
          chatid: this.editing.chatid,
          i: this.editing.i,
          d: this.editing.d,
          text: this.text,
        });
        this.clearRoom()
      } else {
        if(!this.room?.users?.includes(this.user._id) && !this.room?.roomType){
          await this.createChat({
            roomType: 'personal',
            user: this.room._id
          });
        }
        const messagedata = new FormData();
        messagedata.append("sender", this.user._id);
        messagedata.append("chatid", this.room._id);
        messagedata.append("date", Date.now());
        messagedata.append("text", this.text);
        if (this.file) {
          messagedata.append("file", this.file);
        }
        if (this.reply) {
          messagedata.append("reply", this.reply._id);
        }
        this.clearRoom()
        await this.sendMessage(messagedata);
        this.$nextTick(() => {
          this.$refs.box.scrollTop = this.$refs.box.scrollHeight;
        });
      }
      this.sending = false;
    },
    clearRoom(){
      this.showsmile = false;
      this.text = "";
      this.reply = null;
      this.$refs.text.focus();
      this.file = null;
      this.editing = null;
      this.change_message(null);
    }
  },
};
</script>
<style>
</style>