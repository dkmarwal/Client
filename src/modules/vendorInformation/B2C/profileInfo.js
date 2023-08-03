import React, { useRef, useState } from "react";
import {
  Grid,
  Box,
  Paper,
  Link,
  Typography,
  InputBase,
  IconButton,
} from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { withTranslation } from "react-i18next";
import EditIcon from "@material-ui/icons/Edit";
import EditContactView from "./EditContactView";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { Button } from "~/components/Forms";
import { getAddress } from "~/utils/address";
import PinDropIcon from "@material-ui/icons/PinDrop";
import { accessRights } from "~/config/accessRights";
import { starredMask } from "~/utils/common";

const ProfileInfo = (props) => {
  const {
    classes,
    t,
    consumerProfileInfo,
    vendorDetail,
    onResendLink,
    isPayeeEditable,
    updateCTAsData,
    user,
  } = props;
  const { data } = consumerProfileInfo;
  const textRef = useRef();

  const [editDetail, setEditDetail] = useState(false);

  const onCopyClick = () => {
    textRef.current.select();
    document.execCommand("copy");
  };

  const isMySupplierResendLinkEnabled =
    (user.userRoles &&
      user.userRoles.includes(
        accessRights["SUPPLIERS_MY_SUPPLIERS_RESEND_LINK"]
      )) ||
    false;

  return (
    <>
      {editDetail ? (
        <EditContactView
          data={data}
          vendorDetail={vendorDetail}
          updateCTAsData={() => {
            setEditDetail(false);
            updateCTAsData();
          }}
          onCancel={() => setEditDetail(false)}
        />
      ) : (
        <Paper>
          {isPayeeEditable && (
            <Box justifyContent="flex-end" alignSelf="flex-end" display="flex">
              <IconButton
                color="primary"
                aria-label="Edit Company"
                title={t("componentData.vendorCompanyInfo.EditCompany")}
                component="span"
                onClick={() => setEditDetail(true)}
                //disabled={isPayeeEditableDisabled}
              >
                <EditIcon
                  className={classes.smallIcon}
                  //color={
                  //isPayeeEditableDisabled ? "disabled" : "secondary"
                  //}
                />
              </IconButton>
            </Box>
          )}
          <Grid
            container
            className={classes.details}
            spacing={3}
            style={{ padding: "25px" }}
            direction="row"
          >
            <Grid container>
              <Grid item xs={6}>
                <Box my={1}>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={4} className={classes.key}>
                      {t("componentData.profileInfo.PayeeID")}
                    </Grid>
                    <Grid item xs={6} className={classes.value}>
                      {data.consumerIdentifier}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box my={1}>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={1} className={classes.key}>
                      <img
                        src={require(`~/assets/icons/mail.svg`)}
                        alt="E-mail"
                      />
                    </Grid>
                    <Grid item xs={3} className={classes.key}>
                      {t("componentData.profileInfo.EmailAddress")}
                    </Grid>
                    <Grid item xs={8} className={classes.value}>
                      <Link
                        color="inherit"
                        href={`mailto:${data?.emailAddress ?? ""}`}
                      >
                        {data.emailAddress ?? ""}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box my={1}>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={4} className={classes.key}>
                      {t("componentData.profileInfo.PayeeName")}
                    </Grid>
                    <Grid item xs={6} className={classes.value}>
                      {`${data.firstName ?? ""} ${data.lastName ?? ""}`}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box my={1}>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={1} className={classes.key}>
                      <img
                        src={require(`~/assets/icons/phone.svg`)}
                        alt="Phone"
                      />
                    </Grid>
                    <Grid item xs={3} className={classes.key}>
                      {t("componentData.profileInfo.PhoneNumber")}
                    </Grid>
                    <Grid item xs={8} className={classes.value}>
                      {`${data.phoneCountryCode ?? ""}${
                        data.phoneNumber ?? ""
                      }`}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box my={1}>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={4} className={classes.key}>
                      {t("componentData.profileInfo.LoginID")}
                    </Grid>
                    <Grid item xs={6} className={classes.value}>
                      {data.userName}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box my={1}>
                  <Grid container item xs={12} spacing={2}>
                    <Grid
                      item
                      xs={1}
                      style={{ display: "flex" }}
                      className={classes.key}
                    >
                      <PinDropIcon fontSize="small" />
                    </Grid>
                    <Grid item xs={3} className={classes.key}>
                      {t("componentData.profileInfo.Address")}
                    </Grid>
                    <Grid item xs={8} className={classes.value}>
                      {getAddress(data)}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {data.ssnNumber && (
                <Grid item xs={6}>
                  <Box my={1}>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={4} className={classes.key}>
                        {t("componentData.profileInfo.SsnNumber")}
                      </Grid>
                      <Grid item xs={6} className={classes.value}>
                        {starredMask(data.ssnNumber, 3)}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
              {data.customField1 ? (
                <Grid item xs={6}>
                  <Box my={1}>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={4} className={classes.key}>
                        {t("componentData.profileInfo.CustomField1")}
                      </Grid>
                      <Grid item xs={6} className={classes.value}>
                        {data.customField1 ?? ""}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              ) : (
                <Grid item xs={6}></Grid>
              )}
              {data.customField2 && (
                <Grid item xs={6}>
                  <Box my={1}>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={4} className={classes.key}>
                        {t("componentData.profileInfo.CustomField2")}
                      </Grid>
                      <Grid item xs={6} className={classes.value}>
                        {data.customField2 ?? ""}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
              {data.customField3 && (
                <Grid item xs={6}>
                  <Box my={1}>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={4} className={classes.key}>
                        {t("componentData.profileInfo.CustomField3")}
                      </Grid>
                      <Grid item xs={6} className={classes.value}>
                        {data.customField3}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
              {data.customField4 && (
                <Grid item xs={6}>
                  <Box my={1}>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={4} className={classes.key}>
                        {t("componentData.profileInfo.CustomField4")}
                      </Grid>
                      <Grid item xs={6} className={classes.value}>
                        {data.customField4 ?? ""}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
              {data.customField5 && (
                <Grid item xs={6}>
                  <Box my={1}>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={4} className={classes.key}>
                        {t("componentData.profileInfo.CustomField5")}
                      </Grid>
                      <Grid item xs={6} className={classes.value}>
                        {data.customField5 ?? ""}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}

      {data.enrollmentUrl && (
        <>
          <Box mt={4} pb={1}>
            <Typography style={{ color: "#0b1941" }}>
              {t("componentData.profileInfo.EnrollmentLink")}
            </Typography>
          </Box>
          <Grid container xs={12}>
            <Grid item xs={6}>
              <Paper
                component="form"
                style={{ display: "flex", height: "40px" }}
              >
                <InputBase
                  inputRef={textRef}
                  style={{ width: "80%", padding: "0 8px" }}
                  value={data.enrollmentUrl}
                  inputProps={{ "aria-label": "resend link" }}
                />
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 5px",
                  }}
                >
                  <IconButton
                    style={{ color: "#008CE6", padding: "5px" }}
                    aria-label="search"
                    onClick={onCopyClick}
                  >
                    <FileCopyOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography style={{ color: "#008CE6" }}>
                    {t("componentData.profileInfo.CopyBtn")}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {isMySupplierResendLinkEnabled && (
              <Grid item xs={6} style={{ padding: "0 15px" }}>
                <Box>
                  <Button
                    variant="contained"
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      width: "auto",
                      margin: "0px 10px 0 0",
                      background: "#008CE6",
                    }}
                    color="primary"
                    onClick={onResendLink}
                  >
                    {t("componentData.profileInfo.ResendLinkBtn")}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </>
  );
};
export default withTranslation()(withStyles(styles)(ProfileInfo));
