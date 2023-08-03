import React from "react";
import {
  Paper,
  Box,
  FormControlLabel,
  Typography,
  Grid,
  Checkbox,
  Button,
  CircularProgress,
} from "@material-ui/core";
import {
  getSupplierValidations,
  updateSupplierValidations,
} from "../../redux/helpers/settings";
import "./styles.scss";
import { connect } from "react-redux";
import { AlertDialog } from "../../components/Dialogs";

import { accessRights } from "~/config/accessRights";

class SupplierValidations extends React.Component {
  state = {
    savingData: false,
    dialogMessage: "",
    isDialogActive: false,
    checkedList: [],
    permissionList: [
      {
        id: 1,
        key: "isUsPostalServiceFilter",
        title: "US/Canada postal service filter",
        description:
          "Determine if payee address is “out of the ordinary”, “high risk” or generally inconsistent with what would “normally be expected ",
        isChecked: false,
        subChecks: [],
      },
      {
        id: 2,
        title: "OFAC/ OSFI filter",
        key: "isOfacFilter",
        description:
          "Determine if payee or identified individuals at payee organization have been “blacklisted” by the U.S./Canadian Government ",
        isChecked: false,
      },
      {
        id: 3,
        title: "Bank Account Prenote",
        key: "isBankAccountPreNote",
        description:
          "Ensure payments will be successfully credited to payee bank account before the first “live” payment is initiated ",
        isChecked: false,
      },
      {
        id: 4,
        title: "IRS TIN/Business Number Match",
        key: "isIrsTinMatch",
        description:
          "Confirm payee’s legal name and Tax ID#/Business Number matches the official record maintained by the Internal Revenue Service/Canadian Revenue Agency",
        isChecked: false,
      },
      {
        id: 5,
        title: "W9/W8 form for failed TIN Match / Business number match",
        key: "isW9",
        description:
          "To be uploaded on payee portal by payee. The payee support team needs to validate the W9 form uploaded by the payee after a failed TIN match.",
        isChecked: false,
      },
      {
        id: 6,
        title: "Voided check / Bank letter",
        key: "isVoidedCheck",
        description:
          "To be uploaded on payee portal by payee. The payee support team needs to validate the check or bank letter uploaded by the payee after Pre-note or Penny Testing has failed.",
        isChecked: false,
      },
    ],
  };

  saveDetails = () => {
    const { permissionList } = this.state;
    let clientId = this.props.user.userData.portalProfileId;
    let payload = {};
    this.setState({ savingData: true }, () => {
      permissionList.forEach((permission) => {
        payload[permission["key"]] = permission.isChecked == true ? 1 : 0;
      });
      updateSupplierValidations(payload, clientId).then((response) => {
        this.setDialogMessage(true, response.message);
        this.setState({ savingData: false });
      });
    });
  };

  checkItem(permission) {
    permission.isChecked = !permission.isChecked;
    this.setState({ ...this.state });
  }

  setDialogMessage(flag, message) {
    this.setState({
      dialogMessage: message,
      isDialogActive: flag,
    });
  }

  grantAll() {
    const { permissionList } = this.state;
    permissionList.forEach((p) => {
      p.isChecked = true;
    });
    this.setState({ ...this.state });
  }

  clearAll() {
    const { permissionList } = this.state;
    permissionList.forEach((p) => {
      p.isChecked = false;
    });
    this.setState({ ...this.state });
  }

  componentDidMount() {
    this.getPermissionList();
  }

  prepareState(obj) {
    const { permissionList } = this.state;
    //console.log(obj);
    permissionList.forEach((item) => {
      item["isChecked"] = obj[`${item.key}`] == 1 ? true : false;
    });
    this.setState({ ...this.state });
  }

