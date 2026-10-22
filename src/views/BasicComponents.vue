<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/button/index.vue'
import Input from '@/components/input/index.vue'
import Switch from '@/components/switch/index.vue'
import Tag from '@/components/tag/index.vue'
import Tooltip from '@/components/tooltip/index.vue'
import Modal from '@/components/modal/index.vue'
import Tabs from '@/components/tabs/index.vue'
import { message } from '@/components/message'
import type { TabItem } from '@/components/tabs/type'

/* 输入类 */
const basicValue = ref('')
const keyword = ref('xmui')
const counted = ref('')

/* 开关 */
const switchOn = ref(true)
const switchText = ref(false)
const switchSmall = ref(false)
const switchLoading = ref(false)
const switchDisabled = ref(true)

/* 标签 */
const tags = ref(['Vue 3', 'TypeScript', 'Vite'])

function removeTag(name: string) {
  tags.value = tags.value.filter(item => item !== name)
}

/* 弹窗 */
const modalOpen = ref(false)
const modalLoading = ref(false)
const taskName = ref('')
const taskUrgent = ref(true)

function confirmModal() {
  modalLoading.value = true
  window.setTimeout(() => {
    modalLoading.value = false
    modalOpen.value = false
    message.success('任务已创建')
  }, 800)
}

/* 消息 */
function showLoadingMessage() {
  const hide = message.loading('正在上传…', 0)
  window.setTimeout(() => hide.close(), 1500)
}

/* 标签页 */
const activeTab = ref<string | number>('detail')
const tabItems: TabItem[] = [
  { key: 'detail', label: '详情', content: '这里展示任务的基本信息、负责人和执行时间。' },
  { key: 'log', label: '执行日志', content: '每一步工具调用都会记录在这里，便于排查问题。' },
  { key: 'setting', label: '设置', content: '仅管理员可见。', disabled: true }
]
</script>

