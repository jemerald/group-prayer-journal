import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import formatRelative from "date-fns/formatRelative";
import React from "react";
import { trpc } from "../utils/trpc";
import TimelineIcon from "./TimelineIcon";

const TargetTimeline: React.FC<{
  targetId: string;
}> = ({ targetId }) => {
  const theme = useTheme();
  const timeline = trpc.timeline.allByTargetId.useQuery({ targetId });
  if (timeline.isLoading || !timeline.data) {
    return <CircularProgress />;
  }

  const timelineLength = timeline.data.length;
  return (
    <Timeline
      sx={{
        m: 0,
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
          <TimelineContent sx={{ p: "8px 16px" }}>
            <Typography>{event.item.description}</Typography>
            {event.note ? (
              <Typography component="span">{event.note}</Typography>
            ) : null}
            <Typography variant="body2" color={theme.palette.text.secondary}>
              {formatRelative(event.date, new Date())}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default TargetTimeline;
