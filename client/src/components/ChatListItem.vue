<template>
  <v-list-item link dense class="px-3"
    @click="change_room(chat)" :class="(room?._id === chat?._id)?'primary--text v-item--active v-list-item--active':''">
    <v-badge bordered bottom dot offset-x="25" offset-y="22" :value="chat.roomType==='personal'?1:0" :color="isOnline(chatDetail._id)?'green':'grey'">
      <v-list-item-avatar class="ml-0 d-flex justify-center" size="45" :color="chatDetail.usercolor">
        <v-img v-if="chatDetail?.image?.[0]" :src="chatDetail?.image[0]" />
        <span v-else class="white--text" style="text-transform: uppercase;">{{ chatDetail.name[0] }}{{ chatDetail.name[1] || '' }}</span>
      </v-list-item-avatar>
    </v-badge>

    <v-list-item-content>
      <v-list-item-title>
        <v-icon small txt-color v-if="chat.roomType">{{ chaticon }}</v-icon>
        <span txt-color>
          {{ chatDetail.name }}
        </span>
      </v-list-item-title>
      <v-list-item-subtitle class="mt-2 text-caption d-flex align-center" txt-lead>
        <div class="mr-2" v-if="['.jpg','.bmp','.jfif','.gif','.png'].includes(chat.lastMessage?.filetype)" >
          <v-img height="20" width="30px"
            :src="chat.lastMessage.file"></v-img>
        </div>
          {{chat.lastMessage?.text || chat.roomType}}
      </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-icon>
      <div>
        <p txt-lead class="text-caption mb-0">
          <!-- <v-icon v-if="chat.lastMessage.sender?._id === user_id" class="ml-1" small text-active>{{!chat.lastMessage?.view?'mdi-check':'mdi-check-all'}}</v-icon> -->
          {{ new Date(chat.lastMessage?.date).toString().slice(16, 21) }}
        </p>
        <v-chip v-if="chat.not_viewed" dark small color="blue" class="ml-2 mt-1 px-2 py-0" style="height: 22px;">{{ chat.not_viewed }}</v-chip>
      </div>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    props: ['chat'],
    methods: {
      ...mapMutations(["change_room"]),
      isOnline(id){
        return this.online.includes(id)
      }
    },
    computed: {
      ...mapGetters(['room', 'online', 'user_id']),
      chatDetail(){
        if(this.chat?.roomType === 'personal') return this.chat.room_users[0] || {}
        return this.chat || {}
      },
      chaticon(){
        if(this.chat.roomType==='personal') return 'mdi-account'
        else if(this.chat.roomType==='group') return 'mdi-account-group'
        else if(this.chat.roomType==='chanel') return 'mdi-bugle'
        else if(this.chat.roomType==='bot') return 'mdi-robot'
        else return 'mdi-account'
      }
    }
};
</script>

<style>
</style>