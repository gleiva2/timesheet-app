<template>
  <v-container>
      <v-toolbar dense dark color="primary">
          <v-toolbar-title> Cleaning Hours </v-toolbar-title>
        </v-toolbar>
        <CleaningHours type="reg"/>

        <v-toolbar dense dark color="primary">
          <v-toolbar-title> Cleaning Hours PT </v-toolbar-title>
        </v-toolbar>
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