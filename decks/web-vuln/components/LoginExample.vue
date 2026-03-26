<script setup lang="ts">
import InputExample from "./InputExample.vue";
import { ref } from "vue";

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const showHint = ref(false);
const loading = ref(false);

const handleLogin = () => {
  showHint.value = false;
  loading.value = true;
  setTimeout(() => {
    showHint.value = true;
    loading.value = false;
  }, 1000);
};
</script>

<template>
  <div>
    <InputExample label="Username" :value="username" />
    <InputExample label="Password" :value="password" :highlight="showHint" />
    <button
      class="py-1 px-2 rounded-md bg-blue-500 text-white transition-all duration-300"
      @click="handleLogin"
      :disabled="loading"
    >
      <span v-if="loading">Loading...</span>
      <span v-else>Login</span>
    </button>
    <p v-if="showHint" class="text-red-400 !mb-0">密碼錯誤</p>
  </div>
</template>
