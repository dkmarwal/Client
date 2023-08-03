import React from "react";
import {
  Typography,
  Grid,
  Box,
  Button,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import { TextField } from "~/components/Forms";
import { withTranslation } from 'react-i18next';

class PaymentFileFilters extends React.Component {
  state = {
    processing: false,
  };

  componentDidMount() {}

  render() {
    const { processing } = this.state;
    const {
      classes,
      name,
      id,
      count,
      noOfPayment,
      startDate,
      endDate,
      handleChangeInput,
      applySupplierFilter,
      resetSupplierFilter,
      t
    } = this.props;
    const paymentCount = [
      { id: ">", label: ">" },
      { id: "<", label: "<" },
      { id: ">=", label: ">=" },
      { id: "<=", label: "<=" },
      { id: "=", label: "=" },
    ];
    return (
      <Grid>
        <Grid item xs={12}>
          <Box my={1}>
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="name"
              label= {t('componentData.myPaymentsFilter.fileName')}
              variant="outlined"
              value={name}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>
        <Grid item>
          <Box my={1}>
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="id"
              label= {t('componentData.myPaymentsFilter.fileId')}
              variant="outlined"
              value={id || ""}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            flexDirection="row"
            display="flex"
            justifyContent="space-between"
          >
            <Box width="30%" my={1}>
              <TextField
                select
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                name="count"
                label=""
                variant="outlined"
                value={count}
                onChange={handleChangeInput}
              >
                <MenuItem>{t('componentData.myPaymentsFilter.Select')}</MenuItem>
                {paymentCount &&
                  paymentCount.map((option) => (
                    <MenuItem
                      id={`status_${option.id}`}
                      key={`status_${option.id}`}
                      value={option.id}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
            </Box>
            <Box width="65%" my={1}>
              <TextField
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                name="noOfPayment"
                value={noOfPayment}
                label= {t('componentData.myPaymentsFilter.NumberOfPayments')}
                variant="outlined"
                onChange={handleChangeInput}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.filterText}>
          {t('componentData.myPaymentsFilter.UploadedOn')}
          </Typography>
          <Box>
            <TextField
              label= {t('componentData.myPaymentsFilter.StartDate')}
              type="date"
              name="startDate"
              value={startDate || ""}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.filterText}>
            to
          </Typography>
          <Box>
            <TextField
              label= {t('componentData.myPaymentsFilter.EndDate')}
              name="endDate"
              value={endDate || ""}
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>

        <Grid container item xs={12}>
          <Grid item xs={6}>
            <Box mt={4}>
              <Button
                type="submit"
                fullWidth={false}
                variant="outlined"
                color="primary"
                size="large"
                className={classes.btnScpace}
                onClick={resetSupplierFilter}
              >
                {t('componentData.myPaymentsFilter.RESETFILTER')}
              </Button>
            </Box>
          </Grid>
          {processing ? (
            <CircularProgress color="primary" />
          ) : (
            <Grid item xs={6}>
              <Box mt={4}>
                <Button
                  type="submit"
                  fullWidth={false}
                  variant="contained"
                  size="large"
                  color="primary"
                  className={classes.btnScpace}
                  onClick={applySupplierFilter}
                >
                  {t('componentData.myPaymentsFilter.APPLYFILTER')}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withTranslation()(withStyles(styles)(PaymentFileFilters));
