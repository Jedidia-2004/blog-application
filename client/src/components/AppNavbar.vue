<script setup>
import { useRouter } from "vue-router";

import { useUserStore } from "../stores/user";

const router = useRouter();
const userStore = useUserStore();

function handleLogout() {
  userStore.logout();
  router.push({ name: "home" });
}
</script>

<template>
  <nav class="navbar navbar-expand-md bg-dark shadow-sm" data-bs-theme="dark">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold" :to="{ name: 'home' }">
        MEVN Blog
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavigation"
        aria-controls="mainNavigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mainNavigation" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'home' }">
              Posts
            </RouterLink>
          </li>
          <li v-if="userStore.isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'post-create' }">
              Write a post
            </RouterLink>
          </li>
        </ul>

        <div v-if="userStore.isAuthenticated" class="d-md-flex align-items-md-center gap-3">
          <div class="py-2 py-md-0 text-light-emphasis small">
            {{ userStore.user.username }}
            <span v-if="userStore.isAdmin" class="badge text-bg-warning ms-1">Admin</span>
          </div>
          <button class="btn btn-outline-light btn-sm" type="button" @click="handleLogout">
            Log out
          </button>
        </div>

        <div v-else class="d-flex gap-2 py-2 py-md-0">
          <RouterLink class="btn btn-outline-light btn-sm" :to="{ name: 'login' }">
            Log in
          </RouterLink>
          <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'register' }">
            Register
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
