"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by speaker(s)" />
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
