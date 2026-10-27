<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div
    class="w-full h-full flex items-center justify-center"
    :style="{ height: height + 'px' }"
  >
    <img :src="src" :style="{ height: height + 'px' }" class="rounded-md" />
  </div>
</template>
