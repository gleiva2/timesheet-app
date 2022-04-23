import Vue from "vue";
import Router from "vue-router";
import { authGuard } from "../auth/authGuard";
Vue.use(Router);

//import CleaningHours from "../components/CleaningHours.vue";
import HomeView from "../components/HomeView.vue"

export default new Router({
  routes: [
    {
      path: "/cleaning",
      alias: "/",
      name: "home-view",
      component: HomeView, 
      beforeEnter: authGuard 
    },
  ],
});
