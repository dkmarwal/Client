import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import { Route, Switch } from "react-router-dom";

import ImportPaymentFiles from "~/modules/ImportPaymentFiles";
import USbankImportPaymentFiles from "~/modules/USbankImportPaymentFiles";
import FileDetails from "~/modules/FileDetails";
import B2CFileDetails from "~/modules/FileDetails/B2C";
import config from "~/config";
import { entityType } from "~/config/entityTypes";

class Payment extends Component {
  state = {};

  render() {
    const {isPayeeChoicePortal} = this.props.user;
    const { state } = this.props.location;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Switch>
              <Route
                exact
                path={`${config.baseName}/payments/paymentFiles`}
                render={(props) => isPayeeChoicePortal?<USbankImportPaymentFiles {...this.props}/>
                :
                
                <ImportPaymentFiles {...this.props}/>
                
                }
              />
              <Route
                path={`${config.baseName}/payments/paymentFiles/fileDetails`}
                render={
                  (props) => (
                    state.appType ? state.appType === entityType.B2B ?
                      <FileDetails {...this.props} /> : <B2CFileDetails {...this.props} /> : <FileDetails {...this.props} />
                  )}
              />
            </Switch>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default connect((state) => ({ ...state.user }))(Payment);
