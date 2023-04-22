<template>
  <div>
    <span v-if="typedusers?.length > 0 && room.roomType !== 'chanel'">
      <TypingAnimation :typing="typedusers"  :group="room.roomType === 'group'" />
    </span>
    <span txt-lead v-else-if="room.roomType === 'personal'">
      <span text-active v-if="userOnline">в сети</span>
      <span v-else>был(а) недавно</span>
    </span>
    <span txt-lead v-else-if="room.roomType === 'group'">{{ room.users.length }} участников</span>
    <span txt-lead v-else-if="room.roomType === 'chanel'">{{ room.users.length }} подписчиков</span>
    <span txt-lead v-else>был(а) недавно</span>
  </div>
</template>

<script>
import TypingAnimation from './TypingAnimation.vue';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['room', 'online']),
    typedusers(){
      return this.room?.room_users?.filter(u => u.typing)
    },
    userOnline(){
      return this.online.includes(this.room.room_users[0]._id)
    }
  },
  components: {
    TypingAnimation
  }
};
</script>

<style>
</style>