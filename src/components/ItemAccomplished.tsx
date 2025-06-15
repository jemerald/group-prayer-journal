import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { PrayerItem, Timeline } from "@prisma/client";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";
import { FontAwesomeSvgIcon } from "./FontAwesomeSvgIcon";
import { FullScreenDialog } from "./FullScreenDialog";

const ItemAccomplishedDialogContent: React.FC<{
  itemId: string;
  closeDialog: () => void;
}> = ({ itemId, closeDialog }) => {
  const utils = trpc.useUtils();
  const mutation = trpc.timeline.accomplished.useMutation({
    onMutate(variable) {
      // perform optimistic update
      utils.timeline.allByItemId.cancel({ itemId: variable.itemId });
      const tempTimelineItem: Timeline & {
        item: PrayerItem | null;
      } = {
        id: "dummy",
        targetId: "dummy",
        itemId: variable.itemId,
        type: "ACCOMPLISHED",
        date: new Date(),
        note: variable.note ?? null,
        item: null,
      };
      utils.timeline.allByItemId.setData(
        {
          itemId: variable.itemId,
        },
        (oldData) => [tempTimelineItem, ...(oldData ?? [])]
      );
    },
    onSuccess(data) {
      if (data.itemId) {
        utils.timeline.allByItemId.invalidate({ itemId: data.itemId });
      }
      utils.timeline.allByTargetId.invalidate({ targetId: data.targetId });
      utils.item.allByTargetId.invalidate({ targetId: data.targetId });
    },
  });

  const [note, setNote] = useState("");

  const onNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };
  const handleAccomplished = () => {
    mutation.mutate({
      itemId,
      note,
    });
    closeDialog();
  };
  return (
    <>
      <DialogTitle>Prayer item accomplished</DialogTitle>
      <DialogContent
        sx={{
          flexGrow: 0,
        }}
      >
        <DialogContentText>
          You can add some optional notes about how the prayer item was
          accomplished
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          multiline
          rows={3}
          margin="dense"
          label="Notes"
          value={note}
          onChange={onNoteChange}
          sx={{ flexGrow: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAccomplished}
          loading={mutation.isPending}
          loadingPosition="start"
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
};

export const ItemAccomplished: React.FC<{
  itemId: string;
}> = ({ itemId }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      {sm ? (
        <IconButton
          color="success"
          onClick={() => setShowDialog(true)}
          aria-label="Accomplished"
        >
          <FontAwesomeSvgIcon icon={faCircleCheck} />
        </IconButton>
      ) : (
        <Button
          onClick={() => setShowDialog(true)}
          startIcon={<FontAwesomeSvgIcon icon={faCircleCheck} />}
          color="success"
        >
          Accomplished
        </Button>
      )}
      <FullScreenDialog
        maxWidth="sm"
        fullWidth
        open={showDialog}
        onClose={() => setShowDialog(false)}
      >
        <ItemAccomplishedDialogContent
          itemId={itemId}
          closeDialog={() => setShowDialog(false)}
        />
      </FullScreenDialog>
    </>
  );
};
