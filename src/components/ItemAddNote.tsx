import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import type { PrayerItem } from "@prisma/client";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";
import { FullScreenDialog } from "./FullScreenDialog";

const ItemAddNoteDialogContent: React.FC<{
  item: PrayerItem;
  closeDialog: () => void;
}> = ({ item, closeDialog }) => {
  const utils = trpc.useContext();
  const mutation = trpc.timeline.addNote.useMutation({
    onSuccess(data, variable) {
      utils.timeline.allByItemId.invalidate({ itemId: variable.itemId });
    },
  });
  const [note, setNote] = useState("");

  const onNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };
  const handleAddNote = () => {
    mutation.mutate({
      itemId: item.id,
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
  item: PrayerItem;
}> = ({ item }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button onClick={() => setShowDialog(true)} aria-label="add note">
        Add note
      </Button>
      <FullScreenDialog
        maxWidth="sm"
        fullWidth
        open={showDialog}
        onClose={() => setShowDialog(false)}
      >
        <ItemAddNoteDialogContent
          item={item}
          closeDialog={() => setShowDialog(false)}
        />
      </FullScreenDialog>
    </>
  );
};

export default ItemAddNote;
