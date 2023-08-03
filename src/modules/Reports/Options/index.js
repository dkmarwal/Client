import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  MenuItem,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import TextField from '~/components/Forms/TextField';
import { withStyles } from '@material-ui/styles';
import styles from '../styles';
import { withTranslation } from 'react-i18next';
import { accessRights } from '~/config/accessRights';

const ReportOptions = (props) => {
  const {
    isSubscriber = false,
    handleSubscription,
    emailSubscriptionFrequency,
    userRoles,
    subscriptionFrequencyList,
    classes,
    handleChange,
    handleDownload,
    downloadProgress,
    subscriptionProgress = false,
    t,
  } = props;
  const isDownloadEnabled =
    userRoles && userRoles.includes(accessRights['DYNAMIC_REPORTS_DOWNLOAD']);
  const isSubscriptionEnabled =
    userRoles && userRoles.includes(accessRights['DYNAMIC_REPORTS_SUBSCRIBE']);
  return (
    <Box
      display="flex"
      className={classes.root}
      width="100%"
      flexDirection="column"
    >
      {isDownloadEnabled && (
        <Box p={1} display="flex" justifyContent="flex-start">
          {downloadProgress ? (
            <CircularProgress color="primary" />
          ) : (
            <IconButton
              color="primary"
              aria-label="Download"
              title={t('componentData.reportsComp.Download')}
              component="span"
              className={classes.smallBtn}
              onClick={handleDownload}
            >
              <GetAppIcon size="small" className={classes.smallIcon} />
              <Typography variant="h6" className={classes.iconText}>
                {t('componentData.reportsComp.DOWNLOAD')}
              </Typography>
            </IconButton>
          )}
        </Box>
      )}
      {subscriptionProgress ? (
        <CircularProgress color="primary" />
      ) : (
        isSubscriptionEnabled && (
          <>
            <Box p={1} display="flex" justifyContent="flex-start">
              <IconButton
                color="primary"
                aria-label={isSubscriber ? 'SUBSCRIBE' : 'UNSUBSCRIBE'}
                title={
                  isSubscriber === true
                    ? t('componentData.reportsComp.SUBSCRIBE')
                    : t('componentData.reportsComp.UNSUBSCRIBE')
                }
                component="span"
                className={classes.smallBtn}
                onClick={() =>
                  handleSubscription({
                    target: { name: 'subscription', value: !isSubscriber },
                  })
                }
              >
                {isSubscriber ? (
                  <RemoveCircleOutlineIcon
                    size="small"
                    className={classes.smallIcon}
                  />
                ) : (
                  <AddCircleOutlineIcon
                    size="small"
                    className={classes.smallIcon}
                  />
                )}
                <Typography variant="h6" className={classes.iconText}>
                  {isSubscriber
                    ? t('componentData.reportsComp.UNSUBSCRIBE')
                    : t('componentData.reportsComp.SUBSCRIBE')}
                </Typography>
              </IconButton>
            </Box>
            {isSubscriber && (
              <Box
                p={1}
                display="flex"
                justifyContent="flex-start"
                width="300px"
              >
                <TextField
                  label={t(
                    'componentData.reportsComp.EmailSubscriptionFrequency'
                  )}
                  fullWidth={true}
                  select
                  value={emailSubscriptionFrequency || ''}
                  autoComplete="off"
                  variant="outlined"
                  name="frequency"
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                >
                  {subscriptionFrequencyList ? (
                    subscriptionFrequencyList.map((option) => (
                      <MenuItem
                        key={option.subscriptionTypeId}
                        value={option.subscriptionTypeId}
                      >
                        {option.description}
                      </MenuItem>
                    ))
                  ) : (
                    <Box
                      width="100px"
                      display="flex"
                      mt={1.875}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CircularProgress color="primary" />
                    </Box>
                  )}
                </TextField>
              </Box>
            )}
          </>
        )
      )}
    </Box>
  );
};
export default withTranslation()(withStyles(styles)(ReportOptions));
