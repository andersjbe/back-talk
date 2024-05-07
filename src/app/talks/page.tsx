import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { validateRequest } from "~/lib/auth/lucia";
import { getAllSpeakers, getAllTags, getTalks } from "~/lib/queries";
import { durationToLength } from "~/lib/utils";
import NewTalkDialog from "./new-talk";

export default async function TalksPage({
  searchParams,
}: {
  searchParams: { page?: number };
}) {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const talks = await getTalks(page);
  console.log(talks.at(-1)?.length);

  return (
    <main className="container mx-auto mt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Talks</h1>
        <NewTalk />
      </div>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {talks.map((talk) => (
          <Card key={talk.id}>
            <CardHeader>
              <CardTitle>{talk.title}</CardTitle>
              <CardDescription>
                {talk.speakers.map((s) => s.name).join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-4 min-h-12 text-ellipsis text-wrap break-words">
                {talk.description}
              </p>
              <div className="flex flex-row items-center justify-between text-muted-foreground">
                <span>{talk.year}</span>
                <span>
                  {/* {`${talk.length.toString().replace("PT", "").replace("M", "")}`}{" "} */}
                  {durationToLength(talk.length)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center gap-1">
              {talk.tags.map(({ name }) => (
                <span className="text-bold rounded bg-accent p-1 text-sm font-semibold text-accent-foreground dark:bg-accent/70">
                  {name}
                </span>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}

async function NewTalk() {
  const tags = await getAllTags();
  const speakerDB = await getAllSpeakers();
  const speakers = speakerDB.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
  const { session } = await validateRequest();

  if (!session) return null;

  return <NewTalkDialog tags={tags} speakers={speakers} />;
}
