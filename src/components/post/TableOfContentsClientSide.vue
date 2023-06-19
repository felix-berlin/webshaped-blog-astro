<template>
  <nav :id="props.id" class="c-toc" role="doc-toc" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

export interface TableOfContentsClientSideProps {
  id?: string;
  target: string;
  h2Class?: string;
  h3Class?: string;
  setIndexIdToHeadlines?: boolean;
}

const props = withDefaults(defineProps<TableOfContentsClientSideProps>(), {
  id: "tableOfContents",
  target: "",
  h2Class: "c-toc__h2",
  h3Class: "c-toc__h3",
  setIndexIdToHeadlines: false,
});

const observer = ref<IntersectionObserver>();

const createTocClientSide = () => {
  const toc = document.getElementById(props.id) as HTMLDivElement;
  const matches = document.querySelectorAll(
    `${props.target} h2, ${props.target} h3`
  ) as NodeListOf<HTMLElement>;

  matches.forEach((value, index) => {
    if (props.setIndexIdToHeadlines) {
      const headlineId = `h-${index}`;
      value.id = headlineId;
    }

    // Create all needed elements
    const ul = document.createElement("ul") as HTMLUListElement;
    const li = document.createElement("li") as HTMLLIElement;
    const a = document.createElement("a") as HTMLAnchorElement;

    a.className = "c-toc__link";
    // a.classList.add('c-toc__link');
    if (value.tagName === "H2") {
      a.innerText = value.textContent;
      a.href = `#${value.id}`;
      li.appendChild(a);
      li.classList.add(props.h2Class);
      ul.appendChild(li);
      toc.appendChild(ul);
    }
    if (value.tagName === "H3") {
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
};

observer.value = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const headline = entry.target as HTMLElement;
        const toc = document.getElementById(props.id) as HTMLDivElement;
        const tocLinks = toc.querySelectorAll(
          "a"
        ) as NodeListOf<HTMLAnchorElement>;

        tocLinks.forEach((link) => {
          link.classList.remove("c-toc__link--active");
        });
        const tocLink = toc.querySelector(
          `a[href="#${headline.id}"]`
        ) as HTMLAnchorElement;
        tocLink.classList.add("c-toc__link--active");
      }
    });
  },
  {
    threshold: 0.75,
    rootMargin: "-10% 0px",
  }
);

onMounted(() => {
  createTocClientSide();
  if (observer.value)
    document
      .querySelectorAll(".c-blog__content h2[id], .c-blog__content h3[id]")
      .forEach((section) => observer.value.observe(section));

  // document.addEventListener('click', (event) => {
  //   const target = event.target as HTMLElement;
  //   if (target.classList.contains('c-toc__link')) {
  //     // event.preventDefault();
  //     const toc = document.getElementById(props.id) as HTMLDivElement;
  //     const tocLinks = toc.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
  //     tocLinks.forEach((link) => {
  //       link.classList.remove('c-toc__link--active');
  //     });
  //     target.classList.add('c-toc__link--active');
  //   }
  // });
});

onUnmounted(() => {
  if (observer.value) observer.value.disconnect();
});
</script>

<style lang="scss">
@use "@styles/components/table-of-contents.scss";
</style>
