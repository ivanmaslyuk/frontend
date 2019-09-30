<template>
  <div id="app">
    <Header v-if="notOnMobilePage" class="shadow-sm" />
    <router-view v-bind:class="{container: notOnMobilePage}" />
  </div>
</template>

<script>
import Header from "./components/Header";

export default {
  components: { Header },
  computed: {
    notOnMobilePage() {
      return (
        !["login", "mobile", "projector"].includes(this.$route.name) &&
        this.$route.name != null
      );
    }
  }
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
