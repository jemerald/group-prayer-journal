import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import Typography from "@mui/material/Typography";
import formatRelative from "date-fns/formatRelative";
import React from "react";
import { trpc } from "../utils/trpc";
import TimelineIcon from "./TimelineIcon";
import TimelineSkeleton from "./TimelineSkeleton";

const ItemTimeline: React.FC<{
  itemId: string;
}> = ({ itemId }) => {
  const timeline = trpc.timeline.allByItemId.useQuery({ itemId });

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {timeline.isLoading || timeline.data === undefined ? (
        <TimelineSkeleton />
      ) : (
        timeline.data.map((event, index) => (
          <TimelineItem key={event.id}>
            <TimelineSeparator>
              <TimelineIcon type={event.type} />
              {index < timeline.data.length - 1 ? <TimelineConnector /> : null}
            </TimelineSeparator>
            {event.note ? (
              <TimelineContent>
                <Typography component="span">{event.note}</Typography>
                <Typography variant="body2">
                  {formatRelative(event.date, new Date())}
                </Typography>
              </TimelineContent>
            ) : (
              <TimelineContent sx={{ m: "11.5px 0" }}>
                {formatRelative(event.date, new Date())}
              </TimelineContent>
            )}
          </TimelineItem>
        ))
      )}
    </Timeline>
  );
};

export default ItemTimeline;
