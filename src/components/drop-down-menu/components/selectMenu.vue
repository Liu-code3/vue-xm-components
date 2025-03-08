<script lang="ts" setup>
import { watch, onMounted, ref } from 'vue'
import noData from './noData.vue'

interface MenuItem {
  content: string;
  [key: string]: any;
}

const emits = defineEmits<{
  (e: 'selectItem', item: MenuItem): void;
}>()

const props = defineProps<{
  menuData: MenuItem[];
  searchValue: string;
}>()

const selectItem = (item: MenuItem) => {
  emits('selectItem', item)
}

const selectData = ref<MenuItem[]>([])

watch(() => props.searchValue, (newVal) => {
  filterData(newVal)
})

onMounted(() => {
  selectData.value = props.menuData
})

function filterData(val: string) {
  selectData.value = props.menuData.filter((item) => {
    return item.content.toLowerCase().includes(val.toLowerCase())
  })
}
</script>


<template>
  <div class="menu">
    <template v-if="selectData.length === 0">
      <noData />
    </template>
    <template v-else>
      <template v-for="item of selectData" :key="item.content">
        <div
            class="menu-item"
            @click="selectItem(item)"
        >{{ item.content }}</div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.menu {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: -2px;
  width: calc(100% + 4px);
  max-height: 364px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  animation: dropDown .25s ease-in-out;
  overflow-y: auto;
  z-index: 1000;
}

.menu-item {
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

@keyframes dropDown {
  from {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: center top;
  }
  to {
    opacity: 1;
    transform: scaleY(1);
    transform-origin: center top;
  }
}

.menu::-webkit-scrollbar {
  width: 6px;
}

.menu::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 3px;
}

.menu::-webkit-scrollbar-thumb {
  background: #e4e7ed;
  border-radius: 3px;
  transition: all 0.2s;
}

.menu::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}
</style>