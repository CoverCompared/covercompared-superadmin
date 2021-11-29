import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";
import { Button, IconButton, InputAdornment, Paper, TextField } from "@material-ui/core";
import Helmet from 'react-helmet';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import validator from "../../libs/validator";
import utils from "../../libs/utils";
import 'react-quill/dist/quill.snow.css';
import BlogService from "../../libs/services/blogs";
import { useSnackbar, withSnackbar } from "notistack";


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

function BlogCreate({ theme }, props) {

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [form, setForm] = useState({
    title: { value: "", rules: ["required"] },
    status: { value: "", rules: ["required"] },
    description: { value: "", rules: ["required"] },
    content: { value: "", rules: [] },
    image: { value: "", rules: ["required"] }
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

  useEffect(() => {
    submitMessage();
  }, [])

  const submitForm = async () => {
    setForm(utils.formTouchAllField({ ...form }));
    var axios = require('axios');
    var FormData = require('form-data');
    var fs = require('fs');
    

    let bodyFormData = new FormData();
    bodyFormData.append('title', form.title.value);
    bodyFormData.append('status', form.status.value);
    bodyFormData.append('description', form.description.value);
    bodyFormData.append('content', form.content.value);
    // bodyFormData.append('image', form.image.value);
    bodyFormData.append('image', fs.createReadStream(form.image.value));

    const config = {     
      headers: { 'content-type': 'multipart/form-data' }
    }
    console.log(bodyFormData);
    try {
      
      let data = await BlogService.add(bodyFormData,config);
      

      if (data.status) {
        /**
         * TODO: Stop loader
         */
        props.history.push(`/`);
        enqueueSnackbar(data.message, { variant: "success", autoHideDuration: '3s' });
      } else {
        /**
         * TODO: Stop loader
         */
        setValidateMessage({ email: data.message, password: "" });
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
          label="Status"
          name="status"
          value={form.status.value} onChange={handleChange}
          onBlur={onBlur}
          error={form.status.isTouched === true && validateMessage.status !== undefined}
          helperText={form.status.isTouched === true ? validateMessage.status : ""}
        />

        <TextField variant="standard" margin="normal" fullWidth
          label="description"
          name="description"
          value={form.description.value} onChange={handleChange}
          onBlur={onBlur}
          error={form.description.isTouched === true && validateMessage.description !== undefined}
          helperText={form.description.isTouched === true ? validateMessage.description : ""}
        />

        {/* <TextField variant="standard" margin="normal" fullWidth
          label="content"
          name="content"
          value={form.content.value} onChange={handleChange}
          onBlur={onBlur}
          error={form.content.isTouched === true && validateMessage.content !== undefined}
          helperText={form.content.isTouched === true ? validateMessage.content : ""}
        /> */}

        <ReactQuill
          name="content"
          theme="snow"
          value={form.content.value}
          onChange={handleChangeReachTextEditor}
          onBlur={(e) => { onBlur({ target: { name: "content" } }) }}
        />

        <Button
          mb={2}
          variant="contained"
          component="label"
          type="file"
          name="image"
        >
          Upload File
          <input
            type="file"
            name="image"
            value={form.image.value}
            hidden
          />
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          mb={2}
          // disabled={Boolean(Object.keys(validateMessage).length)}
          onClick={submitForm}
        >
          Add
        </Button>
      </form>
    </React.Fragment>
  );
}

export default withTheme(BlogCreate);
