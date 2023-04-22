<template>
  <v-app>
    <v-container fluid class="d-flex justify-center align-center">
      <div class="login">
        <div class="login-head"></div>
        <div class="content">
          <v-stepper v-model="e1" width="300">
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-form ref="form" lazy-validation>
                  <v-card class="elevation-0">
                    <v-card-title class="px-0 text-body-1 pb-1"
                      >Ваш электронная почта</v-card-title
                    >
                    <v-card-text class="px-0 pb-0 text-body-2" txt-lead
                      >Введите свой электронная почту.</v-card-text
                    >
                    <v-card-text class="px-0">
                      <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        class="text-body-2"
                        @keydown.enter="(e) => { e.preventDefault(); validate() }"
                        placeholder="example@domain.com"
                      ></v-text-field>
                    </v-card-text>
                  </v-card>

                  <v-btn
                    dark
                    bg-blue
                    @click="validate"
                    block class="white--text"
                    style="text-transform: capitalize;"
                    >Продолжить</v-btn
                  >
                </v-form>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="elevation-0">
                  <v-card-title class="px-0 text-body-1 pb-1">
                    {{ email }}
                  </v-card-title>
                  <v-card-text class="px-0 pb-0 text-body-2" 
                    txt-lead>
                    Если Вы используете это почту, код отправлен через Gmail.
                  </v-card-text>
                  <v-card-text class="px-0 pb-0 text-caption amber--text">
                    Eсли вы не получили код, обновите страницу и снова введите адрес электронной почты
                  </v-card-text>
                  <v-card-text v-if="error" class="px-0 pb-0 text-caption red--text">
                    Не верный парол
                  </v-card-text>
                  <v-card-text class="px-0">
                    <v-otp-input v-model="code"
                      type="password" length="5"
                    ></v-otp-input>
                  </v-card-text>
                </v-card>

                <v-btn
                  dark class="white--text"
                  bg-blue
                  @click="verifycode"
                  block style="text-transform: capitalize">
                  Продолжить
                </v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
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
    email: "",
    code: "",
    error: false,
    emailRules: [
      (v) => !!v || "Некорректный электронная адрес. Попробуйте еще раз.",
      (v) =>
        /.+@.+\..+/.test(v) ||
        "Некорректный электронная адрес. Попробуйте еще раз.",
    ],
  }),
  methods: {
    ...mapActions(["login", "verify"]),
    validate() {
      if (this.$refs.form.validate()) {
        this.sendEmail();
      }
    },
    sendEmail() {
      if (!this.email.trim()) return;
      this.login({ email: this.email });
      this.e1 = 2;
    },
    async verifycode(){
      if (!this.code.trim()) return;
      const data = await this.verify({ email: this.email, code: this.code });
      if(data.status){
        this.error = false
        if(data.result.registered) this.$router.push('/')
        else this.$router.push('/register')
      }else{
        this.error = true
      }
    }
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
.theme--dark.v-otp-input .v-input .v-input__control .v-input__slot{
  background: none !important;
}
</style>