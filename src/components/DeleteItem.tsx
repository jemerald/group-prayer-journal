import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";
import { FontAwesomeSvgIcon } from "./FontAwesomeSvgIcon";
import { FullScreenDialog } from "./FullScreenDialog";

const DeleteItemDialogContent: React.FC<{
  itemId: string;
  closeDialog: () => void;
}> = ({ itemId, closeDialog }) => {
  const utils = trpc.useUtils();
  const mutation = trpc.item.delete.useMutation({
    onSuccess(data) {
      utils.item.allByTargetId.invalidate({ targetId: data.targetId });
      closeDialog();
    },
  });
  const handleDelete = () => {
    mutation.mutate({
      id: itemId,
    });
  };
  return (
    <>
      <DialogTitle>Delete prayer item</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this prayer item?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          loading={mutation.isPending}
          loadingPosition="start"
        >
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

export const DeleteItem: React.FC<{
  itemId: string;
}> = ({ itemId }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      {sm ? (
        <IconButton
          color="error"
          onClick={() => setShowDialog(true)}
          aria-label="Delete item"
        >
          <FontAwesomeSvgIcon icon={faTrash} />
        </IconButton>
      ) : (
        <Button
          onClick={() => setShowDialog(true)}
          startIcon={<FontAwesomeSvgIcon icon={faTrash} />}
          color="error"
        >
          Delete item
        </Button>
      )}
      <FullScreenDialog
        maxWidth="sm"
        fullWidth
        open={showDialog}
        onClose={() => setShowDialog(false)}
      >
        <DeleteItemDialogContent
          itemId={itemId}
          closeDialog={() => setShowDialog(false)}
        />
      </FullScreenDialog>
    </>
  );
};
