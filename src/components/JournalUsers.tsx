import AvatarGroup from "@mui/material/AvatarGroup";
import Stack from "@mui/material/Stack";
import type { PrayerJournalAccess, User } from "@prisma/client";
import React from "react";

import { UserAvatar } from "./UserAvatar";

export const JournalUsers: React.FC<{
  journalUsers: {
    owner: User;
    accesses: (PrayerJournalAccess & {
      user: User;
    })[];
  };
}> = ({ journalUsers }) => {
  return (
    <Stack direction="row" gap={2} sx={{ alignItems: "center" }}>
      <UserAvatar user={journalUsers.owner} tooltipPrefix="Created by: " />
      <AvatarGroup>
        {journalUsers.accesses.map((access) => (
          <UserAvatar key={access.userId} user={access.user} />
        ))}
      </AvatarGroup>
    </Stack>
  );
};
