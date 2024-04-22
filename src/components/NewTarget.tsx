import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";
import { FullScreenDialog } from "./FullScreenDialog";

const NewTargetDialog: React.FC<{
  journalId: string;
  open: boolean;
  closeDialog: () => void;
}> = ({ journalId, open, closeDialog }) => {
  const [name, setName] = useState("");

  const utils = trpc.useUtils();
  const mutation = trpc.target.create.useMutation({
    onSuccess() {
      utils.target.allByJournalId.invalidate({ journalId });
      setName("");
      closeDialog();
    },
  });
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleCreate = () => {
    mutation.mutate({
      journalId,
      name,
    });
  };
  return (
    <FullScreenDialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={closeDialog}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleCreate();
        },
      }}
    >
      <DialogTitle>Create new prayer target</DialogTitle>
      <DialogContent
        sx={{
          flexGrow: 0,
        }}
      >
        <DialogContentText>
          A prayer target is usually a person or group of people that you are
          praying for
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Name"
          value={name}
          onChange={onNameChange}
          sx={{ flexGrow: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button type="submit" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </FullScreenDialog>
  );
};

export const NewTarget: React.FC<{ journalId: string }> = ({ journalId }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  return (
    <>
      <Tooltip title="Create new prayer target">
        <Fab
          color="primary"
          aria-label="Create new prayer target"
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
      <NewTargetDialog
        journalId={journalId}
        open={showCreateDialog}
        closeDialog={() => setShowCreateDialog(false)}
      />
    </>
  );
};
