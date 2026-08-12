<script setup>
import { computed } from "vue";

import { useUserStore } from "../stores/user";
import { formatDate } from "../utils/formatDate";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  deleting: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["delete"]);

const userStore = useUserStore();

const authorId = computed(() =>
  String(props.post.author?._id || props.post.author || "")
);
const isOwner = computed(
  () =>
    Boolean(userStore.user?.id) && authorId.value === String(userStore.user.id)
);
const canDelete = computed(() => isOwner.value || userStore.isAdmin);
const preview = computed(() => {
  const content = props.post.content || "";
  return content.length > 180 ? `${content.slice(0, 180)}…` : content;
});
</script>

<template>
  <article class="card h-100 border-0 shadow-sm">
    <div class="card-body d-flex flex-column p-4">
      <div class="mb-2 text-secondary small">
        By {{ post.author?.username || "Unknown user" }} ·
        {{ formatDate(post.createdAt) }}
      </div>

      <h2 class="card-title h4">{{ post.title }}</h2>
      <p class="card-text flex-grow-1 text-secondary post-content">{{ preview }}</p>

      <div class="d-flex flex-wrap gap-2">
        <RouterLink
          class="btn btn-primary btn-sm"
          :to="{ name: 'post-detail', params: { id: post._id } }"
        >
          Read post
        </RouterLink>
        <RouterLink
          v-if="isOwner"
          class="btn btn-outline-secondary btn-sm"
          :to="{ name: 'post-edit', params: { id: post._id } }"
        >
          Edit
        </RouterLink>
        <button
          v-if="canDelete"
          class="btn btn-outline-danger btn-sm"
          type="button"
          :disabled="deleting"
          @click="$emit('delete', post)"
        >
          {{ deleting ? "Deleting..." : "Delete" }}
        </button>
      </div>
    </div>
  </article>
</template>
