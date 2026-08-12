<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import AlertMessage from "../components/AlertMessage.vue";
import { useUserStore } from "../stores/user";

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
});
const loading = ref(false);
const error = ref("");
const details = ref([]);

async function handleSubmit() {
  error.value = "";
  details.value = [];

  if (form.password !== form.confirmPassword) {
    error.value = "Passwords do not match.";
    return;
  }

  loading.value = true;

  try {
    await userStore.register({
      email: form.email,
      username: form.username,
      password: form.password,
    });
    await router.push({ name: "home" });
  } catch (requestError) {
    error.value = requestError.message;
    details.value = requestError.details || [];
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5">
          <h1 class="h2">Create an account</h1>
          <p class="mb-4 text-secondary">Join the community and publish your ideas.</p>

          <AlertMessage v-if="error" :message="error" :details="details" />

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="registerEmail" class="form-label">Email</label>
              <input
                id="registerEmail"
                v-model="form.email"
                class="form-control"
                type="email"
                autocomplete="email"
                maxlength="254"
                required
                :disabled="loading"
              />
            </div>

            <div class="mb-3">
              <label for="registerUsername" class="form-label">Username</label>
              <input
                id="registerUsername"
                v-model="form.username"
                class="form-control"
                type="text"
                autocomplete="username"
                minlength="3"
                maxlength="30"
                pattern="[A-Za-z0-9_]+"
                required
                :disabled="loading"
              />
              <div class="form-text">Letters, numbers, and underscores only.</div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="registerPassword" class="form-label">Password</label>
                <input
                  id="registerPassword"
                  v-model="form.password"
                  class="form-control"
                  type="password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                  :disabled="loading"
                />
              </div>

              <div class="col-md-6 mb-4">
                <label for="confirmPassword" class="form-label">Confirm password</label>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  class="form-control"
                  type="password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <button class="btn btn-primary w-100" type="submit" :disabled="loading">
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
              {{ loading ? "Creating account..." : "Register" }}
            </button>
          </form>

          <p class="mb-0 mt-4 text-center text-secondary">
            Already registered?
            <RouterLink :to="{ name: 'login' }">Log in</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
