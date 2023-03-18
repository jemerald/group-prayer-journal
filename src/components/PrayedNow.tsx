import { faPrayingHands } from "@fortawesome/free-solid-svg-icons/faPrayingHands";
import Button from "@mui/material/Button";
import type { PrayerItem, Timeline } from "@prisma/client";
import isSameDay from "date-fns/isSameDay";
import React from "react";
import { trpc } from "../utils/trpc";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";

const PrayedNow: React.FC<{
  item: PrayerItem;
}> = ({ item }) => {
  const lastPrayed = trpc.timeline.lastPrayedForItem.useQuery({
    itemId: item.id,
  });

  const utils = trpc.useContext();
  const mutation = trpc.timeline.prayedNow.useMutation({
    onMutate(variable) {
      // perform optimistic update
      utils.timeline.allByItemId.cancel({
        itemId: item.id,
      });
      const tempTimelineItem: Timeline = {
        id: "dummy",
        itemId: variable.itemId,
        targetId: item.targetId,
        type: "PRAYED",
        date: new Date(),
        note: null,
      };
      utils.timeline.allByItemId.setData(
        {
          itemId: item.id,
        },
        (oldData) => [tempTimelineItem, ...(oldData ?? [])]
      );
      utils.timeline.lastPrayedForItem.setData(
        { itemId: item.id },
        () => tempTimelineItem
      );
      utils.timeline.lastPrayedForTarget.setData(
        {
          targetId: item.targetId,
        },
        () => tempTimelineItem
      );
    },
    onSuccess() {
      utils.timeline.allByItemId.invalidate({ itemId: item.id });
      utils.timeline.lastPrayedForItem.invalidate({ itemId: item.id });
      utils.timeline.lastPrayedForTarget.invalidate({
        targetId: item.targetId,
      });
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
      startIcon={<FontAwesomeSvgIcon icon={faPrayingHands} />}
    >
      Prayed now
    </Button>
  );
};

export default PrayedNow;
