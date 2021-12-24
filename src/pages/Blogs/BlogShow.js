import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";
import { useHistory } from "react-router";
import Helmet from 'react-helmet';
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Swal from 'sweetalert2';
import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Breadcrumbs,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
import BlogService from "../../libs/services/blogs";
import { Edit, Delete, Visibility } from "@material-ui/icons";
import { func } from "prop-types";
import { BASE_URL } from "../../libs/config";


const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);


function BlogShow({ theme }, props) {

  const params = useParams();
  const [blog, setBlog] = useState({});
  const [_status, setStatus] = useState({});
  const [notFound, setNotFound] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    BlogService.show(params.id)
      .then((response) => {
        if (response.data && response.data.success) {
          setBlog(response.data.data);
          setStatus(response.data.data.status);

        } else {
          setNotFound(true);
        }
      }).catch(err => {
        setNotFound(true);
      })
  },





    [])
  function deleteBlog(id) {


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





  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure ?',
      text: "You won't be able to revert this blog!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBlog(id);
        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )
      }
    })
  }


  function changeStatus(status) {

    let bodyFormData = new FormData();
    bodyFormData.append('status', status);

    BlogService.update(blog._id, bodyFormData)
      .then((response) => {
        if (response.data && response.data.success) {

          enqueueSnackbar(response.data.message, { variant: "success", autoHideDuration: '2s' });
          setStatus(status);

          BlogService.show(params.id)
            .then((response) => {
              if (response.data && response.data.success) {
                setBlog(response.data.data);
                setStatus(response.data.data.status);

              } else {
                setNotFound(true);
              }
            })

        } else {

          let message = response.data.data.image ? response.data.data.image.message : "Something went wrong.";
          enqueueSnackbar(message, { variant: "error", autoHideDuration: '2s' });
        }
      }).catch(err => {
        setNotFound(true);
      })
  }
  
  const openBlog = () => {
    window.open(`${BASE_URL}/blogs/${blog.slug}`, '_blank').focus()
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


      <Divider my={6} />
      <Card>

        <CardContent>
          <div class="button_padding">
            {_status === "draft" && <Button onClick={() => { changeStatus("published") }} className="ml-2 float-right" variant="contained" color="primary">Published</Button>}
            {_status === "published" && <Button onClick={() => { changeStatus("draft") }} className="ml-2 float-right" variant="contained" color="secondary">Draft</Button>}
            {/* <Button className="mr-5px float-right" variant="contained" color="primary"><Visibility fontSize="small"/> Preview</Button> */}
            {_status === "published" && <Button onClick={() => { openBlog() }} className="mr-5px float-right" variant="contained" color="secondary"><Visibility fontSize="small" /> Preview</Button>}

            <Button className="button-align-ctm btn-danger" onClick={() => { handleDelete(blog._id) }} variant="contained" ><Delete fontSize="small" /> DELETE</Button>
            <Button className="button-align-ctm btn-primary" onClick={() => { history.push(`/blogs/edit/${blog._id}`) }} variant="contained" ><Edit fontSize="small" /> EDIT</Button>
          </div>
        </CardContent>
      </Card>

      <Divider my={6} />

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
