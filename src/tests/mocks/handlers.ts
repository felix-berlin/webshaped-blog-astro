import type { RequestHandler } from "msw";

// Default handlers shared by every test; individual tests add their own via `server.use(...)`.
export const handlers: RequestHandler[] = [];
