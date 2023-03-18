import MenuIcon from "@mui/icons-material/Menu";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { PrayerTarget } from "@prisma/client";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import type { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { reorderArray } from "../utils/reorderArray";

import { trpc } from "../utils/trpc";

const TargetListItem: React.FC<{ target: PrayerTarget; index: number }> = ({
  target,
  index,
}) => {
  const lastPrayed = trpc.timeline.lastPrayedForTarget.useQuery({
    targetId: target.id,
  });
  return (
    <Draggable key={target.id} draggableId={target.id} index={index}>
      {(provided) => (
        <ListItem
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            width: "100%",
          }}
        >
          <ListItemIcon ref={provided.innerRef} {...provided.dragHandleProps}>
            <MenuIcon />
          </ListItemIcon>
          <ListItemButton
            component={Link}
            href={`/target/${encodeURIComponent(target.id)}`}
          >
            <ListItemText
              primary={target.name}
              secondary={
                lastPrayed.data
                  ? `last prayed on ${lastPrayed.data.date.toLocaleDateString()}`
                  : `created on ${target.createdAt.toLocaleDateString()}`
              }
            />
          </ListItemButton>
        </ListItem>
      )}
    </Draggable>
  );
};

const TargetList: React.FC<{ journalId: string }> = ({ journalId }) => {
  const targets = trpc.target.allByJournalId.useQuery({ journalId });
  const targetIds = useMemo(
    () => targets.data?.map((x) => x.id) ?? [],
    [targets]
  );

  const utils = trpc.useContext();
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
    <>
      <Stack direction="row" gap={2}>
        <Typography variant="h5">Prayer targets</Typography>
        {targets.isFetching ? <CircularProgress size={24} /> : null}
      </Stack>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="target-list">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {targets.data.map((target, index) => (
                <TargetListItem key={target.id} target={target} index={index} />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default TargetList;