<template>
  <div class="demo-page">
    <section class="demo-card">
      <h2 class="demo-title">Button 按钮</h2>
      <p class="demo-desc">五种类型、三种尺寸、危险态与加载态</p>

      <div class="demo-section">
        <div class="demo-section__title">类型</div>
        <div class="demo-row">
          <Button>默认按钮</Button>
          <Button type="primary">主要按钮</Button>
          <Button type="dashed">虚线按钮</Button>
          <Button type="text">文本按钮</Button>
          <Button type="link">链接按钮</Button>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-section__title">状态</div>
        <div class="demo-row">
          <Button danger>删除</Button>
          <Button type="primary" danger>危险主要</Button>
          <Button type="primary" loading>提交中</Button>
          <Button disabled>禁用</Button>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-section__title">尺寸与形状</div>
        <div class="demo-row">
          <Button size="small">小号</Button>
          <Button>中号</Button>
          <Button size="large">大号</Button>
          <Button shape="round">圆角</Button>
          <Button type="primary" shape="circle" aria-label="添加">
            <template #icon>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                    d="M8 3.2v9.6M3.2 8h9.6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                />
              </svg>
            </template>
          </Button>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-section__title">撑满宽度</div>
        <Button type="primary" block>Block 按钮</Button>
      </div>
    </section>

    <section class="demo-card">
      <h2 class="demo-title">Input 输入框</h2>
      <p class="demo-desc">前后缀、清空、字数统计、校验状态</p>

      <div class="demo-section">
        <div class="demo-row">
          <div class="demo-field">
            <Input v-model="basicValue" placeholder="基础输入框" />
          </div>
          <div class="demo-field">
            <Input v-model="keyword" placeholder="可清空" allow-clear @enter="message.info(`搜索：${keyword}`)" />
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-row">
          <div class="demo-field">
            <Input v-model="counted" placeholder="最多 20 个字" show-count :max-length="20" />
          </div>
          <div class="demo-field">
            <Input placeholder="带前后缀">
              <template #prefix>🔍</template>
              <template #suffix>.com</template>
            </Input>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-row">
          <div class="demo-field">
            <Input model-value="校验失败的内容" status="error" />
          </div>
          <div class="demo-field">
            <Input model-value="只读内容" disabled />
          </div>
          <div class="demo-field">
            <Input model-value="大尺寸" size="large" />
          </div>
        </div>
      </div>
    </section>

    <section class="demo-card">
      <h2 class="demo-title">Switch 开关</h2>
      <p class="demo-desc">受控开关、带文案、加载中、禁用</p>

      <div class="demo-row">
        <Switch v-model:checked="switchOn" />
        <Switch v-model:checked="switchText" checked-text="开" un-checked-text="关" />
        <Switch v-model:checked="switchSmall" size="small" />
        <Switch v-model:checked="switchLoading" loading />
        <Switch v-model:checked="switchDisabled" disabled />
      </div>
    </section>

    <section class="demo-card">
      <h2 class="demo-title">Tag 标签</h2>
      <p class="demo-desc">预设色板、可关闭、自定义颜色</p>

      <div class="demo-section">
        <div class="demo-section__title">预设色</div>
        <div class="demo-row">
          <Tag>默认</Tag>
          <Tag color="primary">进行中</Tag>
          <Tag color="success">已完成</Tag>
          <Tag color="warning">待确认</Tag>
          <Tag color="error">失败</Tag>
          <Tag color="purple">Agent</Tag>
          <Tag color="cyan">工具调用</Tag>
          <Tag color="magenta">实验</Tag>
        </div>
      </div>

      <div class="demo-section">
        <div class="demo-section__title">可关闭 / 无边框 / 自定义色</div>
        <div class="demo-row">
          <Tag v-for="tag in tags" :key="tag" color="primary" closable @close="removeTag(tag)">
            {{ tag }}
          </Tag>
          <Tag color="success" :bordered="false">无边框</Tag>
          <Tag color="#722ed1">#722ed1</Tag>
        </div>
      </div>
    </section>

    <section class="demo-card">
      <h2 class="demo-title">Tooltip 文字提示</h2>
      <p class="demo-desc">四个方向、hover / click 触发</p>

      <div class="demo-row">
        <Tooltip content="上方提示" placement="top">
          <Button>上方</Button>
        </Tooltip>
        <Tooltip content="下方提示" placement="bottom">
          <Button>下方</Button>
        </Tooltip>
        <Tooltip content="左侧提示" placement="left">
          <Button>左侧</Button>
        </Tooltip>
        <Tooltip content="右侧提示" placement="right">
          <Button>右侧</Button>
        </Tooltip>
        <Tooltip trigger="click" placement="bottom" content="点击外部关闭">
          <Button type="dashed">点击触发</Button>
        </Tooltip>
      </div>
    </section>

    <section class="demo-card">
      <h2 class="demo-title">Tabs 标签页</h2>
      <p class="demo-desc">line / card 两种样式，受控切换</p>

      <div class="demo-section">
        <div class="demo-section__title">line</div>
        <Tabs v-model:active-key="activeTab" :items="tabItems">
          <template #content="{ item }">
            <strong>{{ item?.label }}：</strong>{{ item?.content }}
          </template>
        </Tabs>
      </div>

      <div class="demo-section">
        <div class="demo-section__title">card + small</div>
        <Tabs type="card" size="small" :items="tabItems" default-active-key="log" />
      </div>
    </section>

    <section class="demo-card">
      <h2 class="demo-title">Modal 与 Message</h2>
      <p class="demo-desc">对话框配合全局提示</p>

      <div class="demo-section">
        <div class="demo-section__title">对话框</div>
        <Button type="primary" @click="modalOpen = true">新建任务</Button>
      </div>

      <div class="demo-section">
        <div class="demo-section__title">全局提示</div>
        <div class="demo-row">
          <Button @click="message.success('操作成功')">成功</Button>
          <Button @click="message.error('请求失败，请重试')">失败</Button>
          <Button @click="message.warning('磁盘空间不足')">警告</Button>
          <Button @click="message.info('已复制到剪贴板', 1500)">普通</Button>
          <Button @click="showLoadingMessage">加载中</Button>
        </div>
      </div>

      <Modal
          v-model:open="modalOpen"
          title="新建任务"
          :confirm-loading="modalLoading"
          @ok="confirmModal"
      >
        <div class="demo-stack">
          <div>
            <div class="demo-section__title">任务名称</div>
            <Input v-model="taskName" placeholder="例如：生成本周周报" />
          </div>
          <div class="demo-row">
            <Switch v-model:checked="taskUrgent" />
            <span class="modal-text">标记为紧急</span>
          </div>
        </div>
      </Modal>
    </section>
  </div>
</template>

<style scoped>
.modal-text {
  font-size: var(--xm-font-size);
  color: var(--xm-color-text-secondary);
}
</style>
