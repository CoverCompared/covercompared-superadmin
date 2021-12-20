import React, { useEffect, useState } from "react";
import { Button, IconButton, InputAdornment, Paper, TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import validator from "./../libs/validator";
import utils from "../libs/utils";
import AuthService from "./../libs/services/auth";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { useSnackbar, withSnackbar } from "notistack";
import { setLoader } from "../redux/actions/themeActions";
import { connect } from "react-redux";

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

function Login(props) {

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    email: { value: "", rules: ["required"] },
    password: { value: "", rules: ["required"] }
  });

  const [validateMessage, setValidateMessage] = useState({});

  const onBlur = (e) => {
    let _form = { ...form };
    _form[e.target.name].isTouched = true;
    setForm(_form);
  }
  
  const handleChange = (e) => {
    let _form = { ...form };
    _form[e.target.name].value = e.target.value;
    setForm(_form);
    submitMessage()
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

  const submitForm = async (e) => {
    e.preventDefault();
    setForm(utils.formTouchAllField({ ...form }));

    /**
     * TODO: Start Loader
     */
    setProcessing(true);

    try {
      let data = await AuthService.login(form.email.value, form.password.value);
      if (data.status) {
        /**
         * TODO: Stop loader
         */
         setProcessing(false);
        props.history.push(`/`);
        enqueueSnackbar(data.message, { variant: "success", autoHideDuration: '3s' });
      } else {
        /**
         * TODO: Stop loader
         */
         setProcessing(false);
        setValidateMessage({ email: data.message, password: "" });
      }
    }
    catch (e) {
      /**
       * TODO: Stop loader
       */
       setProcessing(false);
      enqueueSnackbar("Something went wrong.", { variant: "error", autoHideDuration: '3s' });
    }
  }

  return (
    <Wrapper className="Login">
      <Helmet title="Login" />
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Login to your account to continue
      </Typography>

      <form onSubmit={submitForm}>

        <TextField variant="standard" margin="normal" fullWidth
          label="Email Address"
          name="email"
          autoFocus
          value={form.email.value} onChange={handleChange}
          onBlur={onBlur}
          error={form.email.isTouched === true && validateMessage.email !== undefined}
          helperText={form.email.isTouched === true ? validateMessage.email : ""}
        />

        <TextField variant="standard" margin="normal"
          label="Password*"
          className="mb-3"
          type={passwordVisibility ? "text" : "password"}
          fullWidth name="password" onChange={handleChange} onBlur={onBlur}
          value={form.password.value}
          error={form.password.isTouched === true && validateMessage.password !== undefined}
          helperText={form.password.isTouched === true ? validateMessage.password : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" tabIndex="-1"
                  onClick={e => setPasswordVisibility(!passwordVisibility)} >
                  {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          mb={2}
          disabled={Boolean(Object.keys(validateMessage).length) || processing}
        >
          {processing ? "Processing..." : "Sign in"}
        </Button>
        <Link className="forgot-password-link" to={{ pathname: "/forgot-password" }}>Forgot Password</Link>

      </form>
    </Wrapper>
  );
}

export default connect()(withRouter(Login));