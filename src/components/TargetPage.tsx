import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Head from "next/head";
import { useRouter } from "next/router";
import type { SyntheticEvent } from "react";
import { trpc } from "../utils/trpc";
import ItemList from "./ItemList";
import NewItem from "./NewItem";
import TargetPageHeader from "./TargetPageHeader";
import TargetTimeline from "./TargetTimeline";

const tabs = {
  items: "Prayer items",
  timeline: "Timeline",
} as const;

const TargetPage: React.FC<{ targetId: string }> = ({ targetId }) => {
  const router = useRouter();
  let { tab } = router.query;
  if (typeof tab !== "string" || Object.keys(tabs).indexOf(tab) < 0) {
    tab = "items";
  }

  const target = trpc.target.byId.useQuery({ id: targetId });
  if (target.data === null) {
    return <Alert severity="error">Prayer target not found</Alert>;
  }

  const handleTabChange = (
    _: SyntheticEvent<Element, Event>,
    value: string
  ) => {
    router.replace({
      query: {
        ...router.query,
        tab: value,
      },
    });
  };

  return (
    <>
      <Head>
        <title>{target.data?.name ?? ""} | Group Prayer Journal</title>
      </Head>
      <Stack>
        <TargetPageHeader targetId={targetId} />
        <Tabs value={tab} onChange={handleTabChange}>
          {Object.entries(tabs).map(([value, label]) => (
            <Tab key={value} label={label} value={value} />
          ))}
        </Tabs>
        <div
          style={{
            display: tab === "timeline" ? "none" : "block",
          }}
        >
          <ItemList targetId={targetId} />
        </div>
        <div
          style={{
            display: tab === "timeline" ? "block" : "none",
          }}
        >
          <TargetTimeline targetId={targetId} />
        </div>
      </Stack>
      <NewItem targetId={targetId} />
    </>
  );
};

export default TargetPage;
