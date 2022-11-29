import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Journal: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const journal = trpc.journal.byId.useQuery({ id: id as string });
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
        <Typography variant="h3">Journal {journal.data.name}</Typography>
      </Stack>
    </>
  );
};

export default Journal;
