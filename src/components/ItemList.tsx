import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import type { PrayerItem } from "@prisma/client";
import React from "react";
import { trpc } from "../utils/trpc";
import ItemAccomplished from "./ItemAccomplished";
import PrayedList from "./PrayedList";
import PrayedNow from "./PrayedNow";

const PrayerItemListItem: React.FC<{
  item: PrayerItem;
}> = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  const prayedHistory = trpc.prayed.allByItemId.useQuery({ itemId: item.id });
  let lastPrayed = "";
  if (prayedHistory.data != null) {
    lastPrayed = prayedHistory.data[0]
      ? prayedHistory.data[0].date.toLocaleDateString()
      : "never";
  }

  let secondaryText = "";
  if (item.dateAccomplished != null) {
    secondaryText = `accomplished on ${item.dateAccomplished.toLocaleDateString()}`;
  } else {
    secondaryText = `began on ${item.dateBegins.toLocaleDateString()}, last prayed: ${lastPrayed}`;
  }
  return (
    <>
      <ListItemButton onClick={() => setOpen((wasOpen) => !wasOpen)}>
        <ListItemText primary={item.description} secondary={secondaryText} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ ml: 4 }}>
          <Stack direction="row">
            <PrayedNow item={item} />
            <ItemAccomplished item={item} />
          </Stack>
          <PrayedList itemId={item.id} />
        </Box>
      </Collapse>
    </>
  );
};

const ItemList: React.FC<{
  items: PrayerItem[];
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
        <PrayerItemListItem key={item.id} item={item} />
      ))}
    </List>
  );
};

export default ItemList;
