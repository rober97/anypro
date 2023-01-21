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
        <q-btn label="Medium" color="primary" @click="medium = true" />

        <q-dialog v-model="small">
          <q-card style="width: 300px">
            <q-card-section>
              <div class="text-h6">Small</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              Click/Tap on the backdrop.
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn flat label="OK" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="medium">
          <q-card style="width: 700px; max-width: 80vw">
            <q-card-section>
              <div class="text-h6">Medium</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              Click/Tap on the backdrop.
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn flat label="OK" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="fullWidth" full-width>
          <q-card>
            <q-card-section>
              <div class="text-h6">Full Width</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              Click/Tap on the backdrop.
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn flat label="OK" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="fullHeight" full-height>
          <q-card class="column full-height" style="width: 300px">
            <q-card-section>
              <div class="text-h6">Full Height</div>
            </q-card-section>

            <q-card-section class="col q-pt-none">
              Click/Tap on the backdrop.
            </q-card-section>

            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn flat label="OK" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-table
          title="Treats"
          :rows="records"
          :columns="columns"
          row-key="name"
          selection="multiple"
          v-model:selected="selected"
          :hide-bottom="hideBottom"
          :hide-selected-banner="hideSelectedBanner"
          :hide-no-data="hideNoData"
          :hide-pagination="hidePagination"
        />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import DrawerComponent from "components/DrawerComponent.vue";

const columns = [
  {
    name: "name",
    required: true,
    label: "Dessert (100g serving)",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "calories",
    align: "center",
    label: "Calories",
    field: "calories",
    sortable: true,
  },
  { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
  { name: "carbs", label: "Carbs (g)", field: "carbs" },
];

const rows = [
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
  },
  {
    name: "Gingerbread",
    calories: 356,
    fat: 16.0,
    carbs: 49,
  },
  {
    name: "Jelly bean",
    calories: 375,
    fat: 0.0,
    carbs: 94,
  },
  {
    name: "Lollipop",
    calories: 392,
    fat: 0.2,
    carbs: 98,
  },
  {
    name: "Honeycomb",
    calories: 408,
    fat: 3.2,
    carbs: 87,
  },
  {
    name: "Donut",
    calories: 452,
    fat: 25.0,
    carbs: 51,
  },
  {
    name: "KitKat",
    calories: 518,
    fat: 26.0,
    carbs: 65,
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    DrawerComponent,
  },

  methods: {
    closeSession() {
      this.$router.push({ path: "/login" });
    },
  },

  setup() {
    const hasData = ref(true);

    return {
      hasData,
      hideBottom: ref(false),
      hideSelectedBanner: ref(false),
      hideNoData: ref(false),
      hidePagination: ref(false),

      selected: ref([rows[1]]),

      columns,

      records: computed(() => (hasData.value === true ? rows : [])),

      small: ref(false),
      medium: ref(false),
      fullWidth: ref(false),
      fullHeight: ref(false),
    };
  },
});
</script>
