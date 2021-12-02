import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";

import Helmet from 'react-helmet';
import { useParams } from "react-router-dom";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Breadcrumbs
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
import BlogService from "../../libs/services/blogs";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);



function BlogShow({ theme }) {

  const params = useParams();
  const [blog, setBlog] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    BlogService.show(params.id)
      .then((response) => {
        if (response.data && response.data.success) {
          setBlog(response.data.data);
          console.log(response.data.data);
        } else {
          setNotFound(true);
        }
      }).catch(err => {
        setNotFound(true);
      })
  }, [])

  return (
    <React.Fragment>
      <Helmet title="Default Dashboard" />
      <Typography variant="h3" gutterBottom display="inline">
        Blogs
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link exact to="/"> Dashboard </Link>
        <Link exact to="/blogs"> Blogs </Link>
        <Typography>{blog.title}</Typography>
      </Breadcrumbs>


      <Divider my={6} />

      <Grid container spacing={6}>
                <Grid item xs={12}>
                
                    <img src={blog.image} height="200px" width="300px"></img>
                    {blog.description}
                </Grid>
            </Grid>

    </React.Fragment>
  );
}

export default withTheme(BlogShow);
