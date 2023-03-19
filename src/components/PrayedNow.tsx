import { faPrayingHands } from "@fortawesome/free-solid-svg-icons/faPrayingHands";
import Button from "@mui/material/Button";
import type { Timeline } from "@prisma/client";
import isSameDay from "date-fns/isSameDay";
import React from "react";
import { trpc } from "../utils/trpc";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";

const PrayedNow: React.FC<{
  itemId: string;
}> = ({ itemId }) => {
  const lastPrayed = trpc.timeline.lastPrayedForItem.useQuery({ itemId });

  const utils = trpc.useContext();
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
      utils.timeline.lastPrayedForItem.setData(
        { itemId: variable.itemId },
        () => tempTimelineItem
      );
    },
    onSuccess(data) {
      if (data.itemId) {
        utils.timeline.allByItemId.invalidate({ itemId: data.itemId });
        utils.timeline.lastPrayedForItem.invalidate({ itemId: data.itemId });
      }
      utils.timeline.allByTargetId.invalidate({ targetId: data.targetId });
      utils.timeline.lastPrayedForTarget.invalidate({
        targetId: data.targetId,
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
    mutation.mutate({ itemId });
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
