import { faFilePen } from "@fortawesome/free-solid-svg-icons/faFilePen";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { PrayerItem, Timeline } from "@prisma/client";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";
import { FullScreenDialog } from "./FullScreenDialog";

const ItemAddNoteDialogContent: React.FC<{
  itemId: string;
  closeDialog: () => void;
}> = ({ itemId, closeDialog }) => {
  const utils = trpc.useContext();
  const mutation = trpc.timeline.addItemNote.useMutation({
    onMutate(variable) {
      // perform optimistic update
      utils.timeline.allByItemId.cancel({ itemId: variable.itemId });
      const tempTimelineItem: Timeline & {
        item: PrayerItem | null;
      } = {
        id: "dummy",
        targetId: "dummy",
        itemId: variable.itemId,
        type: "NOTE",
        date: new Date(),
        note: variable.note,
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
    },
  });
  const [note, setNote] = useState("");

  const onNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };
  const handleAddNote = () => {
    mutation.mutate({
      itemId,
      note,
    });
    closeDialog();
  };
  return (
    <>
      <DialogTitle>Add note to prayer item</DialogTitle>
      <DialogContent>
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
        <Button aria-label="cancel" onClick={closeDialog}>
          Cancel
        </Button>
        <Button aria-label="save" variant="contained" onClick={handleAddNote}>
          Save
        </Button>
      </DialogActions>
    </>
  );
};

const ItemAddNote: React.FC<{
  itemId: string;
}> = ({ itemId }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      {sm ? (
        <IconButton
          color="inherit"
          onClick={() => setShowDialog(true)}
          aria-label="add note"
        >
          <FontAwesomeSvgIcon icon={faFilePen} />
        </IconButton>
      ) : (
        <Button
          onClick={() => setShowDialog(true)}
          aria-label="add note"
          startIcon={<FontAwesomeSvgIcon icon={faFilePen} />}
          color="inherit"
        >
          Add note
        </Button>
      )}
      <FullScreenDialog
        maxWidth="sm"
        fullWidth
        open={showDialog}
        onClose={() => setShowDialog(false)}
      >
        <ItemAddNoteDialogContent
          itemId={itemId}
          closeDialog={() => setShowDialog(false)}
        />
      </FullScreenDialog>
    </>
  );
};

export default ItemAddNote;