  getPermissionList() {
    let clientId = this.props.user.userData.portalProfileId;
    getSupplierValidations(null, clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message);
        return false;
      }
      this.prepareState(response.data);
    });
  }
  render() {
    const {
      permissionList,
      dialogMessage,
      savingData,
      isDialogActive,
    } = this.state;
    const { theme } = this.props.clientConfig.layout;
    const { user } = this.props;
    const isSettingValidationSupplierEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_VALIDATION_SUPPLIER_EDIT"]
        )) ||
      false;

    return (
      <Box mx={6}>
        <Paper className={"generalSettingsWrapper"}>
          <Box p={4}>
            <Grid container>
              <Grid xs={6} sm={6}>
                <h3 className="settingHeading">Payee Validations</h3>
              </Grid>
              {/* <Grid xs={6} sm={6}>
                                <div style={{
                justify: "end",
                display: "flex",
                justifyContent: "flex-end"
              }}>
                  
                <Button
                  variant="contained"
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    width: "240px",
                    margin: "0px 10px 0 0",
                  }}
                  color="primary"
                >
                  Select All Validations
                </Button>
                <Button
                  variant="contained"
                  style={{
                    display: "inline-block",
                    float: "left",
                    padding: "6px 10px",
                    width: "220px",
                    margin: "0px 10px 0 0",
                    background: theme.palette.secondary.contrastText,
                    color: theme.palette.button.primary,
                  }}
                  color=""
                >
                  Clear All Validations
                </Button>
                                </div>
                                
                                
                            </Grid> */}
              {isSettingValidationSupplierEditEnabled && (
                <Grid xs={6} sm={6}>
                  <Box>
                    <Button
                      className="displayInlineBLock floatRight horizontalMargin button"
                      onClick={this.clearAll.bind(this)}
                    >
                      Clear All
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      className="displayInlineBLock floatRight horizontalMargin button"
                      style={{
                        background: theme.palette.button.primary,
                        color: theme.palette.secondary.contrastText,
                      }}
                      onClick={this.grantAll.bind(this)}
                    >
                      Grant All
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
            <Box my={3}>
              {permissionList &&
                permissionList.map((permission) => (
                  <Box pb={2} style={{ borderBottom: "1px solid #ccc" }}>
                    <Grid>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={permission.isChecked}
                            onChange={() => this.checkItem(permission)}
                            style={{ opacity: 0.1 }}
                            name="checkedB"
                            color="primary"
                            disabled={true}
                          />
                        }
                        label={permission.title}
                        className={"checkbox-lable"}
                      />
                      <Typography
                        className={"checkbox-lable"}
                        style={{ paddingLeft: "32px", paddingBottom: "5px" }}
                      >
                        {permission.title}
                      </Typography>
                      <Box className={"description"} mx={4} my={-1}>
                        {permission.description}
                      </Box>
                    </Grid>
                  </Box>
                ))}
            </Box>
          </Box>
        </Paper>

        <Grid justify="center">
          {isSettingValidationSupplierEditEnabled && (
            <Box mt={5}>
              <div
                style={{
                  justify: "center",
                  margin: "0 auto",
                  display: "table",
                }}
              >
                {/* <Box px={5}>
                                <Button variant="contained" style={{ display: "inline-block", float: "left", padding: "6px 10px", width: "120px", margin: "0px 10px 0 0", background: theme.palette.secondary.contrastText, color: theme.palette.button.primary }} color="" >
                                    Cancel
                                        </Button>
                            </Box> */}

                {savingData ? (
                  <CircularProgress color="primary" />
                ) : (
                  <Box px={0}>
                    <Button
                      variant="contained"
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        width: "120px",
                        margin: "0px",
                      }}
                      color="primary"
                      onClick={() => this.saveDetails()}
                    >
                      Update
                    </Button>
                  </Box>
                )}
              </div>
            </Box>
          )}
        </Grid>

        <Grid justify="end">
          <Box mt={5}>
            {/* {savingDetails ? (
                <CircularProgress color="primary" />
            ) : ( */}
            {/* <div
              style={{
                justify: "end",
                margin: "0 auto",
                display: "table",
                width: "340px",
              }}
            >
              <Box px={5}>
                <Button
                  variant="contained"
                  style={{
                    display: "inline-block",
                    float: "left",
                    padding: "6px 10px",
                    width: "120px",
                    margin: "0px 10px 0 0",
                    background: theme.palette.secondary.contrastText,
                    color: theme.palette.button.primary,
                  }}
                  color=""
                >
                  Cancel
                </Button>
              </Box>

              <Box px={2}>
                

                    <Button
                      variant="contained"
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        width: "120px",
                        margin: "0px 10px 0 0",
                      }}
                      color="primary"
                    >
                      Save
                    </Button>

              </Box>

            </div> */}
            {/* )} */}
          </Box>
        </Grid>

        {dialogMessage && isDialogActive && (
          <AlertDialog
            title={dialogMessage}
            open={true}
            onConfirm={() =>
              this.setState({ dialogMessage: "", isDialogActive: false })
            }
          />
        )}
      </Box>
    );
  }
}

export default connect((state) => ({ ...state.user, ...state.clientConfig }))(
  SupplierValidations
);
