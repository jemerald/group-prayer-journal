import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/system/Container";
import { useSession } from "next-auth/react";
import React from "react";
import AuthButton from "./AuthButton";
import CustomThemeProvider from "./CustomThemeProvider";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { status } = useSession();
  
  return (
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
      {status === "unauthenticated" ? <Typography variant="h3">Sign in to use the application</Typography> : null}
      {status === "authenticated" ? children : null}
    </Container>
  </CustomThemeProvider>
);
  }

export default Layout;
