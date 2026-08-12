<template>
  <div class="py-5 text-center">
    <div class="display-1 fw-bold text-primary">404</div>
    <h1 class="h2">Page not found</h1>
    <p class="text-secondary">The page you requested does not exist.</p>
    <RouterLink class="btn btn-primary" :to="{ name: 'home' }">
      Return home
    </RouterLink>
  </div>
</template>
