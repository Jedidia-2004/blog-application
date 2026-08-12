<script setup>
import { onMounted, ref } from "vue";

import AlertMessage from "../components/AlertMessage.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import PostCard from "../components/PostCard.vue";
import { postsApi } from "../api";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const posts = ref([]);
const loading = ref(true);
const error = ref("");
const success = ref("");
const deletingId = ref(null);

async function loadPosts() {
  loading.value = true;
  error.value = "";

  try {
    const data = await postsApi.getAll();
    posts.value = data.posts;
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    loading.value = false;
  }
}

async function deletePost(post) {
  const confirmed = window.confirm(`Delete “${post.title}”?`);
  if (!confirmed) return;

  deletingId.value = post._id;
  error.value = "";
  success.value = "";

  try {
    const data = await postsApi.remove(post._id);
    posts.value = posts.value.filter((item) => item._id !== post._id);
    success.value = data.message;
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    deletingId.value = null;
  }
}

onMounted(loadPosts);
</script>

<template>
  <section class="rounded-4 bg-dark p-4 p-lg-5 text-white shadow-sm">
    <div class="row align-items-center g-4">
      <div class="col-lg-8">
        <h1 class="display-5 fw-bold">Ideas worth sharing</h1>
        <p class="lead mb-0 text-white-50">
          Read community stories or sign in to publish your own.
        </p>
      </div>
      <div class="col-lg-4 text-lg-end">
        <RouterLink
          v-if="userStore.isAuthenticated"
          class="btn btn-primary btn-lg"
          :to="{ name: 'post-create' }"
        >
          Write a post
        </RouterLink>
        <RouterLink
          v-else
          class="btn btn-primary btn-lg"
          :to="{ name: 'register' }"
        >
          Join the blog
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="mt-5">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2 class="h3 mb-0">Latest posts</h2>
      <span v-if="!loading" class="badge rounded-pill text-bg-secondary">
        {{ posts.length }} {{ posts.length === 1 ? "post" : "posts" }}
      </span>
    </div>

    <AlertMessage v-if="error" :message="error" />
    <AlertMessage v-if="success" :message="success" variant="success" />
    <LoadingSpinner v-if="loading" />

    <div v-else-if="posts.length" class="row g-4">
      <div v-for="post in posts" :key="post._id" class="col-md-6 col-xl-4">
        <PostCard
          :post="post"
          :deleting="deletingId === post._id"
          @delete="deletePost"
        />
      </div>
    </div>

    <div v-else class="card border-0 shadow-sm">
      <div class="card-body p-5 text-center">
        <h3 class="h5">No posts yet</h3>
        <p class="mb-0 text-secondary">Be the first person to share a story.</p>
      </div>
    </div>
  </section>
</template>
