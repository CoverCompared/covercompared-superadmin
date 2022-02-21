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
import { FilterList, Search, Visibility, FileCopy, OpenInNew } from "@material-ui/icons";
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
        downloading: false,
        product_type: ""
    }

    componentDidMount() {

        let { q, from, to, product_type, status } = utils.queryToFilter(this.props.location.hash);

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

    resetPagination = () => {
        this.setState({ current_page: 0 })
    }

    createRequestObj = () => {
        let req = {
            from: ((this.state.current_page) * this.state.rows_per_page),
            to: ((this.state.current_page + 1) * this.state.rows_per_page),
        };


        if (this.state.status > 0) req['status'] = this.state.status_options[this.state.status];
        if (this.state.product_type) req['product_type'] = this.state.product_type;
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
            if(decodeURIComponent(this.props.location.hash) != `#?${query_string}`){
                this.props.history.push(`/covers#?${query_string}`)
            }

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
        this.resetPagination();
        this.setState({ status }, this.loadTable)
    }

    handleChangeSearch = (e) => {
        this.resetPagination();
        this.setState({ [e.target.name]: e.target.value }, this.loadTable);
    }

    handleChangeDate = (key, date) => {
        this.resetPagination();
        this.setState({ [key]: date }, this.loadTable);
    }

    downloadCSV = () => {
        if (this.state.from_date && this.state.to_date && Array.isArray(this.state.rows) && this.state.rows.length) {
            this.setState({ downloading: true });

            let req = this.createRequestObj();
            let query_string = utils.filterToQuery(req);
            let url = `${API_BASE_URL}/admin/policies?${query_string}&export=csv`

            fetch(url, { headers: AuthService.getHeader() })
            .then(res => res.blob())
            .then(blob => {
                this.setState({ downloading: false })
                saveAs(blob, `Cover Compared Policies Report (${utils.getFormattedDate(this.state.from_date)} - ${utils.getFormattedDate(this.state.to_date)} ).csv`)
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
                                    <FormControl fullWidth>
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
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" className="cover-list-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Type</TableCell>
                                    <TableCell>Txn Hash</TableCell>
                                    {this.state.status_options[this.state.status] === "active" ? <TableCell className="transaction-hash">Etherscan Transaction</TableCell> : <React.Fragment></React.Fragment>}
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
                                        {
                                            this.state.status_options[this.state.status] === "active" ? 
                                            <TableCell className="transaction-hash" title={cover.payment_hash}>{cover.payment_hash}</TableCell> : 
                                            <React.Fragment></React.Fragment>
                                        }
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
                                            {
                                                this.state.status_options[this.state.status] === "active" ? 
                                                <a target="_blank" href={cover.transaction_link}>
                                                    <IconButton> <OpenInNew /> </IconButton>
                                                </a> : 
                                                <React.Fragment></React.Fragment>
                                            }
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
        <React.Fragment>
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
