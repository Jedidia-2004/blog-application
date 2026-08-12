<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  initialPost: {
    type: Object,
    default: () => ({ title: "", content: "" }),
  },
  submitLabel: {
    type: String,
    default: "Save post",
  },
  busy: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit"]);

const form = reactive({ title: "", content: "" });

watch(
  () => props.initialPost,
  (post) => {
    form.title = post?.title || "";
    form.content = post?.content || "";
  },
  { immediate: true }
);

function handleSubmit() {
  emit("submit", {
    title: form.title,
    content: form.content,
  });
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="postTitle" class="form-label">Title</label>
      <input
        id="postTitle"
        v-model="form.title"
        class="form-control"
        type="text"
        maxlength="150"
        required
        :disabled="busy"
      />
      <div class="form-text">Maximum 150 characters.</div>
    </div>

    <div class="mb-4">
      <label for="postContent" class="form-label">Content</label>
      <textarea
        id="postContent"
        v-model="form.content"
        class="form-control"
        rows="12"
        maxlength="50000"
        required
        :disabled="busy"
      ></textarea>
    </div>

    <div class="d-flex gap-2">
      <button class="btn btn-primary" type="submit" :disabled="busy">
        <span
          v-if="busy"
          class="spinner-border spinner-border-sm me-2"
          aria-hidden="true"
        ></span>
        {{ busy ? "Saving..." : submitLabel }}
      </button>
      <RouterLink class="btn btn-outline-secondary" :to="{ name: 'home' }">
        Cancel
      </RouterLink>
    </div>
  </form>
</template>
