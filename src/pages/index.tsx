import Stack from "@mui/material/Stack";
import { type NextPage } from "next";
import { JournalList } from "../components/JournalList";
import { NewJournal } from "../components/NewJournal";

const Home: NextPage = () => {
  return (
    <Stack gap={2}>
      <JournalList />
      <NewJournal />
    </Stack>
  );
};

export default Home;
