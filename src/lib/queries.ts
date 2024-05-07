import { unstable_cache } from "next/cache";
import "server-only";
import e, { createClient } from "~/edgeql-js";

const client = createClient();

export const getAllTags = unstable_cache(
  () =>
    e
      .select(e.TalkTag, (tag) => ({
        id: true,
        name: true,
      }))
      .run(client),
  [],
  { tags: ["get-all-tags"] },
);

export const getAllSpeakers = unstable_cache(
  () =>
    e
      .select(e.Speaker, (sp) => ({
        id: true,
        name: true,
      }))
      .run(client),
  [],
  { tags: ["get-all-speakers"] },
);

const talksCount = e.params({}, (_) => e.count(e.TalkRecording));

const talksQuery = e.params({ skip: e.optional(e.int32) }, (p) =>
  e.select(e.TalkRecording, (talk) => ({
    id: true,
    createdAt: true,
    description: true,
    length: true,
    title: true,
    year: true,
    tags: {
      name: true,
      limit: 5,
    },
    speakers: {
      name: true,
    },
    order_by: talk.createdAt,
    limit: 12,
    offset: p.skip,
  })),
);
export const getTalks = unstable_cache(
  async (page: number) => {
    const count = await e.count(e.TalkRecording).run(client);
    const talks = await talksQuery.run(client, { skip: (page - 1) * 24 });
    return { talks, count };
  },
  [],
  { tags: ["get-talks"] },
);
