import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import { FullScreenDialog } from "./FullScreenDialog";

const ShareJournalDialog: React.FC<{
  journalId: string;
  open: boolean;
  closeDialog: () => void;
}> = ({ journalId, open, closeDialog }) => {
  const [email, setEmail] = useState("");

  const utils = trpc.useUtils();
  const mutation = trpc.journal.shareWith.useMutation({
    onSuccess(data) {
      utils.journal.usersOfJournal.invalidate({ journalId: data.journalId });
      setEmail("");
      closeDialog();
    },
  });
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
    <FullScreenDialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={closeDialog}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleShare();
        },
      }}
    >
      <DialogTitle>Share prayer journal with</DialogTitle>
      <DialogContent
        sx={{
          flexGrow: 0,
        }}
      >
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
        <Button
          aria-label="cancel"
          onClick={closeDialog}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          aria-label="share journal"
          variant="contained"
          loading={mutation.isPending}
          loadingPosition="start"
        >
          Share
        </Button>
      </DialogActions>
    </FullScreenDialog>
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
      <ShareJournalDialog
        journalId={journalId}
        open={showShareDialog}
        closeDialog={() => setShowShareDialog(false)}
      />
    </>
  );
};
