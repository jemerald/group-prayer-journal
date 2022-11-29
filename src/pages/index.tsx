import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type NextPage } from "next";
import JournalList from "../components/JournalList";
import NewJournal from "../components/NewJournal";

const Home: NextPage = () => {
  return (
    <Stack gap={2}>
      <Typography variant="h3">Journals</Typography>
      <JournalList />
      <NewJournal />
    </Stack>
  );
};

export default Home;
