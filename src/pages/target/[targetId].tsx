import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ItemList from "../../components/ItemList";
import NewItem from "../../components/NewItem";
import { trpc } from "../../utils/trpc";

const Target: NextPage = () => {
  const router = useRouter();
  const { targetId } = router.query;
  if (!targetId || Array.isArray(targetId)) {
    router.replace("/");
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
        <Stack direction="row" gap={2}>
          <Typography variant="h5">Prayer items</Typography>
          {target.isFetching ? <CircularProgress size={24} /> : null}
        </Stack>
        <ItemList items={target.data.items} />
      </Stack>
      <NewItem target={target.data} />
    </>
  );
};

export default Target;
