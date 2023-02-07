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
              <q-card-section class="text-center q-pa-none">
                <div class="q-pa-md q-gutter-sm" v-if="msgNotification">
                  <q-banner
                    inline-actions
                    rounded
                    class="text-white"
                    :class="msgSuccess ? 'bg-success' : 'bg-orange'"
                  >
                    {{ msg }}
                  </q-banner>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useGlobal } from "../stores/global";
const global = useGlobal();
export default {
  name: "LoginLayout",
  setup() {
    return {
      email: ref(""),
      password: ref(""),
      msgNotification: ref(false),
      msg: ref(""),
      msgSuccess: ref(false),
    };
  },
  props: {},

  methods: {
    async login() {
      //4234423
      let config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        url: `${global.url_api}/login`,
        //timeout: 5000,
        data: {
          email: this.email,
          password: this.password,
        },
      };

      await axios(config).then((res) => {
        this.msgNotification = true;
        this.msg = res.data.msg;
        if (res.status == 200) {
          this.msgSuccess = true;
          localStorage.setItem("user", JSON.stringify(res.data));
          if (res.data.tipo === "Usuario") {
            this.$router.push({ path: "welcome" });
          } else {
            this.$router.push({ path: "list-user" });
          }
        } else {
          this.msgSuccess = false;
        }
      });
    },
  },
};
</script>

<style>
</style>