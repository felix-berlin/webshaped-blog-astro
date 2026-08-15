<template>
  <template v-for="(block, index) in blocks" :key="index">
    <ParagraphBlock
      v-if="block.name === 'core/paragraph'"
      :block="block as ParagraphBlockProps['block']"
    />
    <ListBlock v-if="block.name === 'core/list'" :block="block as ListBlockProps['block']" />
    <HeadlineBlock
      v-if="block.name === 'core/heading'"
      :block="block as HeadlineBlockProps['block']"
    />
    <CodeBlock v-if="block.name === 'core/code'" :block="block as CodeBlockProps['block']" />
    <FigureBlock v-if="block.name === 'core/image'" :block="block as FigureBlockProps['block']" />
    <ButtonBlock v-if="block.name === 'core/buttons'" :block="block as ButtonBlockProps['block']" />
    <!-- <div v-if="block.name === 'core/html'" v-html="block.originalContent" /> -->
  </template>
</template>

<script setup lang="ts">
import ButtonBlock, { type ButtonBlockProps } from "@components/content-blocks/ButtonBlock.vue";
import CodeBlock, { type CodeBlockProps } from "@components/content-blocks/CodeBlock.vue";
import FigureBlock, { type FigureBlockProps } from "@components/content-blocks/FigureBlock.vue";
import HeadlineBlock, {
  type HeadlineBlockProps,
} from "@components/content-blocks/HeadlineBlock.vue";
import ListBlock, { type ListBlockProps } from "@components/content-blocks/ListBlock.vue";
import ParagraphBlock, {
  type ParagraphBlockProps,
} from "@components/content-blocks/ParagraphBlock.vue";

export interface ContentBlocksProps {
  blocks: ContentBlock[];
}

// The `name` discriminant is a plain `string | null` (not a literal union) on every one of
// these fragment types, so TS can't narrow the block union from the `v-if` check alone — each
// branch still needs a `block as XBlockProps['block']` cast once `.name` has confirmed which
// variant is actually present at runtime.
type ContentBlock =
  | ButtonBlockProps["block"]
  | CodeBlockProps["block"]
  | FigureBlockProps["block"]
  | HeadlineBlockProps["block"]
  | ListBlockProps["block"]
  | ParagraphBlockProps["block"];

const { blocks } = defineProps<ContentBlocksProps>();
</script>
