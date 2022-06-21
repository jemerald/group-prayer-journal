import { useAuth0 } from '@auth0/auth0-react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import LoginButton from './LoginButton';

const Profile: React.FC = () => {
  const { user, isLoading, logout } = useAuth0();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleLogout = () => {
    setAnchorElUser(null);
    logout({ returnTo: window.location.origin });
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return user ? (
    <>
      <Tooltip title={user.name || ''}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={user.name} src={user.picture} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleLogout}>
          <Typography textAlign="center">Log Out</Typography>
        </MenuItem>
      </Menu>
    </>
  ) : (
    <LoginButton />
  );
};

export default Profile;
