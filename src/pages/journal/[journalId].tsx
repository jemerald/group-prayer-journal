import { type NextPage } from "next";
import { useRouter } from "next/router";
import { JournalPage } from "../../components/JournalPage";

const Journal: NextPage = () => {
  const router = useRouter();
  const { journalId } = router.query;
  if (!journalId || Array.isArray(journalId)) {
    router.replace("/");
    return null;
  }

  return <JournalPage journalId={journalId} />;
};

export default Journal;
