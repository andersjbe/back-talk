import { z } from "zod";

export const CURRENT_YEAR = new Date(Date.now()).getFullYear();

export const talkSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  videoUrl: z.string().url(),
  year: z.coerce.number().min(1950).max(CURRENT_YEAR),
  length: z.coerce.number().min(1),
  // speakerIds: z.array(z.tuple([z.string(), z.string()])).min(1),
  tags: z.array(z.string().min(1)),
});
