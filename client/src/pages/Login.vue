<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AlertMessage from "../components/AlertMessage.vue";
import { useUserStore } from "../stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const form = reactive({ email: "", password: "" });
const loading = ref(false);
const error = ref("");

async function handleSubmit() {
  loading.value = true;
  error.value = "";

  try {
    await userStore.login(form);
    const requestedPath = route.query.redirect;
    const redirect =
      typeof requestedPath === "string" &&
      requestedPath.startsWith("/") &&
      !requestedPath.startsWith("//")
        ? requestedPath
        : "/";
    await router.push(redirect);
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6 col-xl-5">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5">
          <h1 class="h2">Welcome back</h1>
          <p class="mb-4 text-secondary">Log in to create and manage your posts.</p>

          <AlertMessage v-if="error" :message="error" />

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="loginEmail" class="form-label">Email</label>
              <input
                id="loginEmail"
                v-model="form.email"
                class="form-control"
                type="email"
                autocomplete="email"
                required
                :disabled="loading"
              />
            </div>

            <div class="mb-4">
              <label for="loginPassword" class="form-label">Password</label>
              <input
                id="loginPassword"
                v-model="form.password"
                class="form-control"
                type="password"
                autocomplete="current-password"
                required
                :disabled="loading"
              />
            </div>

            <button class="btn btn-primary w-100" type="submit" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
              {{ loading ? "Logging in..." : "Log in" }}
            </button>
          </form>

          <p class="mb-0 mt-4 text-center text-secondary">
            Need an account?
            <RouterLink :to="{ name: 'register' }">Register</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
