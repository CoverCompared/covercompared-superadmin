import React, { Component } from "react";
import styled, { withTheme } from "styled-components";
import { connect } from "react-redux";
import { darken } from "polished";

import {
  Badge,
  Grid,
  Hidden,
  InputBase,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar
} from "@material-ui/core";

import { Menu as MenuIcon } from "@material-ui/icons";

import {
  Bell,
  MessageSquare,
  Search as SearchIcon,
  Power
} from "react-feather";
import { setProfile } from "../redux/actions/themeActions";
import AuthService from "./../libs/services/auth";
import { useSnackbar, withSnackbar } from "notistack";

const AppBar = styled(MuiAppBar)`
  background: ${props => props.theme.header.background};
  color: ${props => props.theme.header.color};
  box-shadow: ${props => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${props => props.theme.header.indicator.background};
    color: ${props => props.theme.palette.common.white};
  }
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${props => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${props => darken(0.05, props.theme.header.background)};
  }

  ${props => props.theme.breakpoints.up("md")} {
    display: block;
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${props => props.theme.header.search.color};
    padding-top: ${props => props.theme.spacing(2.5)}px;
    padding-right: ${props => props.theme.spacing(2.5)}px;
    padding-bottom: ${props => props.theme.spacing(2.5)}px;
    padding-left: ${props => props.theme.spacing(12)}px;
    width: 160px;
  }
`;

const Flag = styled.img`
  border-radius: 50%;
  width: 22px;
  height: 22px;
`;

class LanguageMenu extends Component {
  state = {
    anchorMenu: null
  };

  toggleMenu = event => {
    this.setState({ anchorMenu: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorMenu: null });
  };

  render() {
    const { anchorMenu } = this.state;
    const open = Boolean(anchorMenu);

    return (
      <React.Fragment>
        <IconButton
          aria-owns={open ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={this.toggleMenu}
          color="inherit"
        >
          <Flag src="/static/img/flags/us.png" alt="English" />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorMenu}
          open={open}
          onClose={this.closeMenu}
        >
          <MenuItem
            onClick={() => {
              this.closeMenu();
            }}
          >
            English
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.closeMenu();
            }}
          >
            French
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.closeMenu();
            }}
          >
            German
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.closeMenu();
            }}
          >
            Dutch
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

class UserMenu extends Component {
  state = {
    anchorMenu: null
  };

  toggleMenu = event => {
    this.setState({ anchorMenu: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorMenu: null });
  };

  logout = async () => {

    /**
     * TODO: Start loader
     */

    // Remove Token
    localStorage.removeItem("token");

    await AuthService.logout();

    /**
     * TODO: Stop loader
     */
     this.props.enqueueSnackbar("Logout successfully.", { variant: "success", autoHideDuration: '3s' });

    // Remove Profile Object from redux
    this.props.dispatch(setProfile(false))
  }

  render() {
    const { anchorMenu } = this.state;
    const open = Boolean(anchorMenu);

    return (
      <React.Fragment>
        <IconButton
          aria-owns={open ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={this.toggleMenu}
          color="inherit"
        >
          <Power />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorMenu}
          open={open}
          onClose={this.closeMenu}
        >
          {/* <MenuItem
            onClick={() => {
              this.closeMenu();
            }}
          >
            Profile
          </MenuItem> */}
          <MenuItem
            onClick={() => {
              this.logout();
            }}
          >
            Sign out
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}
UserMenu = connect()(withSnackbar(UserMenu) );

const Header = ({ onDrawerToggle, theme }) => (
  <React.Fragment>
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Grid container alignItems="center">
          <Hidden mdUp>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Hidden>
          {/* <Grid item>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <Input placeholder="Search topics" />
            </Search>
          </Grid> */}
          <Grid item xs />
          <Grid item>
            {/* <IconButton color="inherit">
              <Indicator badgeContent={3}>
                <MessageSquare />
              </Indicator>
            </IconButton>
            <IconButton color="inherit">
              <Indicator badgeContent={7}>
                <Bell />
              </Indicator>
            </IconButton> */}
            {/* <LanguageMenu /> */}
            <UserMenu />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </React.Fragment>
);

export default connect(store => ({ theme: store.themeReducer }))(withTheme(Header));
