<template>
  <v-app>
    <v-container>
      <v-toolbar dense dark color="primary">
        <v-toolbar-title> Timesheet </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- Check that the SDK client is not currently loading before accessing is methods -->
        <div v-if="!$auth.loading">
          <!-- show login when not authenticated -->
          <button v-if="!$auth.isAuthenticated" @click="login">Log in</button>
          <!-- show logout when authenticated -->
          <button v-if="$auth.isAuthenticated" @click="logout">Log out</button>
        </div>
      </v-toolbar>

      <v-main >
        <router-view />
      </v-main>
    </v-container>
  </v-app>
</template>

<script>

export default {
  name: "App",

  data: () => ({
    //
  }),
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithPopup();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  },
};
</script>
