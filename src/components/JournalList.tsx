import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { PrayerJournal, PrayerJournalCover } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import { JournalUsers } from "./JournalUsers";
import { ArchiveDisplaySelection } from "./ArchiveDisplaySelection";
import { JournalCoverPhoto } from "./JournalCoverPhoto";

const JournalListItem: React.FC<{
  journal: PrayerJournal & {
    cover: PrayerJournalCover | null;
  };
  photoPriority?: boolean;
}> = ({ journal, photoPriority }) => {
  return (
    <Card>
      <CardActionArea
        LinkComponent={Link}
        href={`/journal/${encodeURIComponent(journal.id)}`}
      >
        <Box sx={{ position: "relative", height: 250, overflow: "hidden" }}>
          <JournalCoverPhoto
            journal={journal}
            isThumbnail
            priority={photoPriority}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              p: 2,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)"
                  : "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)",
            }}
          >
            <Stack gap={1}>
              <Typography
                variant="h4"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {journal.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`created on ${journal.createdAt.toLocaleDateString()}`}
              </Typography>
              <JournalUsers journalId={journal.id} />
            </Stack>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export const JournalList: React.FC = () => {
  const [showArchived, setShowArchived] = useState(false);
  const handleShowArchivedToggle = () => {
    setShowArchived((val) => !val);
  };

  const journals = trpc.journal.all.useQuery({ includeArchived: showArchived });
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Prayer journals
        </Typography>
        {journals.isFetching ? <CircularProgress size={24} /> : null}
        <ArchiveDisplaySelection
          showArchived={showArchived}
          onToggle={handleShowArchivedToggle}
        />
      </Box>
      <Grid container spacing={2}>
        {journals.isPending || journals.data === undefined ? (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Skeleton variant="rectangular" height={250} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Skeleton variant="rectangular" height={250} />
            </Grid>
          </>
        ) : journals.data.some((j) => j.archivedAt == null) ? (
          journals.data
            .filter((j) => j.archivedAt == null)
            .map((journal, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={journal.id}>
                <JournalListItem journal={journal} photoPriority={index < 2} />
              </Grid>
            ))
        ) : (
          <Alert severity="info">You have not created any journal yet</Alert>
        )}
      </Grid>
      {showArchived && journals.data != null ? (
        <>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Archived journals
          </Typography>
          <Grid container spacing={2}>
            {journals.data
              .filter((j) => j.archivedAt != null)
              .map((journal) => (
                <Grid size={{ xs: 12, sm: 6 }} key={journal.id}>
                  <JournalListItem journal={journal} />
                </Grid>
              ))}
          </Grid>
        </>
      ) : null}
    </>
  );
};
