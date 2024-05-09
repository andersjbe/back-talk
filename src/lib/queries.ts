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
    tagName: e.optional(e.uuid),
    speakerId: e.optional(e.uuid),
    queryTerm: e.optional(e.str),
  },
  (p) => {
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
      filter: e.all(
        e.set(
          e.op(p.speakerId, "in", talk.speakers.id),
          e.op(p.tagName, "in", talk.tags.id),
          e.any(
            e.set(
              e.op(talk.title, "ilike", p.queryTerm),
              e.op(talk.description, "ilike", p.queryTerm),
            ),
          ),
        ),
      ),

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
      queryTerm: searchTerm ? `%${searchTerm}%` : null,
      speakerId: speakerId || null,
      tagName: tagName || null,
    });
    return { talks, count };
  },
  [],
  { tags: [`get-talks`], revalidate: 2 },
);
