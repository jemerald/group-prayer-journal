import type { PrayerJournal } from "@prisma/client";
import Image from "next/image";
import React from "react";

export const JournalCoverPhoto: React.FC<{
  journal: PrayerJournal;
  isThumbnail?: boolean;
}> = ({ journal, isThumbnail = false }) => {
  if (journal.coverImageUrl != null) {
    return (
      <Image
        src={journal.coverImageUrl}
        alt={journal.name}
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
