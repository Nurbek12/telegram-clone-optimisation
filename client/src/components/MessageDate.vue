<template>
    <div class="message-gruop-data" :data-index="d">
      <div class="message alert message-time">
        <p class="ma-0">
          {{ getDate(messages?.messages[0]?.date) }}
        </p>
      </div>
      <Message v-for="(mess, i) in messages?.messages" :key="mess._id" :d="d" :i="i" :message="mess"/>
    </div>
  </template>
  
  <script>
//   import { mapGetters } from "vuex";
import Message from './Message.vue';
  export default {
    name: "MessageDate",
    props: ["messages", "d"],
    components: {
        Message
    },
    methods: {
        getDate(date){
            return new Date(date).toLocaleString('ru', {
                day: "numeric",
                month: "long"
            })
        }
    },
    // computed: mapGetters(["currentRoom", "rooms", "user"]),
  };
  </script>
  
  <style>
  </style>
  