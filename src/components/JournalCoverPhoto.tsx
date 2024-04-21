import type { PrayerJournal, PrayerJournalCover } from "@prisma/client";
import Image from "next/image";
import React from "react";

// Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535
const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

const colorDataURL = (color: string) =>
  rgbDataURL(
    parseInt(color.substring(1, 3), 16),
    parseInt(color.substring(3, 5), 16),
    parseInt(color.substring(5, 7), 16)
  );

export const JournalCoverPhoto: React.FC<{
  journal: PrayerJournal & { cover: PrayerJournalCover | null };
  isThumbnail?: boolean;
  priority?: boolean;
}> = ({ journal, isThumbnail = false, priority }) => {
  //   const blurDataUrl = useNextBlurhash(
  //     journal.coverImageBlurHash ?? "LEHV6nWB2yk8pyo0adR*.7kCMdnj"
  //   );
  if (journal.cover != null) {
    return (
      <Image
        src={journal.cover.url}
        alt={journal.name}
        priority={priority}
        placeholder="blur"
        blurDataURL={colorDataURL(journal.cover.color ?? "#000000")}
        fill
        sizes={
          isThumbnail
            ? "(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            : undefined
        }
        style={{ objectFit: "cover" }}
      />
    );
  }
  return (
    <div
      style={{ backgroundColor: "darkgray", width: "100%", height: "100%" }}
    />
  );
};
