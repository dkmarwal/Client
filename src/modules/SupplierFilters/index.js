import React from "react";
import {
  Typography,
  Grid,
  Box,
  Button,
  MenuItem,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import StateListField from "~/components/Forms/StateListField";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import { TextField } from "~/components/Forms";
import { withTranslation } from "react-i18next";

class SupplierFilters extends React.Component {
  state = {
    processing: false,
  };
  render() {
    const { processing } = this.state;
    const {
      classes,
      name,
      id,
      location,
      paymentList,
      programList,
      selectedFilterItem,
      filterList,
      handleChangeInput,
      handlePaymentClickFilter,
      handleProgramClickFilter,
      applySupplierFilter,
      resetSupplierFilter,
      enrollmentOnly,
      isImplementationProgSelected,
      t,
    } = this.props;
    return (
      <Grid className="vendorInfo overflowAuto">
        <Grid item xs={12}>
          <Box>
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="name"
              label={t("componentData.supplierFilters.PayeeName")}
              variant="outlined"
              value={name}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="id"
              label={t("componentData.supplierFilters.PayeeID")}
              variant="outlined"
              value={id}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <StateListField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="location"
              label={t("componentData.supplierFilters.Location")}
              countryCode="US"
              variant="outlined"
              value={location}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.paymentsTabContainer}>
            <Typography variant="h4" className={classes.filterText}>
              {t("componentData.supplierFilters.PaymentMethods")}
            </Typography>
            <Box my={2}>
              {paymentList.length > 0
                ? !isImplementationProgSelected
                  ? paymentList.map((item, index) => (
                      <Chip
                        icon={
                          <img
                            src={item.selected ? item.iconSelected : item.icon}
                            alt={t("componentData.supplierFilters.ViewFilter")}
                            className={classes.imgIcon}
                          />
                        }
                        key={item.id}
                        label={t(`componentData.supplierFilters.${item.label}`)}
                        size="medium"
                        className={
                          item.selected ? classes.itemSelected : classes.item
                        }
                        variant={item.selected ? "default" : "outlined"}
                        color="primary"
                        onClick={(event) =>
                          handlePaymentClickFilter(event, item, index)
                        }
                      />
                    ))
                  : paymentList
                      .slice(
                        enrollmentOnly ? 3 : 0,
                        enrollmentOnly ? paymentList.length : 3
                      )
                      .map((item, index) => (
                        <Chip
                          icon={
                            <img
                              src={
                                item.selected ? item.iconSelected : item.icon
                              }
                              alt={t(
                                "componentData.supplierFilters.ViewFilter"
                              )}
                              className={classes.imgIcon}
                            />
                          }
                          key={item.id}
                          label={t(
                            `componentData.supplierFilters.${item.label}`
                          )}
                          size="medium"
                          className={
                            item.selected ? classes.itemSelected : classes.item
                          }
                          variant={item.selected ? "default" : "outlined"}
                          color="primary"
                          onClick={(event) =>
                            handlePaymentClickFilter(event, item, index)
                          }
                        />
                      ))
                : ""}
            </Box>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.implementationProgram}>
            <Typography variant="h4" className={classes.filterText}>
              {t("componentData.supplierFilters.ImplementationProgram")}
            </Typography>
            <Box mt={2}>
              {programList.length > 0 &&
                programList.map((item, index) => (
                  <Chip
                    key={item.id}
                    label={t(`componentData.supplierFilters.${item.label}`)}
                    size="medium"
                    className={
                      item.selected ? classes.itemSelected : classes.item
                    }
                    variant={item.selected ? "default" : "outlined"}
                    color="primary"
                    onClick={(event) =>
                      handleProgramClickFilter(event, item, index)
                    }
                  />
                ))}
            </Box>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Box my={1}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="status"
              label={t("componentData.supplierFilters.Status")}
              variant="outlined"
              value={selectedFilterItem.filterKey}
              onChange={handleChangeInput}
            >
              {filterList &&
                filterList.map((option) => (
                  <MenuItem
                    id={`status_${option.filterKey}`}
                    key={`status_${option.filterKey}`}
                    value={option.filterKey}
                  >
                    {option.roleName}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              type="submit"
              size="large"
              fullWidth={true}
              variant="outlined"
              color="primary"
              onClick={resetSupplierFilter}
            >
              {t("componentData.supplierFilters.resetFilter")}
            </Button>
          </Grid>
          {processing ? (
            <CircularProgress color="primary" />
          ) : (
            <Grid item xs={12}>
              <Button
                disableElevation
                size="large"
                type="submit"
                fullWidth={true}
                variant="contained"
                color="primary"
                onClick={applySupplierFilter}
              >
                {t("componentData.supplierFilters.applyFilter")}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withTranslation()(withStyles(styles)(SupplierFilters));
