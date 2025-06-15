import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";
import { FullScreenDialog } from "./FullScreenDialog";
import { ListItem, Typography } from "@mui/material";

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

const PrayerItemSuggestion: React.FC<{
  onSelect: (description: string) => void;
}> = ({ onSelect }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (description: string) => {
    setAnchorEl(null);
    onSelect(description);
  };
  return (
    <>
      <Stack direction="row-reverse">
        <Button
          id="suggestion-button"
          aria-controls={open ? "suggestion-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Suggestion
        </Button>
      </Stack>
      <Menu
        id="suggestion-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "suggestion-button",
        }}
      >
        {ProgressivePrayerItems.map((stage, index) => (
          <>
            {index !== 0 ? <Divider /> : null}
            <ListItem>
              <Typography variant="caption">{stage.stage}</Typography>
            </ListItem>
            {stage.items.map((item) => (
              <MenuItem key={item} onClick={() => handleClose(item)}>
                {item}
              </MenuItem>
            ))}
          </>
        ))}
      </Menu>
    </>
  );
};

const NewItemDialog: React.FC<{
  targetId: string;
  open: boolean;
  closeDialog: () => void;
}> = ({ targetId, open, closeDialog }) => {
  const utils = trpc.useUtils();
  const mutation = trpc.item.create.useMutation({
    onSuccess(variable) {
      utils.item.allByTargetId.invalidate({ targetId: variable.targetId });
      setDescription("");
      closeDialog();
    },
  });

  const [description, setDescription] = useState("");

  const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleCreate = () => {
    if (description) {
      mutation.mutate({
        targetId,
        description,
      });
    }
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
          handleCreate();
        },
      }}
    >
      <DialogTitle>Create new prayer item</DialogTitle>
      <DialogContent
        sx={{
          flexGrow: 0,
        }}
      >
        <DialogContentText>
          A prayer item is a definite progress or goal that you want to pray for
        </DialogContentText>
        <PrayerItemSuggestion onSelect={setDescription} />
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Description"
          value={description}
          onChange={onDescriptionChange}
          sx={{ flexGrow: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!description}
          loading={mutation.isPending}
          loadingPosition="start"
        >
          Confirm
        </Button>
      </DialogActions>
    </FullScreenDialog>
  );
};

export const NewItem: React.FC<{
  targetId: string;
}> = ({ targetId }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  return (
    <>
      <Tooltip title="Create new prayer item">
        <Fab
          color="primary"
          aria-label="Create new prayer item"
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
      <NewItemDialog
        targetId={targetId}
        open={showCreateDialog}
        closeDialog={() => setShowCreateDialog(false)}
      />
    </>
  );
};
