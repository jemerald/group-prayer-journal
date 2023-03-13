import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { PrayerItem } from "@prisma/client";
import React, { useCallback, useMemo } from "react";
import type { DraggableProvided, DropResult } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { reorderArray } from "../utils/reorderArray";
import { trpc } from "../utils/trpc";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";
import ItemAccomplished from "./ItemAccomplished";
import ItemAddNote from "./ItemAddNote";
import ItemTimeline from "./ItemTimeline";
import PrayedNow from "./PrayedNow";

const styles = {
  iconSmallScreen: { minWidth: 32 },
  timeline: { ml: 12 },
  timelineSmallScreen: { ml: 8 },
};

const PrayerListItem = ({
  item,
  provided,
}: {
  item: PrayerItem;
  provided?: DraggableProvided;
}) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = React.useState(false);
  const lastPrayedTimeline = trpc.timeline.lastPrayedForItem.useQuery({
    itemId: item.id,
  });
  let lastPrayed = "";
  if (lastPrayedTimeline.data !== undefined) {
    lastPrayed = lastPrayedTimeline.data
      ? lastPrayedTimeline.data.date.toLocaleDateString()
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
      <ListItem>
        {provided != null ? (
          <ListItemIcon
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            sx={sm ? styles.iconSmallScreen : undefined}
          >
            <MenuIcon />
          </ListItemIcon>
        ) : null}
        {item.dateAccomplished != null ? (
          <ListItemIcon sx={sm ? styles.iconSmallScreen : undefined}>
            <FontAwesomeSvgIcon icon={faCircleCheck} color="success" />
          </ListItemIcon>
        ) : null}
        <ListItemButton onClick={() => setOpen((wasOpen) => !wasOpen)}>
          <ListItemText primary={item.description} secondary={secondaryText} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={sm ? styles.timelineSmallScreen : styles.timeline}>
          {item.dateAccomplished == null ? (
            <Stack direction="row" gap={1}>
              <PrayedNow item={item} />
              <ItemAddNote item={item} />
              <ItemAccomplished item={item} />
            </Stack>
          ) : null}
          <ItemTimeline itemId={item.id} />
        </Box>
      </Collapse>
    </>
  );
};
const PrayerItemListItem: React.FC<{
  item: PrayerItem;
  index: number;
}> = ({ item, index }) => {
  if (item.dateAccomplished == null) {
    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              width: "100%",
            }}
          >
            <PrayerListItem item={item} provided={provided} />
          </div>
        )}
      </Draggable>
    );
  } else {
    return <PrayerListItem item={item} />;
  }
};

const ItemList: React.FC<{
  targetId: string;
}> = ({ targetId }) => {
  const items = trpc.item.allByTargetId.useQuery({ targetId });
  const itemIds = useMemo(() => items.data?.map((x) => x.id) ?? [], [items]);

  const utils = trpc.useContext();
  const mutation = trpc.item.prioritize.useMutation({
    onMutate(variable) {
      // perform optimistic update
      utils.item.allByTargetId.cancel({
        targetId: variable.targetId,
      });
      utils.item.allByTargetId.setData(
        {
          targetId: variable.targetId,
        },
        (oldData) => {
          if (!oldData) {
            return oldData;
          }
          const temp = [...oldData];
          temp.sort((a, b) => {
            return (
              variable.idsInPriorityOrder.indexOf(a.id) -
              variable.idsInPriorityOrder.indexOf(b.id)
            );
          });
          return temp;
        }
      );
    },
    onSuccess(data, variable) {
      // trigger refresh
      utils.item.allByTargetId.invalidate({
        targetId: variable.targetId,
      });
    },
  });

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (
        !result.destination || // dropped outside the list
        result.source.index === result.destination.index // did not move
      ) {
        return;
      }
      console.log("drop", result.source.index, result.destination.index);
      //
      mutation.mutate({
        targetId,
        idsInPriorityOrder: reorderArray(
          itemIds,
          result.source.index,
          result.destination.index
        ),
      });
    },
    [itemIds, mutation, targetId]
  );

  if (items.isLoading) {
    return (
      <Stack sx={{ alignItems: "center" }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Stack>
    );
  }
  if (items.data == null) {
    return <Alert severity="error">Prayer target not found</Alert>;
  }
  if (items.data.length === 0) {
    return (
      <Alert severity="info">
        You have not added any prayer item for the target
      </Alert>
    );
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="item-list">
        {(provided, snapshot) => (
          <List {...provided.droppableProps} ref={provided.innerRef}>
            {items.data.map((item, index) => (
              <PrayerItemListItem key={item.id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ItemList;
