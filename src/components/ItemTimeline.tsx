import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import { faPrayingHands } from "@fortawesome/free-solid-svg-icons/faPrayingHands";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { TimelineType } from "@prisma/client";
import formatRelative from "date-fns/formatRelative";
import React from "react";
import { trpc } from "../utils/trpc";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";

const TimelineIcon: React.FC<{
  type: TimelineType;
}> = ({ type }) => {
  switch (type) {
    case "PRAYED":
      return (
        <Tooltip title="Prayed">
          <TimelineDot
            sx={{
              bgcolor: "transparent",
            }}
          >
            <FontAwesomeSvgIcon icon={faPrayingHands} color="info" />
          </TimelineDot>
        </Tooltip>
      );
    case "NOTE":
      return (
        <Tooltip title="Note">
          <TimelineDot
            sx={{
              bgcolor: "transparent",
            }}
          >
            <FontAwesomeSvgIcon icon={faFile} />
          </TimelineDot>
        </Tooltip>
      );
    case "ACCOMPLISHED":
      return (
        <Tooltip title="Prayer accomplished">
          <TimelineDot
            sx={{
              bgcolor: "transparent",
            }}
          >
            <FontAwesomeSvgIcon icon={faCircleCheck} color="success" />
          </TimelineDot>
        </Tooltip>
      );
  }
};

const ItemTimeline: React.FC<{
  itemId: string;
}> = ({ itemId }) => {
  const timeline = trpc.timeline.allByItemId.useQuery({ itemId });
  if (timeline.isLoading || !timeline.data) {
    return <CircularProgress />;
  }

  const timelineLength = timeline.data.length;
  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {timeline.data.map((event, index) => (
        <TimelineItem key={event.id}>
          <TimelineSeparator>
            <TimelineIcon type={event.type} />
            {index < timelineLength - 1 ? <TimelineConnector /> : null}
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
      ))}
    </Timeline>
  );
};

export default ItemTimeline;
