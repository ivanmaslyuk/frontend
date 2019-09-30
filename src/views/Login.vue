<template>
  <div class="container">
    <div class="row">
        <div class="col-xs-12 col-md-7 col-lg-5 d-block mx-auto main-form">
          <h1 class="form-header">EventStore</h1>
          <h2 class="form-subtitle">Введите свои данные</h2>

          <form @submit="performLogin">
            <input 
                class="form-control form-input" 
                v-model="email"
                name="email"
                type="text" 
                placeholder="Ваш логин"
                required 
            >
            <input 
                class="form-control form-input mt-1" 
                v-model="password" 
                name="password"
                type="password" 
                placeholder="Ваш пароль"
                required 
            >
            <button class="btn btn-primary form-btn" type="submit">Вход</button>
          </form>

        <div class="help">
            <span class="d-block">Нет аккаунта?</span>
            <a href="help-link">Зарегистрируйтесь</a>
        </div>
      </div>
    </div>
  </div>
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
.container {
overflow-x:hidden;
} 
.main-form {
padding: 4rem 2rem;
text-align: center;
}
.form-header {
font-size: 30px;
color: #2176ff;
margin-top: 5rem;
margin-bottom: 2rem;
}
.form-subtitle {
margin-bottom: 30px;
font-size: 22px; 
}
.form-input {
display: block;
height: 56px;
width: 100%;
}
.form-btn {
display: block;
width: 100%;
margin-top: 20px;
padding: 8px;
}
.help {
margin-top: 35px;
font-size: 16px;
}
.help-link {
color: #2176ff;
}
</style>