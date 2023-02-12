<template>
  <q-drawer v-model="drawerStatus" show-if-above bordered>
    <q-list>
      <q-item-label header> <p>AnyPro</p> </q-item-label>
      <EssentialLink
        v-for="link in essentialLinks"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </q-drawer>
</template>
  
  <script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Usuarios",
    caption: "",
    icon: "school",
    link: "/list-user",
  },
];

export default defineComponent({
  props: "drawerStatus",
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  methods: {
    getDrawnerStatus() {},
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
  