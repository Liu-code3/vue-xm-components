<script setup lang="ts">
import { ref } from 'vue'
import AgentDemo from './views/AgentDemo.vue'
import BasicComponents from './views/BasicComponents.vue'

const tabs = [
  { key: 'agent', label: 'Agent 组件' },
  { key: 'basic', label: '基础组件' }
] as const

const active = ref<'agent' | 'basic'>('agent')
</script>

<template>
  <div class="app">
    <header class="app__header">
      <div class="app__brand">
        <h1>XMUI 组件练习</h1>
        <p>Vue 3 + TypeScript 手写组件，参考 Ant Design / Ant Design X</p>
      </div>

      <nav class="app__nav" aria-label="组件分类">
        <button
            v-for="tab in tabs"
            :key="tab.key"
            class="app__tab"
            :class="{ 'is-active': active === tab.key }"
            type="button"
            @click="active = tab.key"
        >
          {{ tab.label }}
        </button>
      </nav>
    </header>

    <AgentDemo v-if="active === 'agent'" />
    <BasicComponents v-else />
  </div>
</template>

<style scoped>
.app {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 72px;
}

.app__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.app__brand h1 {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--xm-color-text);
}

.app__brand p {
  margin-top: 6px;
  font-size: 13px;
  color: var(--xm-color-text-tertiary);
}

.app__nav {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--xm-color-border-secondary);
  border-radius: 999px;
  background: var(--xm-color-bg);
}

.app__tab {
  padding: 5px 14px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--xm-color-text-secondary);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: background-color var(--xm-motion) var(--xm-ease), color var(--xm-motion) var(--xm-ease);
}

.app__tab:hover {
  color: var(--xm-color-primary);
}

.app__tab.is-active {
  background: var(--xm-color-primary);
  color: #fff;
}
</style>
