import Alert from "@mui/material/Alert";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { JournalHeader } from "./JournalHeader";
import { NewTarget } from "./NewTarget";
import { TargetList } from "./TargetList";

export const JournalPage: React.FC<{ journalId: string }> = ({ journalId }) => {
  const journal = trpc.journal.byId.useQuery({ id: journalId });
  if (journal.data === null) {
    return <Alert severity="error">Journal not found</Alert>;
  }
  return (
    <>
      <Head>
        <title>{journal.data?.name ?? ""} | Group Prayer Journal</title>
      </Head>
      <Stack gap={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
          {journal.isPending || journal.data === undefined ? (
            <Skeleton width={50} />
          ) : (
            <Typography color="text.primary">{journal.data.name}</Typography>
          )}
        </Breadcrumbs>
        <JournalHeader journalId={journalId} />
        <TargetList journalId={journalId} />
      </Stack>
      {journal.data?.archivedAt === null ? (
        <NewTarget journalId={journalId} />
      ) : null}
    </>
  );
};
