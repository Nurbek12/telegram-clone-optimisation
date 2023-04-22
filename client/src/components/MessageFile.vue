<template>
    <img :src="file" v-if="['.jpg','.bmp','.jfif','.gif','.png'].includes(filetype)" @click="set_images([file])">
    <video height="120" :src="file" preload="none" controls v-else-if="['.mp4','.3pg','.mov','.avi','.wmv'].includes(filetype)"></video>
    <a v-else-if="['.pdf','.doc','.xsl','.docx','.ppt'].includes(filetype)"
        class="message-file" :href="file" target="_blank">
        <v-btn icon class="mr-1">
            <v-icon >mdi-file</v-icon>
        </v-btn>
        <p>{{ file.toString().split('/')[3] }}</p>
    </a>
    <div v-else-if="['.mp3', '.wma', '.ogg', '.m4a'].includes(filetype)"
        class="message-file">
        <v-btn icon class="mr-1" @click="playing(file)">
            <v-icon v-if="!paused">mdi-pause</v-icon>
            <v-icon v-else>mdi-play</v-icon>
        </v-btn>
        <p>
            <span>
                {{ file.toString().split('/')[3] }}
            </span>
            <v-progress-linear @change="set_time"
                :value="time" class="mt-1"
                color="light-blue" height="6"
            ></v-progress-linear>
        </p>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
    props: ['file', 'filetype'],
    data: () => ({
        time: 0,
        paused: true,
    }),
    computed: {
        ...mapGetters(['media']),
    },
    methods: {
        ...mapMutations(['play', 'set_images']),
        playing(file){
            if(this.media.src !== file) this.play(file)
            if(this.media.paused) this.media.play()
            else if(!this.media.paused) this.media.pause()
            this.paused = this.media.paused
        },
        set_time(t){
            if(this.media.src && this.media.src === this.file)
            this.media.currentTime = this.media.duration * t / 100;
        }
    },
    created(){
        if(this.media.src === this.file) this.paused = this.media.paused;
    },
    mounted(){
        this.media.addEventListener('timeupdate', (e) => {
            if(this.media.src === this.file) {
                const {duration, currentTime} = e.srcElement;
                this.time = (currentTime / duration) * 100;
            }
        })
        this.media.addEventListener('play', () => {
            if(this.media.src !== this.file) {
                this.paused = true
                this.time = 0
            }
        })
    }
}
</script>

<style>

</style>