import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type NextPage } from "next";
import { useRouter } from "next/router";

const Target: NextPage = () => {
  const router = useRouter();
  const { journalId, targetId } = router.query;
  if (
    !journalId ||
    Array.isArray(journalId) ||
    !targetId ||
    Array.isArray(targetId)
  ) {
    router.push("/");
    return null;
  }

  return (
    <>
      <Stack gap={2}>
        <Typography variant="h3">
          journal: {journalId} target: {targetId}
        </Typography>
      </Stack>
    </>
  );
};

export default Target;
