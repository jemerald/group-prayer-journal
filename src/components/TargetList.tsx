import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { PrayerTarget } from "@prisma/client";
import Link from "next/link";
import React from "react";

import { trpc } from "../utils/trpc";

const TargetListItem: React.FC<{ target: PrayerTarget }> = ({ target }) => {
  return (
    <ListItemButton
      component={Link}
      href={`/target/${encodeURIComponent(target.id)}`}
    >
      <ListItemText
        primary={target.name}
        secondary={`created on ${target.createdAt.toLocaleDateString()}`}
      />
    </ListItemButton>
  );
};

const TargetList: React.FC<{ journalId: string }> = ({ journalId }) => {
  const targets = trpc.target.allByJournalId.useQuery({ journalId });
  if (targets.isLoading) {
    return (
      <Stack sx={{ alignItems: "center" }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Stack>
    );
  }
  if (targets.data == null) {
    return <Alert severity="error">Journal not found</Alert>;
  }

  if (targets.data.length === 0) {
    return (
      <Alert severity="info">
        You have not added any prayer target to the journal
      </Alert>
    );
  }
  return (
    <>
      <Stack direction="row" gap={2}>
        <Typography variant="h5">Prayer targets</Typography>
        {targets.isFetching ? <CircularProgress size={24} /> : null}
      </Stack>
      <List>
        {targets.data.map((target) => (
          <TargetListItem key={target.id} target={target} />
        ))}
      </List>
    </>
  );
};

export default TargetList;
