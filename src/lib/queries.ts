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

export const getTalks = unstable_cache(
  async ({
    page,
    orderBy,
    searchTerm,
    speakerId,
    tagName,
  }: {
    page: number;
    orderBy?: string;
    searchTerm?: string;
    speakerId?: string;
    tagName?: string;
  }) => {
    if (!orderBy || !["createdAt", "length", "year"].includes(orderBy)) {
      orderBy = "createdAt";
    }

    let orderQuery;
    if (orderBy === "createdAt") {
      orderQuery = e.select(e.TalkRecording, (q) => ({
        order_by: q.createdAt,
      }));
    } else if (orderBy === "length") {
      orderQuery = e.select(e.TalkRecording, (q) => ({
        order_by: q.length,
      }));
    } else {
      orderQuery = e.select(e.TalkRecording, (q) => ({
        order_by: q.year,
      }));
    }

    const talksQuery = e.params(
      {
        skip: e.optional(e.int32),
        tagName: e.optional(e.uuid),
        speakerId: e.optional(e.uuid),
        queryTerm: e.optional(e.str),
      },
      (p) => {
        let query = e.select(orderQuery, (q) => ({
          ...q["*"],
          id: true,
          createdAt: true,
          description: true,
          length: true,
          title: true,
          year: true,
          tags: {
            filter: e.op("exists", q.tags),
            limit: 5,
            name: true,
          },
          speakers: {
            name: true,
          },
          filter: e.all(
            e.set(
              e.op(p.speakerId, "in", q.speakers.id),
              e.op(p.tagName, "in", q.tags.id),
              e.any(
                e.set(
                  e.op(q.title, "ilike", p.queryTerm),
                  e.op(q.description, "ilike", p.queryTerm),
                ),
              ),
            ),
          ),

          limit: 12,
          offset: p.skip,
        }));

        return query;
      },
    );

    const count = await e.count(e.TalkRecording).run(client);

    const talks = await talksQuery.run(client, {
      skip: (page - 1) * 12,
      queryTerm: `%${searchTerm || ""}%`,
      speakerId: speakerId || null,
      tagName: tagName || null,
    });
    return { talks, count };
  },
  [],
  { tags: [`get-talks`], revalidate: 2 },
);
