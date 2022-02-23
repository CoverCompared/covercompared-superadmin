import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";
import _ from "lodash";
import Helmet from 'react-helmet';
import moment from "moment";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Table, TableBody, TableCell,
  TableHead,
  TableRow,
  Box, Button as MuiButton, Menu, MenuItem
} from "@material-ui/core";

import { height, spacing } from "@material-ui/system";
import UtilsService from "../libs/services/utils";
import { PRODUCT_TYPE_NAMES } from "../libs/constants";
import CryptoExchangeIcon from "../assets/crypto-exchange.svg";
import DeviceInsuranceIcon from "../assets/device-insurance.svg";
import MSOIcon from "../assets/mso.svg";
import SmartContractIcon from "../assets/smart-contract.svg";
import { MoreVertical } from "react-feather";
import { Doughnut } from "react-chartjs-2";
import { blue, green, red, orange } from "@material-ui/core/colors";

const ChartWrapper = styled.div`
  height: 250px;
  position: relative;
`;

const DoughnutInner = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -22px;
  text-align: center;
  z-index: 0;
`;

const Button = styled(MuiButton)(spacing);

const GreenText = styled.span`
  color: ${() => green[400]};
  font-weight: ${props => props.theme.typography.fontWeightMedium};
`;

const RedText = styled.span`
  color: ${() => red[400]};
  font-weight: ${props => props.theme.typography.fontWeightMedium};
