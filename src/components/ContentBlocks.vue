<template>
  <template v-for="(block, index) in blocks" :key="index">
    <ParagraphBlock v-if="block.name === 'core/paragraph'" :block="block" />
    <ListBlock v-if="block.name === 'core/list'" :block="block" />
    <HeadlineBlock v-if="block.name === 'core/heading'" :block="block" />
    <CodeBlock v-if="block.name === 'core/code'" :block="block" />
    <FigureBlock v-if="block.name === 'core/image'" :block="block" />
    <ButtonBlock v-if="block.name === 'core/buttons'" :block="block" />
    <!-- <div v-if="block.name === 'core/html'" v-html="block.originalContent" /> -->
  </template>
</template>

<script setup lang="ts">
import type { EditorBlock } from "@/gql/graphql.ts";
import ListBlock from "@components/content-blocks/ListBlock.vue";
import CodeBlock from "@components/content-blocks/CodeBlock.vue";
import ButtonBlock from "@components/content-blocks/ButtonBlock.vue";
import FigureBlock from "@components/content-blocks/FigureBlock.vue";
import HeadlineBlock from "@components/content-blocks/HeadlineBlock.vue";
import ParagraphBlock from "@components/content-blocks/ParagraphBlock.vue";
interface ContentBlocksProps {
  blocks: EditorBlock[];
}

defineProps<ContentBlocksProps>();
</script>
