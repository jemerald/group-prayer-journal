import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import type { Prayed, PrayerItem } from "@prisma/client";
import React from "react";

const ItemList: React.FC<{
  items: (PrayerItem & {
    prayed: Prayed[];
  })[];
}> = ({ items }) => {
  if (items.length === 0) {
    return (
      <Alert severity="info">
        You have not added any prayer item for the target
      </Alert>
    );
  }
  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.id}>
          <ListItemText
            primary={item.description}
            secondary={`began on ${item.dateBegins.toLocaleDateString()}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ItemList;
