import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { config } from "@vue/test-utils";
import { setupServer } from "msw/node";
import { graphql, http } from "msw";
// import { useAutoAnimate } from "@formkit/auto-animate/vue";

import {
  // Directives
  VTooltip,
  VClosePopper,
  // Components
  Dropdown as VDropdown,
  Tooltip,
  Menu as VMenu,
} from "floating-vue";

beforeAll(() => {
  vi.stubEnv("PUBLIC_WP_API", "https://cms.webshaped.de/api");

  config.global.components = {
    VDropdown,
    Tooltip,
    VMenu,
  };
  config.global.directives = {
    "close-popper": VClosePopper,
    tooltip: VTooltip,
    // "auto-animate": useAutoAnimate,
  };
});

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// const posts = [
//   {
//     userId: 1,
//     id: 1,
//     title: "first post title",
//     body: "first post body",
//   },
//   // ...
// ];

// export const restHandlers = [
//   http.get("https://rest-endpoint.example/path/to/posts", (req, res, ctx) => {
//     return res(ctx.status(200), ctx.json(posts));
//   }),
// ];

// const graphqlHandlers = [
//   graphql.query(
//     "https://graphql-endpoint.example/api/v1/posts",
//     (req, res, ctx) => {
//       return res(ctx.data(posts));
//     },
//   ),
// ];

// const server = setupServer(...restHandlers, ...graphqlHandlers);

// // Start server before all tests
// beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// //  Close server after all tests
// afterAll(() => server.close());

// // Reset handlers after each test `important for test isolation`
// afterEach(() => server.resetHandlers());
