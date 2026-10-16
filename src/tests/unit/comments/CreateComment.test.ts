import CreateComment from "@components/comments/CreateComment.vue";
import { guest } from "@stores/store";
import { flushPromises, mount } from "@vue/test-utils";
import { HttpResponse } from "msw";
import { graphql } from "msw/graphql";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "@/tests/mocks/node";

// The success/error dialog stays up for three seconds; skip the wait.
vi.mock("@vueuse/core", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@vueuse/core")>()),
  promiseTimeout: () => Promise.resolve(),
}));

// Same endpoint the urql client in src/tests/setup.ts talks to.
const wordpress = graphql.link("https://cms.webshaped.test/graphql");
const requests = vi.fn();

const mockCreate = (body: object) =>
  server.use(
    wordpress.mutation("CreateComment", ({ variables }) => {
      requests(variables);
      return HttpResponse.json(body);
    }),
  );

const success = (ok: boolean) => ({
  data: { createComment: { __typename: "CreateCommentPayload", success: ok } },
});

const mountForm = () => mount(CreateComment, { props: { currentPostId: "42", lang: "en" } });

const fillValid = async (wrapper: ReturnType<typeof mountForm>) => {
  await wrapper.find("#comment").setValue("A thoughtful comment");
  await wrapper.find("#author").setValue("Jane");
  await wrapper.find("#privacy").setValue(true);
};

const submit = async (wrapper: ReturnType<typeof mountForm>) => {
  await wrapper.find("form").trigger("submit");
  await flushPromises();
};

beforeEach(() => {
  requests.mockClear();
  guest.set({ saveUser: false });
});

describe("CreateComment", () => {
  it("submits once an invalid optional e-mail has been emptied again", async () => {
    mockCreate(success(true));
    const wrapper = mountForm();
    await fillValid(wrapper);

    await wrapper.find("#user-email").setValue("not-an-email");
    await submit(wrapper);
    expect(requests).not.toHaveBeenCalled();

    await wrapper.find("#user-email").setValue("");
    await submit(wrapper);
    await vi.waitFor(() => expect(requests).toHaveBeenCalledOnce());
  });

  it("emits commentCreated and clears the comment on success", async () => {
    mockCreate(success(true));
    const wrapper = mountForm();
    await fillValid(wrapper);
    await submit(wrapper);

    await vi.waitFor(() => expect(wrapper.emitted("commentCreated")).toHaveLength(1));
    expect((wrapper.find("#comment").element as HTMLTextAreaElement).value).toBe("");
  });

  it("keeps the typed comment and shows an error when WordPress reports success: false", async () => {
    mockCreate(success(false));
    const wrapper = mountForm();
    await fillValid(wrapper);
    await wrapper.find("form").trigger("submit");

    await vi.waitFor(() => expect(requests).toHaveBeenCalledOnce());
    await flushPromises();
    expect(wrapper.emitted("commentCreated")).toBeUndefined();
    expect((wrapper.find("#comment").element as HTMLTextAreaElement).value).toBe(
      "A thoughtful comment",
    );
  });

  it("does not save the guest data when the comment was not created", async () => {
    mockCreate({ errors: [{ message: "Duplicate comment" }] });
    const wrapper = mountForm();
    await fillValid(wrapper);
    await wrapper.find("#saveUser").setValue(true);
    await submit(wrapper);

    await vi.waitFor(() => expect(requests).toHaveBeenCalledOnce());
    await flushPromises();
    expect(guest.get()).toEqual({ saveUser: false });
  });
});
