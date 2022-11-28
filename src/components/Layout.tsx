import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/system/Container";
import React from "react";
import AuthButton from "./AuthButton";
import CustomThemeProvider from "./CustomThemeProvider";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <CustomThemeProvider>
    <CssBaseline />
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Group Prayer Journal
        </Typography>
        <AuthButton />
      </Toolbar>
    </AppBar>
    <Container maxWidth="md" sx={{ mt: 2 }}>
      {children}
    </Container>
  </CustomThemeProvider>
);

export default Layout;
