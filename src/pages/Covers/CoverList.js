import React from "react";
import styled, { withTheme } from "styled-components";

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
import { PRODUCT_TYPE_NAMES } from "../../libs/constants";
import { FilterList, Search, Visibility } from "@material-ui/icons";
import { withRouter } from "react-router-dom";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);


class BasicTable extends React.Component {

    state = {
        status_options: ["all", "active", "pending", "cancelled"],
        status: 0,
        q: "",
        total_pages: 0,
        total_records: 0,
        current_page: 0,
        rows_per_page: 1,
        is_filter_open: false,
        rows: [],
        product_type: ""
    }

    componentDidMount() {

        let { q, from, to, product_type, status } = utils.queryToFilter(this.props.location.search);

        if(this.state.status_options.includes(status)){
            status = this.state.status_options.indexOf(status)
        }

        let current_page = this.state.current_page;
        let rows_per_page = this.state.rows_per_page;
        if(from !== undefined && to !== undefined){
            rows_per_page = to - from;
            current_page = from/rows_per_page;
        }

        this.setState({
            q: q ? q : this.state.q, 
            product_type: product_type ? product_type : this.state.product_type, 
            status: status ? status : this.state.status, 
            current_page, rows_per_page
        }, () => {
            this.loadTable();
        })


    }

    resetFilter = () => {
        this.setState({ q: "", total_pages: 0, total_records: 0, current_page: 0, product_type: "" })
    }

    loadTable = async () => {
        /**
         * TODO: Start Loader
         */
        try {
            let status = [""]

            let req = {
                from: ((this.state.current_page) * this.state.rows_per_page),
                to: ((this.state.current_page + 1) * this.state.rows_per_page),
            };


            if (this.state.status > 0) req['status'] = this.state.status_options[this.state.status];
            if (this.state.product_type) req['product_type'] = this.state.product_type;
            if (this.state.q) req['q'] = this.state.q;

            let query_string= utils.filterToQuery(req);
            this.props.history.push(`/covers?${query_string}`)
            let response = await PolicyService.table(req);

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

    handleChangeSearch = (e) => {
        this.props.history.push(`/covers?${e.target.name}=${e.target.value}`)
        this.setState({ [e.target.name]: e.target.value }, this.loadTable);
    }

    render() {
        return (
            <React.Fragment>
                <Paper className="p-2 mb-3">
                    <Grid container spacing={2} className="mb-2">
                        <Grid item sm={9} xs={6}>
                            <FormControl fullWidth style={{ width: "300px" }}>
                                <InputLabel>Product Type</InputLabel>
                                <Select
                                    value={this.state.product_type}
                                    label="Product Type"
                                    name="product_type"
                                    onChange={this.handleChangeSearch}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {Object.keys(PRODUCT_TYPE_NAMES).map((product_type, ind) => (<MenuItem value={product_type} key={ind}>{PRODUCT_TYPE_NAMES[product_type]}</MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={6}>
                            <TextField
                                variant="standard"
                                label="Search"
                                fullWidth
                                placeholder="Search by Txn Hash / Name / Email"
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

                <Paper rounded>
                    <Tabs value={this.state.status} variant="fullWidth" onChange={this.handleChangeStatus}>
                        {this.state.status_options.map((status, ind) => (<Tab className="text-capitalize" label={status} key={ind} />))}
                    </Tabs>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Type</TableCell>
                                    <TableCell>Txn Hash</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Payment Status</TableCell>
                                    <TableCell className="text-right">Total Amount</TableCell>
                                    <TableCell className="text-right">Date</TableCell>
                                    <TableCell className="text-right">View</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(this.state.rows) && this.state.rows.length ?
                                    this.state.rows.map((cover, ind) => (<TableRow key={ind}>
                                        <TableCell >{PRODUCT_TYPE_NAMES[cover.product_type]}</TableCell>
                                        <TableCell > {cover.txn_hash} </TableCell>
                                        <TableCell>{cover.user && cover.user.first_name} {cover.user && cover.user.last_name}</TableCell>
                                        <TableCell>{cover.user && cover.user.email}</TableCell>
                                        <TableCell className="text-capitalize">{cover.status}</TableCell>
                                        <TableCell className="text-capitalize">{cover.payment_status}</TableCell>
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

function CoverList({ theme }) {
    return (
        <React.Fragment>CoverList
            <Helmet title="Default Dashboard" />
            <Grid container justify="space-between" spacing={6}>
                <Grid item>
                    <Typography variant="h3" gutterBottom display="inline">
                        Covers
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

export default withRouter(withTheme(CoverList));
