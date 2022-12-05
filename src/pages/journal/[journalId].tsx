import Alert from "@mui/material/Alert";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { JournalHeader } from "../../components/JournalHeader";
import { JournalUsers } from "../../components/JournalUsers";
import NewTarget from "../../components/NewTarget";
import TargetList from "../../components/TargetList";
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
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">{journal.data.name}</Typography>
        </Breadcrumbs>
        <JournalHeader journal={journal.data} />
        <JournalUsers journalUsers={journal.data} />
        <TargetList journalId={journalId} />
      </Stack>
      <NewTarget journalId={journalId} />
    </>
  );
};

export default Journal;
