import { Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { validateRequest } from "~/lib/auth/lucia";
import { getAllSpeakers, getAllTags, getTalks } from "~/lib/queries";
import { durationToLength } from "~/lib/utils";
import {
  OrderSelect,
  ResetButton,
  SpeakerFilter,
  TagFilter,
  TalkSearch,
} from "./filters";
import NewTalkDialog from "./new-talk";

export default async function TalksPage({
  searchParams,
}: {
  searchParams: {
    page?: number;
    speakerId?: string;
    tagName?: string;
    query?: string;
    orderBy?: string;
  };
}) {
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const { talks, count } = await getTalks({
    page,
    searchTerm: searchParams.query,
    speakerId: searchParams.speakerId,
    tagName: searchParams.tagName,
    orderBy: searchParams.orderBy,
  });
  const totalPages = Math.ceil(count / 12);

  const tags = await getAllTags();
  const speakerDB = await getAllSpeakers();
  const speakers = speakerDB.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <main className="container mx-auto mt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Talks</h1>
        <NewTalk speakers={speakers} tags={tags} />
      </div>
      <div className="mt-2 flex flex-col items-start justify-between md:flex-row md:items-center">
        <div className="flex flex-row flex-wrap gap-2">
          <TalkSearch />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-46 space-y-2">
              <SpeakerFilter speakers={speakers} />
              <TagFilter tags={tags} />
            </PopoverContent>
          </Popover>
          {(searchParams.query ||
            searchParams.speakerId ||
            searchParams.tagName) && <ResetButton />}
        </div>
        <div>
          <OrderSelect />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {talks.map((talk) => (
          <Card
            key={talk.id}
            className="delay-50 group transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary "
          >
            <CardHeader>
              <CardTitle>{talk.title}</CardTitle>
              <CardDescription>
                {talk.speakers.map((s) => s.name).join(", ")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 min-h-[72px] text-ellipsis text-wrap break-words">
                {talk.description}
              </p>
              <div className="flex flex-row items-center justify-between text-muted-foreground">
                <span>{talk.year}</span>
                <span>{durationToLength(talk.length)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center gap-1">
              {talk.tags.map(({ name }) => (
                <span
                  key={name}
                  className="text-bold group-hover:text-primary-foreground: rounded bg-secondary p-1 text-sm font-semibold text-secondary-foreground delay-100 duration-300 ease-in-out group-hover:bg-primary dark:bg-secondary/70"
                >
                  {name}
                </span>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
      <Pages page={page} totalPages={totalPages} displayPages={5} />
    </main>
  );
}

function Pages({
  page,
  totalPages,
  displayPages,
}: {
  page: number;
  totalPages: number;
  displayPages: number;
}) {
  const showLeftElipsis = page - 1 > displayPages / 2;
  const showRightElipsis = totalPages - page + 1 > displayPages / 2;

  const getPageNumbers = () => {
    if (page <= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
      const half = Math.floor(totalPages / 2);
      // To ensure that the current page is always in the middle
      let start = page - half;
      let end = page + half;
      // If the current page is near the start
      if (start < 1) {
        start = 1;
        end = totalPages;
      }
      // If the current page is near the end
      if (end > totalPages) {
        start = totalPages - totalPages + 1;
        end = totalPages;
      }
      // If showLeftEllipsis is true, add an ellipsis before the start page
      if (showLeftElipsis) {
        start++;
      }
      // If showRightEllipsis is true, add an ellipsis after the end page
      if (showRightElipsis) {
        end--;
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const renderPaginationItems = () => {
    const pageNumbers = getPageNumbers();
    return pageNumbers.map((pn) => (
      <PaginationItem key={pn}>
        <PaginationLink href={`/talks?page=${pn}`} isActive={page === pn}>
          {pn}
        </PaginationLink>
      </PaginationItem>
    ));
  };

  return (
    <Pagination className="mb-2">
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={`/talks?page=${page - 1}`} />
          </PaginationItem>
        )}
        {showLeftElipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {renderPaginationItems()}
        {showRightElipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext href={`/talks?page=${page + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

async function NewTalk({
  speakers,
  tags,
}: {
  tags: { id: string; name: string }[];
  speakers: { label: string; value: string }[];
}) {
  const { session } = await validateRequest();

  if (!session) return null;

  return <NewTalkDialog tags={tags} speakers={speakers} />;
}
