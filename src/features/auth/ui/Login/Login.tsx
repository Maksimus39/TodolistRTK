import React from 'react';
import { Grid, FormControl, FormLabel } from '@mui/material';

const LoginFormLabel = () => <span>Login Form Label</span>;

const MyComponent = () => {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={6}>
        <FormControl>
          <FormLabel>
            <LoginFormLabel />
          </FormLabel>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default MyComponent;