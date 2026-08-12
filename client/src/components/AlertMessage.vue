<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
  details: {
    type: Array,
    default: () => [],
  },
  variant: {
    type: String,
    default: "danger",
  },
});
</script>

<template>
  <div class="alert" :class="`alert-${variant}`" role="alert">
    <div>{{ message }}</div>
    <ul v-if="details.length" class="mb-0 mt-2">
      <li v-for="detail in details" :key="detail">{{ detail }}</li>
    </ul>
  </div>
</template>
