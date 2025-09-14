<template>
  <span v-html="highlightedText"></span>
</template>

<script setup lang="ts">
interface Props {
  text: string
  query: string
}

const props = defineProps<Props>()

// Function to remove Vietnamese diacritics
const removeDiacritics = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const highlightedText = computed(() => {
  if (!props.query.trim()) {
    return props.text
  }
  
  // Remove diacritics for comparison
  const normalizedQuery = removeDiacritics(props.query)
  const normalizedText = removeDiacritics(props.text)
  
  // Check if text contains query (case-insensitive, no diacritics)
  if (!normalizedText.toLowerCase().includes(normalizedQuery.toLowerCase())) {
    return props.text
  }
  
  // Find the original match position and highlight it
  const regex = new RegExp(`(${props.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return props.text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>')
})
</script>
