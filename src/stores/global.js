import { defineStore } from 'pinia';

export const useGlobal = defineStore('counter', {
  state: () => ({
    url_api: 'http://localhost:3000',
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
