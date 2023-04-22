<template>
    <v-overlay z-index="1000" :value="modal_overlay" opacity=".9">
        <v-img max-width="100vw" max-height="100vh" :src="images[n-1]"></v-img>
        <div style="position: absolute; top: 0; right: 0;">
            <v-btn v-if="modal_setting" @click="removeAvatar" tile color="gray" small dark>
                <v-icon small>mdi-delete</v-icon>
            </v-btn>
            <v-btn @click.stop="set_images(null)" tile color="red" 
                small dark>
                <v-icon small>mdi-close</v-icon>
            </v-btn>
        </div>
        <v-footer fixed color="transparent" v-if="images.length!==1">
            <v-row justify="center" class="py-2">
                <v-pagination :length="images.length" v-model="n"></v-pagination>
            </v-row>
        </v-footer>
    </v-overlay>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  data: () => ({
    n: 1,
  }),
  computed: mapGetters(['modal_overlay', 'images', 'theme', 'modal_setting']),
  methods: {
    ...mapMutations(['set_images']),
    ...mapActions(['remove_avatar']),
    removeAvatar(){
        this.remove_avatar(this.images[this.n-1])
        this.images.splice(this.n-1, 1)
    }
  }
}
</script>

<style>
.v-overlay__content {
    position: static !important;
}
</style>