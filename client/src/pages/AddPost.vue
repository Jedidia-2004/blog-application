<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import AlertMessage from "../components/AlertMessage.vue";
import PostForm from "../components/PostForm.vue";
import { postsApi } from "../api";

const router = useRouter();
const loading = ref(false);
const error = ref("");
const details = ref([]);

async function createPost(post) {
  loading.value = true;
  error.value = "";
  details.value = [];

  try {
    const data = await postsApi.create(post);
    await router.push({
      name: "post-detail",
      params: { id: data.post._id },
    });
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
    <div class="col-lg-9 col-xl-8">
      <div class="mb-4">
        <h1 class="h2">Write a new post</h1>
        <p class="mb-0 text-secondary">Share something useful with the community.</p>
      </div>

      <AlertMessage v-if="error" :message="error" :details="details" />

      <div class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5">
          <PostForm submit-label="Publish post" :busy="loading" @submit="createPost" />
        </div>
      </div>
    </div>
  </div>
</template>
