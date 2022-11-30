import Button from "@mui/material/Button";
import isSameDay from "date-fns/isSameDay";
import React from "react";
import { trpc } from "../utils/trpc";

const PrayedNow: React.FC<{
  itemId: string;
}> = ({ itemId }) => {
  const prayedHistory = trpc.prayed.allByItemId.useQuery({ itemId });

  const utils = trpc.useContext();
  const mutation = trpc.prayed.create.useMutation({
    onSuccess(added) {
      utils.prayed.allByItemId.setData(
        {
          itemId,
        },
        (currentTarget) =>
          [...(currentTarget || []), added].sort(
            (a, b) => a.date.getTime() - b.date.getTime()
          )
      );
      utils.prayed.allByItemId.invalidate({ itemId });
    },
  });
  if (prayedHistory.isLoading || prayedHistory.data === undefined) {
    return null;
  }
  const now = new Date();
  const hasPrayedToday = prayedHistory.data.some((x) => isSameDay(x.date, now));
  const handlePrayedNow = () => {
    mutation.mutate({
      itemId,
    });
  };
  return (
    <Button
      disabled={hasPrayedToday || mutation.isLoading}
      onClick={handlePrayedNow}
      aria-label="prayed now"
    >
      Prayed now
    </Button>
  );
};

export default PrayedNow;
