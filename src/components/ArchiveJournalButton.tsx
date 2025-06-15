import ArchiveIcon from "@mui/icons-material/Archive";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { FullScreenDialog } from "./FullScreenDialog";

const ArchiveJournalDialogContent: React.FC<{
  journalId: string;
  closeDialog: () => void;
}> = ({ journalId, closeDialog }) => {
  const router = useRouter();
  const mutation = trpc.journal.archive.useMutation({
    onSuccess() {
      closeDialog();
      router.push("/");
    },
  });
  const handleArchive = () => {
    mutation.mutate({
      id: journalId,
    });
  };
  return (
    <>
      <DialogTitle>Archive prayer journal</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Archived journal would no longer be visible to anyone by default.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleArchive}
          loading={mutation.isPending}
          loadingPosition="start"
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

export const ArchiveJournalButton: React.FC<{
  journalId: string;
}> = ({ journalId }) => {
  const [showDialog, setShowDialog] = useState(false);
  const handleClose = () => {
    setShowDialog(false);
  };
  return (
    <>
      <Tooltip title="Archive journal">
        <IconButton onClick={() => setShowDialog(true)} color="warning">
          <ArchiveIcon />
        </IconButton>
      </Tooltip>
      <FullScreenDialog open={showDialog} onClose={handleClose}>
        <ArchiveJournalDialogContent
          journalId={journalId}
          closeDialog={handleClose}
        />
      </FullScreenDialog>
    </>
  );
};
