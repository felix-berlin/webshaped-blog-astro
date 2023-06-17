<template>
  <div id="postContent" class="c-blocks">
    <template v-for="block in blocks" :key="block.order">
      <p
        v-if="block.name === 'core/paragraph'"
        class="c-blocks__paragraph"
        v-html="parse(block.attributesJSON as string | undefined).content"
      />

      <component
        :is="`h${parse(block.attributesJSON as string | undefined).level}`"
        v-if="block.name === 'core/heading'"
        :id="slugify(parse(block.attributesJSON as string | undefined).content, { lower: true })"
        :class="`c-blocks__heading c-blocks__heading--${
          parse(block.attributesJSON as string | undefined).level
        }`"
      >
        {{ parse(block.attributesJSON as string | undefined).content }}
      </component>

      <div
        v-if="block.name === 'core/code'"
        class="c-blocks__code"
        v-html="block.originalContent"
      />

      <figure v-if="block.name === 'core/image'" class="c-blocks__image">
        <img
          :id="parse(block.attributesJSON as string | undefined).id"
          :src="parse(block.attributesJSON as string | undefined).url"
          :alt="parse(block.attributesJSON as string | undefined).alt"
        />
        <figcaption
          v-if="parse(block.attributesJSON as string | undefined).caption"
          v-html="parse(block.attributesJSON as string | undefined).caption"
        />
      </figure>

      <a
        v-if="block.name === 'core/button'"
        :id="parse(block.attributesJSON as string | undefined).anchor"
        :href="parse(block.attributesJSON as string | undefined).url"
        :title="parse(block.attributesJSON as string | undefined).title"
        :target="parse(block.attributesJSON as string | undefined).target"
        :rel="parse(block.attributesJSON as string | undefined).rel"
        :class="`c-blocks__button ${parse(block.attributesJSON as string | undefined).className}`"
        >{{ parse(block.attributesJSON as string | undefined).text }}</a
      >

      <div v-if="block.name === 'core/html'" v-html="block.originalContent" />
    </template>
  </div>
</template>

<script setup lang="ts">
import slugify from "slugify";
import type { Block } from "../types/generated/graphql";

interface PostBlocksProps {
  blocks: Block[];
}

const props = defineProps<PostBlocksProps>();

const parse = (str: string | undefined) => {
  if (!str) return;

  return JSON.parse(str);
};
</script>

<style scoped></style>
