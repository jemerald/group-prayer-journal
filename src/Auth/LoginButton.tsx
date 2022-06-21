import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';
import React from 'react';

const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button color="inherit" onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );
};

export default LoginButton;
