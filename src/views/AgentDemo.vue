<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Bubble from '@/components/bubble/index.vue'
import Sender from '@/components/sender/index.vue'
import Prompts from '@/components/prompts/index.vue'
import Actions from '@/components/actions/index.vue'
import ThoughtChain from '@/components/thought-chain/index.vue'
import Cascader from '@/components/Cascade/index.vue'
import type { ThoughtChainItem, ThoughtChainStatus } from '@/components/thought-chain/type'
import type { PromptItem } from '@/components/prompts/type'
import type { ActionItem } from '@/components/actions/type'

/* ---------------- 对话数据 ---------------- */

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content?: string
  /** 这条消息里嵌入思维链 */
  chain?: boolean
}

let messageId = 3
const messages = ref<ChatMessage[]>([
  { id: 1, role: 'assistant', content: '你好，我是 XMUI 助手。可以帮你查天气、总结文档、排查构建问题。' },
  { id: 2, role: 'user', content: '明天杭州天气怎么样？' },
  { id: 3, role: 'assistant', chain: true }
])

const draft = ref('')
const chatRef = ref<HTMLElement>()
const senderRef = ref<InstanceType<typeof Sender> | null>(null)

async function scrollToBottom() {
  await nextTick()
  const el = chatRef.value
  if (el) el.scrollTop = el.scrollHeight
}

function onSubmit(text: string) {
  if (!text) return
  messages.value.push({ id: ++messageId, role: 'user', content: text })
  draft.value = ''
  void scrollToBottom()

  window.setTimeout(() => {
    messages.value.push({
      id: ++messageId,
      role: 'assistant',
      content: '收到，我按这个思路继续处理。你可以先看看上面的执行链路，每一步都会实时更新状态。'
    })
    void scrollToBottom()
  }, 500)
}

/* ---------------- 提示词 ---------------- */

const promptItems: PromptItem[] = [
  { key: 'p1', label: '明天杭州天气', description: '调用天气工具查询', icon: '🌤' },
  { key: 'p2', label: '总结这份文档', description: '提炼要点与结论', icon: '📄' },
  { key: 'p3', label: '排查构建报错', description: '定位类型错误', icon: '🧩' },
  { key: 'p4', label: '写一个组件单测', description: '生成 Vitest 用例', icon: '🧪' }
]

function onPrompt(item: PromptItem) {
  draft.value = item.label
  senderRef.value?.focus()
}

/* ---------------- 思维链：模拟工具调用 ---------------- */

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

/** 按 key 递归查找节点，模拟时直接改状态 */
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

/* ---------------- 消息操作 ---------------- */

const actionItems: ActionItem[] = [
  { key: 'copy', icon: 'copy' },
  { key: 'reload', icon: 'reload' },
  { key: 'like', icon: 'like' },
  { key: 'dislike', icon: 'dislike' }
]

const liked = ref(false)
const actionTip = ref('')
let tipTimer: ReturnType<typeof setTimeout> | undefined

function tip(text: string) {
  actionTip.value = text
  clearTimeout(tipTimer)
  tipTimer = setTimeout(() => (actionTip.value = ''), 2000)
}

async function onAction(item: ActionItem) {
  if (item.key === 'copy') {
    try {
      await navigator.clipboard.writeText('明天杭州多云转晴，18~26℃，东南风 2 级。')
      tip('已复制回答')
    } catch {
      tip('当前环境不支持复制')
    }
    return
  }

  if (item.key === 'like') {
    liked.value = !liked.value
    tip(liked.value ? '感谢反馈' : '已取消')
    return
  }

  if (item.key === 'reload') {
    tip('重新执行中…')
    void play()
  }
}

onMounted(() => {
  void play()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  clearTimeout(tipTimer)
})

