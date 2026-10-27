<script setup lang="ts">
import Footer from "../components/Footer.vue";

const props = defineProps({
  class: {
    type: String,
  },
});
</script>

<template>
  <div class="slidev-layout two-columns w-full h-full">
    <div class="col-span-2">
      <slot />
    </div>
    <div class="grid grid-cols-2 grid-rows-2 gap-10">
      <div class="col-left" :class="props.class">
        <slot name="left" />
      </div>
      <div class="col-right" :class="props.class">
        <slot name="right" />
      </div>
    </div>
  </div>
  <Footer />
</template>
