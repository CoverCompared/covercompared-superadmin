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

function BlogCreate({ theme }) {
    return (
        <React.Fragment>
            <Helmet title="Default Dashboard" />
            <Grid justify="space-between" container spacing={6}>
                <Grid item>
                    <Typography variant="h3" display="inline">
                        Blog Create
                    </Typography>
                </Grid>
            </Grid>

            <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                <Link exact to="/"> Dashboard </Link>
                <Link exact to="/blogs"> Blogs </Link>
                <Typography>Create</Typography>
            </Breadcrumbs>

            <Divider my={6} />

        </React.Fragment>
    );
}

export default withTheme(BlogCreate);
