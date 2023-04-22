<template>
  <v-stepper v-model="e1" height="500px" bg-color>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card bg-color class="rounded-lg">
          <v-card-text class="pr-3 pb-0">
            <div class="d-flex align-center">
              <div style="font-size: 16px; font-weight: 500" usn txt-color>
                Настройки
              </div>
              <v-spacer />
              <!-- <v-btn icon>
                <v-icon txt-lead>mdi-dots-vertical</v-icon>
              </v-btn> -->
              <v-btn icon @click="$emit('closing')">
                <v-icon txt-lead>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-text>
          <v-list-item three-line>
            <v-list-item-avatar size="70" class="d-flex justify-center" :color="user.usercolor">
              <v-img v-ripple v-if="user.image[0]" :src="user.image[0]" 
                @click="set_images(user.image)" />
              <span v-else class="white--text" usn style="text-transform: uppercase">
                {{ user.name[0] }}{{ user.name[1] || "" }}
              </span>
            </v-list-item-avatar>
            <v-list-item-content class="py-4">
              <v-list-item-title class="text-body-1">{{
                user.name
              }}</v-list-item-title>
              <v-list-item-subtitle txt-color>
                {{ user.email }}
              </v-list-item-subtitle>
              <v-list-item-subtitle usn>
                {{ user.username ? "@" + user.username : "Не задано" }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-sheet
            color="grey lighten-3"
            elevation="1"
            height="10"
            width="100%"
            style="opacity: 0.1"
          ></v-sheet>
          <v-list dense color="transparent">
            <v-list-item
              v-for="(link, i) in links"
              :key="i"
              link
              @click="e1 = 2"
            >
              <v-list-item-icon class="mr-5">
                <v-chip label dark small class="px-1 ml-1" :color="link.color">
                  <v-icon small>{{ link.icon }}</v-icon>
                </v-chip>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title font-sans>{{
                  link.title
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <!-- <v-card-text>
            Имя пользователя
              Это имя пользователя доступно.
              Это имя пользователя уже доступно.
              Допустимые символы: a-z, 0-9, _.
              Слишком короткое имя пользователя.
      
              Вы можете выбрать публичное имя пользователя. Другие пользователи смогут найти Вас и связаться, не зная Вашего почта.
              Можно использовать символы a-z, 0-9 и подчёркивание. Минимальная длина - 5 символов.
          </v-card-text> -->
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card bg-color class="rounded-lg">
          <v-card-text class="pr-3 pl-2 pb-0">
            <div class="d-flex align-center">
              <v-btn icon class="mr-3" @click="e1 = 1">
                <v-icon dense txt-lead>mdi-arrow-left</v-icon>
              </v-btn>
              <div style="font-size: 16px; font-weight: 500" usn txt-color>
                Информация
              </div>
              <v-spacer />
              <v-btn icon @click="$emit('closing')">
                <v-icon txt-lead>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-card-text>
          <div class="d-flex align-center flex-column mt-4">
            <div style="position: relative;">
              <v-avatar size="95" :color="user.usercolor">
                <v-img v-ripple v-if="user.image[0]" :src="user.image[0]" @click="set_images(user.image)" />
                <span
                  v-else
                  class="white--text"
                  style="text-transform: uppercase"
                >
                  {{ user.name[0] }}{{ user.name[1] || "" }}
                </span>
              </v-avatar>
              <v-btn @click="changeFile" 
                dark absolute bg-blue icon bg-active width="33" height="33" style="bottom: -5px; right: -5px; border: 2px solid var(--bg-1-color);">
                <v-icon size="18" color="white" class="mt-1">mdi-camera</v-icon>
              </v-btn>
              <!-- <v-btn @click="changeChatBg" 
                dark absolute bg-blue icon bg-active width="33" height="33" style="bottom: -5px; right: -40px; border: 2px solid var(--bg-1-color);">
                <v-icon size="18" color="white" class="mt-1">mdi-image-outline</v-icon>
              </v-btn> -->
              <input type="file"
                id="setting-avatar-image"
                name="image"
                @change="upload_avatar($event.target.files[0])"
                hidden accept="image/png, image/gif, image/jpeg"
              />
              <!-- <input type="file"
                id="setting-chatbg-image"
                name="image"
                @change="set_chat_bg($event.target.files[0])"
                hidden accept="image/png, image/gif, image/jpeg"
              /> -->
            </div>
            <v-list-item-title class="text-body-1 mt-2" usn>
              {{ user.name }}
            </v-list-item-title>
            <span usn text-active style="line-height: 1.3" class="text-body-2"
              >в сети</span
            >
          </div>
          <v-list dense color="transparent" class="mt-4">
            <v-list-item v-for="(item, i) in setting" :key="i">
              <v-list-item-icon class="mr-5">
                <v-chip label dark small
                  class="px-1 ml-1 mt-2"
                  :color="item.color">
                  <v-icon small>{{ item.icon }}</v-icon>
                </v-chip>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title font-sans>
                  <v-text-field
                    class="text-body-2"
                    hide-details
                    dense v-model="userDetails[item.value]"
                    :placeholder="item.title"
                  ></v-text-field>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item class="mt-2">
              <v-list-item-content>
                <v-list-item-title font-sans>
                  <v-btn block text text-active :disabled="!updating || validating" 
                  @click="update_profile(userDetails)">Сохранить</v-btn>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data: () => ({
    userDetails: {
      name: '',
      email: '',
      username: '',
      description: ''
    },
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
    setting: [
      {
        icon: "mdi-account",
        title: "Имя и Фамилия",
        color: "#56b3f5",
        value: "name",
      },
      {
        icon: "mdi-phone",
        title: "Электронная почта",
        color: "#6dc534",
        value: "email",
      },
      {
        icon: "mdi-at",
        title: "t.me/username",
        color: "#ed9f20",
        value: "username",
      },
      {
        icon: "mdi-text",
        title: "О себе",
        color: "#f06964",
        value: "description",
      },
    ],
    image: null,
    e1: 1,
  }),
  computed: {
    ...mapGetters(["user"]),
    updating(){
      if(
        this.userDetails.name === this.user.name &&
        this.userDetails.email === this.user.email &&
        this.userDetails.username === this.user.username &&
        this.userDetails.description === this.user.description
      )return false
      return true
    },
    validating(){
      if(
        this.userDetails.name === '' ||
        this.userDetails.email === ''
      ) return true
      return false
    }
  },
  created(){
    this.userDetails = Object.assign({}, this.user)
  },
  methods: {
    ...mapMutations(['set_images', 'set_chat_bg']),
    ...mapActions(['update_profile', 'upload_avatar']),
    changeFile(){
      document.getElementById('setting-avatar-image').click()
    },
    changeChatBg(){
      document.getElementById('setting-chatbg-image').click()
    }
  }
};
</script>


<style scoped>
.v-stepper__content {
  background: none !important;
  padding: 0 !important;
}
.v-sheet.v-stepper:not(.v-sheet--outlined) {
  box-shadow: none !important;
}
.theme--light.v-otp-input .v-input .v-input__control .v-input__slot,
.theme--dark.v-otp-input .v-input .v-input__control .v-input__slot {
  background: transparent !important;
}
.theme--dark.v-otp-input .v-input .v-input__control .v-input__slot {
  background: none !important;
}
</style>