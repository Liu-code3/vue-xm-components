<script setup lang="ts">
import { messageList } from './state'
</script>

<template>
  <div class="xm-message">
    <TransitionGroup name="xm-message">
      <div
          v-for="item in messageList"
          :key="item.id"
          class="xm-message__item"
          :class="`is-${item.type}`"
          role="alert"
      >
        <span class="xm-message__icon">
          <svg v-if="item.type === 'success'" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="8" fill="currentColor" />
            <path
                d="M4.6 8.3 6.9 10.6 11.5 5.9"
                fill="none"
                stroke="#fff"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>
          <svg v-else-if="item.type === 'error'" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="8" fill="currentColor" />
            <path
                d="M5.6 5.6 10.4 10.4 M10.4 5.6 5.6 10.4"
                fill="none"
                stroke="#fff"
                stroke-width="1.6"
                stroke-linecap="round"
            />
          </svg>
          <svg v-else-if="item.type === 'warning'" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="8" fill="currentColor" />
            <path d="M8 4.2v4.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
            <circle cx="8" cy="11.4" r="0.9" fill="#fff" />
          </svg>
          <svg v-else-if="item.type === 'info'" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="8" fill="currentColor" />
            <circle cx="8" cy="4.8" r="0.9" fill="#fff" />
            <path d="M8 7.2v4.2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          <span v-else class="xm-message__spinner" />
        </span>

        <span class="xm-message__content">{{ item.content }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.xm-message {
  position: fixed;
  top: 16px;
  left: 50%;
  z-index: 1080;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transform: translateX(-50%);
  pointer-events: none;
}

.xm-message__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 420px;
  padding: 9px 14px;
  border-radius: var(--xm-radius-lg);
  background: var(--xm-color-bg);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12);
  color: var(--xm-color-text);
  font-size: var(--xm-font-size);
  line-height: 1.5;
  pointer-events: auto;
}

.xm-message__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 16px;
  height: 16px;
}

.xm-message__icon svg {
  width: 100%;
  height: 100%;
}

.xm-message__item.is-success .xm-message__icon {
  color: var(--xm-color-success);
}

.xm-message__item.is-error .xm-message__icon {
  color: var(--xm-color-error);
}

.xm-message__item.is-warning .xm-message__icon {
  color: var(--xm-color-warning);
}

.xm-message__item.is-info .xm-message__icon {
  color: var(--xm-color-primary);
}

.xm-message__spinner {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--xm-color-primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: xm-message-spin 0.8s linear infinite;
}

.xm-message__content {
  min-width: 0;
  overflow-wrap: anywhere;
}

.xm-message-enter-active,
.xm-message-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.xm-message-enter-from,
.xm-message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.xm-message-move,
.xm-message-enter-active,
.xm-message-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

@keyframes xm-message-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
