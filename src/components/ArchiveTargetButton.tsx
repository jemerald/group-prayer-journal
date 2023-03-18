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

const ArchiveTargetDialogContent: React.FC<{
  targetId: string;
  journalId: string;
  closeDialog: () => void;
}> = ({ targetId, journalId, closeDialog }) => {
  const router = useRouter();
  const mutation = trpc.target.archive.useMutation({
    onSuccess() {
      closeDialog();
      router.push(`/journal/${journalId}`);
    },
  });
  const handleArchive = () => {
    mutation.mutate({
      id: targetId,
    });
  };
  return (
    <>
      <DialogTitle>Archive prayer target</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Archived target would no longer be visible to anyone by default.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button aria-label="cancel" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          aria-label="archive target"
          variant="contained"
          color="warning"
          onClick={handleArchive}
        >
          Archive
        </Button>
      </DialogActions>
    </>
  );
};

export const ArchiveTargetButton: React.FC<{
  targetId: string;
  journalId: string;
}> = ({ targetId, journalId }) => {
  const [showDialog, setShowDialog] = useState(false);
  const handleClose = () => {
    setShowDialog(false);
  };
  return (
    <>
      <Tooltip title="Archive prayer target">
        <IconButton onClick={() => setShowDialog(true)} color="warning">
          <ArchiveIcon />
        </IconButton>
      </Tooltip>
      <FullScreenDialog open={showDialog} onClose={handleClose}>
        <ArchiveTargetDialogContent
          targetId={targetId}
          journalId={journalId}
          closeDialog={handleClose}
        />
      </FullScreenDialog>
    </>
  );
};
