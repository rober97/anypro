<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> </q-toolbar-title>

        <div @click="closeSession()" style="cursor: pointer">Cerrar sesion</div>
      </q-toolbar>
    </q-header>

    <DrawerComponent />

    <q-page-container>
      <div class="q-pa-md">
        <q-btn
          round
          color="primary"
          icon="person_add"
          @click="medium = true"
          class="q-mb-md"
        />

        <q-dialog v-model="medium">
          <q-card style="width: 700px; max-width: 80vw">
            <q-card-section>
              <div class="text-h6">Registrar nuevo usuario</div>
            </q-card-section>
            <q-form method="post" @submit="newUser">
              <q-card-section class="q-pt-none">
                <div class="q-gutter-y-md column">
                  <div class="row">
                    <div class="col-6">
                      <q-input
                        standout="bg-light-blue-4 text-white"
                        v-model="userObject.name"
                        required
                        label="Nombre"
                      />
                    </div>
                    <div class="col-6 q-pl-sm">
                      <q-input
                        standout="bg-light-blue-4 text-white"
                        v-model="userObject.lastname"
                        required
                        label="Apellido"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12 col-md-12">
                      <q-input
                        standout="bg-light-blue-4 text-white"
                        v-model="userObject.rut"
                        required
                        label="Rut"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12 col-md-12">
                      <q-select
                        filled
                        v-model="userObject.type"
                        required
                        :options="options"
                        label="Tipo de usuario"
                      />
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <!-- v-close-popup -->
                <q-btn flat label="Registrar" type="submit" />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>

        <q-table
          ref="tableRef"
          title="Usuarios registrados"
          :rows="rows"
          :columns="columns"
          selection="multiple"
          v-model:pagination="pagination"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscador"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width>
                <q-checkbox dense v-model="selectAll" @click="selectAllRows" />
              </q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-checkbox dense v-model="props.row.selected" />
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="lastname" :props="props">
                {{ props.row.lastname }}
              </q-td>

              <q-td key="rut" :props="props">
                {{ props.row.rut }}
              </q-td>

              <q-td key="type" :props="props">
                <q-badge color="green">
                  {{ props.row.type }}
                </q-badge>
              </q-td>

              <q-td key="type" :props="props">
                <q-btn
                  size="sm"
                  color="accent"
                  round
                  dense
                  @click="deleteUser"
                  :icon="'remove'"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import DrawerComponent from "components/DrawerComponent.vue";
import axios from "axios";

const columns = [
  {
    name: "name",
    label: "Nombre",
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: "lastname",
    align: "center",
    label: "Apellido",
    field: (row) => row.lastname,
    sortable: true,
  },
  { name: "rut", label: "Rut", field: (row) => row.rut, sortable: true },
  { name: "type", label: "Tipo", field: (row) => row.type },
  { name: "actions", label: "Acciones" },
];

const rows = ref([]);

const userObject = ref({
  name: "",
  lastname: "",
  rut: "",
  password: "",
  confirm_password: "",
  type: "",
});

export default defineComponent({
  name: "MainLayout",

  components: {
    DrawerComponent,
  },

  methods: {
    closeSession() {
      this.$router.push({ path: "/login" });
    },

    async newUser() {
      let password = userObject.value.rut.substring(
        4,
        userObject.value.rut.length
      );
      let config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        url: "http://localhost:3000/new-user",
        //timeout: 5000,
        data: {
          name: userObject.value.name,
          apellido: userObject.value.lastname,
          rut: userObject.value.rut,
          type: userObject.value.type,
          password,
        },
      };

      await axios(config).then((respuestas) => {
        debugger;
      });
    },

    async getUser() {
      let config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
        url: "http://localhost:3000/list-user",
      };

      await axios(config).then((respuestas) => {
        respuestas.data.forEach((element) => {
          let res = {
            _id: element._id,
            name: element.nombre,
            lastname: element.apellido,
            rut: element.rut,
            type: element.tipo,
            selected: false,
          };
          rows.value.push(res);
        });
      });
    },

    async deleteUser() {},

    selectAllRows() {
      rows.value.forEach((v) => (v.selected = !v.selected));
    },
  },

  async mounted() {
    this.getUser();
  },

  setup() {
    const hasData = ref(true);
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 1,
      rowsPerPage: 100,
    });

    return {
      hasData,
      hideBottom: ref(false),
      hideSelectedBanner: ref(false),
      hideNoData: ref(false),
      hidePagination: ref(false),
      selectAll: ref(false),

      selected: ref([rows.value[1]]),

      columns,
      text: ref(""),

      records: computed(() => (hasData.value === true ? rows : [])),

      small: ref(false),
      medium: ref(false),
      fullWidth: ref(false),
      fullHeight: ref(false),
      options: ["Administrador", "Usuario"],
      model: ref(null),
      userObject,
      rows,
      pagination,
    };
  },
});
</script>
