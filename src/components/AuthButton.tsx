import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const AuthButton: React.FC = () => {
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
        <Tooltip title={session.user.name}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              alt={session.user.name || undefined}
              src={session.user.image || undefined}
              imgProps={{
                referrerPolicy: "no-referrer",
              }}
            />
          </IconButton>
        </Tooltip>
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
            <Typography textAlign="center">Sign out</Typography>
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <Button color="inherit" onClick={() => signIn("google")}>
      Sign in
    </Button>
  );
};

export default AuthButton;
