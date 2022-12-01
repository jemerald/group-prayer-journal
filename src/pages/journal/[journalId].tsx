import { AvatarGroup } from "@mui/material";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import NewTarget from "../../components/NewTarget";
import { ShareJournalButton } from "../../components/ShareJournalButton";
import TargetList from "../../components/TargetList";
import { UserAvatar } from "../../components/UserAvatar";
import { trpc } from "../../utils/trpc";

const Journal: NextPage = () => {
  const router = useRouter();
  const { journalId } = router.query;
  if (!journalId || Array.isArray(journalId)) {
    router.replace("/");
    return null;
  }
  const journal = trpc.journal.byId.useQuery({ id: journalId });
  if (journal.isLoading) {
    return (
      <Stack sx={{ alignItems: "center" }}>
        <CircularProgress />
        <Typography>Loading journal...</Typography>
      </Stack>
    );
  }
  if (!journal.data) {
    return <Alert severity="error">Journal not found</Alert>;
  }
  return (
    <>
      <Head>
        <title>{journal.data.name} | Group Prayer Journal</title>
      </Head>
      <Stack gap={2}>
        <Stack direction="row" gap={2} sx={{ alignItems: "center" }}>
          <Typography variant="h3">{journal.data.name}</Typography>
          <ShareJournalButton journalId={journalId} />
        </Stack>
        <Stack direction="row" gap={2} sx={{ alignItems: "center" }}>
          <UserAvatar user={journal.data.owner} />
          <AvatarGroup>
            {journal.data.accesses.map((access) => (
              <UserAvatar key={access.userId} user={access.user} />
            ))}
          </AvatarGroup>
        </Stack>
        <TargetList journalId={journalId} />
      </Stack>
      <NewTarget journalId={journalId} />
    </>
  );
};

export default Journal;
