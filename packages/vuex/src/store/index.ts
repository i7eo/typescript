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
      state: {
        navList: ["testmodule2 state", "damn!!!"],
      },
      getters: {
        getNavList(state) {
          return state.testmodule2state;
        },
      },
      mutations: {
        updateNavList(state, navList: any) {
          return state.navList = navList;
        },
      },
      actions: {
        updateNavList({ commit }) {
          setTimeout(() => {
            const navList = [1, 2];
            commit("updateNavList", navList);
          }, 2000);
        },
      },
      modules: {
        testmodule11: {
          state: {
            navList: ["testmodule2 state", "damn!!!"],
          },
          getters: {
            getNavList(state) {
              return state.navList;
            },
          },
          mutations: {
            updateNavList(state, navList: any) {
              console.log(navList)
              return state.navList = navList;
            },
          },
          actions: {
            updateNavList({ commit }, payload: any) {
              console.log(payload)
              setTimeout(() => {
                const navList = [1, 2];
                commit("updateNavList", navList);
              }, 2000);
            },
          },
          modules: {
            testmodule111: {
              state: {
                navList: ["testmodule2 state", "damn!!!"],
              },
              getters: {
                getNavList(state) {
                  return state.testmodule2state;
                },
              },
              mutations: {
                updateNavList(state, navList: any) {
                  return state.navList = navList;
                },
              },
              actions: {
                updateNavList({ commit }) {
                  setTimeout(() => {
                    const navList = [1, 2];
                    commit("updateNavList", navList);
                  }, 2000);
                },
              },
            }
          }
        },
        testmodule12: {
          state: {
            navList: ["testmodule2 state", "damn!!!"],
          },
          getters: {
            getNavList(state) {
              return state.testmodule2state;
            },
          },
          mutations: {
            updateNavList(state, navList: any) {
              return state.navList = navList;
            },
          },
          actions: {
            updateNavList({ commit }) {
              setTimeout(() => {
                const navList = [1, 2];
                commit("updateNavList", navList);
              }, 2000);
            },
          },
        }
      }
    },
    testmodule2: {
      state: {
        navList: ["testmodule2 state", "damn!!!"],
      },
      getters: {
        getNavList(state) {
          return state.testmodule2state;
        },
      },
      mutations: {
        updateNavList(state, navList: any) {
          return state.navList = navList;
        },
      },
      actions: {
        updateNavList({ commit }) {
          setTimeout(() => {
            const navList = [1, 2];
            commit("updateNavList", navList);
          }, 2000);
        },
      },
    }
  }
});
