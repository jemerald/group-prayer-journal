import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import Skeleton from "@mui/material/Skeleton";
import React from "react";

export const TimelineSkeleton: React.FC = () => (
  <>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor: "transparent",
          }}
        >
          <Skeleton variant="circular" width={24} height={24} />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Skeleton />
        <Skeleton />
      </TimelineContent>
    </TimelineItem>
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor: "transparent",
          }}
        >
          <Skeleton variant="circular" width={24} height={24} />
        </TimelineDot>
      </TimelineSeparator>
      <TimelineContent>
        <Skeleton />
        <Skeleton />
      </TimelineContent>
    </TimelineItem>
  </>
);
