<template>
  <div class="navbar">
    <div class="container">
      <a class="navbar-brand brand" href="#/">EventStore</a>
      <a>{{sessionId}}</a>
      <a>{{nameOfUser}}</a>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      nameOfUser: localStorage.email
    };
  },
  computed: mapState(["sessionId"])
};
</script>

<style>
.brand {
  color: #2176ff;
}
</style>