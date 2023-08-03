import React, { Component } from 'react';
import { Grid, Box } from '@material-ui/core';
import { Button } from '~/components/Forms';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import { withTranslation } from 'react-i18next';
import config from '~/config';
import { ProcessingFailureReasonStatusId } from '~/utils/const';

class PaymentFilesDetails extends Component {
  state = { error: false, idArray: [1005, 1021, 1002] };

  render() {
    const { t } = this.props;
    const { classes, campaignFileData } = this.props;
    const { idArray } = this.state;    

    return (
      <>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={6}>
            <Box className={classes.outerBox} bgcolor="white" height={1}>
              <Box
                fontSize={16}
                textAlign="left"
                color="primary"
                alignItems="left"
                pb={2}
                className={classes.BoxTitle}
              >
                {' '}
                {t(
                  'componentData.supplierCampaignFile.CampaignFileDetails'
                )}{' '}
              </Box>
              <Box p={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  pb={2}
                  alignItems="center"
                  className={classes.TitleText}
                >
                  <Box fontSize={16} width="40%">
                    {' '}
                    {t('componentData.paymentFileDetail.FileStatus')}
                  </Box>
                  <Box fontSize={15} width="60%">
                    {' '}
                    <Button size="small" className={classes.btnLighGreen} style={{ "backgroundColor": campaignFileData.StatusColor ? campaignFileData.StatusColor : "#33c3a461" }}>
                      {' '}
                      {campaignFileData.FileStatus || '--'}
                    </Button>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  pb={2}
                  alignItems="center"
                  className={classes.TitleText}
                >
                  <Box fontSize={16} width="40%">
                    {' '}
                    {t('componentData.paymentFileDetail.FileID')}
                  </Box>
                  <Box fontSize={15} width="60%">
                    {' '}
                    {campaignFileData.FileID || ''}
                  </Box>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  pb={2}
                  alignItems="center"
                  className={classes.TitleText}
                >
                  <Box fontSize={16} width="40%">
                    {' '}
                    {t('componentData.supplierCampaignFile.UploadedAt')}
                    {': '}
                  </Box>
                  <Box fontSize={15} width="60%">
                    {' '}
                    {campaignFileData.FileUploaded || '--'}
                  </Box>
                </Box>
                {!idArray.includes(campaignFileData.FileStatusId) && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    pb={2}
                    alignItems="center"
                    className={classes.TitleText}
                  >
                    <Box fontSize={16} width="40%">
                      {' '}
                      {t('componentData.supplierCampaignFile.UpdatedBy')}
                      {': '}
                    </Box>
                    <Box fontSize={15} width="60%">
                      {' '}
                      {campaignFileData.ApprovedBy || '--'}
                    </Box>
                  </Box>
                )}
                {!idArray.includes(campaignFileData.FileStatusId) && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    pb={2}
                    alignItems="center"
                    className={classes.TitleText}
                  >
                    <Box fontSize={16} width="40%">
                      {' '}
                      {t('componentData.supplierCampaignFile.UpdatedAt')}
                      {': '}
                    </Box>
                    <Box fontSize={15} width="60%">
                      {' '}
                      {campaignFileData.FileApprovedAt || '--'}
                    </Box>
                  </Box>
                )}
                {ProcessingFailureReasonStatusId.includes(campaignFileData.FileStatusId) && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    pb={2}
                    alignItems="center"
                    className={classes.TitleText}
                  >
                    <Box fontSize={16} width="40%">
                      {t('componentData.supplierCampaignFile.FailureReason')}
                      {': '}
                    </Box>
                    <Box fontSize={15} width="60%">
                      {campaignFileData.FailureReason || '--'}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          {/********2nd box *********/}
          <Grid item xs={6}>
            <Box className={classes.outerBox} bgcolor="white" height={1}>
              <Box
                fontSize={16}
                textAlign="left"
                color="primary"
                alignItems="left"
                pb={2}
                className={classes.BoxTitle}
              >
                {' '}
                {t('componentData.supplierCampaignFile.TotalRecords')}{' '}
              </Box>
              <Box p={2} alignItems="center">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  pb={2}
                  alignItems="center"
                  className={classes.TitleText}
                >
                  <Box fontSize={16} width="60%">
                    {' '}
                    {t('componentData.supplierCampaignFile.TotalNoOfRecords')}
                    {': '}
                  </Box>
                  <Box fontSize={16} width="40%">
                    {' '}
                    {campaignFileData.NoOfRecords || '--'}
                  </Box>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  pb={2}
                  alignItems="center"
                  className={classes.TitleText}
                >
                  <Box fontSize={16} width="60%">
                    {' '}
                    {t(
                      'componentData.supplierCampaignFile.NoOfProcessedRecords'
                    )}
                    {': '}
                  </Box>
                  <Box fontSize={15} width="40%">
                    {' '}
                    <u
                      className={classes.pointer}
                      onClick={() => {
                        this.props.history.push({
                          pathname: `${config.baseName}/suppliers/mySupplier`,
                          state:{
                            fileID: campaignFileData?.FileID ?? null
                          }
                        }                          
                        );
                      }}
                    >
                      {campaignFileData.ProcessedRecords || '--'}
                    </u>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  pb={2}
                  alignItems="center"
                  className={classes.TitleText}
                >
                  <Box fontSize={16} width="60%">
                    {' '}
                    {t('componentData.supplierCampaignFile.NoOfInvalidRecords')}
                    {': '}
                  </Box>
                  <Box fontSize={15} width="40%">
                    {' '}
                    {campaignFileData.NoOfExceptions || '--'}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withTranslation()(withStyles(styles)(PaymentFilesDetails));
