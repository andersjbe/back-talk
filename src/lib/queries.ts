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
    limit: 24,
    offset: p.skip,
  })),
);
export const getTalks = unstable_cache(
  (page: number) => talksQuery.run(client, { skip: (page - 1) * 24 }),
  [],
  { tags: ["get-talks"] },
);
