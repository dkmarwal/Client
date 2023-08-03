import React from 'react';
import {
  Box,
  Card,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { connect } from 'react-redux';
const USbankPayeeUpdates = (props) => {
  const { supplierUpdates, classes, openSupplierUpdates, onSupplierClick, t, suppliers } = props;
  return (
    <>
      {supplierUpdates?.length > 0 ? (
        <Box mb={3}>
          <Card
            className={classes.expansionCards}
            style={{ height: openSupplierUpdates ? "494px" : "150px" }}
          >
            <Box px={2} py={1}>
              <h1 className={classes.textAttention}>
                {`${t("componentData.mySupplier.PayeeUpdates")} (${(suppliers.unReadCount) || ""
                  })`}{" "}
              </h1>
              <Box>
                {supplierUpdates.map(
                  (u, index) => (
                    <div
                      className={classes.subHeading}
                      key={index}
                      style={{
                        display: "flex",
                        margin: 0,
                        alignItems: "baseline",
                      }}
                    >
                      <span className={classes.circleText}>
                        {u["consumerName"] && u["consumerName"][0]}
                      </span>
                      <span className={classes.text16}>
                        {" "}
                        <Link
                          className={classes.link}
                          to={`/suppliers/supplierUpdates`}
                        >
                          {" "}
                          {u["consumerName"]}
                        </Link>
                        {`- ${u["actionType"]}`}
                      </span>
                    </div>
                  )
                )}
              </Box>
            </Box>
            <div className={classes.bgBlur}>
              {openSupplierUpdates ? (
                <>
                  <Box className={classes.btnWrap}>
                    <Button
                      color="secondary"
                      onClick={() =>
                        props.history.push(
                          "/suppliers/supplierUpdates"

                        )
                      }
                    >
                      {t("componentData.dashboard.SeeMore")}
                    </Button>
                  </Box>
                </>
              ) : null}

              <Box display="flex" justifyContent="center">
                <span
                  className={classes.expansionBtn}
                  onClick={onSupplierClick}
                >
                  {openSupplierUpdates ? (
                    <>
                      <ExpandLessIcon className={classes.arrowsColor} />
                    </>
                  ) : (
                    <ExpandMoreIcon className={classes.arrowsColor} />
                  )}
                </span>
              </Box>
            </div>
          </Card>
        </Box>
      ) : (
        <Box display="block" textAlign="center" width={1} my={2}>
          <Card
            style={{ padding: 10 }}
            className={classes.expansionCards}
          >
            <Box color="#7F7F7F" fontSize={20} pb={2} textAlign="left">
              {t("componentData.dashboard.zeroPayeeUpdates")}
            </Box>
            <img
              src={require("~/assets/images/nodata-img1.svg")}
              alt=""
            />

            <Box py={2} color="#A1A1A1" fontSize={14} display="block">
              {" "}
              {t("componentData.dashboard.noDataToShow")}{" "}
            </Box>
          </Card>
        </Box>
      )}
    </>
  );
}

// export default USbankPayeeUpdates;

export default (
  connect((state) => ({
    ...state.user,
  }))(USbankPayeeUpdates)
);