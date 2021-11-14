import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { setProfile } from "../../redux/actions/themeActions";
import AuthService from "./../../libs/services/auth";


class AuthGuard extends React.Component {

    state = {
        status: false
    }

    async componentDidMount() {
        if (!this.props.theme.profile || !localStorage.getItem("token")) {
            try {
                let user = await AuthService.getProfile(true);
                let status = this.state.status;
                if (!user) {
                    this.props.history.push(`${process.env.PUBLIC_URL}/login`);
                } else {
                    status = true;
                }
                this.setState({ status: true }, () => {
                    this.props.dispatch(setProfile(user))
                });
                return;
            } catch (error) {
                this.props.history.push(`${process.env.PUBLIC_URL}/login`);
            }
        } else {
            this.setState({ status: true });
        }
    }

    render() {
        return this.state.status ? <React.Fragment>{this.props.component}</React.Fragment> : <React.Fragment></React.Fragment>;
    }
}

export default connect(store => ({ theme: store.themeReducer }))(withRouter(AuthGuard))