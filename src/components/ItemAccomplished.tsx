import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { PrayerItem } from "@prisma/client";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";
import { FullScreenDialog } from "./FullScreenDialog";

const ItemAccomplishedDialogContent: React.FC<{
  item: PrayerItem;
  closeDialog: () => void;
}> = ({ item, closeDialog }) => {
  const utils = trpc.useContext();
  const mutation = trpc.timeline.accomplished.useMutation({
    onSuccess(data, variable) {
      utils.timeline.allByItemId.invalidate({ itemId: variable.itemId });
      utils.item.allByTargetId.invalidate({ targetId: item.targetId });
    },
  });
  const [note, setNote] = useState("");

  const onNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };
  const handleAccomplished = () => {
    mutation.mutate({
      itemId: item.id,
      note,
    });
    closeDialog();
  };
  return (
    <>
      <DialogTitle>Prayer item accomplished</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can add some optional notes about how the prayer item was
          accomplished
        </DialogContentText>
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
        <Button
          aria-label="save"
          variant="contained"
          onClick={handleAccomplished}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
};

const ItemAccomplished: React.FC<{
  item: PrayerItem;
}> = ({ item }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      {sm ? (
        <IconButton
          color="success"
          onClick={() => setShowDialog(true)}
          aria-label="prayer accomplished"
        >
          <FontAwesomeSvgIcon icon={faCircleCheck} />
        </IconButton>
      ) : (
        <Button
          onClick={() => setShowDialog(true)}
          aria-label="prayer accomplished"
          startIcon={<FontAwesomeSvgIcon icon={faCircleCheck} />}
          color="success"
        >
          Accomplished
        </Button>
      )}
      <FullScreenDialog
        maxWidth="sm"
        fullWidth
        open={showDialog}
        onClose={() => setShowDialog(false)}
      >
        <ItemAccomplishedDialogContent
          item={item}
          closeDialog={() => setShowDialog(false)}
        />
      </FullScreenDialog>
    </>
  );
};

export default ItemAccomplished;
