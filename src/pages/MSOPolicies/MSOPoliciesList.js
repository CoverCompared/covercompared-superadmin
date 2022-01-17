import React from "react";
import styled, { withTheme } from "styled-components";
import { saveAs } from "file-saver";

import Helmet from 'react-helmet';
import _ from "lodash";

import {
    Grid,
    Divider as MuiDivider,
    Typography as MuiTypography,
    Button,
    Breadcrumbs, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, TablePagination, Tabs, Tab, TextField, FormControl, InputAdornment, FilledInput, MenuItem, Select, IconButton, ButtonBase, InputLabel
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
import utils from "../../libs/utils";
import PolicyService from "../../libs/services/policies";
import AuthService from "../../libs/services/auth";
import { PRODUCT_TYPE_NAMES } from "../../libs/constants";
import { FilterList, Search, Visibility } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { API_BASE_URL } from "./../../libs/config"


const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);


class BasicTable extends React.Component {

    state = {
        status_options: ["all", "active", "pending", "cancelled"],
        status: 0,
        from_date: null,
        to_date: null,
        q: "",
        total_pages: 0,
        total_records: 0,
        current_page: 0,
        rows_per_page: 10,
        is_filter_open: false,
        rows: [],
        downloading: false
    }

    componentDidMount() {

        let { q, from, to, status } = utils.queryToFilter(this.props.location.search);

        if (this.state.status_options.includes(status)) {
            status = this.state.status_options.indexOf(status)
        }

        let current_page = this.state.current_page;
        let rows_per_page = this.state.rows_per_page;
        if (from !== undefined && to !== undefined) {
            rows_per_page = to - from;
            current_page = from / rows_per_page;
        }

        this.setState({
            q: q ? q : this.state.q,
            status: status ? status : this.state.status,
            current_page, rows_per_page
        }, () => {
            this.loadTable();
        })


    }

    resetFilter = () => {
        this.setState({ q: "", total_pages: 0, total_records: 0, current_page: 0 })
    }

    createRequestObj = () => {
        let req = {
            from: ((this.state.current_page) * this.state.rows_per_page),
            to: ((this.state.current_page + 1) * this.state.rows_per_page),
        };


        if (this.state.status > 0) req['status'] = this.state.status_options[this.state.status];
        if (this.state.from_date) req['from_date'] = this.state.from_date;
        if (this.state.to_date) req['to_date'] = this.state.to_date;
        if (this.state.q) req['q'] = this.state.q;
        return req;
    }

    loadTable = async () => {
        /**
         * TODO: Start Loader
         */
        try {
            let status = [""]

            let req = this.createRequestObj()
            
            let query_string = utils.filterToQuery(req);
            this.props.history.push(`/mso-policies?${query_string}`)

            let response = await PolicyService.msoPolicies(req);

            /**
             * TODO: Stop Loader
             */

            if (response.data.success) {
                this.setState(utils.convertPaginationResponse(response))
            }

        } catch (error) {
            /**
             * TODO: Stop Loader
             */
        }
    }

    handleChangeFilter = (event) => {

    }

