import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";

const NewJournal: React.FC = () => {
  const utils = trpc.useContext();
  const mutation = trpc.journal.create.useMutation({
    onSuccess() {
      utils.journal.all.invalidate();
    },
  });
  const [name, setName] = useState("");

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleCreate = () => {
    mutation.mutate({
      name,
    });
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <TextField
        label="Name"
        value={name}
        onChange={onNameChange}
        sx={{ flexGrow: 1 }}
      />
      <Tooltip title="Create new journal">
        <IconButton aria-label="create journal" onClick={handleCreate}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default NewJournal;
