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

const talksQuery = e.params(
  {
    skip: e.optional(e.int32),
    tagName: e.optional(e.str),
    speakerId: e.optional(e.uuid),
    queryTerm: e.optional(e.str),
  },
  (p) => {
    // console.log(p.speakerId.runJSON(client));

    return e.select(e.TalkRecording, (talk) => ({
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
      filter: e.all(e.set(e.op(p.speakerId, "in", talk.speakers.id))),

      order_by: talk.createdAt,
      limit: 12,
      offset: p.skip,
    }));
  },
);
export const getTalks = unstable_cache(
  async (
    page: number,
    searchTerm?: string,
    speakerId?: string,
    tagName?: string,
  ) => {
    const count = await e.count(e.TalkRecording).run(client);
    const talks = await talksQuery.run(client, {
      skip: (page - 1) * 24,
      queryTerm: searchTerm,
      speakerId: speakerId || null,
      tagName: tagName,
    });
    return { talks, count };
  },
  [],
  { tags: [`get-talks`], revalidate: 2 },
);
