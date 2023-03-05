import CachedIcon from "@mui/icons-material/Cached";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { PrayerJournal } from "@prisma/client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { ArchiveJournalButton } from "./ArchiveJournalButton";
import { ShareJournalButton } from "./ShareJournalButton";

const JournalCoverPhoto = dynamic(() => import("./JournalCoverPhoto"), {
  ssr: false,
});

export const JournalHeader: React.FC<{ journal: PrayerJournal }> = ({
  journal,
}) => {
  const utils = trpc.useContext();
  const mutation = trpc.journal.changeCover.useMutation({
    onSuccess(data) {
      utils.journal.byId.setData(
        {
          id: data.id,
        },
        (current) =>
          current
            ? {
                ...current,
                coverImageUrl: data.coverImageUrl,
              }
            : undefined
      );
      utils.journal.byId.invalidate({
        id: data.id,
      });
    },
  });
  const handleChangeCover = () => {
    mutation.mutate({
      id: journal.id,
    });
  };

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(menuAnchor);

  return (
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
          <Typography variant="h4">{journal.name}</Typography>
          <ShareJournalButton journalId={journal.id} />
          <ArchiveJournalButton journalId={journal.id} />
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
          <IconButton onClick={handleChangeCover} disabled={mutation.isLoading}>
            <CachedIcon color="inherit" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
