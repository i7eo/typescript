<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
// import { useStore } from "../../vuex-core";
import { useStore } from "../../vuex-core/multiple.index.ts";

defineProps<{ msg: string }>();
const count = ref(0);

const store = useStore()
// console.log(store)

const navList = computed(() => {
  console.log('computed')
  return store.getters['testmodule11/getNavList']
})

// // store.mutations['testmodule11/updateNavList'](["testmodule11 state", "damn!!!"]) // mutations
// store.commit('testmodule11/updateNavList', ["testmodule11 state", "damn!!!"]) // mutations

onMounted(() => {
  console.log('onMounted')
  // store.actions['testmodule11/updateNavList']({}) // actions
  store.dispatch('testmodule11/updateNavList', {}) // actions
})
</script>

<template>
  <h1>{{ msg }}</h1>
  <!-- <h2>{{ store.test() }}</h2> -->
  <h2>{{ navList }}</h2>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
