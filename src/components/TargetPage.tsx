import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Head from "next/head";
import type { SyntheticEvent } from "react";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import ItemList from "./ItemList";
import NewItem from "./NewItem";
import TargetPageHeader from "./TargetPageHeader";
import TargetTimeline from "./TargetTimeline";

const TargetPage: React.FC<{ targetId: string }> = ({ targetId }) => {
  const [currentTab, setCurrentTab] = useState<"items" | "timeline">("items");

  const target = trpc.target.byId.useQuery({ id: targetId });
  if (target.data === null) {
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
        <title>{target.data?.name ?? ""} | Group Prayer Journal</title>
      </Head>
      <Stack>
        <TargetPageHeader targetId={targetId} />
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Prayer items" value="items" />
          <Tab label="Timeline" value="timeline" />
        </Tabs>
        <div
          style={{
            display: currentTab === "items" ? "block" : "none",
          }}
        >
          <ItemList targetId={targetId} />
        </div>
        <div
          style={{
            display: currentTab === "timeline" ? "block" : "none",
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
