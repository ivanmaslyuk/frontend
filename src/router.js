import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import AppPage from "./views/AppPage.vue";
import Login from "./views/Login.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/app/:id",
      name: "app-page",
      component: AppPage,
      props: true
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/mobile",
      name: "mobile",
      component: undefined
    }
  ]
});
