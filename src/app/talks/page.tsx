import { getAllSpeakers, getAllTags } from "~/lib/queries";
import NewTalkDialog from "./new-talk";

export default async function TalksPage() {
  const tags = await getAllTags();
  const speakers = (await getAllSpeakers()).map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <main className="container mx-auto mt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Talks</h1>
        <NewTalkDialog tags={tags} speakers={speakers} />
      </div>
    </main>
  );
}
