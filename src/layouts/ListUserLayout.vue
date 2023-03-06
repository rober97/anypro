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

    <DrawerComponent :drawerStatus="false" />

    <q-page-container>
      <div class="q-pa-md">
        <h4>Bienvenido {{ getLocalStorage.nombre }}!</h4>
        <q-btn
          round
          color="primary"
          icon="person_add"
          @click="medium = true"
          class="q-mb-md"
        />

        <q-btn
          round
          color="warning"
          icon="file_upload"
          @click="openModalFile"
          class="q-mb-md q-ml-md"
        />

        <!-- MODAL PARA REGISTRO DE USUARIO -->
        <q-dialog v-model="medium">
          <q-card style="width: 700px; max-width: 80vw">
            <q-card-section>
              <div class="text-h6">Registrar nuevo usuario</div>
            </q-card-section>
            <q-form method="post" @submit="newUser">
              <q-card-section class="q-pt-none" v-if="newRegister">
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
                        @keyup="verifyRut($event)"
                        required
                        label="Rut"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12 col-md-12">
                      <q-input
                        standout="bg-light-blue-4 text-white"
                        v-model="userObject.email"
                        required
                        type="email"
                        label="Email"
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

              <q-card-section class="q-pt-none" v-if="!newRegister">
                <p>La clave de acceso es: {{ userObject.password }}</p>
                <span>Recuerda guardarla en un lugar seguro</span>
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <!-- v-close-popup -->
                <q-btn flat label="Cancelar" v-close-popup v-if="newRegister" />
                <q-btn
                  flat
                  label="Registrar"
                  type="submit"
                  v-if="newRegister"
                />

                <!-- Registro terminado -->
                <q-btn flat label="Aceptar" v-close-popup v-if="!newRegister" />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>

        <!-- MODAL PARA SUBIR ARCHIVOS -->
        <q-dialog v-model="modalFile">
          <q-card style="width: 700px; max-width: 80vw">
            <q-card-section>
              <div class="text-h6">Importar archivos</div>
            </q-card-section>
            <q-form
              method="post"
              @submit.prevent="importFile"
              enctype="multipart/form-data"
            >
              <q-card-section class="q-pt-none">
                <div class="q-gutter-y-md column">
                  <div class="row">
                    <div class="col-12">
                      <q-select
                        filled
                        v-model="userModel"
                        use-input
                        requiredj
                        input-debounce="0"
                        label="Buscar usuario"
                        :options="userList"
                        @filter="filterFn"
                        behavior="menu"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              No hay usuarios registrados
                            </q-item-section>
                          </q-item>
                        </template>

                        <template v-slot:selected-item="scope">
                          <q-item>
                            <q-item-section>
                              <q-item-label>
                                {{ scope.opt.name }}
                                {{ scope.opt.lastname }}</q-item-label
                              >

                              <q-item-label caption>{{
                                scope.opt.rut
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>

                        <template v-slot:option="scope">
                          <q-item v-bind="scope.itemProps">
                            <q-item-section>
                              <q-item-label
                                >{{ scope.opt.name }}
                                {{ scope.opt.lastname }}</q-item-label
                              >
                              <q-item-label caption>{{
                                scope.opt.rut
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12">
                      <q-select
                        filled
                        v-model="typeFile"
                        required
                        :options="listFiles"
                        label="Tipo de archivo"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12 col-md-12">
                      <q-file
                        v-model="files"
                        label="Clic para buscar archivos"
                        filled
                        counter
                        :counter-label="counterLabelFn"
                        max-files="3"
                        multiple
                        style="max-width: 300px"
                      >
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <!-- v-close-popup -->
                <q-btn flat label="Cancelar" v-close-popup />
                <q-btn flat label="Importar" type="submit" />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>

        <!-- MODAL PARA MAS INFORMACION -->
        <q-dialog v-model="modalInfo">
          <q-card style="width: 700px; max-width: 80vw">
            <q-card-section>
              <div class="text-h6">Informacion</div>
            </q-card-section>
            <q-form
              method="post"
              @submit.prevent="updateUser"
              enctype="multipart/form-data"
            >
              <q-card-section class="q-pt-none">
                <div class="q-pa-md">
                  <q-list bordered separator v-if="listFilesData.length > 0">
                    <q-item
                      clickable
                      v-ripple
                      v-for="(file, index) in listFilesData"
                      :key="index"
                    >
                      <q-item-section>
                        <q-item-label header>{{ file.type }}</q-item-label>
                        <q-item-label
                          >{{ file.name }}
                          <q-btn
                            size="sm"
                            color="red"
                            class="q-ml-xs"
                            style="float: right"
                            round
                            dense
                            @click="deleteFile(file)"
                            :icon="'delete'"
                            title="Eliminar" />

                          <q-btn
                            size="sm"
                            color="blue"
                            class="q-ml-xs"
                            style="float: right"
                            round
                            dense
                            @click="downloadFile(file)"
                            :icon="'download'"
                            title="Descargar"
                        /></q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>

                  <span v-else>No hay archivos subidos para este usuario</span>
                </div>
              </q-card-section>

              <q-card-actions align="right" class="bg-white text-teal">
                <!-- v-close-popup -->
                <q-btn flat label="Cerrar" v-close-popup />
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
              <q-td key="lastname" :props="props">
                {{ props.row.lastname }}
              </q-td>

              <q-td key="rut" :props="props">
                {{ props.row.rut }}
              </q-td>

              <q-td key="email" :props="props">
                {{ props.row.email }}
              </q-td>

              <q-td key="type" :props="props">
                <q-badge color="green">
                  {{ props.row.type }}
                </q-badge>
              </q-td>

              <q-td key="type" :props="props">
                <q-btn
                  size="sm"
                  color="red"
                  round
                  dense
                  @click="deleteUser(props)"
                  :icon="'delete'"
                  title="Eliminar usuario"
                />

                <q-btn
                  size="sm"
                  color="blue"
                  class="q-ml-xs"
                  round
                  dense
                  @click="infoUser(props)"
                  :icon="'info'"
                  title="Mas informacion"
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
  {
    name: "lastname",
    align: "center",
    label: "Apellido",
    field: (row) => row.lastname,
    sortable: true,
  },
  { name: "rut", label: "Rut", field: (row) => row.rut, sortable: true },
  {
    name: "email",
    label: "Email",
    field: (row) => row.email,
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
      localStorage.removeItem("user");
    },

    async newUser() {
      let password = userObject.value.rut
        .substring(4, userObject.value.rut.length)
        .replace("-", "");

      userObject.value.password = password;
      let config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        url: `${global.url_api}/new-user`,
        //timeout: 5000,
        data: {
          name: userObject.value.name,
          apellido: userObject.value.lastname,
          rut: userObject.value.rut,
          email: userObject.value.email,
          type: userObject.value.type,
          password,
        },
      };

      await axios(config).then((res) => {
        let obj = {
          _id: res.data._id,
          name: res.data.nombre,
          lastname: res.data.apellido,
          rut: res.data.rut,
          email: res.data.email,
          type: res.data.tipo,
          selected: false,
        };
        rows.value.push(obj);
        this.newRegister = false;
      });
    },

    async getUser() {
      if (rows.value.length == 0) {
        rows.value = [];
        let config = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
          url: `${global.url_api}/list-user`,
        };

        await axios(config).then((respuestas) => {
          respuestas.data.forEach((element) => {
            let res = {
              _id: element._id,
              name: element.nombre,
              lastname: element.apellido,
              rut: element.rut,
              email: element.email,
              type: element.tipo,
              files: element.files,
              selected: false,
            };
            rows.value.push(res);
          });
        });
      }
    },

    async openModalFile() {
      this.modalFile = true;
      let config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
        url: `${global.url_api}/list-user`,
      };

      this.userList = [];

      await axios(config).then((respuestas) => {
        respuestas.data.forEach((element) => {
          let res = {
            _id: element._id,
            name: element.nombre,
            lastname: element.apellido,
            rut: element.rut,
          };
          userList.value.push(res);
        });
      });
    },

    verifyRut(e) {
      // Despejar Puntos
      var valor = this.userObject.rut.replace(".", "");
      // Despejar Guión
      valor = valor.replace("-", "");

      // Aislar Cuerpo y Dígito Verificador
      let cuerpo = valor.slice(0, -1);
      let dv = valor.slice(-1).toUpperCase();

      // Formatear RUN
      this.userObject.rut = cuerpo + "-" + dv;

      let size = valor.length;
      console.log("SIZE: ", size);
      if (size == 9) {
        e.preventDefault();
      }
      // Si todo sale bien, eliminar errores (decretar que es válido)
      //alert("RUT VALIDO");
      //rut.setCustomValidity("");
    },

    async infoUser(item) {
      this.modalInfo = !this.modalInfo;
      this.listFilesData = [];
      try {
        let config = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
          url: `${global.url_api}/listFileByUser?id=${item.row._id}`,
        };

        await axios(config).then((respuestas) => {
          respuestas.data.forEach((element) => {
            let res = {
              _id: element._id,
              name: element.nombre,
              type: element.type,
              id_user: element.id_user,
            };
            this.listFilesData.push(res);
          });
        });

        this.userObject = item.row;
      } catch (ex) {
        console.error(ex);
      }
    },

    async deleteUser(item) {
      let config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        url: `${global.url_api}/delete-user`,
        //timeout: 5000,
        data: {
          id: item.row._id,
        },
      };

      await axios(config).then((res) => {
        rows.value = rows.value.filter((v) => v._id !== res.data._id);
      });
    },

    async importFile() {
      let formData = new FormData();
      let fileData = [];
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("file", file);
        formData.append("id_user", this.userModel._id);
        formData.append("type", this.typeFile);
      }

      let res = await axios.post(`${global.url_api}/upload-file`, formData);

      if (res.status == 200) {
        this.files = [];
        this.modalFile = false;
      }
    },

    selectAllRows() {
      rows.value.forEach((v) => (v.selected = !v.selected));
    },

    async downloadFile(item) {
      try {
        const response = await axios.get(
          `${global.url_api}/downloadFile?id=${item._id}`,
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = item.name;
        link.click();
      } catch (err) {
        console.log(err);
      }
    },

    async deleteFile(item) {
      let config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        url: `${global.url_api}/deleteFileById`,
        //timeout: 5000,
        data: {
          id: item._id,
        },
      };

      await axios(config).then((res) => {
        if (res.data.success) {
          this.listFilesData = this.listFilesData.filter(
            (v) => v._id !== item._id
          );
        }
      });
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
