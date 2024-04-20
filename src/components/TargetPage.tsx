import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, type SyntheticEvent } from "react";
import { trpc } from "../utils/trpc";
import ItemList from "./ItemList";
import NewItem from "./NewItem";
import TargetPageHeader from "./TargetPageHeader";
import TargetTimeline from "./TargetTimeline";
import { type SortOrder, SortOrderSelection } from "./SortOrderSelection";
import Box from "@mui/material/Box";

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

  const [sortOrder, setSortOrder] = useState<SortOrder>("priority");

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tabs value={tab} onChange={handleTabChange} sx={{ flexGrow: 1 }}>
            {Object.entries(tabs).map(([value, label]) => (
              <Tab key={value} label={label} value={value} />
            ))}
          </Tabs>
          {tab === "items" ? (
            <SortOrderSelection order={sortOrder} onChange={setSortOrder} />
          ) : null}
        </Box>
        <div
          style={{
            display: tab === "timeline" ? "none" : "block",
          }}
        >
          <ItemList targetId={targetId} sortOrder={sortOrder} />
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
