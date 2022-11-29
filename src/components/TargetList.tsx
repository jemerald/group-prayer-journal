import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";

import { trpc } from "../utils/trpc";

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
    <List>
      {targets.data.map((target) => (
        <ListItem key={target.id}>
          <ListItemButton
            component={Link}
            href={`/journal/${encodeURIComponent(
              journalId
            )}/target/${encodeURIComponent(target.id)}`}
          >
            <ListItemText
              primary={target.name}
              secondary={`created on ${target.createdAt.toLocaleDateString()}`}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default TargetList;
