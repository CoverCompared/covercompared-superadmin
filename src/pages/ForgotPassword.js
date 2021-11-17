import React, { useEffect, useState } from "react";
import { Button, Paper, TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import validator from "./../libs/validator";
import utils from "../libs/utils";
import AuthService from "./../libs/services/auth";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

function ForgotPassword(props) {

    const [form, setForm] = useState({
        email: { value: "", rules: ["required", "email"] },
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

    useEffect(() => { submitMessage() }, [])

    const submitForm = async () => {
        setForm(utils.formTouchAllField({ ...form }));

        /**
         * TODO: Start Loader
         */

        try {
            let data = await AuthService.sendResetMail(form.email.value);
            if (data.status) {
                /**
                 * TODO: Stop loader & Toast Message "Reset mail successfully."
                 */
                props.history.push(`${process.env.PUBLIC_URL}/login`);
            } else {
                setValidateMessage({ email: data.message });
            }
        }
        catch (e) {
            console.log("Error", e);
        }
    }

    return (
        <Wrapper className="Login">
            <Helmet title="Login" />
            <Typography component="h1" variant="h4" align="center" gutterBottom>
                Forgot Password
            </Typography>

            <form>

                <TextField variant="standard" margin="normal" fullWidth
                    label="Email Address"
                    name="email"
                    value={form.email.value} onChange={handleChange}
                    onBlur={onBlur}
                    error={form.email.isTouched === true && validateMessage.email !== undefined}
                    helperText={form.email.isTouched === true ? validateMessage.email : ""}
                />

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    mb={2}
                    disabled={Boolean(Object.keys(validateMessage).length)}
                    onClick={submitForm}
                >
                    Send Reset Password Mail
                </Button>

                <div className="back-to-login-link">
                    <Link to={{ pathname: "/login" }}>Back to login</Link>
                </div>

            </form>
        </Wrapper>
    );
}

export default withRouter(ForgotPassword);