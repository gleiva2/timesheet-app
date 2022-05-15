<template>
  <v-container>
        <CleaningHours type="reg"/>
        <CleaningHours type="pt"/>
  </v-container>
</template>

<script>
import CleaningHours from "./CleaningHours.vue"
export default {
  name: "HomeView",
  components: {CleaningHours},
  data() {
    return {
    };
  },
};
</script>