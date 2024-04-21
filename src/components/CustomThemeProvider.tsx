import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";

export const CustomThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
