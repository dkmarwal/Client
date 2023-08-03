import React from "react";
import {
  Paper,
  Box,
  FormControlLabel,
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
import { withTranslation } from "react-i18next";

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
        title: "US & Canada Postal Service Filter",
        description:
          "Determine if payee is “out of the ordinary”, “high risk” or generally inconsistent with what would “normally be expected”.",
        isChecked: false,
        subChecks: [],
      },
      {
        id: 2,
        title: "OFAC Filter",
        key: "isOfacFilter",
        description:
          "Determine if payee or identified individuals at payee organization have been “blacklisted” by the U.S. Government.",
        isChecked: false,
      },
      {
        id: 3,
        title: "Bank Account Validation",
        key: "isBankAccountPreNote",
        description: "Confirm bank account status and ownership.",
        isChecked: false,
      },
      {
        id: 4,
        title: "IRS Tax ID / Business Number Match",
        key: "isIrsTinMatch",
        description:
          "Confirm payee’s legal name and Tax ID / Business Number match the official records maintained by the Internal Revenue Service (IRS) / Canadian Revenue Agency (CRA).",
        isChecked: false,
      },
      {
        id: 5,
        title:
          "W9 / CRA Form Required for Failed IRS Tax ID / Business Number Match",
        key: "isW9",
        description:
          "Payee to upload form directly onto the portal for Citi to validate information submitted during enrollment.",
        isChecked: false,
      },
      {
        id: 6,
        title: "Voided Check / Bank Letter",
        key: "isVoidedCheck",
        description:
          "Payee to upload form directly onto the portal for Citi to validate bank account information submitted during enrollment.",
        isChecked: false,
      },
      {
        id: 7,
        title: "Profile Authorization Form (PAF)",
        key: "isPAF",
        description:
          "Secondary authorization of the profile creation and to confirm bank account provided belongs to vendor organization.",
        isChecked: false,
      },
    ],
  };

  saveDetails = () => {
    const { permissionList } = this.state;
    const clientId = this.props.user.userData.portalProfileId;
    const payload = {};
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

    permissionList.forEach((item) => {
      item["isChecked"] = obj[`${item.key}`] == 1 ? true : false;
    });
    this.setState({ ...this.state });
  }

  getPermissionList() {
    const clientId = this.props.user.userData.portalProfileId;
    getSupplierValidations(null, clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message);
        return false;
      }
      this.prepareState(response.data);
    });
  }
  render() {
    const { permissionList, dialogMessage, savingData, isDialogActive } =
      this.state;
    const { theme } = this.props.clientConfig.layout;
    const { user, t } = this.props;
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
                <h3 className="settingHeading">
                  {t("componentData.supplierValidation.PayeeValidations")}
                </h3>
              </Grid>
              {isSettingValidationSupplierEditEnabled && (
                <Grid xs={6} sm={6}>
                  <Box>
                    <Button
                      className="displayInlineBLock floatRight horizontalMargin button"
                      onClick={this.clearAll.bind(this)}
                    >
                      {t("componentData.supplierValidation.ClearAll")}
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
                      {t("componentData.supplierValidation.GrantAll")}
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
            <Box my={3}>
              {permissionList &&
                permissionList.map((permission) => (
                  <Box pb={2} className="borderBottom">
                    <Grid xs={6}>
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
                        label={
                          <span style={{ fontWeight: "bold" }}>
                            {t(
                              `componentData.supplierValidation.${permission.key}.title`
                            )}
                          </span>
                        }
                        className={"checkbox-lable"}
                      />
                      <Box className={"description"} mx={4} my={-1}>
                        {t(
                          `componentData.supplierValidation.${permission.key}.disc`
                        )}
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
                      {t("componentData.supplierValidation.Update")}
                    </Button>
                  </Box>
                )}
              </div>
            </Box>
          )}
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

export default withTranslation()(
  connect((state) => ({ ...state.user, ...state.clientConfig }))(
    SupplierValidations
  )
);
