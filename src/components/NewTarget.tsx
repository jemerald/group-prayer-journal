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

const NewTargetDialogContent: React.FC<{
  journalId: string;
  closeDialog: () => void;
}> = ({ journalId, closeDialog }) => {
  const utils = trpc.useContext();
  const mutation = trpc.target.create.useMutation({
    onSuccess() {
      utils.target.allByJournalId.invalidate({ journalId });
    },
  });
  const [name, setName] = useState("");

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleCreate = () => {
    mutation.mutate({
      journalId,
      name,
    });
    closeDialog();
  };
  return (
    <>
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
        <Button aria-label="cancel" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          aria-label="create prayer target"
          variant="contained"
          onClick={handleCreate}
        >
          Create
        </Button>
      </DialogActions>
    </>
  );
};

const NewTarget: React.FC<{ journalId: string }> = ({ journalId }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  return (
    <>
      <Tooltip title="Create new prayer target">
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
      <FullScreenDialog
        maxWidth="sm"
        fullWidth
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      >
        <NewTargetDialogContent
          journalId={journalId}
          closeDialog={() => setShowCreateDialog(false)}
        />
      </FullScreenDialog>
    </>
  );
};

export default NewTarget;
