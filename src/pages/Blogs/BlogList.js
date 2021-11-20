import React from "react";
import styled, { withTheme } from "styled-components";

import Helmet from 'react-helmet';
import _ from "lodash";

import {
    Grid,
    Divider as MuiDivider,
    Typography as MuiTypography,
    Button,
    Breadcrumbs, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, TablePagination
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
import BlogService from "../../libs/services/blogs";
import utils from "../../libs/utils";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);


class BasicTable extends React.Component {

    state = {
        total_pages: 0,
        total_records: 0,
        current_page: 0,
        rows_per_page: 10,
        rows: []
    }

    componentDidMount() {
        this.loadTable();
    }

    loadTable = async () => {
        /**
         * TODO: Start Loader
         */
        try {

            let response = await BlogService.table({ from: ((this.state.current_page) * this.state.rows_per_page), to: ((this.state.current_page + 1) * this.state.rows_per_page) });

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

    handleChangePage = (event, newPage) => {
        this.setState({ current_page: newPage }, this.loadTable)
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ rows_per_page: parseInt(event.target.value, 10), current_page: 0 }, this.loadTable)
    }

    render() {
        return (
            <React.Fragment>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Created Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(this.state.rows) && this.state.rows.length ?
                                this.state.rows.map((blog, ind) => (<TableRow key={ind}>
                                    <TableCell component="th" scope="row">
                                        {blog.title}
                                    </TableCell>
                                    <TableCell align="right">{blog.status}</TableCell>
                                    <TableCell align="right">{blog.createdAt}</TableCell>
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

function BlogList({ theme }) {
    return (
        <React.Fragment>
            <Helmet title="Default Dashboard" />
            <Grid container justify="space-between" spacing={6}>
                <Grid item>
                    <Typography variant="h3" gutterBottom display="inline">
                        Blogs
                    </Typography>
                </Grid>
                <Grid item>
                    <Link to={"/blogs/create"}>
                        <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                        >
                            Add
                        </Button>
                    </Link>
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

export default withTheme(BlogList);
