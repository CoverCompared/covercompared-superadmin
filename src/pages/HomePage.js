import React, { useEffect, useState } from "react";
import styled, { withTheme } from "styled-components";
import _ from "lodash";
import Helmet from 'react-helmet';

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Card,
  CardContent,
  Box
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import UtilsService from "../libs/services/utils";
import { PRODUCT_TYPE_NAMES } from "../libs/constants";
import CryptoExchangeIcon from "../assets/crypto-exchange.svg";
import DeviceInsuranceIcon from "../assets/device-insurance.svg";
import MSOIcon from "../assets/mso.svg";
import SmartContractIcon from "../assets/smart-contract.svg";



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

  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState(undefined);

  useEffect(() => {
    UtilsService.dashboard().then((response) => {
      if (_.get(response, "data.success", false)) {
        setTotal(_.get(response, "data.data.total_count", 0))
        setCounts(_.get(response, "data.data.counts", undefined))
      } else {
        setTotal(0)
        setCounts(undefined)
      }
    })
  }, [])

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
      {
        Boolean(counts) &&
        <Grid container spacing={6}>
          {
            [
              { code: "mso_policy", icon: MSOIcon },
              { code: "device_insurance", icon: DeviceInsuranceIcon },
              { code: "smart_contract", icon: SmartContractIcon },
              { code: "crypto_exchange", icon: CryptoExchangeIcon }
            ].map((product_type, ind) => {
              return (PRODUCT_TYPE_NAMES[product_type.code] && counts[product_type.code]) ? <Grid key={ind} item xs={12} sm={12} md={6} lg={3} xl>
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
    </React.Fragment>
  );
}

export default withTheme(HomePage);
