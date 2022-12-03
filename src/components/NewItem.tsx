import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import type { PrayerTarget } from "@prisma/client";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";

const NewItemDialogContent: React.FC<{
  target: PrayerTarget;
  closeDialog: () => void;
}> = ({ target, closeDialog }) => {
  const utils = trpc.useContext();
  const mutation = trpc.item.create.useMutation({
    onSuccess() {
      utils.target.byId.invalidate({ id: target.id });
    },
  });
  const [description, setDescription] = useState("");

  const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleCreate = () => {
    mutation.mutate({
      targetId: target.id,
      description,
    });
    closeDialog();
  };
  return (
    <>
      <DialogTitle>Create new prayer item</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A prayer item is a definite progress or goal that you want to pray for
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Description"
          value={description}
          onChange={onDescriptionChange}
          sx={{ flexGrow: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button aria-label="cancel" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          aria-label="create prayer item"
          variant="contained"
          onClick={handleCreate}
        >
          Create
        </Button>
      </DialogActions>
    </>
  );
};

const NewItem: React.FC<{
  target: PrayerTarget;
}> = ({ target }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  return (
    <>
      <Tooltip title="Create new prayer item">
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
          onClick={() => setShowCreateDialog(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      >
        <NewItemDialogContent
          target={target}
          closeDialog={() => setShowCreateDialog(false)}
        />
      </Dialog>
    </>
  );
};

export default NewItem;
