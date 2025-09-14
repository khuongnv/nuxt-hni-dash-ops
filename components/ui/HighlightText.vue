<template>
  <span v-html="highlightedText"></span>
</template>

<script setup lang="ts">
interface Props {
  text: string
  query: string
}

const props = defineProps<Props>()

const highlightedText = computed(() => {
  if (!props.query.trim()) {
    return props.text
  }
  
  const regex = new RegExp(`(${props.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return props.text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>')
})
</script>
