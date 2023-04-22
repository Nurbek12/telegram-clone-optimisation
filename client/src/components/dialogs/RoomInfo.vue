<template>
  <v-card bg-color class="pt-3 rounded-lg">
    <v-card-text class="pr-3 pb-0">
      <div class="d-flex align-center">
        <div style="font-size: 16px; font-weight: 500" usn txt-color>
          Информация
        </div>
        <v-spacer />
        <v-btn icon>
          <v-icon txt-lead>mdi-dots-vertical</v-icon>
        </v-btn>
        <v-btn icon @click="$emit('closing')">
          <v-icon txt-lead>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-card-text>
    <v-list-item two-line dense>
      <v-list-item-avatar class="ml-0 d-flex justify-center" size="70" :color="chatDetail.usercolor">
        <v-img v-ripple v-if="chatDetail?.image?.length !== 0" :src="chatDetail?.image[0]" @click="set_images(chatDetail.image)" />
        <span v-else class="white--text" style="text-transform: uppercase;" usn>{{ chatDetail.name[0] }}{{ chatDetail.name[1] || '' }}</span>
      </v-list-item-avatar>
      <v-list-item-content class="py-4">
        <v-list-item-title class="text-body-1 mb-2">{{
          chatDetail.name
        }}</v-list-item-title>
        <v-list-item-subtitle txt-color usn>
          <span v-if="room.roomType === 'group'" txt-lead>{{ room?.users?.length || 0 }} участников</span>
          <span v-else-if="room.roomType === 'chanel'" txt-lead>{{ room?.users?.length }} подписчиков</span>
          <span text-active v-else-if="isOnline(chatDetail._id)">в сети</span>
          <span v-else txt-lead>был(а) недавно</span>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-sheet
      color="grey lighten-3"
      elevation="1"
      height="10"
      style="opacity: 0.1"
      width="100%"
    ></v-sheet>
    <v-list color="transparent" dense>
      <v-list-item v-if="chatDetail.email">
        <v-list-item-icon class="pl-2 pt-3">
          <v-icon>mdi-information-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ chatDetail.email }}</v-list-item-title>
          <v-list-item-subtitle usn txt-lead>Электронный адрес</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="chatDetail.description">
        <v-list-item-icon class="ml-2">
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ chatDetail.description }}</v-list-item-title>
          <v-list-item-subtitle usn txt-lead>О себе</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="chatDetail.username" class="py-1">
        <v-list-item-icon class="ml-2">
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ chatDetail.username }}</v-list-item-title>
          <v-list-item-subtitle usn txt-lead>Имя пользователя</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <!-- <v-list-item class="px-0">
        <v-btn block text text-active tile>Отправить сообшение</v-btn>
      </v-list-item> -->
    </v-list>
    <v-list dense color="transparent" v-if="room.roomType === 'group'">
      <v-list-item link dense class="px-3" v-if="room.users.includes(user._id)" @click="changeMe">
        <v-list-item-avatar
          class="ml-0 d-flex justify-center"
          size="45" :color="user.usercolor">
          <v-img v-if="user?.image?.length !== 0"
            :src="user?.image[0]" />
          <span v-else class="white--text" usn style="text-transform: uppercase">
            {{ user.name[0] }}{{ user.name[1] || "" }}
          </span>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title txt-color>{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle class="mt-2 text-caption">
            <span text-active v-if="isOnline(user._id)">в сети</span>
            <span v-else>был(а) недавно</span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link dense class="px-3" v-for="ruser in room.room_users || []"
       :key="ruser._id" @click="changeUser(ruser)">
        <v-list-item-avatar
          class="ml-0 d-flex justify-center"
          size="45" :color="ruser.usercolor">
          <v-img v-if="ruser?.image?.length !== 0"
            :src="ruser?.image[0]" />
          <span v-else class="white--text" style="text-transform: uppercase">
            {{ ruser.name[0] }}{{ ruser.name[1] || "" }}
          </span>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title txt-color>{{ ruser.name }}</v-list-item-title>
          <v-list-item-subtitle class="mt-2 text-caption">
            <span text-active v-if="isOnline(ruser._id)">в сети</span>
            <span v-else>был(а) недавно</span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data: () => ({
    links: [
      {
        icon: "mdi-account-circle",
        title: "Изменить профиль",
        color: "#ed9f20",
      },
      { icon: "mdi-bell", title: "Уведомления и звуки", color: "#f06964" },
      { icon: "mdi-lock", title: "Конфиденциальность", color: "#6dc534" },
      { icon: "mdi-chat", title: "Настройки чатов", color: "#56b3f5" },
      { icon: "mdi-folder", title: "Папки", color: "#7595ff" },
      {
        icon: "mdi-chart-pie",
        title: "Продвинутые настройки",
        color: "#b580e2",
      },
      { icon: "mdi-phone", title: "Настройки звонков", color: "#6dc534" },
      { icon: "mdi-web", title: "Язык", color: "#f2925b" },
    ],
  }),
  computed: {
    ...mapGetters(["room", 'user', 'online', 'modal_room_info']),
    chatDetail(){
      if(this.room?.roomType === 'personal') return this.room.room_users[0] || {}
      return this.room || {}
    },
  },
  methods: {
    ...mapMutations(['set_images', "change_room", "set_molads"]),
    isOnline(id){
      return this.online.includes(id)
    },
    changeUser(chat){
      this.change_room(chat)
      this.set_molads(['modal_room_info', false])
    },
    changeMe(){
      this.set_molads(['modal_room_info', false])
      this.set_molads(['modal_setting', true])
    }
  }
};
</script>

<style>
</style>