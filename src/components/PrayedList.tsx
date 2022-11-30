import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import formatRelative from "date-fns/formatRelative";
import React from "react";
import { trpc } from "../utils/trpc";

const PrayedList: React.FC<{
  itemId: string;
}> = ({ itemId }) => {
  const prayedHistory = trpc.prayed.allByItemId.useQuery({ itemId });
  if (prayedHistory.isLoading || !prayedHistory.data) {
    return <CircularProgress />;
  }

  return (
    <List component="div" disablePadding>
      {prayedHistory.data.map((prayed) => (
        <ListItem key={prayed.id}>
          <ListItemText primary={formatRelative(prayed.date, new Date())} />
        </ListItem>
      ))}
    </List>
  );
};

export default PrayedList;
