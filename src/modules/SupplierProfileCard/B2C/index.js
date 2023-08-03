import React from "react";
import { Grid, Avatar, Box } from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

const SupplierProfileCardB2C = ({ consumerInfo, t, payeeType, ...props }) => {
  const { firstName, lastName, consumerIdentifier } = consumerInfo || "";
  const isPayeeChoicePortal = props.user?.isPayeeChoicePortal;
  return (
    <Box>
      {consumerInfo ? (
        <>
          <Grid container item direction="row">
            <Grid
              container
              item
              direction="row"
              xs={12}
              alignItems="center"
              justify="space-between"
            >
              <Grid item xs={6}>
                <Grid container alignItems="center">
                  <Grid item xs={2}>
                    <Box display="flex">
                      <Avatar alt="Remy Sharp" />
                    </Box>
                  </Grid>
                  <Grid item xs={10}>
                    <Box width="90%" whiteSpace="nowrap">
                      <Box
                        color="primary.main"
                        fontSize={34}
                        title={`${firstName} ${lastName}` || ""}
                      >
                        {`${firstName} ${lastName}` || ""}
                      </Box>
                      <Box color="primary.main" fontSize={16}>
                        {t("componentData.supplierProfileCard.payeeID")}:{" "}
                        {consumerIdentifier}
                      </Box>
                      {isPayeeChoicePortal && 
                      (
                      <Box color="primary.main" fontSize={16}>
                        {t("componentData.supplierProfileCard.payeeType")}:{" "}
                        {payeeType}
                      </Box>
                      )
                      }
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              
            </Grid>
          </Grid>
        </>
      ) : (
        ""
      )}
    </Box>
  );
};

export default withTranslation() (
  connect((state) => ({ ...state.user }))(SupplierProfileCardB2C)
)
