import React from "react";
import styled, { withTheme } from "styled-components";

import Helmet from 'react-helmet';

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";


const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function HomePage({ theme }) {
  return (
    <React.Fragment>
      <Helmet title="Default Dashboard" />
      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" display="inline">
            Dashboard
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

    </React.Fragment>
  );
}

export default withTheme(HomePage);
