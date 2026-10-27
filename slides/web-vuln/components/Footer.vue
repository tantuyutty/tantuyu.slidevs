<script setup lang="ts">
import { useSlideContext } from "@slidev/client";
const { $slidev } = useSlideContext();
</script>

<template>
  <footer
    class="flex flex-row justify-between absolute bottom-0 left-0 right-0 p-2 text-white"
  >
    <div class="text-xs">{{ $slidev.configs.author }}</div>
    <div class="text-xs">
      <Link to="2" :title="$slidev.configs.title" />
    </div>
    <div class="text-xs"><SlideCurrentNo /> / <SlidesTotal /></div>
  </footer>
</template>
