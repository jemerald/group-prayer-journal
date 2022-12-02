import Button from "@mui/material/Button";
import type { PrayerItem } from "@prisma/client";
import isSameDay from "date-fns/isSameDay";
import React from "react";
import { trpc } from "../utils/trpc";

const PrayedNow: React.FC<{
  item: PrayerItem;
}> = ({ item }) => {
  const prayedHistory = trpc.prayed.allByItemId.useQuery({ itemId: item.id });

  const utils = trpc.useContext();
  const mutation = trpc.prayed.create.useMutation({
    onSuccess(added) {
      utils.prayed.allByItemId.setData(
        {
          itemId: item.id,
        },
        (currentTarget) => [added, ...(currentTarget || [])]
      );
      utils.prayed.allByItemId.invalidate({ itemId: item.id });
    },
  });
  if (prayedHistory.isLoading || prayedHistory.data === undefined) {
    return null;
  }
  const now = new Date();
  const hasPrayedToday = prayedHistory.data.some((x) => isSameDay(x.date, now));
  const handlePrayedNow = () => {
    mutation.mutate({
      itemId: item.id,
    });
  };
  return (
    <Button
      disabled={
        hasPrayedToday || item.dateAccomplished != null || mutation.isLoading
      }
      onClick={handlePrayedNow}
      aria-label="prayed now"
    >
      Prayed now
    </Button>
  );
};

export default PrayedNow;
