// import { createStore } from "../../vuex-core";

// export default createStore({
//   state: {
//     navList: ["signle module test", "damn!!!"],
//   },
//   getters: {
//     getNavList(state) {
//       return state.navList;
//     },
//   },
//   mutations: {
//     updateNavList(state, navList: any) {
//       return state.navList = navList;
//     },
//   },
//   actions: {
//     updateNavList({ commit }) {
//       setTimeout(() => {
//         const navList = [1, 2];
//         commit("updateNavList", navList);
//       }, 2000);
//     },
//   },
// });


import { createStore } from "../../vuex-core/multiple.index";

export default createStore({
  modules: {
    testmodule1: {
      modules: {
        testmodule11: {
          modules: {
            testmodule111: {}
          }
        },
        testmodule12: {}
      }
    },
    testmodule2: {}
  }
});
