import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import React from "react";
import { UserAvatar } from "./UserAvatar";

export const AuthButton: React.FC = () => {
  const { data: session, status } = useSession();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleSignOut = () => {
    setAnchorElUser(null);
    signOut();
  };

  if (status === "loading") {
    return <CircularProgress color="inherit" />;
  }

  if (session && session.user) {
    return (
      <Box sx={{ flexGrow: 0 }}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <UserAvatar user={session.user} />
        </IconButton>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleSignOut}>
            <Typography sx={{ textAlign: "center" }}>Sign out</Typography>
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  const doSignin = async () => {
    const providers = await getProviders();
    const configuredProviders = Object.keys(providers ?? {});
    if (configuredProviders.length === 1) {
      await signIn(configuredProviders[0]);
    } else {
      await signIn();
    }
  };

  return (
    <Button color="inherit" onClick={doSignin}>
      Sign in
    </Button>
  );
};
