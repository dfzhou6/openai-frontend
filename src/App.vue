<template>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>

<script>
import router from './router'

export default {
  name: 'App',
  router
}
</script>
