<script setup>
import AppNavbar from "./components/AppNavbar.vue";
</script>

<template>
  <div class="d-flex min-vh-100 flex-column bg-body-tertiary">
    <AppNavbar />

    <main class="container flex-grow-1 py-4 py-lg-5">
      <RouterView />
    </main>

    <footer class="border-top bg-white py-3">
      <div class="container text-center text-secondary small">
        MEVN Blog Application
      </div>
    </footer>
  </div>
</template>
