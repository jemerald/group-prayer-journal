import type { PrayerJournal } from "@prisma/client";
import Image from "next/image";
import React from "react";

export const JournalCoverPhoto: React.FC<{ journal: PrayerJournal }> = ({
  journal,
}) => {
  if (journal.coverImageUrl != null) {
    return (
      <Image
        src={journal.coverImageUrl}
        alt={journal.name}
        fill
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
