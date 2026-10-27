<!-- 四格 grid
::top-left::
::top-right::
::bottom-left::
::bottom-right::

or

::top-left::
::top-right::
::wrong-example::
::right-example::
-->

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
    <div class="col-span-2 pb-4">
      <slot />
    </div>
    <div class="grid grid-cols-2 gap-8">
      <div class="top-left" :class="props.class">
        <slot name="top-left" />
      </div>
      <div class="top-right" :class="props.class">
        <slot name="top-right" />
      </div>
      <div class="bottom-left" :class="props.class">
        <slot name="bottom-left" />
        <div
          v-if="$slots['wrong-example']"
          class="bg-red-500/25 p-4 rounded-lg border border-red-500/50"
        >
          <slot name="wrong-example" />
        </div>
      </div>
      <div class="bottom-right" :class="props.class">
        <slot name="bottom-right" />
        <div
          v-if="$slots['right-example']"
          class="bg-green-500/25 p-4 rounded-lg border border-green-500/50"
        >
          <slot name="right-example" />
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style>
.bottom-right > * > p {
  margin: 0;
}

.bottom-left > * > p {
  margin: 0;
}
</style>
