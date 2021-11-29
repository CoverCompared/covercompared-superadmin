import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";

import Helmet from 'react-helmet';
import { useParams } from "react-router-dom";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  FormLabel,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableFooter
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { Link } from "react-router-dom";
import PolicyService from "../../libs/services/policies";
import { PRODUCT_TYPE_NAMES } from "../../libs/constants";
import utils from "../../libs/utils";
import countryList from "react-select-country-list";


const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function ReviewRating({ review }) {
  return <Grid item lg={6} xs={12}>
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div"> Review By Customer</Typography>
        <Divider className="mb-3" />
        <div>
          <FormControl className="m-2">
            <FormLabel>Rating</FormLabel>
            <Typography >{review.rating}</Typography>
          </FormControl>
          <FormControl className="m-2 float-right">
            <FormLabel>Review At</FormLabel>
            <Typography >{utils.getFormattedDateTime(review.updatedAt)}</Typography>
          </FormControl>
        </div>
        <div>
          <FormControl className="m-2">
            <FormLabel>Review</FormLabel>
            <Typography >{review.review}</Typography>
          </FormControl>
        </div>
      </CardContent>
    </Card>
  </Grid>
}

function PaymentDetail({ cover }) {
  return <Grid item lg={6} xs={12}>
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Payment Details
          <span className="text-capitalize float-right">
            {cover.payment_status}
          </span>
        </Typography>
        <Divider className="mb-3" />
        <div>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableBody>
                {cover.details && cover.product_type === "mso_policy" &&
                  <React.Fragment>
                    <TableRow >
                      <TableCell scope="row" style={{ borderBottom: "none" }}> Policy Price </TableCell>
                      <TableCell align="right">{utils.getFormattedAmount(cover.details.policy_price)} {cover.currency}</TableCell>
                    </TableRow>
                    <TableRow >
                      <TableCell scope="row"> MSO Addon Service</TableCell>
                      <TableCell align="right">{utils.getFormattedAmount(cover.details.mso_addon_service)} {cover.currency}</TableCell>
                    </TableRow>
                  </React.Fragment>
                }

                <TableRow >
                  <TableCell scope="row" style={{ borderBottom: "none" }}> Amount </TableCell>
                  <TableCell align="right">{utils.getFormattedAmount(cover.amount)} {cover.currency}</TableCell>
                </TableRow>
                <TableRow  >
                  <TableCell scope="row"> Discount Amount </TableCell>
                  <TableCell align="right">-{utils.getFormattedAmount(cover.discount_amount)} {cover.currency}</TableCell>
                </TableRow>
                <TableRow  >
                  <TableCell scope="row" style={{ borderBottom: "none" }}> Total </TableCell>
                  <TableCell align="right">{utils.getFormattedAmount(cover.amount - cover.discount_amount)} {cover.currency}</TableCell>
                </TableRow>
                <TableRow >
                  <TableCell scope="row"> Tax</TableCell>
                  <TableCell align="right">{utils.getFormattedAmount(cover.tax)} {cover.currency}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Table>
              <TableHead>
                <TableRow >
                  <TableCell component="th" scope="row"> Total Amount</TableCell>
                  <TableCell align="right">{utils.getFormattedAmount(cover.total_amount)} {cover.currency}</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </div>
      </CardContent>
    </Card>
  </Grid>
}

function CryptoPaymentDetails({ payment }) {
  return <Grid item lg={6} xs={12}>
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div"> Crypto Payment Details</Typography>
        <Divider className="mb-3" />
        <div>
          <FormControl className="m-2">
            <FormLabel>Blockchain</FormLabel>
            <Typography >{payment.blockchain}</Typography>
          </FormControl>
          <FormControl className="m-2">
            <FormLabel>Wallet Address</FormLabel>
            <Typography >{payment.wallet_address}</Typography>
          </FormControl>
        </div>
        <div>
          <FormControl className="m-2">
            <FormLabel>Block Timestamp</FormLabel>
            <Typography >{payment.block_timestamp}</Typography>
          </FormControl>
          <FormControl className="m-2">
            <FormLabel>Txn Type</FormLabel>
            <Typography >{payment.txn_type}</Typography>
          </FormControl>
          <FormControl className="m-2">
            <FormLabel>Payment Hash</FormLabel>
            <Typography >{payment.payment_hash}</Typography>
          </FormControl>
        </div>
        <div>
          <FormControl className="m-2">
            <FormLabel>Paid Amount</FormLabel>
            <Typography >{payment.paid_amount} {payment.currency}</Typography>
          </FormControl>
          <FormControl className="m-2">
            <FormLabel>Date</FormLabel>
            <Typography >{utils.getFormattedDateTime(payment.createdAt)}</Typography>
          </FormControl>
        </div>
      </CardContent>
    </Card>
  </Grid>
}

