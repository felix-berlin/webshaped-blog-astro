// @pagefind/default-ui ships no type declarations; this covers the API Search.vue uses.
declare module "@pagefind/default-ui" {
  export interface PagefindUIOptions {
    bundlePath?: string;
    element?: string;
    resetStyles?: boolean;
    showImages?: boolean;
  }

  export class PagefindUI {
    constructor(options: PagefindUIOptions);
  }
}
