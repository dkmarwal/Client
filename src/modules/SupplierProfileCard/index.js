import React, { useEffect, useState } from "react";
import { Grid, Typography, Avatar, Box } from "@material-ui/core";
import { getSupplierCompanyUpdate } from "../../redux/helpers/supplier";
import { withTranslation } from "react-i18next";

const SupplierProfileCard = ({ supplierId, t }) => {
  const [supplierInfo, setSupplierInfo] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getSupplierDetails = async () => {
    const supplierInfo = await getSupplierCompanyUpdate({
      payeeId: supplierId,
      prevDetails: false,
    });
    if (supplierInfo) {
      const { payeeLocations, ...restProps } = supplierInfo;
      setSupplierInfo({ ...payeeLocations, ...restProps });
    }
  };

  useEffect(() => {
    (() => getSupplierDetails())();
  }, [getSupplierDetails, supplierId]);

  const {
    companyName,
    clientPayeeLink,
    city,
    state,
    zipCode,
    dunsNumber,
    country,
  } = supplierInfo || "";

  return (
    <Box>
      {supplierInfo ? (
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
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        title={companyName || ""}
                      >
                        {companyName || ""}
                      </Box>
                      <Box color="primary.main" fontSize={16}>
                        {t("componentData.vendorCompanyInfo.Status")}:{" "}
                        {clientPayeeLink && clientPayeeLink.Status}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Box display="flex" flexDirection="column">
                  <Typography>{`${dunsNumber || ""}`}</Typography>
                  <Typography>{`${city || ""} , ${state || ""}`}</Typography>
                  <Typography>{`${country || ""} - ${
                    zipCode || ""
                  }`}</Typography>
                </Box>
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

export default withTranslation()(SupplierProfileCard);
