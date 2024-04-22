import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { PrayerItem } from "@prisma/client";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import React, { useCallback, useMemo } from "react";
import type { DraggableProvided, DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { reorderArray } from "../utils/reorderArray";
import { trpc } from "../utils/trpc";
import { FontAwesomeSvgIcon } from "./FontAwesomeSvgIcon";
import { ItemAccomplished } from "./ItemAccomplished";
import { ItemAddNote } from "./ItemAddNote";
import { ItemTimeline } from "./ItemTimeline";
import { PrayedNow } from "./PrayedNow";
import type { SortOrder } from "./SortOrderSelection";

const styles = {
  iconSmallScreen: { minWidth: 32 },
  timeline: { ml: 12 },
  timelineSmallScreen: { ml: 8 },
};

function getExpandedItemFromQuery(query: ParsedUrlQuery): string[] {
  const { expandedItem } = query;
  if (!expandedItem) {
    return [];
  }
  if (typeof expandedItem === "string") {
    return [expandedItem];
  }
  return expandedItem;
}

const PrayerListItem = ({
  item,
  provided,
}: {
  item: PrayerItem;
  provided?: DraggableProvided;
}) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();
  const expandedItem = getExpandedItemFromQuery(router.query);
  const open = expandedItem.indexOf(item.id) >= 0;

  const handleItemToggle = () => {
    router.replace({
      query: {
        ...router.query,
        expandedItem: open
          ? expandedItem.filter((x) => x !== item.id)
          : [...expandedItem, item.id],
      },
    });
  };

  const lastPrayed = item.lastPrayed
    ? item.lastPrayed.toLocaleDateString()
    : "never";

  let secondaryText = "";
  if (item.dateAccomplished != null) {
    secondaryText = `accomplished on ${item.dateAccomplished.toLocaleDateString()}`;
  } else {
    secondaryText = `began on ${item.dateBegins.toLocaleDateString()}, last prayed: ${lastPrayed}`;
  }

  return (
    <>
      <ListItem
        {...(provided != null
          ? {
              ref: provided.innerRef,
              ...provided.draggableProps,
              ...provided.dragHandleProps,
            }
          : null)}
      >
        {provided != null ? (
          <ListItemIcon sx={sm ? styles.iconSmallScreen : undefined}>
            <MenuIcon />
          </ListItemIcon>
        ) : null}
        {item.dateAccomplished != null ? (
          <ListItemIcon sx={sm ? styles.iconSmallScreen : undefined}>
            <FontAwesomeSvgIcon icon={faCircleCheck} color="success" />
          </ListItemIcon>
        ) : null}
        <ListItemButton onClick={handleItemToggle}>
          <ListItemText primary={item.description} secondary={secondaryText} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={sm ? styles.timelineSmallScreen : styles.timeline}>
          {item.dateAccomplished == null ? (
            <Stack direction="row" gap={1}>
              <PrayedNow item={item} />
              <ItemAddNote itemId={item.id} />
              <ItemAccomplished itemId={item.id} />
            </Stack>
          ) : null}
          <ItemTimeline itemId={item.id} />
        </Box>
      </Collapse>
    </>
  );
};
const DraggablePrayerListItem: React.FC<{
  item: PrayerItem;
  index: number;
}> = ({ item, index }) => {
  if (item.dateAccomplished == null) {
    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided) => <PrayerListItem item={item} provided={provided} />}
      </Draggable>
    );
  } else {
    return <PrayerListItem item={item} />;
  }
};

function prayerItemSorter(
  sortOrder: Exclude<SortOrder, "priority">
): (a: PrayerItem, b: PrayerItem) => number {
  return (a, b) => {
    // accomplished item alway sorted to the bottom by its date in descending order
    if (a.dateAccomplished != null) {
      if (b.dateAccomplished != null) {
        return a.dateAccomplished.getTime() - b.dateAccomplished.getTime();
      }
      return 1;
    } else if (b.dateAccomplished != null) {
      return -1;
    }

    let prayedOrder = 0;
    if (a.lastPrayed != null) {
      if (b.lastPrayed != null) {
        prayedOrder = a.lastPrayed.getTime() - b.lastPrayed.getTime();
      } else {
        prayedOrder = 1;
      }
    } else {
      if (b.lastPrayed != null) {
        prayedOrder = -1;
      } else {
        prayedOrder = a.dateBegins.getTime() - b.dateBegins.getTime();
      }
    }

    if (sortOrder === "lastPrayedDesc") {
      prayedOrder = -prayedOrder;
    }
    return prayedOrder;
  };
}

export const ItemList: React.FC<{
  targetId: string;
  sortOrder: SortOrder;
}> = ({ targetId, sortOrder }) => {
  const items = trpc.item.allByTargetId.useQuery({ targetId });
  const itemIds = useMemo(() => items.data?.map((x) => x.id) ?? [], [items]);

  const utils = trpc.useUtils();
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

  if (items.isLoading || items.data === undefined) {
    return (
      <Stack gap={2} sx={{ mt: 2 }}>
        <Skeleton variant="rectangular" height={72} />
        <Skeleton variant="rectangular" height={72} />
      </Stack>
    );
  }

  if (items.data.length === 0) {
    return (
      <Alert severity="info">
        You have not added any prayer item for the target
      </Alert>
    );
  }
  if (sortOrder === "priority") {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="item-list">
          {(provided) => (
            <List
              aria-label="prayer items"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.data.map((item, index) => (
                <DraggablePrayerListItem
                  key={item.id}
                  item={item}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return (
    <List aria-label="prayer items">
      {items.data.sort(prayerItemSorter(sortOrder)).map((item) => (
        <PrayerListItem key={item.id} item={item} />
      ))}
    </List>
  );
};
