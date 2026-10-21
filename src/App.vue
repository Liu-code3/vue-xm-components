<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ThoughtChain from '@/components/thought-chain/index.vue'
import Cascader from '@/components/Cascade/index.vue'
import type { ThoughtChainItem, ThoughtChainStatus } from '@/components/thought-chain/type'

/* ---------------- 演示一：Agent 调用工具的完整链路 ---------------- */

function createAgentSteps(): ThoughtChainItem[] {
  return [
    {
      key: '0',
      title: '理解用户意图',
      description: '拆解问题，规划需要调用的工具',
      status: 'pending',
      content: '用户询问「明天杭州天气怎么样」，需要调用天气查询工具获取实时数据。'
    },
    {
      key: '1',
      title: '调用工具 weather.query',
      description: '入参 city=杭州、date=明天',
      status: 'pending',
      content: 'POST /tools/weather.query\n{ "city": "杭州", "date": "2026-10-22" }',
      children: [
        { key: '1-0', title: '校验参数', status: 'pending' },
        { key: '1-1', title: '请求天气服务', status: 'pending' },
        { key: '1-2', title: '解析返回结果', status: 'pending' }
      ]
    },
    {
      key: '2',
      title: '生成回答',
      description: '结合工具结果组织自然语言回复',
      status: 'pending',
      content: '明天杭州多云转晴，18~26℃，东南风 2 级，适合出行。'
    }
  ]
}

const agentSteps = ref<ThoughtChainItem[]>(createAgentSteps())
const expandedKeys = ref<(string | number)[]>(['0', '1'])
const running = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

/** 按 key 递归查找节点，模拟时方便直接改状态 */
function findStep(list: ThoughtChainItem[], key: string): ThoughtChainItem | undefined {
  for (const item of list) {
    if (item.key === key) return item
    const hit = item.children && findStep(item.children, key)
    if (hit) return hit
  }
}

function patch(key: string, status: ThoughtChainStatus, statusText?: string | null) {
  const target = findStep(agentSteps.value, key)
  if (!target) return
  target.status = status
  if (statusText !== undefined) {
    target.statusText = statusText ?? undefined
  }
}

function wait(ms: number) {
  return new Promise<void>(resolve => {
    timer = setTimeout(resolve, ms)
  })
}

/** 依次推进状态，模拟 Agent 真实执行节奏 */
async function play() {
  if (running.value) return
  running.value = true
  agentSteps.value = createAgentSteps()
  expandedKeys.value = ['0']

  patch('0', 'loading', '思考中')
  await wait(900)
  patch('0', 'success', '0.6s')

  expandedKeys.value = ['0', '1']
  patch('1', 'loading', '调用中')
  for (const key of ['1-0', '1-1', '1-2']) {
    patch(key, 'loading', '执行中')
    await wait(650)
    patch(key, 'success', null)
  }
  patch('1', 'success', '2.1s')

  expandedKeys.value = ['0', '1', '2']
  patch('2', 'loading', '生成中')
  await wait(900)
  patch('2', 'success', '0.8s')

  running.value = false
}

onMounted(() => {
  void play()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
})

/* ---------------- 演示二：静态数据 + 自定义内容插槽 ---------------- */

const simpleSteps: ThoughtChainItem[] = [
  {
    key: 's0',
    title: '读取 package.json',
    description: 'node scripts/read-config.ts',
    status: 'success',
    statusText: '12ms',
    content: '{ "name": "xmui", "version": "0.0.0" }'
  },
  {
    key: 's1',
    title: '安装依赖',
    status: 'loading',
    statusText: '进行中',
    content: 'pnpm install --frozen-lockfile'
  },
  {
    key: 's2',
    title: '构建产物',
    status: 'pending',
    statusText: '等待中'
  }
]
</script>

<template>
  <main class="page">
    <header class="page__header">
      <h1>XMUI 组件练习</h1>
      <p>Vue 3 + TypeScript 手写组件，参考 Ant Design / Ant Design X 的交互与视觉</p>
    </header>

    <section class="card">
      <div class="card__head">
        <div>
          <h2 class="card__title">ThoughtChain 思维链</h2>
          <p class="card__desc">模拟 Agent 执行过程：思考 → 调用工具 → 生成回答</p>
        </div>
        <button class="btn" type="button" :disabled="running" @click="play">
          {{ running ? '演示中…' : '重新演示' }}
        </button>
      </div>

      <ThoughtChain v-model:expanded-keys="expandedKeys" :items="agentSteps" />
    </section>

    <section class="card">
      <h2 class="card__title">基础用法</h2>
      <p class="card__desc">small 尺寸、虚线连接线、自定义内容插槽</p>

      <ThoughtChain
          size="small"
          line="dashed"
          :items="simpleSteps"
          :default-expanded-keys="['s1']"
      >
        <template #content="{ item }">
          <pre class="code">{{ item.content }}</pre>
        </template>
      </ThoughtChain>
    </section>

    <section class="card">
      <h2 class="card__title">Cascade 级联选择</h2>
      <p class="card__desc">已有组件，保留演示入口</p>
      <Cascader />
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 780px;
  margin: 0 auto;
  padding: 48px 24px 72px;
}

.page__header {
  margin-bottom: 24px;
}

.page__header h1 {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.page__header p {
  margin-top: 6px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
}

.card {
  padding: 20px 22px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.card + .card {
  margin-top: 16px;
}

.card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.card__title {
  font-size: 15px;
  font-weight: 600;
}

.card__desc {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.card__title + .card__desc {
  margin-bottom: 16px;
}

.btn {
  flex: none;
  padding: 5px 14px;
  border: 1px solid #1677ff;
  border-radius: 6px;
  background: #1677ff;
  color: #fff;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, opacity 0.2s;
}

.btn:hover:not(:disabled) {
  background: #4096ff;
  border-color: #4096ff;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.code {
  margin: 8px 0 0;
  padding: 8px 10px;
  background: #f7f8fa;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  color: rgba(0, 0, 0, 0.65);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
