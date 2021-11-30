import React, { useEffect, useRef, useState } from "react";
import styled, { withTheme } from "styled-components";
import { Card, CardContent, Button, IconButton, InputAdornment, Paper, TextField } from "@material-ui/core";
import Helmet from 'react-helmet';
import { InsertPhoto } from "@material-ui/icons";
import validator from "../../libs/validator";
import utils from "../../libs/utils";
import 'react-quill/dist/quill.snow.css';
import BlogService from "../../libs/services/blogs";
import { useSnackbar, withSnackbar } from "notistack";
import { withRouter } from "react-router";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Breadcrumbs
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";


const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function BlogCreate({ theme, history }, props) {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [imageDataUrl, setImageDataUrl] = useState(undefined);
  const fileInput = useRef(null);
  const [form, setForm] = useState({
    title: { value: "", rules: ["required"] },
    description: { value: "", rules: ["required"] },
    content: { value: "", rules: [] },
    image: { value: "", rules: [] }
  });

  const [validateMessage, setValidateMessage] = useState({});

  const onBlur = (e) => {
    let _form = { ...form };
    _form[e.target.name].isTouched = true;
    setForm(_form);
    submitMessage()
  }

  const handleChange = (e) => {
    let _form = { ...form };
    _form[e.target.name].value = e.target.value;
    setForm(_form);
  }

  const submitMessage = async () => {
    let messages = {};
    let validate = validator.validate(utils.getFormValues(form), utils.getFormRules(form));
    if (validate !== true) { messages = validate; }
    setValidateMessage(messages);
  }

  const setImageFiles = (files) => {
    if (files && files.length) {
      const image = files[0];
      let fileReader = new FileReader();
      fileReader.readAsDataURL(image);
      fileReader.onload = () => {
        setImageDataUrl(fileReader.result);
        let _form = { ...form };
        _form['image'].value = image;
        setForm(_form);
      }
    } else {
      setImageDataUrl(undefined);
    }
  }

  useEffect(() => {
    submitMessage();
  }, [])

  const submitForm = async () => {
    setForm(utils.formTouchAllField({ ...form }));
    var axios = require('axios');
    var FormData = require('form-data');

    let bodyFormData = new FormData();
    bodyFormData.append('title', form.title.value);
    bodyFormData.append('status', "draft");
    bodyFormData.append('description', form.description.value);
    bodyFormData.append('content', form.content.value);
    bodyFormData.append('image', form.image.value);

    try {

      let response = await BlogService.add(bodyFormData);
      if (response.data.success) {
        /**
         * TODO: Stop loader
         */
        enqueueSnackbar(response.data.message, { variant: "success", autoHideDuration: '3s' });
        history.push(`/blogs/show/${response.data.data._id}`)
      } else {
        /**
         * TODO: Stop loader
         */
        let message = response.data.data.image ? response.data.data.image.message : "Something went wrong.";
        enqueueSnackbar(message, { variant: "error", autoHideDuration: '3s' });
      }
    }
    catch (e) {
      /**
       * TODO: Stop loader
       */
      enqueueSnackbar("Something went wrong.", { variant: "error", autoHideDuration: '3s' });
    }
  }

  const handleChangeReachTextEditor = (value) => {
    let _form = { ...form };
    _form['content'].value = value;
    setForm(_form);
  }

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
      <Card>
        <CardContent>
          <form>
            <TextField variant="standard" margin="normal" fullWidth
              label="Title"
              name="title"
              value={form.title.value} onChange={handleChange}
              onBlur={onBlur}
              error={form.title.isTouched === true && validateMessage.title !== undefined}
              helperText={form.title.isTouched === true ? validateMessage.title : ""}
            />

            <TextField variant="standard" margin="normal" fullWidth
              label="Description"
              name="description"
              value={form.description.value} onChange={handleChange}
              onBlur={onBlur}
              error={form.description.isTouched === true && validateMessage.description !== undefined}
              helperText={form.description.isTouched === true ? validateMessage.description : ""}
            />

            <Typography variant="body2" className="mt-2"> Image </Typography>
            <div
              onDrop={(event) => { event.preventDefault(); setImageFiles(event.dataTransfer.files) }}
              onDragEnter={(event) => { event.preventDefault() }}
              onDragLeave={(event) => { event.preventDefault() }}
              onDragOver={(event) => { event.preventDefault() }}
              onClick={(event) => { fileInput.current.click() }}
              className="drop-image-container">
              <InsertPhoto /> &nbsp;
              Drop a image to upload, or click to select it.
              <input type="file" ref={fileInput} onChange={(event) => { setImageFiles(event.target.files) }} accept=".jpg,.jpeg,.png" hidden />
            </div>

            {imageDataUrl && <img src={imageDataUrl} className="blog-upload-image-preview" />}

            <ReactQuill
              name="content"
              theme="snow"
              value={form.content.value}
              onChange={handleChangeReachTextEditor}
              onBlur={(e) => { onBlur({ target: { name: "content" } }) }}
            />


            <Button
              fullWidth
              variant="contained"
              color="primary"
              mb={2}
              disabled={Boolean(Object.keys(validateMessage).length)}
              onClick={submitForm}
            >
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default withRouter(withTheme(BlogCreate));