    handleChangePage = (event, newPage) => {
        this.setState({ current_page: newPage }, this.loadTable)
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ rows_per_page: parseInt(event.target.value, 10), current_page: 0 }, this.loadTable)
    }

    handleChangeStatus = (event, status) => {
        this.resetFilter();
        this.setState({ status }, this.loadTable)
    }

    handleChangeDate = (key, date) => {
        this.setState({ [key]: date }, this.loadTable);
    }

    downloadCSV = () => {
        if (this.state.from_date && this.state.to_date && Array.isArray(this.state.rows) && this.state.rows.length) {
            this.setState({ downloading: true });

            let req = this.createRequestObj();
            let query_string = utils.filterToQuery(req);
            let url = `${API_BASE_URL}/admin/policies-mso?${query_string}&export=csv`

            fetch(url, { headers: AuthService.getHeader() })
            .then(res => res.blob())
            .then(blob => {
                this.setState({ downloading: false })
                saveAs(blob, `MSO Policies Report (${utils.getFormattedDate(this.state.from_date)} - ${utils.getFormattedDate(this.state.to_date)} ).csv`)
            })
        }
    }

    render() {
        return (
            <React.Fragment>
                <Paper className="p-2 mb-3">
                    <Grid container spacing={2} className="mb-2">
                        <Grid item sm={9} xs={6}>
                            <Grid container spacing={2}>
                                <Grid item sm={12} md={3}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker
                                            className="mr-5px"
                                            fullWidth
                                            label="Start Date"
                                            animateYearScrolling
                                            name="from_date"
                                            clearable
                                            value={this.state.from_date}
                                            onChange={(date) => { this.handleChangeDate("from_date", date) }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item sm={12} md={3}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker
                                            className="mr-5px"
                                            label="End Date"
                                            fullWidth
                                            animateYearScrolling
                                            name="to_date"
                                            clearable
                                            value={this.state.to_date}
                                            onChange={(date) => { this.handleChangeDate("to_date", date) }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                {
                                    this.state.from_date && this.state.to_date && <Grid item sm={12} md={12}>
                                        <div className="d-flex">
                                            <Button
                                                onClick={this.downloadCSV}
                                                disabled={(!(Array.isArray(this.state.rows) && this.state.rows.length)) || this.state.downloading}
                                                color="primary" variant="contained">
                                                {this.state.downloading ? "Downloading..." : "Download CSV"}
                                            </Button>
                                        </div>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper rounded>
                    <Tabs value={this.state.status} variant="fullWidth" onChange={this.handleChangeStatus}>
                        {this.state.status_options.map((status, ind) => (<Tab className="text-capitalize" label={status} key={ind} />))}
                    </Tabs>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Txn Hash</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Payment Status</TableCell>
                                    <TableCell>Plan type</TableCell>
                                    <TableCell>Cover User Count</TableCell>
                                    <TableCell>Cover User Details</TableCell>
                                    <TableCell className="text-right">Total Amount</TableCell>
                                    <TableCell className="text-right">Date</TableCell>
                                    <TableCell >View</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(this.state.rows) && this.state.rows.length ?
                                    this.state.rows.map((cover, ind) => (<TableRow key={ind}>
                                        <TableCell > {cover.txn_hash} </TableCell>
                                        <TableCell>{cover.user && cover.user.first_name} {cover.user && cover.user.last_name}</TableCell>
                                        <TableCell>{cover.user && cover.user.email}</TableCell>
                                        <TableCell className="text-capitalize">{cover.status}</TableCell>
                                        <TableCell className="text-capitalize">{cover.payment_status}</TableCell>
                                        <TableCell>{cover.MSOPolicy && cover.MSOPolicy.name}</TableCell>
                                        <TableCell>{(cover.MSOPolicy && cover.MSOPolicy.MSOMembers && Array.isArray(cover.MSOPolicy.MSOMembers)) ? cover.MSOPolicy.MSOMembers.length : 0}</TableCell>
                                        <TableCell>{
                                            (cover.MSOPolicy && cover.MSOPolicy.MSOMembers && Array.isArray(cover.MSOPolicy.MSOMembers)) ? (
                                                cover.MSOPolicy.MSOMembers.map((member, ind) => {
                                                    return (<div key={ind}>
                                                        No : {ind + 1} <br />
                                                        User Type : {member.user_type} <br />
                                                        Name : {member.first_name} {member.last_name} <br />
                                                        Country : {member.country} <br />
                                                        Date Of Birth : {utils.getFormattedDate(member.dob)} <br />
                                                        Identity : {member.identity} <br />
                                                    </div>)
                                                })
                                            ) : ""
                                        }</TableCell>
                                        <TableCell className="text-right">
                                            {["device_insurance", "mso_policy"].includes(cover.product_type) && <React.Fragment>{cover.total_amount} {cover.currency}</React.Fragment>}
                                            {["smart_contract", "crypto_exchange"].includes(cover.product_type) && <React.Fragment>{cover.crypto_amount} {cover.crypto_currency}</React.Fragment>}
                                        </TableCell>
                                        <TableCell className="text-right">{utils.getFormattedDate(cover.createdAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <Link to={`/covers/show/${cover._id}`}>
                                                <IconButton> <Visibility /> </IconButton>
                                            </Link>
                                        </TableCell>
                                    </TableRow>)) :
                                    <TableRow>
                                        <TableCell colSpan={7}>No data found.</TableCell>
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
                </Paper>

            </React.Fragment>
        )
    };
}

BasicTable = withRouter(BasicTable)

function MSOPoliciesList({ theme }) {
    return (
        <React.Fragment>
            <Helmet title="Default Dashboard" />
            <Grid container justify="space-between" spacing={6}>
                <Grid item>
                    <Typography variant="h3" gutterBottom display="inline">
                        MSO Policies
                    </Typography>
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

export default withRouter(withTheme(MSOPoliciesList));
