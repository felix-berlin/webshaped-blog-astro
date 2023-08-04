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

      <div
        v-if="block.name === 'core/code'"
        class="c-blocks__code"
        v-html="block.originalContent"
      />

      <figure v-if="block.name === 'core/image'" class="c-blocks__image">
        <img
          :id="(parse(block.attributesJSON) as typeof block.attributesJSON).id"
          :src="
            (parse(block.attributesJSON) as typeof block.attributesJSON).url
          "
          :alt="
            (parse(block.attributesJSON) as typeof block.attributesJSON).alt
          "
        />
        <figcaption
          v-if="
            (parse(block.attributesJSON) as typeof block.attributesJSON).caption
          "
          v-html="
            (parse(block.attributesJSON) as typeof block.attributesJSON).caption
          "
        />
      </figure>

      <a
        v-if="block.name === 'core/button'"
        :id="
          (parse(block.attributesJSON) as typeof block.attributesJSON).anchor
        "
        :href="(parse(block.attributesJSON) as typeof block.attributesJSON).url"
        :title="
          (parse(block.attributesJSON) as typeof block.attributesJSON).title
        "
        :target="
          (parse(block.attributesJSON) as typeof block.attributesJSON).target
        "
        :rel="(parse(block.attributesJSON) as typeof block.attributesJSON).rel"
        :class="`c-blocks__button ${
          (parse(block.attributesJSON) as typeof block.attributesJSON).className
        }`"
        >{{
          (parse(block.attributesJSON) as typeof block.attributesJSON).text
        }}</a
      >

      <div v-if="block.name === 'core/html'" v-html="block.originalContent" />
    </template>
  </div>
</template>

<script setup lang="ts">
import slugify from "slugify";
import type { Block } from "../types/generated/graphql";
import { isHtml, parse, getHtmlContent } from "../lib/helpers";

interface ContentBlocksProps {
  blocks: Block[];
}

defineProps<ContentBlocksProps>();
</script>
