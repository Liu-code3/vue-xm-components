<script setup lang="ts">
import type { ActionIconName } from '../type'

defineProps<{
  name: ActionIconName
}>()
</script>

<template>
  <svg class="xm-action-icon" viewBox="0 0 16 16" aria-hidden="true">
    <g
        v-if="name === 'copy'"
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linejoin="round"
    >
      <rect x="5.6" y="5.6" width="8" height="8" rx="1.6" />
      <path d="M10.4 5.6V3.7c0-.6-.5-1.1-1.1-1.1H3.7c-.6 0-1.1.5-1.1 1.1v5.6c0 .6.5 1.1 1.1 1.1h1.9" />
    </g>

    <g
        v-else-if="name === 'reload'"
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
      <path d="M2.9 8a5.1 5.1 0 0 1 8.7-3.6l1.5 1.5" />
      <path d="M13.1 2.9v3h-3" />
      <path d="M13.1 8a5.1 5.1 0 0 1-8.7 3.6l-1.5-1.5" />
      <path d="M2.9 13.1v-3h3" />
    </g>

    <g
        v-else-if="name === 'like'"
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
      <path d="M6.3 13.4V7.3l2.3-4.6c.6 0 1.1.5 1.1 1.1v2.4h2.5c.7 0 1.2.7 1 1.4l-.9 4.5c-.1.6-.6 1-1.2 1H6.3Z" />
      <path d="M6.3 7.3H3.8c-.5 0-.9.4-.9.9v4.3c0 .5.4.9.9.9h2.5" />
    </g>

    <g
        v-else-if="name === 'dislike'"
        transform="translate(0 16) scale(1 -1)"
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
      <path d="M6.3 13.4V7.3l2.3-4.6c.6 0 1.1.5 1.1 1.1v2.4h2.5c.7 0 1.2.7 1 1.4l-.9 4.5c-.1.6-.6 1-1.2 1H6.3Z" />
      <path d="M6.3 7.3H3.8c-.5 0-.9.4-.9.9v4.3c0 .5.4.9.9.9h2.5" />
    </g>

    <g
        v-else-if="name === 'delete'"
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
      <path d="M3.4 4.4h9.2" />
      <path d="M6.4 4.4V3.2c0-.4.3-.7.7-.7h1.8c.4 0 .7.3.7.7v1.2" />
      <path d="M4.6 4.4l.6 8c0 .5.4.9.9.9h4.8c.5 0 .9-.4.9-.9l.6-8" />
    </g>

    <g
        v-else
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
      <path d="M11.2 2.9l1.9 1.9-6.6 6.6-2.8.8.8-2.8Z" />
      <path d="M3 13.4h10" />
    </g>
  </svg>
</template>

<style scoped>
.xm-action-icon {
  width: 16px;
  height: 16px;
  display: block;
}
</style>
