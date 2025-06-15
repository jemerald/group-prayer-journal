import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { ArchiveTargetButton } from "./ArchiveTargetButton";
import { FontAwesomeSvgIcon } from "./FontAwesomeSvgIcon";
import { TargetNameChange } from "./TargetNameChange";

export const TargetPageHeader: React.FC<{
  targetId: string;
}> = ({ targetId }) => {
  const target = trpc.target.byId.useQuery({ id: targetId });
  const [editMode, setEditMode] = useState(false);

  return (
    <Stack useFlexGap spacing={{ xs: 2 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Home
        </Link>
        {target.isPending || !target.data
          ? [
              <Skeleton key="journal" width={50} />,
              <Skeleton key="target" width={50} />,
            ]
          : [
              <Link
                key="journal"
                color="inherit"
                href={`/journal/${target.data.journalId}`}
              >
                {target.data.journal.name}
              </Link>,
              <Typography key="target" color="text.primary">
                {target.data.name}
              </Typography>,
            ]}
      </Breadcrumbs>
      {target.isPending || !target.data ? (
        <Skeleton variant="rectangular" height={42} />
      ) : (
        <Stack
          direction="row"
          useFlexGap
          spacing={{ xs: 2 }}
          sx={{ alignItems: "center" }}
        >
          {editMode ? (
            <TargetNameChange
              target={target.data}
              onComplete={() => setEditMode(false)}
            />
          ) : (
            <>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {target.data.name}
              </Typography>
              <Tooltip title="Edit name">
                <IconButton onClick={() => setEditMode(true)} color="default">
                  <FontAwesomeSvgIcon icon={faPenToSquare} />
                </IconButton>
              </Tooltip>
              <ArchiveTargetButton
                targetId={target.data.id}
                journalId={target.data.journalId}
              />
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
};
