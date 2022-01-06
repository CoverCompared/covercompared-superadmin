import React from "react";
import styled, { withTheme } from "styled-components";
import Swal from 'sweetalert2';
import Helmet from 'react-helmet';

import {
    Grid,
    Divider as MuiDivider,
    Typography as MuiTypography,
    Button,
    InputAdornment,
    TextField, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, TablePagination, IconButton
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
import SubscriptionService from "../../libs/services/subscription";
import utils from "../../libs/utils";
import { Visibility, Search } from "@material-ui/icons";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);


class BasicTable extends React.Component {

    state = {
        total_pages: 0,
        total_records: 0,
        current_page: 0,
        rows_per_page: 10,
        rows: [],
        q: ""
    }

    componentDidMount() {
        this.loadTable();
    }

    loadTable = async () => {
        /**
         * TODO: Start Loader
         */
        try {
            let req = {
                from: ((this.state.current_page) * this.state.rows_per_page),
                to: ((this.state.current_page + 1) * this.state.rows_per_page),
            };
            if (this.state.q) req['q'] = this.state.q;
            
            let response = await SubscriptionService.table(req);
            console.log(response);
            /**
             * TODO: Stop Loader
             */

            let state_res = utils.convertPaginationResponse(response)
            this.setState(state_res);
                
            
        } catch (error) {

            console.log(error);
            /**
             * TODO: Stop Loader
             */
        }
    }

    handleChangePage = (event, newPage) => {
        this.setState({ current_page: newPage }, this.loadTable)
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ rows_per_page: parseInt(event.target.value, 10), current_page: 0 }, this.loadTable)
    }

    handleChangeSearch = (e) => {
        this.setState({ [e.target.name]: e.target.value }, this.loadTable);
    }
    getFormatedDate = (date) => {
        var formateDate = new Date(date);
        var dd = String(formateDate.getDate()).padStart(2, '0');
        var mm = String(formateDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = formateDate.getFullYear();

        formateDate = dd + '/' + mm + '/' + yyyy;
        return formateDate;

    }

    showMsg = (message) =>{
        Swal.fire({
            title: '<strong>Contact Message</strong>',
            html:
              message,
            showCloseButton: true
          })
    }

    render() {
        
            
        return (
            <React.Fragment>
                <Paper className="p-2 mb-3">
                    <Grid container spacing={2} className="mb-2">
                        
                        <Grid item sm={3} xs={6}>
                            <TextField
                                variant="standard"
                                label="Search"
                                fullWidth
                                placeholder="Search by Name"
                                name="q"
                                value={this.state.q}
                                onChange={this.handleChangeSearch}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>


                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Updated Date</TableCell>
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {Array.isArray(this.state.rows) && this.state.rows.length ?
                                this.state.rows.map((subscription, ind) => (<TableRow key={ind}>
                                    <TableCell component="th" scope="row">
                                        {subscription.name}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {subscription.email}
                                    </TableCell>
                                    <TableCell className="subscription-status text-capitalize" align="right">{(subscription.status == null)?"-":subscription.status}</TableCell>
                                    <TableCell align="right">{this.getFormatedDate(subscription.updatedAt)}</TableCell>
                                    
                                </TableRow>)) :
                                <TableRow>
                                    <TableCell>No data found.</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={this.state.total_records}
                    rowsPerPage={this.state.rows_per_page}
                    page={this.state.current_page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </React.Fragment>
        )
    };
}

function SubscriptionList({ theme }) {
    return (
        <React.Fragment>
            <Helmet title="Default Dashboard" />
            <Grid container justify="space-between" spacing={6}>
                <Grid item>
                    <Typography variant="h3" gutterBottom display="inline">
                        Subscription List
                    </Typography>
                </Grid>
                <Grid item>
                    
                </Grid>
            </Grid>

            <Divider my={6} />

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <BasicTable />
                </Grid>
            </Grid>

        </React.Fragment>
    );
}

export default withTheme(SubscriptionList);
