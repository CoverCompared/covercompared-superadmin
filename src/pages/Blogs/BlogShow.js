import React from "react";
import styled, { withTheme } from "styled-components";

import Helmet from 'react-helmet';

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Breadcrumbs
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";


const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function BlogShow({ theme }) {
  return (
    <React.Fragment>
      <Helmet title="Default Dashboard" />
      <Typography variant="h3" gutterBottom display="inline">
        Blogs
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link exact to="/"> Dashboard </Link>
        <Link exact to="/blogs"> Blogs </Link>
        <Typography>TEST ...</Typography>
      </Breadcrumbs>


      <Divider my={6} />



    </React.Fragment>
  );
}

export default withTheme(BlogShow);
