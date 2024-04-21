import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons/faFloppyDisk";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import type { PrayerJournal } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { FontAwesomeSvgIcon } from "./FontAwesomeSvgIcon";

export const JournalNameChange: React.FC<{
  journal: PrayerJournal;
  onComplete: () => void;
}> = ({ journal, onComplete }) => {
  const [name, setName] = useState(journal.name);

  const utils = trpc.useUtils();
  const mutation = trpc.journal.rename.useMutation({
    onMutate(variable) {
      // perform optimistic update
      utils.journal.byId.cancel({
        id: variable.id,
      });
      utils.journal.byId.setData(
        {
          id: variable.id,
        },
        (oldData) =>
          oldData
            ? {
                ...oldData,
                name: variable.name,
              }
            : oldData
      );
    },
    onSuccess(data, variable) {
      utils.journal.byId.invalidate({
        id: variable.id,
      });
    },
  });

  const handleSave = () => {
    mutation.mutate({ id: journal.id, name });
    onComplete();
  };

  return (
    <>
      <TextField
        margin="dense"
        label="Name"
        sx={{ flexGrow: 1 }}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Tooltip title="Save">
        <IconButton onClick={handleSave} color="primary">
          <FontAwesomeSvgIcon icon={faFloppyDisk} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Cancel">
        <IconButton onClick={onComplete}>
          <FontAwesomeSvgIcon icon={faXmark} />
        </IconButton>
      </Tooltip>
    </>
  );
};
