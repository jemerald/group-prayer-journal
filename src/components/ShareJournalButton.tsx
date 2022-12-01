import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import { trpc } from "../utils/trpc";

const ShareJournalDialogContent: React.FC<{
  journalId: string;
  closeDialog: () => void;
}> = ({ journalId, closeDialog }) => {
  const utils = trpc.useContext();
  const mutation = trpc.journal.shareWith.useMutation({
    onSuccess() {
      utils.journal.byId.invalidate({ id: journalId });
      closeDialog();
    },
  });
  const [email, setEmail] = useState("");

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleShare = () => {
    mutation.mutate({
      id: journalId,
      userEmail: email,
    });
  };
  return (
    <>
      <DialogTitle>Share prayer journal with</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the email address of the user you want to share this journal
          with
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Email"
          value={email}
          onChange={onEmailChange}
          sx={{ flexGrow: 1 }}
          error={mutation.isError}
          helperText={mutation.error?.message}
        />
      </DialogContent>
      <DialogActions>
        <Button aria-label="cancel" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          aria-label="share journal"
          variant="contained"
          onClick={handleShare}
        >
          Share
        </Button>
      </DialogActions>
    </>
  );
};

export const ShareJournalButton: React.FC<{ journalId: string }> = ({
  journalId,
}) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  return (
    <>
      <Tooltip title="Share this journal">
        <IconButton onClick={() => setShowShareDialog(true)}>
          <ShareIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      >
        <ShareJournalDialogContent
          journalId={journalId}
          closeDialog={() => setShowShareDialog(false)}
        />
      </Dialog>
    </>
  );
};
