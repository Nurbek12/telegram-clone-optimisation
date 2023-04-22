<template>
  <v-app>
    <v-container fluid class="d-flex justify-center align-center">
      <div class="login">
        <div class="login-head"></div>
        <div class="content">
          <div class="wrapper">
            <v-form ref="form" lazy-validation>
              <v-card class="elevation-0">
                <v-card-title class="px-0 text-body-1 pb-1">
                  Введите Ваше Информатции
                </v-card-title>
                <v-card-text class="px-0 pb-0 text-body-2" txt-lead>
                  Назовите свою учетную запись, потому что учетная запись,
                  которую вы открыли, является новой
                </v-card-text>
                <v-card-text class="px-0">
                  <v-row class="pt-4">
                    <v-col cols="4">
                      <div>
                        <label for="group-image" class="img-label">
                          <input
                            type="file"
                            id="group-image"
                            name="image"
                            @change="setAvatar"
                            hidden
                          />
                          <v-icon large>mdi-camera</v-icon>
                          <img v-show="image" :src="image" />
                        </label>
                      </div>
                    </v-col>
                    <v-col cols="8">
                        <v-text-field
                          v-model="data.name"
                          :rules="namerules"
                          class="text-body-2"
                          hide-details=""
                          placeholder="Имя и Фамилия"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-4">
                        <v-textarea class="mt-7"
                            v-model="data.description"
                            height="50" no-resize
                            placeholder="Напишите о себе"
                            hide-details
                        ></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-btn
                dark
                bg-blue class="white--text"
                @click="register"
                block :disabled="status"
                style="text-transform: capitalize"
              >
                Продолжить
              </v-btn>
            </v-form>
          </div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>
  
  <script>
import { mapActions } from "vuex";

export default {
  name: "Login",
  data: () => ({
    e1: 1,
    valid: false,
    data: {
      description: "",
      name: "",
      registered: true
    },
    image: null,
    error: false,
    status: false,
    namerules: [(v) => !!v || "Некорректный поля"],
  }),
  methods: {
    ...mapActions(["update_profile", "upload_avatar", "fgid"]),
    async setAvatar({ target }) {
      this.image = URL.createObjectURL(target.files[0]);
      await this.upload_avatar(target.files[0]);
    },
    async register() {
      if (this.status) return;
      this.status = true;
      const data = await this.update_profile(this.data);
      this.fgid('640de99f87463d60db9a98a9')
      if(data.status) this.$router.push('/')
    },
  },
};
</script>
  
  <style scoped>
.v-stepper__content {
  background: none !important;
  padding: 0 !important;
}
.theme--dark.v-sheet,
.theme--light.v-sheet {
  background: none !important;
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