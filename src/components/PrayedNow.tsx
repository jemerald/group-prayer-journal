import Button from "@mui/material/Button";
import type { PrayerItem } from "@prisma/client";
import isSameDay from "date-fns/isSameDay";
import React from "react";
import { trpc } from "../utils/trpc";

const PrayedNow: React.FC<{
  item: PrayerItem;
}> = ({ item }) => {
  const lastPrayed = trpc.timeline.lastPrayedForItem.useQuery({
    itemId: item.id,
  });

  const utils = trpc.useContext();
  const mutation = trpc.timeline.prayedNow.useMutation({
    onSuccess(added) {
      utils.timeline.allByItemId.setData(
        {
          itemId: item.id,
        },
        (currentTarget) => [added, ...(currentTarget || [])]
      );
      utils.timeline.allByItemId.invalidate({ itemId: item.id });
    },
  });
  if (lastPrayed.isLoading || lastPrayed.data === undefined) {
    return null;
  }
  const now = new Date();
  const hasPrayedToday =
    lastPrayed.data && isSameDay(lastPrayed.data.date, now);
  const handlePrayedNow = () => {
    mutation.mutate({
      itemId: item.id,
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
