<template>
  <div id="postContent" class="c-blocks">
    <template v-for="block in blocks" :key="block.originalContent">
      <p
        v-if="block.name === 'core/paragraph'"
        class="c-blocks__paragraph"
        v-html="
          (parse(block.attributesJSON) as typeof block.attributesJSON).content
        "
      />

      <ListBlock v-if="block.name === 'core/list'" :block="block" />

      <component
        :is="`h${
          (parse(block.attributesJSON) as typeof block.attributesJSON).level
        }`"
        v-if="block.name === 'core/heading'"
        :id="
          isHtml(
            (parse(block.attributesJSON) as typeof block.attributesJSON)
              .content,
          )
            ? getHtmlContent(
                (parse(block.attributesJSON) as typeof block.attributesJSON)
                  .content,
              )
            : slugify(
                (parse(block.attributesJSON) as typeof block.attributesJSON)
                  .content,
                { lower: true },
              )
        "
        :class="`c-blocks__heading c-blocks__heading--${
          (parse(block.attributesJSON) as typeof block.attributesJSON).level
        }`"
      >
        <span
          v-if="
            isHtml(
              (parse(block.attributesJSON) as typeof block.attributesJSON)
                .content,
            )
          "
          v-html="
            (parse(block.attributesJSON) as typeof block.attributesJSON).content
          "
        />

        <template v-else>
          {{
            (parse(block.attributesJSON) as typeof block.attributesJSON).content
          }}
        </template>
      </component>

      <CodeBlock v-if="block.name === 'core/code'" :block="block" />

      <FigureBlock v-if="block.name === 'core/image'" :block="block" />
      <pre v-if="block.name === 'core/buttons'">{{ block }}</pre>

      <ButtonBlock v-if="block.name === 'core/buttons'" :block="block" />

      <div v-if="block.name === 'core/html'" v-html="block.originalContent" />
    </template>
  </div>
</template>

<script setup lang="ts">
import slugify from "slugify";
import type { Block } from "../types/generated/graphql";
import { isHtml, parse, getHtmlContent } from "@lib/helpers";
import ListBlock from "@components/content-blocks/ListBlock.vue";
import CodeBlock from "@components/content-blocks/CodeBlock.vue";
import ButtonBlock from "@components/content-blocks/ButtonBlock.vue";
import FigureBlock from "@components/content-blocks/FigureBlock.vue";
interface ContentBlocksProps {
  blocks: Block[];
}

defineProps<ContentBlocksProps>();
</script>