`;

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Stats({ title, total, active, pending, cancelled, complete, icon }) {
  return (
    <Card mb={3}>
      <CardContent>
        <div className="row">
          <div className="col">
            <Typography variant="h6" mb={4}>{title}</Typography>
            <Typography variant="h3" mb={3}><Box fontWeight="fontWeightRegular">{active}</Box></Typography>
          </div>
          <div className="col-auto">
            <img className="dash-count-icon" src={icon} />
          </div>
        </div>

        <div className="dash-sub-count">Active <span>{active}</span></div>
        <div className="dash-sub-count">Pending <span>{pending}</span></div>
        <div className="dash-sub-count">Cancelled <span>{cancelled}</span></div>
        <div className="dash-sub-count">Complete <span>{complete}</span></div>
        <div className="dash-sub-count text-uppercase">Total <span>{total}</span></div>
      </CardContent>
    </Card>
  );
}

function HomePage({ theme }) {

  const rangeValues = [ 
    "All",
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
    "This month",
    "Last month",
  ];
  const options = {
    maintainAspectRatio: false,
    cutoutPercentage: 80
  };


  const [range, setRange] = useState("All");
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState(undefined);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCoverCount, setActiveCoverCount] = useState(0);
  const [data, setData] = useState({
    labels: ["MSO Policy", "Device Insurance", "Smart Contract", "Crypto Exchange"],
    datasets: [
      {
        data: [3, 95, 163, 38],
        backgroundColor: [
          "#f9bb03",
          "#f97b18",
          "#144d81",
          "#37cbc2",
        ],
        borderWidth: 1
      }
    ]
  });

  useEffect(() => {
    let value = range;

    // let dateRange = window.localStorage.getItem("dashboard-range");
    // if(dateRange && rangeValues.includes(dateRange)){
    //   setRange(dateRange);
    //   value = dateRange;
    // }

    loadData(value);
  }, [])

  const loadData = (rangeOptions = false) => {
    return new Promise((resolve, reject) => {
      rangeOptions = rangeOptions ? rangeOptions : range;
      let queryParams = {};

      if (rangeOptions == "Today") {
        queryParams['from_date'] = moment();
      } else if (rangeOptions == "Yesterday") {
        queryParams['from_date'] = moment().subtract(1, 'days');
        queryParams['to_date'] = moment().subtract(1, 'days');
      } else if (rangeOptions == "Last 7 days") {
        queryParams['from_date'] = moment().subtract(7, 'days');
      } else if (rangeOptions == "Last 30 days") {
        queryParams['from_date'] = moment().subtract(30, 'days');
      } else if (rangeOptions == "This month") {
        queryParams['from_date'] = moment().startOf('month');
      } else if (rangeOptions == "Last month") {
        queryParams['from_date'] = moment().subtract(1, 'months').startOf('month');
        queryParams['to_date'] = moment().subtract(1, 'months').endOf('month');
      }

      UtilsService.dashboard(queryParams).then((response) => {
        if (_.get(response, "data.success", false)) {
          setTotal(_.get(response, "data.data.total_count", 0))
          setCounts(_.get(response, "data.data.counts", undefined))
          let datasetData = [0, 0, 0, 0];
          datasetData[0] = _.get(response, "data.data.counts.mso_policy.active", 0)
          datasetData[1] = _.get(response, "data.data.counts.device_insurance.active", 0)
          datasetData[2] = _.get(response, "data.data.counts.smart_contract.active", 0)
          datasetData[3] = _.get(response, "data.data.counts.crypto_exchange.active", 0)
          let dataValue = { ...data };
          dataValue.datasets[0].data = datasetData
          setData(dataValue)
          setActiveCoverCount(_.sum(datasetData))
          resolve(true);
        } else {
          setTotal(0)
          setCounts(undefined)
          resolve(true);
        }
      })
    })
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  };

  const handleClose = (value) => {
    window.localStorage.setItem("dashboard-range", value);
    setRange(value);
    setAnchorEl(null);
    loadData(value);
  };

  return (
    <React.Fragment>
      <Helmet title="Default Dashboard" />
      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" display="inline">
            Dashboard
          </Typography>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={3}>
        <Grid item md={10} lg={6} xl={6}>
          {
            Boolean(counts) &&
            <Grid container spacing={3}>
              {
                [
                  { code: "mso_policy", icon: MSOIcon },
                  { code: "device_insurance", icon: DeviceInsuranceIcon },
                  { code: "smart_contract", icon: SmartContractIcon },
                  { code: "crypto_exchange", icon: CryptoExchangeIcon }
                ].map((product_type, ind) => {
                  return (PRODUCT_TYPE_NAMES[product_type.code] && counts[product_type.code]) ? <Grid key={ind} item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Stats
                      title={PRODUCT_TYPE_NAMES[product_type.code]}
                      icon={product_type.icon}
                      total={counts[product_type.code].total}
                      active={counts[product_type.code].active}
                      pending={counts[product_type.code].pending}
                      cancelled={counts[product_type.code].cancelled}
                      complete={counts[product_type.code].complete}
                    />
                  </Grid> : <React.Fragment key={ind}></React.Fragment>
                })
              }
            </Grid>
          }
        </Grid>
        <Grid item md={10} lg={6} xl={6} style={{ height: "100%" }}>
          <Card mb={3}>
            <CardHeader
              action={
                <React.Fragment>
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    aria-owns={anchorEl ? "simple-menu" : undefined}
                    aria-haspopup="true"
                    onClick={(event) => { setAnchorEl(event.currentTarget) }}
                  >
                    {range}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={(event) => { setAnchorEl(null) }}
                  >
                    {rangeValues.map((value, ind) => <MenuItem key={ind} onClick={(event) => { handleClose(value) }}>{value}</MenuItem>)}
                  </Menu>
                </React.Fragment>
              }
              title="Covers"
            />

            <CardContent>
              <Grid container>
                <Grid item lg={12}>
                  <ChartWrapper>
                    <DoughnutInner variant="h4" className="mt-1">
                      <Typography variant="h4">{activeCoverCount}</Typography>
                    </DoughnutInner>
                    <Doughnut data={data} options={options} />
                  </ChartWrapper>
                </Grid>
                {/* <Grid item lg={4}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Covers</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        (data.labels && Array.isArray(data.labels)) ?
                          data.labels.map(label => <TableRow>
                            <TableCell component="th" scope="row">{label}</TableCell>
                            <TableCell align="right">260</TableCell>
                          </TableRow>) :
                          <React.Fragment></React.Fragment>
                      }
                    </TableBody>
                  </Table>
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </React.Fragment>
  );
}

export default withTheme(HomePage);
