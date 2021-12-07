import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";

import Helmet from 'react-helmet';
import { useParams } from "react-router-dom";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Breadcrumbs,
  Card,
  CardContent,
  IconButton,
  Button
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
import BlogService from "../../libs/services/blogs";
import { Edit , Delete } from "@material-ui/icons";

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
          // console.log(response.data.data);
        } else {
          setNotFound(true);
        }
      }).catch(err => {
        setNotFound(true);
      })
  },


  
  [])
  

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


      <Divider  my={6} />
      <Card>    
      
        <CardContent style={{ float: "right" }}>
        <Link to={`/blogs/show/${blog._id}`} mx={3} >   
          <Edit></Edit> Edit
        </Link>
        <Link to={`/blogs/show/${blog._id}`} style={{ padding_left: "3px" }}>    
          <Delete></Delete>Delete
        </Link>
        <Button style={{ padding_left: "3px" }}  variant="contained" color="success">Contained</Button>
        </CardContent>
      </Card>
      
      <Divider  my={6} />
      
      <Card >
        <CardContent>
          <Grid container spacing={7}>
              <Grid item xs={6}>
                  <div className="">
                  <h3>{blog.title}</h3>
                  </div>
                  <h6 className="mb-2">Image :</h6>
                  <img src={blog.image} className="mb-4" height="200px" width="300px"></img>
                  <h6> Description : </h6>
                  {blog.description}
                  <h6 className="mt-4">Content : </h6>
                  <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
              </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default withTheme(BlogShow);
