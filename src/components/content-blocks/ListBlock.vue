<template>
  <component
    :is="blockAttrs?.ordered ? 'ol' : 'ul'"
    class="c-blocks__list"
    :class="blockAttrs?.ordered ? 'c-blocks__list--ordered' : 'c-blocks__list--unordered'"
  >
    <ListItemBlock
      v-for="(listItem, index) in block.innerBlocks ?? []"
      :key="listItem.attributes?.content ?? index"
      :block="listItem"
      class="c-blocks__list-item"
    >
      <ListBlock v-if="listItem?.innerBlocks?.[0]" :block="listItem.innerBlocks[0]" />
    </ListItemBlock>
  </component>
</template>

<script setup lang="ts">
import ListItemBlock from "@components/content-blocks/ListItemBlock.vue";

import type { CoreListFragment } from "@/gql/graphql.ts";

// ponytail: neither `attributes.ordered` nor a nested `core/list` inside a list item is
// selected by the CoreList GraphQL fragment (src/services/fragments/blockFragments.ts) — this
// mirrors the recursive shape ListBlock/ListItemBlock already render defensively; extend that
// fragment to fetch it for real ordered/nested-list support.
export interface ListBlockProps {
  block: {
    attributes?: null | { ordered?: boolean | null };
    innerBlocks: ListItemNode[] | null;
    name: CoreListFragment["name"];
  };
}
export interface ListItemNode extends CoreListItemFields {
  innerBlocks?: Array<ListBlockProps["block"]> | null;
}

type CoreListInnerBlock = NonNullable<CoreListFragment["innerBlocks"]>[number];

// The one union member WPGraphQL Content Blocks resolves for `... on CoreListItem`.
type CoreListItemFields = Extract<NonNullable<CoreListInnerBlock>, { attributes: unknown }>;

const props = defineProps<ListBlockProps>();

const blockAttrs = props.block.attributes;
</script>
