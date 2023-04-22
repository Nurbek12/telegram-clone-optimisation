<template>
  <!-- <div class="container pa-0"> -->
    <router-view />
  <!-- </div> -->
</template>

<script>
export default {
    name: 'App',
    data:() => ({
        
    })
}
</script>

<style>
@import './style.css';
html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}
[data-vuetify]{
  overflow: hidden;
}
.v-application{
  height: 100% !important;
}
.v-application--wrap{
  /* min-height: 100vh; */
  min-height: 0vh !important;
}
</style>