function DeviceInsuranceDetails({ cover }) {
  return (<Grid container spacing={2}>
    <Grid item lg={6} xs={12}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div"> Cover Details </Typography>
          <Divider className="mb-3" />
          <div >
            <FormControl className="m-2">
              <FormLabel>Product Type</FormLabel>
              <Typography>{PRODUCT_TYPE_NAMES[cover.product_type]}</Typography>
            </FormControl>
            <FormControl className="m-2">
              <FormLabel>Txn Hash</FormLabel>
              <Typography>{cover.txn_hash}</Typography>
            </FormControl>
            <FormControl className="m-2 float-right">
              <FormLabel>Status</FormLabel>
              <Typography className="text-capitalize">{cover.status}</Typography>
            </FormControl>
          </div>
          <div >
            <FormControl className="m-2">
              <FormLabel>Name</FormLabel>
              <Typography>{cover.details && cover.details.first_name} {cover.details && cover.details.last_name}</Typography>
            </FormControl>
          </div>
          <div >
            <FormControl className="m-2">
              <FormLabel>Email</FormLabel>
              <Typography>{cover.details && cover.details.email}</Typography>
            </FormControl>
            <FormControl className="m-2">
              <FormLabel>Phone No.</FormLabel>
              <Typography>{cover.details && cover.details.phone}</Typography>
            </FormControl>
          </div>
        </CardContent>
      </Card>
    </Grid>
    {
      (cover.details) &&
      <Grid item lg={6} xs={12}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div"> Device Insurance Details</Typography>
            <Divider className="mb-3" />
            <FormControl className="m-2">
              <FormLabel>Device Type</FormLabel>
              <Typography>{cover.details.device_type}</Typography>
            </FormControl>
            <FormControl className="m-2">
              <FormLabel>Brand</FormLabel>
              <Typography>{cover.details.brand}</Typography>
            </FormControl>
            <FormControl className="m-2">
              <FormLabel>Value</FormLabel>
              <Typography>{cover.details.value}</Typography>
            </FormControl>
            <br />
            <FormControl className="m-2">
              <FormLabel>Plan Type</FormLabel>
              <Typography className="text-capitalize">{cover.details.plan_type}</Typography>
            </FormControl>
            <FormControl className="m-2">
              <FormLabel>Purchase Month</FormLabel>
              <Typography>{cover.details.purchase_month}</Typography>
            </FormControl>
            <br />
            <FormControl className="m-2">
              <FormLabel>Model</FormLabel>
              <Typography>{cover.details.model}</Typography>
            </FormControl>
            <FormControl className="m-2">
              <FormLabel>Model Name</FormLabel>
              <Typography>{cover.details.model_name}</Typography>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
    }
    <PaymentDetail cover={cover} />
    {cover.payment && <CryptoPaymentDetails payment={cover.payment} />}
    {cover.reviews && <ReviewRating review={cover.reviews} />}
  </Grid>)
}

