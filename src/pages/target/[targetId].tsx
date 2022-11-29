import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Target: NextPage = () => {
  const router = useRouter();
  const { targetId } = router.query;
  if (!targetId || Array.isArray(targetId)) {
    router.push("/");
    return null;
  }

  const target = trpc.target.byId.useQuery({ id: targetId });
  if (target.isLoading) {
    return (
      <Stack sx={{ alignItems: "center" }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Stack>
    );
  }
  if (!target.data) {
    return <Alert severity="error">Prayer target not found</Alert>;
  }

  return (
    <>
      <Head>
        <title>{target.data.name} | Group Prayer Journal</title>
      </Head>
      <Stack gap={2}>
        <Typography variant="h3">{target.data.name}</Typography>
      </Stack>
    </>
  );
};

export default Target;
