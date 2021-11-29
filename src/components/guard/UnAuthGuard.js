import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router";
import { setProfile } from "../../redux/actions/themeActions";
import AuthService from "./../../libs/services/auth";

class UnAuthGuard extends React.Component{

    state = {
        status: false
    }

    async componentDidMount() {
        if (localStorage.getItem("token")) {
            try {
                let user = await AuthService.getProfile();
                let status = this.state.status;
                if (!user) {
                    status = true;
                    localStorage.removeItem("token")
                } else {
                    this.props.history.push(`/`);
                }
                this.setState({ status: true }, () => {
                    this.props.dispatch(setProfile(user))
                });
            } catch (error) {
                this.props.history.push(`/`);
            }
        } else {
            this.setState({ status: true });
        }
    }

    render() {
        return this.state.status ? <React.Fragment>{this.props.component}</React.Fragment> : <React.Fragment></React.Fragment>;
    }

}


export default connect(store => ({ theme: store.themeReducer }))(withRouter(UnAuthGuard))