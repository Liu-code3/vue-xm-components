<script lang="ts" setup>
import { ref } from 'vue';

import selectInput from './components/selectInput.vue';
import selectMenu from './components/selectMenu.vue';


import vFocus from './directives/vFocus'

interface MenuItem {
  content: string;
  [key: string]: any;
}

const props = defineProps<{
  menuData: MenuItem[];
}>()


const chooiseValue = ref('')
const selectItem = (item: MenuItem) => {
  chooiseValue.value = item.content
}


const searchValue = ref('')
const changeValue = (val: string) => {
  searchValue.value = val
}
</script>

<template>
  <div class="selector" v-focus>
    <selectInput
        :value="chooiseValue"
        @changeValue="changeValue"
    />
    <selectMenu
        :menu-data="menuData"
        :searchValue="searchValue"
        @selectItem="selectItem"
    />
  </div>
</template>

<style>
.selector {
  position: relative;
  width: 240px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>