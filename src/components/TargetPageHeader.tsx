import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { PrayerJournal, PrayerTarget } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { ArchiveTargetButton } from "./ArchiveTargetButton";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";
import TargetNameChange from "./TargetNameChange";

const TargetPageHeader: React.FC<{
  target: PrayerTarget & {
    journal: PrayerJournal;
  };
}> = ({ target }) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href={`/journal/${target.journalId}`}>
          {target.journal.name}
        </Link>
        <Typography color="text.primary">{target.name}</Typography>
      </Breadcrumbs>
      <Stack direction="row" gap={2} sx={{ alignItems: "center" }}>
        {editMode ? (
          <TargetNameChange
            target={target}
            onComplete={() => setEditMode(false)}
          />
        ) : (
          <>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              {target.name}
            </Typography>
            <Tooltip title="Edit name">
              <IconButton onClick={() => setEditMode(true)} color="primary">
                <FontAwesomeSvgIcon icon={faPenToSquare} />
              </IconButton>
            </Tooltip>
            <ArchiveTargetButton
              targetId={target.id}
              journalId={target.journalId}
            />
          </>
        )}
      </Stack>
    </>
  );
};

export default TargetPageHeader;
