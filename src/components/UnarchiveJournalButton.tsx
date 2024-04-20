import UnarchiveIcon from "@mui/icons-material/Unarchive";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { trpc } from "../utils/trpc";

export const UnarchiveJournalButton: React.FC<{
  journalId: string;
}> = ({ journalId }) => {
  const utils = trpc.useUtils();
  const mutation = trpc.journal.unarchive.useMutation({
    onSuccess() {
      utils.journal.byId.invalidate({
        id: journalId,
      });
    },
  });
  const handleUnarchive = () => {
    mutation.mutate({
      id: journalId,
    });
  };
  return (
    <Tooltip title="Unarchive journal">
      <IconButton onClick={handleUnarchive} color="warning">
        <UnarchiveIcon />
      </IconButton>
    </Tooltip>
  );
};
