import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import type { User } from "next-auth";
import React from "react";

export const UserAvatar: React.FC<{ user: User }> = ({ user }) => (
  <Tooltip title={user.name}>
    <Avatar
      alt={user.name || undefined}
      src={user.image || undefined}
      imgProps={{
        referrerPolicy: "no-referrer",
      }}
    />
  </Tooltip>
);
