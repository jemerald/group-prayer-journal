import CachedIcon from "@mui/icons-material/Cached";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { PrayerJournal } from "@prisma/client";
import { trpc } from "../utils/trpc";
import { JournalCoverPhoto } from "./JournalCoverPhoto";
import { ShareJournalButton } from "./ShareJournalButton";

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
          background:
            "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
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
        </Stack>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          p: 1,
        }}
      >
        <Tooltip title="Change cover image">
          <IconButton onClick={handleChangeCover} disabled={mutation.isLoading}>
            <CachedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
