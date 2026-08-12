<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import AlertMessage from "../components/AlertMessage.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import PostForm from "../components/PostForm.vue";
import { postsApi } from "../api";
import { useUserStore } from "../stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const post = ref(null);
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const details = ref([]);

const isOwner = computed(() => {
  const authorId = post.value?.author?._id || post.value?.author;
  return Boolean(authorId) && String(authorId) === String(userStore.user?.id);
});

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

async function updatePost(updatedPost) {
  saving.value = true;
  error.value = "";
  details.value = [];

  try {
    const data = await postsApi.update(post.value._id, updatedPost);
    await router.push({
      name: "post-detail",
      params: { id: data.post._id },
    });
  } catch (requestError) {
    error.value = requestError.message;
    details.value = requestError.details || [];
  } finally {
    saving.value = false;
  }
}

watch(() => route.params.id, loadPost, { immediate: true });
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <AlertMessage v-else-if="error && !post" :message="error" />

  <div v-else-if="post && !isOwner" class="row justify-content-center">
    <div class="col-lg-8">
      <AlertMessage message="You can edit only your own posts." />
      <RouterLink class="btn btn-primary" :to="{ name: 'home' }">
        Return to posts
      </RouterLink>
    </div>
  </div>

  <div v-else-if="post" class="row justify-content-center">
    <div class="col-lg-9 col-xl-8">
      <div class="mb-4">
        <h1 class="h2">Edit post</h1>
        <p class="mb-0 text-secondary">Update your title or content.</p>
      </div>

      <AlertMessage v-if="error" :message="error" :details="details" />

      <div class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5">
          <PostForm
            :initial-post="post"
            submit-label="Save changes"
            :busy="saving"
            @submit="updatePost"
          />
        </div>
      </div>
    </div>
  </div>
</template>
