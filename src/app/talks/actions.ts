"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import e, { createClient } from "~/edgeql-js";
import type { talkSchema } from "./schema";

const client = createClient();

export const createTalk = async (talk: z.infer<typeof talkSchema>) => {
  const insertTalk = e.params(
    {
      length: e.duration,
      title: e.str,
      year: e.int32,
      videoUrl: e.str,
      description: e.str,
      tagsNames: e.array(e.str),
    },
    (p) =>
      e.insert(e.TalkRecording, {
        length: p.length,
        title: p.title,
        videoUrl: p.videoUrl,
        year: p.year,
        description: p.description,
        tags: e.select(e.TalkTag, (tag) => ({
          filter: e.op(tag.name, "in", e.array_unpack(p.tagsNames)),
        })),
      }),
  );

  await insertTalk.run(client, {
    description: talk.description || "",
    length: await e.duration(`${talk.length}`).run(client),
    tagsNames: talk.tags,
    title: talk.title,
    videoUrl: talk.videoUrl,
    year: talk.year,
  });
};

export const createTag = async (tagName: string) => {
  console.log({ tagName });
  try {
    await e
      .insert(e.TalkTag, {
        name: tagName,
      })
      .run(client);
    revalidateTag("get-all-tags");
  } catch (err) {
    console.log(err);
    return { success: false };
  }

  return { success: true };
};
