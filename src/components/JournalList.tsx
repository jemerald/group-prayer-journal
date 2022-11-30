import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";

import { trpc } from "../utils/trpc";

const JournalList: React.FC = () => {
  const journals = trpc.journal.all.useQuery();
  if (journals.isLoading || journals.data == null) {
    return (
      <Stack sx={{ alignItems: "center" }}>
        <CircularProgress />
        <Typography>Loading your journals...</Typography>
      </Stack>
    );
  }
  if (journals.data.length === 0) {
    return <Alert severity="info">You have not created any journal yet</Alert>;
  }
  return (
    <>
      <Stack direction="row" gap={2}>
        <Typography variant="h5">Prayer journals</Typography>
        {journals.isFetching ? <CircularProgress size={24} /> : null}
      </Stack>
      <List>
        {journals.data.map((journal) => (
          <ListItemButton
            key={journal.id}
            component={Link}
            href={`/journal/${encodeURIComponent(journal.id)}`}
          >
            <ListItemAvatar>
              <Avatar
                alt={journal.owner.name || undefined}
                src={journal.owner.image || undefined}
                imgProps={{
                  referrerPolicy: "no-referrer",
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={journal.name}
              secondary={`created on ${journal.createdAt.toLocaleDateString()}`}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );
};

export default JournalList;
