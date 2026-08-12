import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "../stores/user";
import AddPost from "../pages/AddPost.vue";
import EditPost from "../pages/EditPost.vue";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import NotFound from "../pages/NotFound.vue";
import PostDetails from "../pages/PostDetails.vue";
import Register from "../pages/Register.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      alias: "/posts",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { guestOnly: true },
    },
    {
      path: "/posts/new",
      name: "post-create",
      component: AddPost,
      meta: { requiresAuth: true },
    },
    { path: "/posts/:id", name: "post-detail", component: PostDetails },
    {
      path: "/posts/:id/edit",
      name: "post-edit",
      component: EditPost,
      meta: { requiresAuth: true },
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
  ],
});

router.beforeEach((to) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return { name: "home" };
  }
});

export default router;
