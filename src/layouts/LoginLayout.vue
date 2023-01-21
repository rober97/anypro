<template>
  <q-layout>
    <q-page-container>
      <q-page
        class="
          bg-light-blue-2
          window-height window-width
          row
          justify-center
          items-center
        "
      >
        <div class="column">
          <div class="row">
            <h5 class="text-h5 text-white q-my-md">AnyPro</h5>
          </div>
          <div class="row">
            <q-card square bordered flat class="q-pa-lg shadow-1">
              <q-card-section>
                <q-form class="q-gutter-md">
                  <q-input
                    square
                    filled
                    clearable
                    v-model="email"
                    type="email"
                    label="Ingrese su correo"
                  />
                  <q-input
                    square
                    filled
                    clearable
                    v-model="password"
                    type="password"
                    label="Ingrese su contraseña"
                  />
                </q-form>
              </q-card-section>
              <q-card-actions class="q-px-md">
                <q-btn
                  unelevated
                  rounded
                  color="light-blue"
                  class="full-width"
                  label="Ingresar"
                  @click="login()"
                />
              </q-card-actions>
              <q-card-section class="text-center q-pa-none"> </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "LoginLayout",
  props: {},

  methods: {
    login() {
      this.$router.push({ path: "list-user" });
    },
  },
};
</script>

<style>
</style>