function MSOPolicyDetails({ cover }) {

  return (<Grid container spacing={2}>
    <Grid item lg={4} xs={12}>
      <Card className="h-100">
        <CardContent>
          <Typography gutterBottom variant="h5" component="div"> Cover Details </Typography>
          <Divider className="mb-3" />
          <div >
            <FormControl className="m-2">
              <FormLabel>Product Type</FormLabel>
              <Typography>{PRODUCT_TYPE_NAMES[cover.product_type]}</Typography>
            </FormControl>
            <FormControl className="m-2">
              <FormLabel>Txn Hash</FormLabel>
              <Typography>{cover.txn_hash}</Typography>
            </FormControl>
            <FormControl className="m-2 float-right">
              <FormLabel>Status</FormLabel>
              <Typography className="text-capitalize">{cover.status}</Typography>
            </FormControl>
          </div>
          <div >
            <FormControl className="m-2">
              <FormLabel>Name</FormLabel>
              <Typography>{cover.user && cover.user.first_name} {cover.user && cover.user.last_name}</Typography>
            </FormControl>
          </div>
          <div >
            <FormControl className="m-2">
              <FormLabel>Email</FormLabel>
              <Typography>{cover.user && cover.user.email}</Typography>
            </FormControl>
          </div>
        </CardContent>
      </Card>
    </Grid>
    {
      (cover.details) &&
      <Grid item lg={8} xs={12}>
        <Card className="h-100">
          <CardContent>
            <Typography gutterBottom variant="h5" component="div"> MSO Policy Details</Typography>
            <Divider className="mb-3" />
            <FormControl className="m-2">
              <FormLabel>Plan type</FormLabel>
              <Typography>{cover.details.name ? cover.details.name : cover.details.plan_type}</Typography>
            </FormControl>
            <FormControl className="m-2">
              <FormLabel>MSO Cover User</FormLabel>
              <Typography>{cover.details.mso_cover_user ? cover.details.mso_cover_user : (Array.isArray(cover.details.MSOMembers) && cover.details.MSOMembers.length)}</Typography>
            </FormControl>
            <div>
              <TableContainer>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell component="th" scope="row"> User Type</TableCell>
                      <TableCell component="th" scope="row"> First Name</TableCell>
                      <TableCell component="th" scope="row"> Last Name</TableCell>
                      <TableCell component="th" scope="row"> Country</TableCell>
                      <TableCell component="th" scope="row"> Date Of Birth</TableCell>
                      <TableCell component="th" scope="row"> Identity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(Array.isArray(cover.details.MSOMembers) && cover.details.MSOMembers.length) ?
                      cover.details.MSOMembers.map((member, ind) => {
                        return <TableRow key={ind} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                          <TableCell scope="row"> {member.user_type} </TableCell>
                          <TableCell scope="row"> {member.first_name} </TableCell>
                          <TableCell scope="row"> {member.last_name} </TableCell>
                          <TableCell scope="row"> {countryList().getLabel(member.country) ? countryList().getLabel(member.country) : member.country} </TableCell>
                          <TableCell scope="row"> {utils.getFormattedDate(member.dob)} </TableCell>
                          <TableCell scope="row"> {member.identity} </TableCell>
                        </TableRow>
                      }) : <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                        <TableCell colSpan={6} scope="row"> Not found. </TableCell>
                      </TableRow>
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      </Grid>
    }
    <PaymentDetail cover={cover} />
    {cover.payment && <CryptoPaymentDetails payment={cover.payment} />}
    {cover.reviews && <ReviewRating review={cover.reviews} />}
  </Grid>)
}

function CoverShow({ theme }) {

  const params = useParams();
  const [cover, setCover] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    PolicyService.show(params.id)
      .then((response) => {
        if (response.data && response.data.success) {
          setCover(response.data.data);
        } else {
          setNotFound(true);
        }
      }).catch(err => {
        setNotFound(true);
      })
  }, [])

  return (
    <React.Fragment>
      <Helmet title="Default Dashboard" />
      <Typography variant="h3" gutterBottom display="inline">
        Covers
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link exact to="/"> Dashboard </Link>
        <Link exact to="/covers"> Covers </Link>
        <Typography>{cover.txn_hash}</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      {notFound === true && <Card>
        <CardContent>No policy found.</CardContent>
      </Card>}

      {cover.product_type === "device_insurance" && <DeviceInsuranceDetails cover={cover} />}
      {cover.product_type === "mso_policy" && <MSOPolicyDetails cover={cover} />}

    </React.Fragment>
  );
}

export default withTheme(CoverShow);
