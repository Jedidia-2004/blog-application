<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import AlertMessage from "../components/AlertMessage.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { postsApi } from "../api";
import { useUserStore } from "../stores/user";
import { formatDate } from "../utils/formatDate";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const post = ref(null);
const loading = ref(true);
const deleting = ref(false);
const error = ref("");

const authorId = computed(() =>
  String(post.value?.author?._id || post.value?.author || "")
);
const isOwner = computed(
  () =>
    Boolean(userStore.user?.id) && authorId.value === String(userStore.user.id)
);
const canDelete = computed(() => isOwner.value || userStore.isAdmin);

async function loadPost() {
  loading.value = true;
  error.value = "";
  post.value = null;

  try {
    const data = await postsApi.getById(route.params.id);
    post.value = data.post;
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    loading.value = false;
  }
}

async function deletePost() {
  if (!window.confirm(`Delete “${post.value.title}”?`)) return;

  deleting.value = true;
  error.value = "";

  try {
    await postsApi.remove(post.value._id);
    await router.push({ name: "home" });
  } catch (requestError) {
    error.value = requestError.message;
    deleting.value = false;
  }
}

watch(() => route.params.id, loadPost, { immediate: true });
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <AlertMessage v-else-if="error && !post" :message="error" />

  <article v-else-if="post" class="row justify-content-center">
    <div class="col-lg-9 col-xl-8">
      <RouterLink class="btn btn-link px-0 mb-3" :to="{ name: 'home' }">
        ← Back to posts
      </RouterLink>

      <AlertMessage v-if="error" :message="error" />

      <div class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5">
          <div class="mb-2 text-secondary">
            By {{ post.author?.username || "Unknown user" }} ·
            {{ formatDate(post.createdAt) }}
          </div>
          <h1 class="display-6 fw-bold mb-4">{{ post.title }}</h1>
          <div class="post-content fs-5 lh-lg">{{ post.content }}</div>

          <hr class="my-4" />

          <div class="d-flex flex-wrap gap-2">
            <RouterLink
              v-if="isOwner"
              class="btn btn-primary"
              :to="{ name: 'post-edit', params: { id: post._id } }"
            >
              Edit post
            </RouterLink>
            <button
              v-if="canDelete"
              class="btn btn-outline-danger"
              type="button"
              :disabled="deleting"
              @click="deletePost"
            >
              {{ deleting ? "Deleting..." : "Delete post" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
