<script lang="ts" setup>
  import { throttle } from "@/utils/tool.ts";
  import Down from "@/components/Cascade/components/down.vue";

  const props = defineProps<{
    value: string;
  }>()

  const emits = defineEmits<{
    (e: 'changeValue', value: string): void;
  }>()

  const handleInputValue = (e: Event) => {
    const target = e.target as HTMLInputElement
    emits('changeValue', target.value)
  }

  const changeInput = throttle(handleInputValue, 300)
</script>

<template>
  <div class="selectInput">
    <label class="placeholder">请选择</label>
    <input
        type="text"
        class="input"
        :value="value"
        @input="changeInput"
    />
    <down class="icon" />
  </div>
</template>

<style scoped>
.selectInput {
  position: relative;
  width: 100%;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: all 0.2s;
}

.selectInput:hover {
  border-color: #c0c4cc;
}

.selectInput:focus-within {
  border-color: #409eff;
}

.placeholder {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  font-size: 14px;
  pointer-events: none;
  transition: all 0.2s;
}

.input {
  width: 100%;
  height: 100%;
  padding: 0 30px 0 12px;
  border: none;
  outline: none;
  font-size: 14px;
  color: #606266;
  background: transparent;
}

.input:not(:placeholder-shown) + .placeholder {
  transform: translateY(-130%);
  font-size: 12px;
  color: #409eff;
}

.icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #c0c4cc;
  transition: transform 0.2s;
  font-size: 12px;
  cursor: pointer;
}

.selectInput:focus-within .icon {
  transform: translateY(-50%) rotate(180deg);
  color: #409eff;
}
</style>