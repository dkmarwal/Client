import React, { Component } from 'react';
import styles from './styles';
import verifyIcongreen from '~/assets/images/verifyIcongreen.png';
import guestIcongreen from '~/assets/images/guestIcongreen.png';
import selectIconblack from '~/assets/images/selectIconblack.png';
import lineGreen from '~/assets/images/lineGreen.png';
import zelleIcon from '~/assets/images/zelleUSBankIcon.png';
import prepaidCardIcon from '~/assets/images/prepaidCardIcon.png';
import bankIcon from '~/assets/images/achUSBankIcon.png';
import paperIcon from '~/assets/images/checkUSBankIcon.png';
import depositIcon from '~/assets/images/DepositToDebitCardIcon.png';
import rtpIcon from '~/assets/images/rtpIcon.png'
import Footer from '../../Footer';
import Header from '../../Header';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { Box, Grid, Typography } from '@material-ui/core';
import clsx from 'clsx';
class USBankPaymentPreference extends Component {
  render() {
    const {
      isMobileView,
      customTheme,
      theme,
      logo,
      classes,
      t,
      isPoweredBy,
      phoneNo,
      ext,
      countryCode,
      clientName,
      isPhoneEnable,
      isPayeeChoicePortal,
      clientEmail,
      isShowEmail
    } = this.props;

    return (
      <>
        <Box className={classes.mainContainer}>
          <Header isMobileView={isMobileView} logo={logo} isPayeeChoicePortal={isPayeeChoicePortal} clientName={clientName} />

          {/* heading & image section */}
          <Box
            style={{ background: customTheme.primaryBackground || '' }}
            className={clsx(classes.subContainer, {
              [classes.subContainerMobile]: isMobileView === true,
            })}
          >
            <Box
              className={clsx(classes.navSection, {
                [classes.navSectionMobile]: isMobileView === true,
              })}
            >
              <Box
                className={clsx(classes.paymentHeading, {
                  [classes.paymentHeadingMobile]: isMobileView === true,
                })}
              >
                <Box
                  component='span'
                  className={clsx(classes.headingText, {
                    [classes.headingTextMobile]: isMobileView === true,
                  })}
                >
                  {t('componentData.PayeeVerificationScreen.YourPaymentOf')}
                  <Box
                    component='span'
                    style={{ fontWeight: 'bold' }}
                    className={`${
                      isMobileView ? classes.emphasizeMobile : classes.emphasize
                    }`}
                  >
                    $6,200.00
                  </Box>{' '}
                  {t('componentData.PayeeVerificationScreen.from')}
                  <Box
                    component='span'
                    style={{ fontWeight: 'bold' }}
                    className={`${
                      isMobileView ? classes.emphasizeMobile : classes.emphasize
                    }`}
                  >
                    {clientName || ''}
                  </Box>
                  {t('componentData.PayeeVerificationScreen.isJust')} 1{' '}
                  {t('componentData.PayeeVerificationScreen.stepAway')}
                </Box>
              </Box>

              <Box
                className={clsx(classes.imageContainer, {
                  [classes.imageContainerMobile]: isMobileView === true,
                })}
              >
                <Box className={clsx(classes.payeeImages)}>
                  <img
                    src={verifyIcongreen}
                    alt='verify_image'
                    className={clsx(classes.payeeImage)}
                  />
                  <Box className={clsx(classes.payeeImagesLabel)}>
                    {t('componentData.PayeeVerificationScreen.VerifyYourself')}
                  </Box>
                </Box>
                <Box
                  style={{ width: '2%', marginTop: '40px' }}
                  className={clsx(classes.payeeImages)}
                >
                  <img
                    src={lineGreen}
                    alt='line_image'
                    className={clsx(classes.payeeLine)}
                  />
                </Box>
                <Box className={clsx(classes.payeeImages)}>
                  <img
                    src={guestIcongreen}
                    alt='guest_image'
                    className={clsx(classes.payeeImage)}
                  />
                  <Box className={clsx(classes.payeeImagesLabel)}>
                    {t('componentData.PayeeVerificationScreen.Register')}
                  </Box>
                </Box>
                <Box
                  style={{ width: '2%', marginTop: '40px' }}
                  className={clsx(classes.payeeImages)}
                >
                  <img
                    src={lineGreen}
                    alt='line_image'
                    className={clsx(classes.payeeLine)}
                  />
                </Box>
                <Box className={clsx(classes.payeeImages)}>
                  <img
                    src={selectIconblack}
                    alt='select_image'
                    className={clsx(classes.payeeImage)}
                  />
                  <Box
                    className={clsx(classes.payeeImagesLabel)}
                    style={{ color: '#333333' }}
                  >
                    {t('componentData.PayeeVerificationScreen.SelectPayment')}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* form section */}
            <Box
              className={clsx(classes.midContainer, {
                [classes.midContainerMobile]: isMobileView === true,
              })}
              mx='auto'
              px={7}
              pb={3}
              style={{ marginTop: '25px' }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box mt={2}>
                    <Typography className={clsx(classes.midHeadingText)} mt={3}>
                      {t('componentData.PayeeVerificationScreen.HowWouldYou')}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={isMobileView ? 12 : 4}>
                  <Box className={clsx(classes.tagContainer)}>
                    <Box
                      className={clsx(classes.tag)}
                      pl={0.4}
                      style={{ background: customTheme.accentColor || '' }}
                    >
                      <Typography
                        style={{
                          color: theme.palette.getContrastText(
                            customTheme.accentColor
                              ? customTheme.accentColor
                              : '#FFFFFF'
                          ),
                        }}
                        className={clsx(classes.tagText)}
                        mt={3}
                      >
                        {t('componentData.PayeeVerificationScreen.LessThan')}
                      </Typography>
                    </Box>
                    <Box
                      className={clsx(classes.skew)}
                      style={{ background: customTheme.accentColor || '' }}
                    ></Box>
                  </Box>
                  <Box variant='outlined' className={classes.paper}>
                    <Box>
                      <img
                        className={clsx(classes.midContainerImg)}
                        src={zelleIcon}
                        alt='mid_image'
                      />
                      <Box
                        component='span'
                        className={clsx(classes.midContainerImgText)}
                      >
                        {t('componentData.PayeeVerificationScreen.ZELLE')}
                      </Box>
                    </Box>
                    <Box
                      ml={1}
                      mt={1.25}
                      className={clsx(classes.midPaymetText)}
                      style={{ height: isMobileView ? '45px' : '80px' }}
                    >
                      {t(
                        'componentData.PayeeVerificationScreen.UtillizingZelle'
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={isMobileView ? 12 : 4}>
                  <Box className={clsx(classes.tagContainer)}>
                    <Box
                      className={clsx(classes.tag)}
                      pl={0.4}
                      style={{ background: customTheme.accentColor || '' }}
                    >
                      <Typography
                        style={{
                          color: theme.palette.getContrastText(
                            customTheme.accentColor
                              ? customTheme.accentColor
                              : '#FFFFFF'
                          ),
                        }}
                        className={clsx(classes.tagText)}
                        mt={3}
                      >
                        {t('componentData.PayeeVerificationScreen.3Business')}
                      </Typography>
                    </Box>
                    <Box
                      className={clsx(classes.skew)}
                      style={{ background: customTheme.accentColor || '' }}
                    ></Box>
                  </Box>
                  <Box variant='outlined' className={classes.paper}>
                    <Box>
                      <img
                        className={clsx(classes.midContainerImg)}
                        src={prepaidCardIcon}
                        alt='prepaidCard_image'
                      />
                      <Box
                        component='span'
                        className={clsx(classes.midContainerImgText)}
                      >
                        {t('componentData.PayeeVerificationScreen.PrepaidCard')}
                      </Box>
                    </Box>
                    <Box
                      ml={1}
                      mt={1.25}
                      style={{ height: isMobileView ? '45px' : '80px' }}
                      className={clsx(classes.midPaymetText)}
                    >
                      {t(
                        'componentData.PayeeVerificationScreen.UtilizingPrepaidCard'
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={isMobileView ? 12 : 4}>
                  <Box className={clsx(classes.tagContainer)}>
                    <Box
                      className={clsx(classes.tag)}
                      pl={0.4}
                      style={{ background: customTheme.accentColor || '' }}
                    >
                      <Typography
                        style={{
                          color: theme.palette.getContrastText(
                            customTheme.accentColor
                              ? customTheme.accentColor
                              : '#FFFFFF'
                          ),
                        }}
                        className={clsx(classes.tagText)}
                        mt={3}
                      >
                        {t('componentData.PayeeVerificationScreen.LessThan')}
                      </Typography>
                    </Box>
                    <Box
                      className={clsx(classes.skew)}
                      style={{ background: customTheme.accentColor || '' }}
                    ></Box>
                  </Box>
                  <Box variant='outlined' className={classes.paper}>
                    <Box style={{display:'flex',paddingTop:'4px'}}>
                    <Box>
                      <img
                        className={clsx(classes.debitCardImg)}
                        src={depositIcon}
                        alt='deposit_image'
                      />
                      </Box>
                      <Box
                        // component='span'
                        className={clsx(classes.midContainerImgText)}
                      >
                        {t(
                          'componentData.PayeeVerificationScreen.DepositToDebitCard'
                        )}
                      </Box>
                    </Box>
                    <Box
                      ml={1}
                      mt={1.25}
                      style={{ height: isMobileView ? '45px' : '80px' }}
                      className={clsx(classes.midPaymetText)}
                    >
                      {t(
                        'componentData.PayeeVerificationScreen.UtilizingDepositToDebitCard'
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className={clsx(classes.tagContainer)}>
                    <Box
                      className={clsx(classes.tag)}
                      style={{
                        width: isMobileView ? '73%' : '24%',
                        background: customTheme.accentColor || '',
                      }}
                      pl={0.4}
                    >
                      <Typography
                        style={{
                          color: theme.palette.getContrastText(
                            customTheme.accentColor
                              ? customTheme.accentColor
                              : '#FFFFFF'
                          ),
                        }}
                        className={clsx(classes.tagText)}
                        mt={3}
                      >
                        {t('componentData.PayeeVerificationScreen.3Business')}
                      </Typography>
                    </Box>
                    <Box
                      className={clsx(classes.skew, classes.skewSec, {
                        [classes.skewSecMobile]: isMobileView === true,
                      })}
                      style={{ background: customTheme.accentColor || '' }}
                    ></Box>
                  </Box>
                  <Box variant='outlined' className={classes.paper}>
                    <Box className={clsx(classes.midBoxWrapper)}>
                      <Box component='span'>
                        <img
                          className={clsx(classes.midContainerImgSec)}
                          src={bankIcon}
                          alt='bank_image'
                        />
                      </Box>
                      <Box component='span' style={{margin:'auto 0'}}>
                        <Box className={clsx(classes.midContainerImgText)}>
                          {t(
                            'componentData.PayeeVerificationScreen.ACH'
                          )}
                        </Box>
                        <Box
                          className={clsx(classes.midPaymetTextSec)}
                          pb={isMobileView ? 2.5 : 0}
                        >
                          {t(
                            'componentData.PayeeVerificationScreen.UtillizingBank'
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className={clsx(classes.tagContainer)}>
                    <Box
                      className={clsx(classes.tag)}
                      style={{
                        width: isMobileView ? '73%' : '24%',
                        background: customTheme.accentColor || '',
                      }}
                      pl={0.4}
                    >
                      <Typography
                        style={{
                          color: theme.palette.getContrastText(
                            customTheme.accentColor
                              ? customTheme.accentColor
                              : '#FFFFFF'
                          ),
                        }}
                        className={clsx(classes.tagText)}
                        mt={3}
                      >
                        {t('componentData.PayeeVerificationScreen.LessThan')}
                      </Typography>
                    </Box>
                    <Box
                      className={clsx(classes.skew, classes.skewSec, {
                        [classes.skewSecMobile]: isMobileView === true,
                      })}
                      style={{ background: customTheme.accentColor || '' }}
                    ></Box>
                  </Box>
                  <Box variant='outlined' className={classes.paper}>
                    <Box className={clsx(classes.midBoxWrapper)}>
                      <Box component='span'>
                        <img
                          className={clsx(classes.midContainerImgSec)}
                          src={rtpIcon}
                          alt='rtp_image'
                        />
                      </Box>
                      <Box component='span' style={{margin:'auto 0'}}>
                        <Box className={clsx(classes.midContainerImgText)}>
                          {t(
                            'componentData.PayeeVerificationScreen.RTP'
                          )}
                        </Box>
                        <Box
                          className={clsx(classes.midPaymetTextSec)}
                          pb={isMobileView ? 2.5 : 0}
                        >
                          {t(
                            'componentData.PayeeVerificationScreen.UtilizingRTP'
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className={clsx(classes.tagContainer)}>
                    <Box
                      className={clsx(classes.tag)}
                      style={{
                        width: isMobileView ? '73%' : '24%',
                        background: customTheme.accentColor || '',
                      }}
                      pl={0.4}
                    >
                      <Typography
                        style={{
                          color: theme.palette.getContrastText(
                            customTheme.accentColor
                              ? customTheme.accentColor
                              : '#FFFFFF'
                          ),
                        }}
                        className={clsx(classes.tagText)}
                        mt={3}
                      >
                        {t('componentData.PayeeVerificationScreen.10Business')}
                      </Typography>
                    </Box>
                    <Box
                      className={clsx(classes.skew, classes.skewSec, {
                        [classes.skewSecMobile]: isMobileView === true,
                      })}
                      style={{ background: customTheme.accentColor || '' }}
                    ></Box>
                  </Box>
                  <Box variant='outlined' className={classes.paper}>
                    <Box className={clsx(classes.midBoxWrapper)}>
                      <Box component='span'>
                        <img
                          className={clsx(classes.midContainerImgSec)}
                          src={paperIcon}
                          alt='paper_image'
                        />
                      </Box>
                      <Box component='span' style={{margin:'auto 0'}}>
                        <Box className={clsx(classes.midContainerImgText)}>
                          {t(
                            'componentData.PayeeVerificationScreen.PAPERCHECK'
                          )}
                        </Box>
                        <Box
                          className={clsx(classes.midPaymetTextSec)}
                          pb={isMobileView ? 2.5 : 0}
                        >
                          {t(
                            'componentData.PayeeVerificationScreen.UtilizingMailing'
                          )}
                          &emsp;&emsp;&emsp;
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
          {/* footer section */}
          <Footer
            isMobileView={isMobileView}
            isPoweredBy={isPoweredBy}
            phoneNo={phoneNo}
            ext={ext}
            countryCode={countryCode}
            isPhoneEnable={isPhoneEnable}
            isPayeeChoicePortal={isPayeeChoicePortal}
            clientEmail={clientEmail}
            isShowEmail={isShowEmail}
            logo={logo}
            clientName={clientName}
          />
        </Box>
      </>
    );
  }
}
export default withTranslation()(
  withStyles(styles, { withTheme: true })(USBankPaymentPreference)
);
