import { type Component, defineAsyncComponent } from "vue";

// Built once at module level: creating the async component inside a render
// function returned a new definition every render and defeated <KeepAlive>.
export const socialIcons: Record<string, Component> = {
  facebook: defineAsyncComponent(() => import("virtual:icons/tabler/brand-facebook")),
  github: defineAsyncComponent(() => import("virtual:icons/tabler/brand-github")),
  instagram: defineAsyncComponent(() => import("virtual:icons/tabler/brand-instagram")),
  linkedIn: defineAsyncComponent(() => import("virtual:icons/tabler/brand-linkedin")),
  mastodon: defineAsyncComponent(() => import("virtual:icons/tabler/brand-mastodon")),
  reddit: defineAsyncComponent(() => import("virtual:icons/tabler/brand-reddit")),
  twitter: defineAsyncComponent(() => import("virtual:icons/tabler/brand-twitter")),
  youtube: defineAsyncComponent(() => import("virtual:icons/tabler/brand-youtube")),
};
