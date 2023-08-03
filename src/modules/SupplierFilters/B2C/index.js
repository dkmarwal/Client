import React from "react";
import { connect } from 'react-redux';
import {
  Typography,
  Grid,
  Box,
  Button,
  MenuItem,
  Chip,
  CircularProgress,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import { TextField } from "~/components/Forms";
import { withTranslation } from "react-i18next";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EventIcon from "@material-ui/icons/Event";
import en from "date-fns/locale/es";
import fr from "date-fns/locale/es";
import es from "date-fns/locale/es";
registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("es", es);

class SupplierFiltersB2C extends React.Component {
  state = {
    processing: false,
  };

  render() {
    const { processing } = this.state;
    const {
      classes,
      name,
      id,
      paymentList,
      enrollmentStatusList,
      payeeTypeList,
      selectedFilterItem,
      filterList,
      handleChangeInput,
      handlePaymentClickFilter,
      handleProgramClickFilter,
      handlePayeeTypeClickFilter,
      handlePayeeActivatedAt,
      handleEnrollmentInitiatedAt,
      applySupplierFilter,
      resetSupplierFilter,
      payeeActivatedAt,
      enrollmentInitiatedAt,
      t,
    } = this.props;

    const {isPayeeChoicePortal} = this.props.user;

    return (
      <Grid className="vendorInfo overflowAuto">
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
          <Box position="relative">
            <DatePicker
              customInput={
                <OutlinedInput
                  variant="outlined"
                  className="full-width"
                  color="primary"
                  endAdornment={
                    <InputAdornment position="end">
                      <EventIcon
                        fontSize="small"
                        style={{ cursor: "pointer" }}
                      />
                    </InputAdornment>
                  }
                />
              }
              onChange={handlePayeeActivatedAt}
              locale={this.props.i18n.language}
              placeholderText={t(
                "componentData.supplierFilters.payeeActivatedAt"
              )}
              value={payeeActivatedAt}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <div className={classes.paymentsTabContainer}>
            <Typography variant="h4" className={classes.filterText}>
              {t("componentData.supplierFilters.PaymentMethods")}
            </Typography>
            <Box my={2}>
              {paymentList.length > 0 &&
                paymentList.map((item, index) => (
                  <Chip
                    // color="default"
                    icon={
                      <img
                        src={item.selected ? item.iconSelected : item.icon}
                        alt={t("componentData.supplierFilters.ViewFilter")}
                        className={classes.imgIcon}
                      />
                    }
                    key={item.id}
                    label={item.b2cDescription}
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
                ))}
            </Box>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.implementationProgram}>
            <Typography variant="h4" className={classes.filterText}>
              {isPayeeChoicePortal ? t("componentData.supplierFilters.campaignStatus") : t("componentData.supplierFilters.enrollmentStatus")}
            </Typography>
            <Box mt={2}>
              {enrollmentStatusList.length > 0 &&
                enrollmentStatusList.map((item, index) => (
                  <Chip
                    key={item.campaignStatusId}
                    label={item.description}
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
          <Box my={1} position="relative">
            <DatePicker
              customInput={
                <OutlinedInput
                  variant="outlined"
                  className="full-width"
                  color="primary"
                  endAdornment={
                    <InputAdornment position="top">
                      <EventIcon
                        fontSize="small"
                        style={{ cursor: "pointer" }}
                      />
                    </InputAdornment>
                  }
                />
              }
              onChange={handleEnrollmentInitiatedAt}
              locale={this.props.i18n.language}
              placeholderText={isPayeeChoicePortal ? t(
                "componentData.supplierFilters.campaignInitiatedAt"
              ) : t(
                "componentData.supplierFilters.enrollmentInitiatedAt"
              )}
              value={enrollmentInitiatedAt}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box my={1}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="status"
              label={t("componentData.supplierFilters.payeeStatus")}
              variant="outlined"
              value={selectedFilterItem.key || ""}
              onChange={handleChangeInput}
            >
              {filterList &&
                filterList.map((option) => (
                  <MenuItem
                    id={`status_${option.key}`}
                    key={`status_${option.key}`}
                    value={option.key}
                  >
                    {option.roleName}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </Grid>
        {isPayeeChoicePortal && 
        <Grid item xs={12}>
          <div className={classes.implementationProgram}>
            <Typography variant="h4" className={classes.filterText}>
              {t("componentData.supplierFilters.payeeType")}
            </Typography>
            <Box my={2}>
              {payeeTypeList.length > 0 &&
                payeeTypeList.map((item, index) => (
                  <Chip
                    key={item.payeeTypeId}
                    label={item.description}
                    size="medium"
                    className={
                      item.selected ? classes.itemSelected : classes.item
                    }
                    variant={item.selected ? "default" : "outlined"}
                    color="primary"
                    onClick={(event) =>
                      handlePayeeTypeClickFilter(event, item, index)
                    }
                  />
                ))}
            </Box>
          </div>
        </Grid>
        }
        <Grid container item xs={12} justify="center">
          <Grid item xs={this.props.i18n.language === "en" ? 5 : 12}>
            <Button
              type="submit"
              fullWidth={this.props.i18n.language === "en" ? false : true}
              style={this.props.i18n.language === "en" ? {} : { marginTop: 16 }}
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
            <Grid item xs={this.props.i18n.language === "en" ? 5 : 12}>
              <Button
                disableElevation
                type="submit"
                fullWidth={this.props.i18n.language === "en" ? false : true}
                style={
                  this.props.i18n.language === "en" ? {} : { marginTop: 16 }
                }
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

//export default withTranslation()(withStyles(styles)(SupplierFiltersB2C));
export default withTranslation()(
  connect((state) => ({ ...state.user }))(
    withStyles(styles)(SupplierFiltersB2C)
  )
);
