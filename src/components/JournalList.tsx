import { Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import React from "react";

import { trpc } from "../utils/trpc";

const JournalList: React.FC = () => {
  const journals = trpc.journal.all.useQuery();
  if (journals.isLoading || journals.data == null) {
    return (
      <Stack sx={{ alignItems: "center" }}>
        <CircularProgress />
        <Typography>Loading journals...</Typography>
      </Stack>
    );
  }
  if (journals.data.length === 0) {
    return <Alert severity="info">No journal found</Alert>;
  }
  return (
    <List>
      {journals.data.map((journal) => (
        <ListItem key={journal.id}>
          <ListItemButton>
            <ListItemText
              primary={journal.name}
              secondary={`created at ${journal.createdAt.toLocaleDateString()}`}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default JournalList;
