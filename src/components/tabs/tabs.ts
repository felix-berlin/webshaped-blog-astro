import type { InjectionKey, Ref } from "vue";

export interface TabMeta {
  badge?: number | string;
  header: string;
  tabId: string;
  tabpanelId: string;
}

export const SelectedTabKey: InjectionKey<Ref<string>> = Symbol("selectedTab");
export const TabsKey: InjectionKey<TabMeta[]> = Symbol("tabs");
