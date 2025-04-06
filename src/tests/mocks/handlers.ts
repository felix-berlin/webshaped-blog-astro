import { http, HttpResponse } from "msw";
import { testData } from "./apiData.js";

export const handlers = [
  http.get("/api/test", () => {
    return HttpResponse.json(testData);
  }),
];
