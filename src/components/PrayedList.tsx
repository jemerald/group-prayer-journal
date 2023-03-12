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
  const timeline = trpc.timeline.allByItemId.useQuery({ itemId });
  if (timeline.isLoading || !timeline.data) {
    return <CircularProgress />;
  }

  return (
    <List component="div" disablePadding>
      {timeline.data.map((event) => (
        <ListItem key={event.id}>
          <ListItemText primary={formatRelative(event.date, new Date())} />
        </ListItem>
      ))}
    </List>
  );
};

export default PrayedList;
