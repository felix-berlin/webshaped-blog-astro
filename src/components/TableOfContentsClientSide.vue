<template>
  <div
    :id="props.id"
    class="c-toc"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

export interface TableOfContentsClientSideProps {
  target: string,
  h2Class?: string,
  h3Class?: string,
  setIndexIdToHeadlines?: boolean,
}

const props = withDefaults(defineProps<TableOfContentsClientSideProps>(), {
  id: 'tableOfContents',
  target: '',
  h2Class: 'c-toc__h2',
  h3Class: 'c-toc__h3',
  setIndexIdToHeadlines: false,
})


const createTocClientSide = () => {
  const toc = document.getElementById(props.id) as HTMLDivElement
  const matches = document.querySelectorAll(`${props.target} h2, ${props.target} h3`) as NodeListOf<HTMLElement>;

  matches.forEach((value, index) => {
    if (props.setIndexIdToHeadlines) {
      const headlineId = `h-${index}`;
      value.id=headlineId
    }

    const ul = document.createElement('ul') as HTMLUListElement;
    const li = document.createElement('li') as HTMLLIElement;
    const a = document.createElement('a') as HTMLAnchorElement;

    if (value.tagName === 'H2') {
      a.innerText = value.textContent;
      a.href = `#${value.id}`;
      li.appendChild(a);
      li.classList.add(h2Class);
      ul.appendChild(li);
      toc.appendChild(ul);
    }
    if (value.tagName === 'H3') {
      const lastUl = toc.lastElementChild;
      const lastLi = lastUl.lastElementChild;
      a.innerText = value.textContent;
      a.href = `#${value.id}`;
      li.appendChild(a);
      li.classList.add(props.h3Class);
      ul.appendChild(li);
      lastLi.appendChild(ul);
    }
  });
}

onMounted(() => {
  createTocClientSide()
})

</script>

<style scoped>

</style>
