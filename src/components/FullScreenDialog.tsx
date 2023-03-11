import type { DialogProps } from "@mui/material/Dialog";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

export const FullScreenDialog: React.FC<
  React.PropsWithChildren<Omit<DialogProps, "fullScreen">>
> = ({ children, ...props }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog {...props} fullScreen={sm}>
      {children}
    </Dialog>
  );
};
