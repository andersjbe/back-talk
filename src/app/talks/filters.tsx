"use client";

import { Label } from "@radix-ui/react-dropdown-menu";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function SpeakerFilter({
  speakers,
}: {
  speakers: { label: string; value: string }[];
}) {
  const params = useSearchParams();
  const router = useRouter();

  return (
    <div>
      <Select
        value={params.get("speakerId") || ""}
        onValueChange={(val) => {
          const newParams = new URLSearchParams(params);
          newParams.delete("page");
          newParams.set("speakerId", val);
          router.push(`/talks?${newParams.toString()}`);
        }}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Filter by speaker" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {speakers.map((sp) => (
              <SelectItem key={`select-${sp.value}`} value={sp.value}>
                {sp.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function TagFilter({ tags }: { tags: { id: string; name: string }[] }) {
  const params = useSearchParams();
  const router = useRouter();

  return (
    <div>
      <Select
        value={params.get("tagName") || ""}
        onValueChange={(val) => {
          const newParams = new URLSearchParams(params);
          newParams.delete("page");
          newParams.set("tagName", val);
          router.push(`/talks?${newParams.toString()}`);
        }}
      >
        <SelectTrigger className="w-44  ">
          <SelectValue placeholder="Filter by tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {tags.map((tag) => (
              <SelectItem key={`select-${tag.name}`} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function TalkSearch() {
  const params = useSearchParams();
  const router = useRouter();
  const [term, setTerm] = useState(params.get("query") || "");

  return (
    <div className="flex items-center gap-1">
      <Label>
        <Search className=" h-6 w-6" />
      </Label>
      <Input
        className="w-48"
        value={term}
        onChange={(ev) => setTerm(ev.target.value)}
        onBlur={() => {
          const newParams = new URLSearchParams(params);
          newParams.delete("page");
          if (term) newParams.set("query", term);
          router.push(`/talks?${newParams.toString()}`);
        }}
        placeholder="Search for a talk"
      />
    </div>
  );
}

export const ResetButton = () => {
  const router = useRouter();

  return (
    <Button variant="secondary" onClick={() => router.push("/talks")}>
      Clear Filters
    </Button>
  );
};

export const OrderSelect = () => {
  const router = useRouter();
  const params = useSearchParams();
  const order = params.get("orderBy") || "createdAt";

  return (
    <div className="flex flex-wrap items-center  gap-1">
      <Label>Order By</Label>
      <Select
        value={order}
        onValueChange={(val) => {
          const newParams = new URLSearchParams(params);
          newParams.delete("page");
          newParams.set("orderBy", val);
          router.push(`/talks?${newParams.toString()}`);
        }}
      >
        <SelectTrigger className="w-44  ">
          <SelectValue placeholder="Order results by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="createdAt">Upload Date</SelectItem>
            <SelectItem value="year">Talk Year</SelectItem>
            <SelectItem value="length">Length</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
