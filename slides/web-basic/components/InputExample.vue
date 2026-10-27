<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  highlight: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <div class="flex flex-col gap-1 mb-2 transition-all duration-300">
    <label class="text-sm font-medium" :for="label">{{ label }}</label>
    <input
      :value="value"
      class="py-1 px-2 rounded-md"
      :id="label"
      :class="{ 'bg-red-500/25': highlight }"
    />
  </div>
</template>
