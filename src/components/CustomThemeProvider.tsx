import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";

const theme = createTheme({});
const CustomThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default CustomThemeProvider;
