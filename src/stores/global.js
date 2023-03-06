import { defineStore } from 'pinia';

export const useGlobal = defineStore('counter', {
  state: () => ({
    url_api: 'https://anyproback-production.up.railway.app',
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
