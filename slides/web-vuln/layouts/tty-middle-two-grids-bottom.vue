<script setup lang="ts">
import Footer from "../components/Footer.vue";
</script>

<template>
  <div class="slidev-layout tty-middle">
    <div class="flex flex-col items-center justify-center">
      <slot />
      <div class="flex flex-row gap-4 items-center justify-center">
        <div class="flex flex-col items-center justify-center w-1/2">
          <slot name="br" class="w-full" />
        </div>
        <div class="flex flex-col items-center justify-center w-1/2">
          <slot name="bl" class="w-full" />
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style>
.slidev-layout.tty-middle {
  @apply flex flex-col items-center justify-center;
}

.slidev-layout.tty-middle p {
  @apply mt-0;
}

.slidev-layout.tty-middle blockquote {
  @apply mb-4;
}

.slidev-layout.tty-middle pre {
  @apply mb-4;
}

.slidev-layout.tty-middle ol {
  @apply mb-4;
}

.slidev-vclick-target {
  transition: opacity 300ms ease;
}

.slidev-vclick-hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
