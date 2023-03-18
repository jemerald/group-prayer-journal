import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import CachedIcon from "@mui/icons-material/Cached";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { PrayerJournal, PrayerJournalCover } from "@prisma/client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { ArchiveJournalButton } from "./ArchiveJournalButton";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";
import JournalNameChange from "./JournalNameChange";
import { JournalUsers } from "./JournalUsers";
import { ShareJournalButton } from "./ShareJournalButton";

const JournalCoverPhoto = dynamic(() => import("./JournalCoverPhoto"), {
  ssr: false,
});

export const JournalHeader: React.FC<{
  journal: PrayerJournal & {
    cover: PrayerJournalCover | null;
  };
}> = ({ journal }) => {
  const [editMode, setEditMode] = useState(false);

  const utils = trpc.useContext();
  const mutation = trpc.journal.changeCover.useMutation({
    onSuccess(data, variable) {
      utils.journal.byId.invalidate({
        id: variable.id,
      });
    },
  });
  const handleChangeCover = () => {
    mutation.mutate({
      id: journal.id,
    });
  };

  return (
    <Stack gap={2}>
      <Box
        sx={{
          position: "relative",
          height: 200,
          borderRadius: "15px 15px 0px 0px",
          overflow: "hidden",
        }}
      >
        <JournalCoverPhoto journal={journal} />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            p: 2,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)"
                : "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          }}
        >
          <Stack
            direction="row"
            gap={2}
            sx={{
              alignItems: "center",
            }}
          >
            {editMode ? (
              <JournalNameChange
                journal={journal}
                onComplete={() => setEditMode(false)}
              />
            ) : (
              <>
                <Typography
                  variant="h4"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  sx={{ flexGrow: 1 }}
                >
                  {journal.name}
                </Typography>
                <Tooltip title="Edit name">
                  <IconButton onClick={() => setEditMode(true)} color="primary">
                    <FontAwesomeSvgIcon icon={faPenToSquare} />
                  </IconButton>
                </Tooltip>
                <ArchiveJournalButton journalId={journal.id} />
              </>
            )}
          </Stack>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            p: 1,
            borderRadius: "0px 0px 0px 50%",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(to bottom left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)"
                : "linear-gradient(to bottom left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          }}
        >
          <Tooltip title="Change cover image">
            <IconButton
              onClick={handleChangeCover}
              disabled={mutation.isLoading}
            >
              <CachedIcon color="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Stack
        direction="row"
        gap={2}
        sx={{
          alignItems: "center",
        }}
      >
        <JournalUsers journalId={journal.id} />
        <ShareJournalButton journalId={journal.id} />
      </Stack>
    </Stack>
  );
};
