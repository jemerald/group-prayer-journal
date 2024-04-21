import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
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
import Alert from "@mui/material/Alert";
import { FontAwesomeSvgIcon } from "./FontAwesomeSvgIcon";
import Typography from "@mui/material/Typography";

const DeleteJournalDialogContent: React.FC<{
  journalId: string;
  closeDialog: () => void;
}> = ({ journalId, closeDialog }) => {
  const router = useRouter();
  const mutation = trpc.journal.delete.useMutation({
    onSuccess(data) {
      console.log("deleted", data);
      closeDialog();
      router.push("/");
    },
  });
  const handleDelete = () => {
    mutation.mutate({
      id: journalId,
    });
  };
  return (
    <>
      <DialogTitle>Are you sure that you want to delete?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography sx={{ mb: "1rem" }}>
            All prayer history in this journal will be deleted.
          </Typography>
          <Alert severity="warning">This action cannot be undone.</Alert>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

export const DeleteJournalButton: React.FC<{
  journalId: string;
}> = ({ journalId }) => {
  const [showDialog, setShowDialog] = useState(false);
  const handleClose = () => {
    setShowDialog(false);
  };
  return (
    <>
      <Tooltip title="Delete journal">
        <IconButton onClick={() => setShowDialog(true)} color="error">
          <FontAwesomeSvgIcon icon={faTrash} />
        </IconButton>
      </Tooltip>
      <FullScreenDialog open={showDialog} onClose={handleClose}>
        <DeleteJournalDialogContent
          journalId={journalId}
          closeDialog={handleClose}
        />
      </FullScreenDialog>
    </>
  );
};
