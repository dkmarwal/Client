import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { styles } from './styles';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import { CancelReasonId } from '~/utils/const'

const CancelPaymentReasons = (props) => {
  const {
    classes,
    cancelReasonsList,
    cancelReasonId,
    setCancelReasonId,
    otherCancelReason,
    setOtherCancelReason,
    t,
  } = props;
  const [showCancelPaymentAlert, setCancelPaymentAlert] = React.useState(true)

  const info = (
    <Tooltip title={t('componentData.cancelPaymentTexts.reasonMaxLength')} arrow placement="right">
      {<InfoOutlinedIcon className={classes.iconColor} />}
    </Tooltip>
  );

  const closeCancelPaymentAlert = () => {
    setCancelPaymentAlert(false)
  }
  const handleCancelReason = (event) => {
    const { value } = event.target;
    setOtherCancelReason(null);
    setCancelReasonId(parseInt(value));
  };

  const handleOtherCancelReason = (event) => {
    setOtherCancelReason(event.currentTarget.value);
  };

  return (
    <>
      {showCancelPaymentAlert && <Grid container className={classes.cancelAlertContainer}>
        <Grid item className={classes.cancelAlertItem} xs={11}>
          <img
            src={require('~/assets/icons/info_outline.svg')}
            alt="Info"
            className={classes.cancelIcon}
          />
          <Typography className={classes.cancelAlertText}>
            {t('componentData.cancelPaymentTexts.cancelAlertMessage')}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <img
            src={require('~/assets/icons/close.svg')}
            alt="Close"
            className={classes.cancelIcon}
            onClick={() => closeCancelPaymentAlert()}
          />
        </Grid>
      </Grid>}
      <Grid container className={classes.cancelReasonContainer}>
        <FormControl component="fieldset">
          <FormLabel component="legend" className={classes.radioLegend}>
            {t('componentData.cancelPaymentTexts.cancelPaymentReasonHeading')}
          </FormLabel>
          <RadioGroup
            name="cancelPayment"
            value={cancelReasonId}
            onChange={handleCancelReason}
          >
            {cancelReasonsList.map((cancelReason) => {
              return (
                <FormControlLabel
                  className={classes.radioLabels}
                  key={cancelReason.Id}
                  value={cancelReason.Id}
                  control={<Radio />}
                  label={cancelReason.Reason}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </Grid>
      {cancelReasonId === CancelReasonId && (
        <Grid container>
          <TextField
            variant="outlined"
            className={classes.otherReasonInput}
            placeholder="Comment"
            value={otherCancelReason}
            onChange={(e) => handleOtherCancelReason(e)}
            inputProps={{ maxLength: 250 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{info}</InputAdornment>
              ),
            }}
          />
        </Grid>
      )}
    </>
  );
};
export default withTranslation()(withStyles(styles)(CancelPaymentReasons));
