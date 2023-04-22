<template>
  <v-card bg-color class="pt-4 rounded-lg">
    <v-card-text>
      <v-form v-model="valid" ref="form1" lazy-validation>
        <v-row class="pt-4" align="center">
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
                <v-icon large dark>mdi-camera</v-icon>
                <img v-show="imageurl" :src="imageurl" />
              </label>
            </div>
          </v-col>
          <v-col cols="8">
            <v-text-field
              v-model="data.name"
              :rules="namerules"
              class="text-body-2"
              dense
              hide-details=""
              autofocus
              @keypress.enter="validation"
              label="Называние канала"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              class="mt-1"
              dense
              v-model="data.description"
              placeholder="Описание (необязательно)"
              @keypress.enter="validation"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions class="pt-0">
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        txt-t-none
        text
        @click="set_molads(['modal_create_chanel', false])"
        >Отмена</v-btn
      >
      <v-btn color="blue darken-1" txt-t-none text @click.stop="validation"
        >Далее</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
    data: () => ({
        valid: false,
        namerules: [(v) => !!v || "Некорректный поля"],
        data: {
            name: '',
            description: '',
        },
        image: null,
        imageurl: null,
    }),
    methods: {
        ...mapMutations(['set_molads']),
        ...mapActions(['createChanel']),
        validation(e){
            e.preventDefault();
            if(this.$refs.form1.validate()) {
                this.creagechanel()
            }
        },
        setAvatar({ target }) {
            if(target.files.length === 0) return;
            this.imageurl = URL.createObjectURL(target.files[0]);
            this.image = target.files[0]
        },
        creagechanel(){
            const fdata = new FormData()
            fdata.append('name', this.data.name);
            fdata.append('roomType', 'chanel')
            if(this.image) fdata.append('image', this.image)
            this.createChanel(fdata)
            this.set_molads(['modal_create_chanel', false])
            this.$refs.form1.reset()
        },
    }
};
</script>

<style>
</style>