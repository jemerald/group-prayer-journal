import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import type { PrayerTarget } from "@prisma/client";
import React, { useMemo, useState } from "react";

import { trpc } from "../utils/trpc";
import { FullScreenDialog } from "./FullScreenDialog";

const ProgressivePrayerItems = [
  {
    stage: "Begotten through the gospel",
    items: [
      "Open to hear the word",
      "Attending an RSG",
      "Open to pray",
      "Repent of sin",
      "Get baptized",
    ],
  },
  {
    stage: "Nourished to grow",
    items: [
      "Family salvation",
      "Innoculation",
      "Meet on the Lord's Day",
      "Use HWMR - Topics for new believers",
      "Use HWMR - current with the church",
      "Get revived alone every morning with the HWMR",
    ],
  },
  {
    stage: "Perfected with the truth and to be constituted",
    items: [
      "Have a scheduled reading of the Word with the ministry",
      "Study alone faithfully every day",
      "Receive light from and enjoy the Lord in the Word",
      "Experience the Lord daily according to the truth",
      "Buy and read the ministry to see the vision of the age",
      "Get to know your vital group members",
    ],
  },
  {
    stage: "Building the church through the God-ordained way",
    items: [
      "Pray in the church prayer meeting",
      "Prepare a prophecy to prophecy every Lord's Day",
      "Practice revived alone, study daily, pray and prophecy, to join your vital group",
    ],
  },
  {
    stage:
      "Practicing the vital group for the increase of the group and the church",
    items: [
      "Preach the word every day in their daily life",
      "Visit sinners by appointment to preach the gospel",
      "Shepherd the saints to grow in life step by step",
      "Take the training with your vital group",
    ],
  },
];

const ProgressivePrayerItemsFlatList = ProgressivePrayerItems.flatMap((stage) =>
  stage.items.map((item) => ({
    stage: stage.stage,
    description: item,
  }))
);

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const NewItemDialogContent: React.FC<{
  target: PrayerTarget;
  closeDialog: () => void;
}> = ({ target, closeDialog }) => {
  const utils = trpc.useContext();
  const mutation = trpc.item.create.useMutation({
    onSuccess() {
      utils.item.allByTargetId.invalidate({ targetId: target.id });
    },
  });

  const [mode, setMode] = useState<"custom" | "preset">("custom");
  const [customDescription, setCustomDescription] = useState("");
  const [selection, setSelection] = useState<ArrayElement<
    typeof ProgressivePrayerItemsFlatList
  > | null>(null);
  const description = useMemo(
    () => (mode === "custom" ? customDescription : selection?.description),
    [customDescription, mode, selection?.description]
  );

  const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDescription(event.target.value);
  };
  const handleCreate = () => {
    if (description) {
      mutation.mutate({
        targetId: target.id,
        description,
      });
      closeDialog();
    }
  };
  return (
    <>
      <DialogTitle>Create new prayer item</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A prayer item is a definite progress or goal that you want to pray for
        </DialogContentText>
        <Tabs
          value={mode}
          onChange={(e, newValue) => setMode(newValue)}
          aria-label="item description edit mode"
        >
          <Tab value="custom" label="Define your own" />
          <Tab value="preset" label="Suggested" />
        </Tabs>
        {mode === "custom" ? (
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Description"
            value={customDescription}
            onChange={onDescriptionChange}
            sx={{ flexGrow: 1 }}
          />
        ) : (
          <Autocomplete
            value={selection}
            onChange={(e, newSelection) => setSelection(newSelection)}
            options={ProgressivePrayerItemsFlatList}
            groupBy={(option) => option.stage}
            getOptionLabel={(option) => option.description}
            renderInput={(params) => (
              <TextField {...params} label="Description" />
            )}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button aria-label="cancel" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          aria-label="create prayer item"
          variant="contained"
          disabled={!description}
          onClick={handleCreate}
        >
          Create
        </Button>
      </DialogActions>
    </>
  );
};

const NewItem: React.FC<{
  target: PrayerTarget;
}> = ({ target }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  return (
    <>
      <Tooltip title="Create new prayer item">
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
        <NewItemDialogContent
          target={target}
          closeDialog={() => setShowCreateDialog(false)}
        />
      </FullScreenDialog>
    </>
  );
};

export default NewItem;
