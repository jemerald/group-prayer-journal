import Alert from "@mui/material/Alert";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import { useState } from "react";
import { ArchiveTargetButton } from "../../components/ArchiveTargetButton";
import ItemList from "../../components/ItemList";
import NewItem from "../../components/NewItem";
import TargetTimeline from "../../components/TargetTimeline";
import { trpc } from "../../utils/trpc";

const Target: React.FC<{ targetId: string }> = ({ targetId }) => {
  const [currentTab, setCurrentTab] = useState<"items" | "timeline">("items");

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

  const handleTabChange = (
    _: SyntheticEvent<Element, Event>,
    value: typeof currentTab
  ) => {
    console.log("value", value);
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>{target.data.name} | Group Prayer Journal</title>
      </Head>
      <Stack gap={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
          <Link color="inherit" href={`/journal/${target.data.journalId}`}>
            {target.data.journal.name}
          </Link>
          <Typography color="text.primary">{target.data.name}</Typography>
        </Breadcrumbs>
        <Stack direction="row" gap={2}>
          <Typography variant="h4">{target.data.name}</Typography>
          <ArchiveTargetButton
            targetId={target.data.id}
            journalId={target.data.journalId}
          />
        </Stack>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Prayer items" value="items" />
          <Tab label="Timeline" value="timeline" />
        </Tabs>
        <div
          style={{
            display: currentTab === "items" ? "block" : "none",
          }}
        >
          <ItemList targetId={target.data.id} />
        </div>
        <div
          style={{
            display: currentTab === "timeline" ? "block" : "none",
          }}
        >
          <TargetTimeline targetId={target.data.id} />
        </div>
      </Stack>
      <NewItem target={target.data} />
    </>
  );
};

const TargetPage: NextPage = () => {
  const router = useRouter();
  const { targetId } = router.query;
  if (!targetId || Array.isArray(targetId)) {
    router.replace("/");
    return null;
  }

  return <Target targetId={targetId} />;
};

export default TargetPage;