/* ---------------- 基础用法数据 ---------------- */

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
  <div class="demo-page">
    <!-- 组合演示：对话气泡 + 思维链 + 提示词 + 输入框 + 操作栏 -->
    <section class="demo-card chat">
      <div class="demo-card__head">
        <div>
          <h2 class="demo-title">Agent 对话面板</h2>
          <p class="demo-desc">Bubble + ThoughtChain + Prompts + Sender + Actions 组合使用</p>
        </div>
        <div class="chat__status">
          <span class="chat__badge">
            <i class="chat__dot" />
            {{ running ? '执行中' : '已完成' }}
          </span>
          <button class="chat__btn" type="button" :disabled="running" @click="play">
            {{ running ? '执行中…' : '重新演示' }}
          </button>
        </div>
      </div>

      <div ref="chatRef" class="chat__messages">
        <template v-for="message in messages" :key="message.id">
          <Bubble
              v-if="message.role === 'user'"
              placement="end"
              variant="outlined"
              :content="message.content"
          />
          <Bubble v-else placement="start" name="XMUI 助手">
            <ThoughtChain
                v-if="message.chain"
                v-model:expanded-keys="expandedKeys"
                :items="agentSteps"
            />
            <template v-else>{{ message.content }}</template>

            <template v-if="message.chain" #footer>
              <div class="chat__footer">
                <Actions
                    :items="actionItems.map(item => item.key === 'like' ? { ...item, active: liked } : item)"
                    size="small"
                    @action="onAction"
                />
                <span v-if="actionTip" class="chat__tip">{{ actionTip }}</span>
              </div>
            </template>
          </Bubble>
        </template>
      </div>

      <div class="chat__composer">
        <Prompts
            class="chat__prompts"
            title="试试这样问"
            :items="promptItems"
            :columns="2"
            @item-click="onPrompt"
        />

        <Sender
            ref="senderRef"
            v-model="draft"
            :loading="running"
            show-count
            :max-length="200"
            placeholder="问点什么，Enter 发送，Shift + Enter 换行"
            @submit="onSubmit"
            @cancel="tip('已停止生成')"
        >
          <template #prefix>
            <button class="chat__tool" type="button" title="添加附件" aria-label="添加附件">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                    d="M8 3.4v9.2M3.4 8h9.2"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
              </svg>
            </button>
          </template>
        </Sender>
      </div>
    </section>

    <!-- 单个组件用法 -->
    <section class="demo-card">
      <h2 class="demo-title">ThoughtChain 基础用法</h2>
      <p class="demo-desc">small 尺寸、虚线连接线、自定义内容插槽</p>

      <ThoughtChain
          size="small"
          line="dashed"
          :items="simpleSteps"
          :default-expanded-keys="['s1']"
      >
        <template #content="{ item }">
          <pre class="demo-code">{{ item.content }}</pre>
        </template>
      </ThoughtChain>
    </section>

    <section class="demo-card">
      <h2 class="demo-title">Bubble 与 Actions</h2>
      <p class="demo-desc">填充、描边、加载三种气泡，底部操作栏</p>

      <div class="bubbles">
        <Bubble placement="start" name="XMUI 助手" content="这是默认的填充样式。" />
        <Bubble placement="start" name="XMUI 助手" variant="outlined" content="这是描边样式，适合内容较重的场景。" />
        <Bubble placement="start" name="XMUI 助手" loading />
        <Bubble placement="end" content="这是靠右的用户消息。" />
        <Actions :items="actionItems" size="small" />
      </div>
    </section>

    <section class="demo-card">
      <h2 class="demo-title">Cascade 级联选择</h2>
      <p class="demo-desc">已有组件，保留演示入口</p>
      <Cascader />
    </section>
  </div>
</template>

<style scoped>
.chat__status {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
}

.chat__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--xm-color-success-bg);
  color: #389e0d;
  font-size: 12px;
}

.chat__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.chat__btn {
  padding: 5px 14px;
  border: 1px solid var(--xm-color-primary);
  border-radius: var(--xm-radius);
  background: var(--xm-color-primary);
  color: #fff;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, opacity 0.2s;
}

.chat__btn:hover:not(:disabled) {
  background: var(--xm-color-primary-hover);
  border-color: var(--xm-color-primary-hover);
}

.chat__btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.chat__messages {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 460px;
  padding: 4px 4px 8px;
  overflow-y: auto;
  border-bottom: 1px solid #f5f5f5;
}

.chat__footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: -6px;
}

.chat__tip {
  font-size: 12px;
  color: var(--xm-color-text-tertiary);
}

.chat__composer {
  padding-top: 14px;
}

.chat__prompts {
  margin-bottom: 12px;
}

.chat__tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 1px solid var(--xm-color-border);
  border-radius: var(--xm-radius);
  background: #fff;
  color: var(--xm-color-text-tertiary);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.chat__tool:hover {
  color: var(--xm-color-primary);
  border-color: var(--xm-color-primary-border);
}

.chat__tool svg {
  width: 14px;
  height: 14px;
}

.bubbles {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}
</style>
