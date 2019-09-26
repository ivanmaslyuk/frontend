<template>
  <form @submit="performLogin">
    <input type="text" v-model="email" name="email" placeholder="email" />
    <br />
    <input type="password" v-model="password" name="password" placeholder="пароль" />
    <br />
    <input type="submit" />
  </form>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  name: "login",
  data() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    performLogin(e) {
      const basePath = this.backendBasePath();
      if (this.email && this.password) {
        axios
          .post(`${basePath}/api/auth`, {
            email: this.email,
            password: this.password
          })
          .then(res => {
            localStorage.accessToken = res.data.token;
            localStorage.userId = res.data.userId;
            localStorage.email = res.data.email;
            router.push({ name: "home" });
          })
          .catch(err => console.log(err.response));
      }

      e.preventDefault();
    }
  }
};
</script>

<style scoped>
</style>
