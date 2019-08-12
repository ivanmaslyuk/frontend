import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Home.vue")
    },
    {
      path: "/app/:id",
      name: "app-page",
      component: () => import("./views/AppPage.vue"),
      props: true
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue")
    },
    {
      path: "/mobile",
      name: "mobile",
      component: () => import("./views/DevicePage")
    },
    {
      path: "/projector",
      name: "projector",
      props: { isProjector: true },
      component: () => import("./views/DevicePage")
    }
  ]
});
