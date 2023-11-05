import { faFilePen } from "@fortawesome/free-solid-svg-icons/faFilePen";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { SxProps, Theme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import type { PrayerItem, Timeline } from "@prisma/client";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";
import { FullScreenDialog } from "./FullScreenDialog";

const TargetAddNoteDialogContent: React.FC<{
  targetId: string;
  closeDialog: () => void;
}> = ({ targetId, closeDialog }) => {
  const utils = trpc.useContext();
  const mutation = trpc.timeline.addTargetNote.useMutation({
    onMutate(variable) {
      // perform optimistic update
      utils.timeline.allByTargetId.cancel({ targetId: variable.targetId });
      const tempTimelineItem: Timeline & {
        item: PrayerItem | null;
      } = {
        id: "dummy",
        targetId: variable.targetId,
        itemId: null,
        type: "NOTE",
        date: new Date(),
        note: variable.note,
        item: null,
      };
      utils.timeline.allByTargetId.setData(
        {
          targetId: variable.targetId,
        },
        (oldData) => [tempTimelineItem, ...(oldData ?? [])]
      );
    },
    onSuccess(_data, variable) {
      utils.timeline.allByTargetId.invalidate({ targetId: variable.targetId });
    },
  });
  const [note, setNote] = useState("");

  const onNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };
  const handleAddNote = () => {
    mutation.mutate({
      targetId,
      note,
    });
    closeDialog();
  };
  return (
    <>
      <DialogTitle>Add note to prayer target</DialogTitle>
      <DialogContent
        sx={{
          flexGrow: 0,
        }}
      >
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
        <Button aria-label="save" variant="contained" onClick={handleAddNote}>
          Save
        </Button>
      </DialogActions>
    </>
  );
};

const TargetAddNote: React.FC<{
  targetId: string;
  sx?: SxProps<Theme>;
}> = ({ targetId, sx }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        aria-label="add note"
        startIcon={<FontAwesomeSvgIcon icon={faFilePen} />}
        color="inherit"
        sx={sx}
      >
        Add note
      </Button>
      <FullScreenDialog
        maxWidth="sm"
        fullWidth
        open={showDialog}
        onClose={() => setShowDialog(false)}
      >
        <TargetAddNoteDialogContent
          targetId={targetId}
          closeDialog={() => setShowDialog(false)}
        />
      </FullScreenDialog>
    </>
  );
};

export default TargetAddNote;
