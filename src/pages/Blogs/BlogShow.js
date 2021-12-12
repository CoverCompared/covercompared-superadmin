import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";
import { useHistory } from "react-router";
import Helmet from 'react-helmet';
import { useParams } from "react-router-dom";
import { useSnackbar, withSnackbar } from "notistack";
import _ from "lodash";
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
import { func } from "prop-types";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);


function BlogShow({ theme } , props) {

  const params = useParams();
  const [blog, setBlog] = useState({});
  const [notFound, setNotFound] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();

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
 function deleteBlog(id){
  
  
  BlogService.delete(id)
  .then((response) => {
    if (response.data && response.data.success) {
        console.log(props.history);
        enqueueSnackbar(response.data.message, { variant: "success", autoHideDuration: '3s' });
        history.push('/blogs');
    } else {
      let message = response.data.data.image ? response.data.data.image.message : "Something went wrong.";
      enqueueSnackbar(message, { variant: "error", autoHideDuration: '3s' });
    }
  }).catch(err => {
    setNotFound(true);
  })
 } 

 function changeStatus(status){
  let bodyFormData = new FormData();
    bodyFormData.append('status', status);

  BlogService.update(blog._id, bodyFormData)
  .then((response) => {
    if (response.data && response.data.success) {
        console.log(props.history);
        enqueueSnackbar(response.data.message, { variant: "success", autoHideDuration: '3s' });
        history.push('/blogs');
    } else {
      let message = response.data.data.image ? response.data.data.image.message : "Something went wrong.";
      enqueueSnackbar(message, { variant: "error", autoHideDuration: '3s' });
    }
  }).catch(err => {
    setNotFound(true);
  })
 }

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
        
        {_.get(blog, "status", false) === "draft" && <Button onClick={() => { changeStatus("published") }} className="ml-2" variant="contained" color="primary">Published</Button>}
        {_.get(blog, "status", false) === "published" && <Button onClick={() => { changeStatus("draft") }} className="ml-2" variant="contained" color="secondary">Draft</Button>}
        
        <Button className="button-align-ctm" onClick={() => { deleteBlog(blog._id) }} variant="contained" color="primary">Delete</Button>
        <Button className="button-align-ctm" onClick={() => { history.push(`/blogs/edit/${blog._id}`) }} variant="contained" color="primary">Edit</Button>
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
                  <h6 className="mt-4"> Status : </h6>
                  {blog.status}
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
