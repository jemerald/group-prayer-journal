import { type NextPage } from "next";
import { useRouter } from "next/router";
import TargetPageContent from "../../components/TargetPageContent";

const TargetPage: NextPage = () => {
  const router = useRouter();
  const { targetId } = router.query;
  if (!targetId || Array.isArray(targetId)) {
    router.replace("/");
    return null;
  }

  return <TargetPageContent targetId={targetId} />;
};

export default TargetPage;
