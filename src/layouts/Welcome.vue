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
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title> </q-toolbar-title>

        <div @click="closeSession()" style="cursor: pointer">Cerrar sesion</div>
      </q-toolbar>
    </q-header>

    <DrawerComponent :drawerStatus="leftDrawerOpen" />

    <q-page-container>
      <div class="q-pa-md">
        <h4>Bienvenido {{ getLocalStorage.nombre }}!</h4>
        <q-table
          ref="tableRef"
          title="Archivos disponibles"
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
              option-label="name"
              option-value="_id"
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

              <q-td key="type" :props="props">
                <q-badge color="green">
                  {{ props.row.type }}
                </q-badge>
              </q-td>

              <q-td key="type" :props="props">
                <q-btn
                  size="sm"
                  color="blue"
                  round
                  dense
                  @click="downloadFile(props)"
                  :icon="'download'"
                  title="Descargar archivo"
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
import { useGlobal } from "../stores/global";

const global = useGlobal();

const columns = [
  {
    name: "name",
    label: "Nombre",
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  { name: "type", label: "Tipo", field: (row) => row.type },
  { name: "actions", label: "Acciones" },
];

const rows = ref([]);

const userObject = ref({
  _id: null,
  name: "",
  lastname: "",
  rut: "",
  email: "",
  password: "",
  confirm_password: "",
  type: "",
});

let userList = ref([]);

export default defineComponent({
  name: "MainLayout",

  components: {
    DrawerComponent,
  },

  computed: {
    getLocalStorage() {
      return JSON.parse(localStorage.getItem("user"));
    },
  },

  methods: {
    closeSession() {
      this.$router.push({ path: "/login" });
    },

    async getFiles() {
      if (rows.value.length == 0) {
        const id_user = JSON.parse(localStorage.getItem("user"))._id;
        rows.value = [];
        let config = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
          url: `${global.url_api}/listFileByUser?id=${id_user}`,
        };

        await axios(config).then((respuestas) => {
          respuestas.data.forEach((element) => {
            let res = {
              _id: element._id,
              name: element.nombre,
              type: element.type,
              selected: false,
            };
            rows.value.push(res);
          });
        });
      }
    },

    selectAllRows() {
      rows.value.forEach((v) => (v.selected = !v.selected));
    },

    async downloadFile(item) {
      try {
        const response = await axios.get(
          `${global.url_api}/downloadFile?id=${item.row._id}`,
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = item.row.name;
        link.click();
      } catch (err) {
        console.log(err);
      }
    },
  },

  async created() {
    this.getFiles();
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
      leftDrawerOpen: ref(false),
      hasData,
      listFilesData: ref([]),
      hideBottom: ref(false),
      hideSelectedBanner: ref(false),
      hideNoData: ref(false),
      hidePagination: ref(false),
      selectAll: ref(false),
      newRegister: ref(true),

      selected: ref([rows.value[1]]),

      columns,
      text: ref(""),
      typeFile: ref(""),

      records: computed(() => (hasData.value === true ? rows : [])),

      small: ref(false),
      medium: ref(false),
      modalFile: ref(false),
      modalInfo: ref(false),
      fullWidth: ref(false),
      fullHeight: ref(false),
      options: ["Administrador", "Usuario"],
      listFiles: ["Liquidacion de sueldo", "Copia de contrato", "Certificado"],
      model: ref(null),
      userObject,
      rows,
      pagination,
      closeModal: ref(false),

      //Para el buscador de usuario
      userList,
      userModel: ref(null),
      filterFn(val, update) {
        // if (val === "") {
        //   update(() => {
        //     userList.value = userList;
        //   });
        //   return;
        // }

        update(() => {
          const needle = val.toLowerCase();
          // userList.value = userList.value.filter(
          //   (v) => v.rut.toLowerCase().indexOf(needle) > -1
          // );
        });
      },

      //INPUT DE ARCHIVOS
      files: ref(null),
      counterLabelFn({ totalSize, filesNumber, maxFiles }) {
        return `${filesNumber} files of ${maxFiles} | ${totalSize}`;
      },
    };
  },
});
</script>
