import Vue from "vue";
import Router from "vue-router";
import { authGuard } from "../auth/authGuard";
Vue.use(Router);

import CleaningHours from "../components/CleaningHours.vue";

export default new Router({
  routes: [
    {
      path: "/cleaning",
      alias: "/",
      name: "cleaning",
      component: CleaningHours, 
      beforeEnter: authGuard 
    },
  ],
});
