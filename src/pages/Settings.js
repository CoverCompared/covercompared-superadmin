import { Button, Card, CardContent, Divider, Grid, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { withTheme } from "styled-components";
import utils from "../libs/utils";
import validator from "./../libs/validator";
import AuthService from "./../libs/services/auth";
import { useSnackbar } from "notistack";
import { Route, Switch, useRouteMatch } from "react-router";

function ChangePassword(props) {

    const { enqueueSnackbar } = useSnackbar();

    const [passwordVisibility, setPasswordVisibility] = useState({
        old_password: false,
        new_password: false,
        confirm_password: false
    });

    const [form, setForm] = useState({
        old_password: { value: "", rules: ["required"] },
        new_password: { value: "", rules: ["required", "minLength:6"] },
        confirm_password: { value: "", rules: ["required", "same:new_password"] },
    })

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

    const passwordField = (label, name) => {
        return <TextField variant="standard" margin="normal"
            label={label}
            className="mb-3"
            type={passwordVisibility[name] ? "text" : "password"}
            fullWidth name={name} onChange={handleChange} onBlur={onBlur}
            value={form[name].value}
            error={form[name].isTouched === true && validateMessage[name] !== undefined}
            helperText={form[name].isTouched === true ? validateMessage[name] : ""}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton edge="end" tabIndex="-1"
                            onClick={e => setPasswordVisibility({ ...passwordVisibility, [name]: !passwordVisibility[name] })} >
                            {passwordVisibility[name] ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    }

    const changePassword = async () => {
        setForm(utils.formTouchAllField({ ...form }));

        /**
         * TODO: Start Loader
         */
        try {
            let response = await AuthService.updatePassword(form.old_password.value, form.new_password.value);
            /**
             * TODO: Stop loader
             */
            if (response.status) {
                enqueueSnackbar("Password changed successfully.", { variant: "success", autoHideDuration: '3s' });
                let _form = { ...form };
                _form.old_password.value = "";
                _form.new_password.value = "";
                _form.confirm_password.value = "";
                setForm(_form);

            } else {
                setValidateMessage({ old_password: response.message });
            }
        } catch (error) {
            setValidateMessage({ old_password: "Something went wrong." });
        }

    }

    useEffect(() => { submitMessage() }, [])

    return (<Card mb={6}>
        <CardContent>
            <Typography variant="h6" gutterBottom>
                Change Password
            </Typography>

            <Grid container spacing={6}>
                <Grid item md={8}>
                    {passwordField("Old Password", "old_password")}
                    {passwordField("New Password", "new_password")}
                    {passwordField("Confirm Password", "confirm_password")}
                </Grid>
            </Grid>

            <Button variant="contained" color="primary"
                disabled={Boolean(Object.keys(validateMessage).length)}
                onClick={changePassword}>
                Save changes
            </Button>
        </CardContent>
    </Card>)
}

function UpdateEmail(props) {

    const { enqueueSnackbar } = useSnackbar();

    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const [form, setForm] = useState({
        email: { value: "", rules: ["required", "email"] },
        password: { value: "", rules: ["required"] }
    })
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
        let _form = { ...form };
        _form.email.value = AuthService.getEmail();
        setForm(_form);
        submitMessage();
    }, []);

    const updateEmail = async () => {

        setForm(utils.formTouchAllField({ ...form }));

        /**
         * TODO: Start Loader
         */
        try {
            let response = await AuthService.updateEmail(form.email.value, form.password.value);
            /**
             * TODO: Stop loader
             */
            if (response.status) {
                enqueueSnackbar("Email changed successfully.", { variant: "success", autoHideDuration: '3s' });
                let _form = { ...form };
                _form.email.value = AuthService.getEmail();
                _form.password.value = "";
                setForm(_form);

            } else {
                setValidateMessage({ password: response.message });
            }
        } catch (error) {
            setValidateMessage({ password: "Something went wrong." });
        }

    }

    return (<Card mb={6}>
        <CardContent>
            <Typography variant="h6" gutterBottom>
                Update Email Address
            </Typography>

            <Grid container spacing={6}>
                <Grid item md={8}>
                    <TextField variant="standard" margin="normal" fullWidth
                        label="Email Address"
                        name="email"
                        value={form.email.value} onChange={handleChange}
                        onBlur={onBlur}
                        error={form.email.isTouched === true && validateMessage.email !== undefined}
                        helperText={form.email.isTouched === true ? validateMessage.email : ""}
                    />

                    <TextField variant="standard" margin="normal"
                        label="Password"
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
                </Grid>
            </Grid>

            <Button variant="contained" color="primary"
                disabled={Boolean(Object.keys(validateMessage).length)}
                onClick={updateEmail}>
                Update
            </Button>
        </CardContent>
    </Card>)
}

function Settings(props) {
    let { path, url } = useRouteMatch();

    return <React.Fragment>
        <Helmet title="Settings" />
        <Grid justify="space-between" container spacing={6}>
            <Grid item>
                <Typography variant="h3" display="inline">
                    Settings
                </Typography>
            </Grid>
        </Grid>

        <Divider my={6} />

        <Grid container spacing={6} className="mt-5">
            <Grid item xs={12} md={6}> <ChangePassword /> </Grid>
            <Grid item xs={12} md={6}> <UpdateEmail /> </Grid>
        </Grid>
        
    </React.Fragment>
}

export default withTheme(Settings);