import { faPrayingHands } from "@fortawesome/free-solid-svg-icons/faPrayingHands";
import Button from "@mui/material/Button";
import type { PrayerItem, Timeline } from "@prisma/client";
import { isSameDay } from "date-fns/isSameDay";
import React from "react";
import { trpc } from "../utils/trpc";
import { FontAwesomeSvgIcon } from "./FontAwesomeSvgIcon";

export const PrayedNow: React.FC<{
  item: PrayerItem;
}> = ({ item }) => {
  const utils = trpc.useUtils();
  const mutation = trpc.timeline.prayedNow.useMutation({
    onMutate(variable) {
      // perform optimistic update
      utils.timeline.allByItemId.cancel({
        itemId: variable.itemId,
      });
      const tempTimelineItem: Timeline = {
        id: "dummy",
        itemId: variable.itemId,
        targetId: "dummy",
        type: "PRAYED",
        date: new Date(),
        note: null,
      };
      utils.timeline.allByItemId.setData(
        {
          itemId: variable.itemId,
        },
        (oldData) => [tempTimelineItem, ...(oldData ?? [])]
      );
    },
    onSuccess(data) {
      if (data.itemId) {
        utils.timeline.allByItemId.invalidate({ itemId: data.itemId });
      }
      utils.timeline.allByTargetId.invalidate({ targetId: data.targetId });
      utils.item.allByTargetId.invalidate({
        targetId: data.targetId,
      });
    },
  });
  const now = new Date();
  const hasPrayedToday = item.lastPrayed && isSameDay(item.lastPrayed, now);
  const handlePrayedNow = () => {
    mutation.mutate({ itemId: item.id });
  };
  return (
    <Button
      disabled={hasPrayedToday || mutation.isPending}
      onClick={handlePrayedNow}
      startIcon={<FontAwesomeSvgIcon icon={faPrayingHands} />}
    >
      Prayed now
    </Button>
  );
};
