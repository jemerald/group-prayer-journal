import MenuIcon from "@mui/icons-material/Menu";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { PrayerTarget } from "@prisma/client";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import type { DraggableProvided, DropResult } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { reorderArray } from "../utils/reorderArray";

import { trpc } from "../utils/trpc";
import { SortOrder, SortOrderSelection } from "./SortOrderSelection";
import Box from "@mui/material/Box";

const TargetListItem: React.FC<{
  target: PrayerTarget;
  provided?: DraggableProvided;
}> = ({ target, provided }) => {
  return (
    <ListItem>
      {provided != null ? (
        <ListItemIcon ref={provided.innerRef} {...provided.dragHandleProps}>
          <MenuIcon />
        </ListItemIcon>
      ) : null}
      <ListItemButton
        component={Link}
        href={`/target/${encodeURIComponent(target.id)}`}
      >
        <ListItemText
          primary={target.name}
          secondary={
            target.lastPrayed != null
              ? `last prayed on ${target.lastPrayed.toLocaleDateString()}`
              : `created on ${target.createdAt.toLocaleDateString()}`
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

const DraggableTargetListItem: React.FC<{
  target: PrayerTarget;
  index: number;
}> = ({ target, index }) => {
  return (
    <Draggable key={target.id} draggableId={target.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            width: "100%",
          }}
        >
          <TargetListItem target={target} provided={provided} />
        </div>
      )}
    </Draggable>
  );
};

function prayerTargetSorter(
  sortOrder: Exclude<SortOrder, "priority">
): (a: PrayerTarget, b: PrayerTarget) => number {
  return (a, b) => {
    // accomplished item alway sorted to the bottom by its date in descending order
    if (a.archivedAt != null) {
      if (b.archivedAt != null) {
        return a.archivedAt.getTime() - b.archivedAt.getTime();
      }
      return 1;
    } else if (b.archivedAt != null) {
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
        prayedOrder = a.createdAt.getTime() - b.createdAt.getTime();
      }
    }

    if (sortOrder === "lastPrayedDesc") {
      prayedOrder = -prayedOrder;
    }
    return prayedOrder;
  };
}

const TargetList: React.FC<{ journalId: string }> = ({ journalId }) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("priority");

  const targets = trpc.target.allByJournalId.useQuery({ journalId });
  const targetIds = useMemo(
    () => targets.data?.map((x) => x.id) ?? [],
    [targets]
  );

  const utils = trpc.useUtils();
  const mutation = trpc.target.prioritize.useMutation({
    onMutate(variable) {
      utils.target.allByJournalId.cancel({
        journalId: variable.journalId,
      });
      // perform optimistic update
      utils.target.allByJournalId.setData(
        {
          journalId: variable.journalId,
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
      utils.target.allByJournalId.invalidate({
        journalId: variable.journalId,
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
        journalId,
        idsInPriorityOrder: reorderArray(
          targetIds,
          result.source.index,
          result.destination.index
        ),
      });
    },
    [journalId, mutation, targetIds]
  );

  if (targets.data?.length === 0) {
    return (
      <Alert severity="info">
        You have not added any prayer target to the journal
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Prayer targets
        </Typography>
        {targets.isFetching ? <CircularProgress size={24} /> : null}
        <SortOrderSelection order={sortOrder} onChange={setSortOrder} />
      </Box>
      {targets.isLoading || targets.data === undefined ? (
        <Stack gap={2} sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" height={72} />
          <Skeleton variant="rectangular" height={72} />
        </Stack>
      ) : sortOrder === "priority" ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="target-list">
            {(provided) => (
              <List
                aria-label="prayer targets"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {targets.data.map((target, index) => (
                  <DraggableTargetListItem
                    key={target.id}
                    target={target}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <List aria-label="prayer targets">
          {targets.data.sort(prayerTargetSorter(sortOrder)).map((target) => (
            <TargetListItem key={target.id} target={target} />
          ))}
        </List>
      )}
    </>
  );
};

export default TargetList;
