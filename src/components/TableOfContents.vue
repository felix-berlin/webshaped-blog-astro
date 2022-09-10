<template>
  <div
    id="tableOfContents"
    class="c-toc"
  >
    <h2>Table of Contents</h2>
    <template
      v-for="(headline, index) in getHeadlines(props.content)"
      :key="index"
    >
      <a
        :href="`#${headline.id}`"
        :class="`c-toc-link__depth-${headline.level}`"
        style="display: block"
      >{{ headline.title }}</a>
    </template>
  </div>
</template>

<script setup lang="ts">

export interface TableOfContentsProps {
  content: string,
}

const props = defineProps<TableOfContentsProps>()

const getHeadlines = (content: string):object => {
  const headlines = []
  const regex = /<h([2-3])[^>]* id="(.*?)"[^>]*>(.*?)<\/h\1>/g
  let match
  while ((match = regex.exec(content)) !== null) {
    headlines.push({
      level: match[1],
      title: match[3],
      id: match[2],
    })
  }

  return headlines
}
</script>

<style scoped>

</style>
