<template>
  <div>
    <v-dialog transition="slide-x-reverse-transition" @input="$event=>set_molads(['modal_create_group', $event])"
        :value="modal_create_group" max-width="360px">
      <v-card bg-color class="pt-4 rounded-lg" v-if="modal_create_group">
        <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
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
                          class="text-body-2" dense
                          hide-details="" autofocus
                          @keypress.enter="validation"
                          label="Называние группы"
                        ></v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" v-if="!modal_create_group">
                        <v-text-field class="mt-1"
                            v-model="data.description"
                            placeholder="Описание (необязательно)"
                            hide-details txt-lead
                        ></v-text-field>
                    </v-col> -->
                  </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" txt-t-none text @click="set_molads(['modal_create_group', false])">Отмена</v-btn>
          <v-btn color="blue darken-1" txt-t-none text @click.stop="validation">Далее</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog transition="slide-x-reverse-transition" @input="$event=>set_molads(['modal_create_chanel', $event])"
        :value="modal_create_chanel" max-width="360px">
      <CreateChanel v-if="modal_create_chanel" />
    </v-dialog>
    <v-dialog transition="slide-x-reverse-transition" @input="$event=>set_molads(['modal_room_info', $event])" :value="modal_room_info" max-width="390px">
      <RoomInfo v-if="modal_room_info" @closing="set_molads(['modal_room_info', false])" />
    </v-dialog>
    <v-dialog transition="slide-x-reverse-transition" @input="$event=>set_molads(['modal_setting', $event])" 
      :value="modal_setting" max-width="390px">
      <Settings @closing="set_molads(['modal_setting', false])" />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Settings from './dialogs/Settings.vue';
import RoomInfo from './dialogs/RoomInfo.vue';
import CreateChanel from './dialogs/CreateChanel.vue';

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
    computed: {
        ...mapGetters(['modal_create_group', 'modal_create_chanel', 'modal_room_info', 'modal_setting'])
    },
    methods: {
        ...mapActions(['createGroup']),
        ...mapMutations(['set_molads']),
        creageGroup(){
            const fdata = new FormData()
            fdata.append('name', this.data.name);
            fdata.append('roomType', 'group')
            if(this.image) fdata.append('image', this.image)
            this.createGroup(fdata)
            this.set_molads(['modal_create_group', false])
            this.$refs.form.reset()
        },
        setAvatar({ target }) {
            if(target.files.length === 0) return;
            this.imageurl = URL.createObjectURL(target.files[0]);
            this.image = target.files[0]
        },
        validation(e){
            e.preventDefault();
            if(this.$refs.form.validate()) {
                this.creageGroup()
            }
        }
    },
    components: {
      Settings,
      RoomInfo,
      CreateChanel,
    },
}
</script>

<style>

</style>