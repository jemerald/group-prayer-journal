import AvatarGroup from "@mui/material/AvatarGroup";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import React from "react";
import { trpc } from "../utils/trpc";

import { UserAvatar } from "./UserAvatar";

export const JournalUsers: React.FC<{
  journalId: string;
}> = ({ journalId }) => {
  const journalUsers = trpc.journal.usersOfJournal.useQuery({
    journalId: journalId,
  });
  return (
    <Stack
      direction="row"
      useFlexGap
      spacing={{ xs: 2 }}
      sx={{ alignItems: "center" }}
    >
      {journalUsers.isPending || !journalUsers.data ? (
        <>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            sx={{ m: "2px" }}
          />
        </>
      ) : (
        <>
          <UserAvatar
            user={journalUsers.data.owner}
            tooltipPrefix="Created by: "
          />
          {journalUsers.data.accesses.length > 0 ? (
            <AvatarGroup>
              {journalUsers.data.accesses.map((access) => (
                <UserAvatar key={access.userId} user={access.user} />
              ))}
            </AvatarGroup>
          ) : null}
        </>
      )}
    </Stack>
  );
};
