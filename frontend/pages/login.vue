<template>
  <v-col class="mx-auto" cols="12" sm="9" md="7" lg="5">
    <v-card class="mx-auto mt-8 px-10 pb-6">
      <v-card-title class="justify-center">Login</v-card-title>
      <form>
        <v-text-field
          v-model="username"
          :error-messages="usernameErrors"
          label="Public Key"
          required
          @input="$v.username.$touch()"
          @blur="$v.username.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="password"
          type="password"
          :error-messages="passwordErrors"
          label="Password"
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
          v-on:keyup.enter="submit"
        ></v-text-field>
        <v-card-actions class="justify-center mt-4">
          <v-btn
            @click="submit"
            :disabled="$v.password.$invalid || $v.username.$invalid"
          >
            submit
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-col>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    username: { required },
    password: { required },
  },
  data: () => ({
    username: "",
    password: "",
  }),
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;

      !this.$v.username.required && errors.push("username is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
  },
  methods: {
    async submit() {
      this.$v.$touch();

      try {
        let log = await this.$auth
          .loginWith("local", {
            data: {
              username: this.username,
              password: this.password,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.data.error) {
              this.$notifier.showMessage({
                content: res.data.error,
                color: "error",
                button: false,
              });
            } else {
              this.$notifier.showMessage({
                content: "successfully logged in",
                color: "success",
                button: false,
              });
              this.$router.push("/");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (e) {
        // Display generic error if API has failed
        this.message = e.response.data.message;
      }
    },
  },
  clear() {
    this.$v.$reset();
    this.email = "";
    this.password = "";
  },
};
</script>

<style></style>