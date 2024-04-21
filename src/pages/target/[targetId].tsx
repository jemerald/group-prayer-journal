import { type NextPage } from "next";
import { useRouter } from "next/router";
import { TargetPage } from "../../components/TargetPage";

const Target: NextPage = () => {
  const router = useRouter();
  const { targetId } = router.query;
  if (!targetId || Array.isArray(targetId)) {
    router.replace("/");
    return null;
  }

  return <TargetPage targetId={targetId} />;
};

export default Target;
