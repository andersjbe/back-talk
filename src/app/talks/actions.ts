"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import e, { createClient } from "~/edgeql-js";
import { talkSchema } from "./schema";

const client = createClient().withConfig({ allow_user_specified_id: true });

const insertSpeakers = e.params(
  { speakers: e.array(e.tuple([e.str, e.uuid])) },
  (p) =>
    e.for(e.array_unpack(p.speakers), (speaker) => {
      return e.insert(e.Speaker, {
        id: speaker[1],
        name: speaker[0],
      });
    }),
);

const insertTalk = e.params(
  {
    length: e.duration,
    title: e.str,
    year: e.int32,
    videoUrl: e.str,
    description: e.str,
    tagsNames: e.array(e.str),
    speakers: e.array(e.uuid),
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
      speakers: e.select(e.Speaker, (speaker) => ({
        filter: e.op(speaker.id, "in", e.array_unpack(p.speakers)),
      })),
    }),
);

const talkFormSchema = talkSchema.extend({
  speakers: z.array(z.object({ label: z.string(), value: z.string() })),
});

export const createTalk = async (bodyString: string) => {
  const talk = talkFormSchema.parse(JSON.parse(bodyString));

  console.log("SPEAKERS FROM BODY", talk.speakers);
  try {
    const newSpeakers = await insertSpeakers.run(client, {
      speakers: talk.speakers
        .filter(({ value }) => value.startsWith("*"))
        .map(({ label, value }) => [label, value.slice(1)]),
    });
    let i = -1;
    const speakers = talk.speakers.map((sp) => {
      if (sp.value.startsWith("*")) {
        i += 1;
        return newSpeakers[i]?.id || "";
      }
      return sp.value;
    });

    console.log(speakers);

    await insertTalk.run(client, {
      description: talk.description || "",
      length: await e.duration(`${talk.length}`).run(client),
      tagsNames: talk.tags,
      title: talk.title,
      videoUrl: talk.videoUrl,
      year: talk.year,
      speakers,
    });

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
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
