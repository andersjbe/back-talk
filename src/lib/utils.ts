import { clsx, type ClassValue } from "clsx";
import type { Duration } from "edgedb";
import { parseDuration } from "edgedb/dist/conUtils";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const durationToLength = (d: Duration) => {
  const ms = parseDuration(d);
  const seconds = ms / 1000;
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSecs = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSecs}`;
};
