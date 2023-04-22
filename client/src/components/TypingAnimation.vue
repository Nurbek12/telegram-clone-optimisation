<template>
  <span class="typing-box">
    <div class="anim">
      <span style="--i: 0"></span>
      <span style="--i: 1"></span>
      <span style="--i: 2"></span>
    </div>
    <div v-if="group && typing.length <= 3" class="d-flex" text-active>
        {{ typing.map(u => u.name).join(', ') }}
    </div>
    <div v-else-if="typing.length > 3">
        и {{ typing.length }} ещё
    </div>
    <div text-active>печатает</div>
  </span>
</template>

<script>
export default {
  props: ["typing", "group"],
};
</script>

<style>
</style>