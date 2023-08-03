import React, { Component } from 'react';
import styles from './styles';
import prepaidCardImg from '~/assets/images/prepaidCardImg.png';
import star from '~/assets/images/star.png';
import edit from '~/assets/images/edit.png';
import checkImg from '~/assets/images/checkUSBankImg.png';
import filterImg from '~/assets/images/filterImg.png';
import downloadPdf from '~/assets/images/downloadPdf.png';
import dividerImg from '~/assets/images/dividerImg.png';
import smallStar from '~/assets/images/smallStar.png';
import smallCheck from '~/assets/images/smallCheck.png';
import smallACH from '~/assets/images/smallAchUSBank.png';
import smallPrepaid from '~/assets/images/smallPrepaid.png';
import smallinfo from '~/assets/images/smallinfo.png';
import emptyStar from '~/assets/images/emptyStar.png';
import fullStar from '~/assets/images/fullStar.png';
import halfStar from '~/assets/images/halfStar.png';
import starHalf from '~/assets/images/starHalf.png';
import downArrow from '~/assets/images/downArrow.png';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Footer from '../../Footer';
import Header from '../../Header';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { Box, Grid } from '@material-ui/core';
import clsx from 'clsx';

class USBankDashboardScreen extends Component {

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
      isPhoneEnable,
      isPayeeChoicePortal,
      clientName,
      clientEmail,
      isShowEmail
    } = this.props;

    return (
      <>
        {/* Header */}
        <Box className={classes.mainContainer}>
          <Header isMobileView={isMobileView} logo={logo} isPayeeChoicePortal={isPayeeChoicePortal} clientName={clientName} />

          <Box
            style={{ background: customTheme.primaryBackground || '' }}
            className={clsx(classes.subContainerD, {
              [classes.subContainerMobileD]: isMobileView === true,
            })}
          >
            <Grid container xs={12} spacing={0}>
              <Grid item xs={12} style={{ marginBottom: '-40px' }}>
                <Box
                  className={clsx(classes.notificationBar, {
                    [classes.notificationBarMobile]: isMobileView === true,
                  })}
                  style={{ background: customTheme.primaryColor || '' }}
                >
                  <Box
                    className={clsx(classes.notificationBarText)}
                    style={{
                      color: theme.palette.getContrastText(
                        customTheme.primaryColor
                          ? customTheme.primaryColor
                          : '#FFFFFF'
                      ),
                    }}
                  > 
                    <Box component='span' style={{ fontWeight: 'bold' }}>
                      {t('componentData.PayeeVerificationScreen.4Payments')}
                    </Box>{' '}
                    {t('componentData.PayeeVerificationScreen.process')}
                  </Box>
                  <Box className={clsx(classes.notificationBarButton)}>
                    {t('componentData.PayeeVerificationScreen.VERIFY')}
                  </Box>
                </Box>

                {!isMobileView && (
                  <Box
                    style={{ background: customTheme.accentColor || '' }}
                    className={clsx(classes.arc)}
                  ></Box>
                )}
                <Grid
                  container
                  item
                  xs={12}
                  spacing={2}
                  className={clsx(classes.boxContainer)}
                >
                  {!isMobileView && (
                    <>
                      <Grid item xs={10}>
                        <Box className={clsx(classes.firstBox)}>
                          <Box className={clsx(classes.boxHeading)} p={1}>
                            <Box className={clsx(classes.payPalimageBox)}>
                              <img
                                src={prepaidCardImg}
                                alt='PrepaidCardImage'
                                className={clsx(classes.payPalimage)}
                              />
                              <img
                                src={star}
                                alt='StarImage'
                                className={clsx(classes.starimage)}
                              />
                              <Box className={clsx(classes.headingText)}>
                                {t(
                                  'componentData.PayeeVerificationScreen.PrimaryPaymentMethod'
                                )}
                              </Box>
                            </Box>
                            <Box className={clsx(classes.headingTextBox)}>
                              <img
                                src={edit}
                                alt='EditImage'
                                className={clsx(classes.editimage)}
                              />
                            </Box>
                          </Box>

                          <Box className={clsx(classes.boxData)} p={1}>
                            <Grid
                              container
                              item
                              xs={12}
                              className={clsx(classes.boxDataContainer)}
                              spacing={1}
                            >
                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.Address'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  123, Hide Park, Street
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.Country'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  United State
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.ZipCode'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  10328
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.State'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  Chicago
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.City'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  Illinois
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.DOB'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  10/02/1997
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.SSN'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  123457982
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.PhoneNumber'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  12345-56789x
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.uniqueId'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  Illinois
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                      </Grid>

                      {/* <Grid item xs={5}>
                        <Box className={clsx(classes.secondBox)}>
                          <Box className={clsx(classes.boxHeading)} p={1}>
                            <Box className={clsx(classes.payPalimageBox)}>
                              <img
                                src={checkImg}
                                alt='check'
                                className={clsx(classes.payPalimage)}
                              />
                              <img
                                src={starHalf}
                                alt='star_image'
                                className={clsx(classes.starimage)}
                              />
                              <Box className={clsx(classes.headingText)}>
                                {t(
                                  'componentData.PayeeVerificationScreen.SecondaryPaymentMethod'
                                )}
                              </Box>
                            </Box>
                            <Box className={clsx(classes.headingTextBox)}>
                              <img
                                src={edit}
                                alt='edit_image'
                                className={clsx(classes.editimage)}
                              />
                            </Box>
                          </Box>

                          <Box className={clsx(classes.boxData)} p={1}>
                            <Grid
                              container
                              item
                              xs={12}
                              className={clsx(classes.boxDataContainer)}
                              spacing={1}
                            >
                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.Address'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  123, Hyde Park, Baker Street
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.Country'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  United State
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.ZipCode'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  10328
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.State'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  Chicago
                                </Box>
                              </Grid>

                              <Grid item xs={6}>
                                <Box
                                  className={clsx(classes.boxDataHeadingText)}
                                >
                                  {t(
                                    'componentData.PayeeVerificationScreen.City'
                                  )}
                                </Box>
                                <Box className={clsx(classes.boxDataText)}>
                                  Illinois
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                      </Grid> */}
                    </>
                  )}
                </Grid>
              </Grid>

              {isMobileView && (
                <Grid
                  item
                  xs={12}
                  className={clsx(classes.mobileAccordianCont)}
                  style={{ marginTop: '60px' }}
                >
                  <Box className={clsx(classes.mobileAccordian)} p={1}>
                    <Box className={clsx(classes.mobileAccordianText)}>
                      <img src={star} alt='star_image' />
                      {t(
                        'componentData.PayeeVerificationScreen.PrimaryPaymentMethod'
                      )}
                    </Box>
                    <Box className={clsx(classes.mobileAccordianText)}>
                      <img src={downArrow} alt='down_image' />
                    </Box>
                  </Box>
                  <Box className={clsx(classes.mobileAccordian)} p={1}>
                    <Box className={clsx(classes.mobileAccordianText)}>
                      <img src={star} alt='star_image' />
                      {t(
                        'componentData.PayeeVerificationScreen.SecondaryPaymentMethod'
                      )}
                    </Box>
                    <Box className={clsx(classes.mobileAccordianText)}>
                      <img src={downArrow} alt='down_image' />
                    </Box>
                  </Box>
                </Grid>
              )}

              {/* Table Section */}
              <Box
                className={clsx(classes.paymentHistoryContainer)}
                style={{ width: isMobileView ? '90%' : '' }}
              >
                <Grid
                  container
                  item
                  xs={12}
                  spacing={1}
                  style={{ marginLeft: '8px' }}
                >
                  <Grid item xs={12} spacing={1}>
                    <Box className={clsx(classes.paymentHistoryHeader)} p={1}>
                      <Box className={clsx(classes.paymentHistoryText)}>
                        {t(
                          'componentData.PayeeVerificationScreen.PAYMENTHISTORY'
                        )}
                      </Box>
                      <Box className={clsx(classes.imageGroup)}>
                        <img src={downloadPdf} alt='down_image' />
                        {t('componentData.PayeeVerificationScreen.PDF')}
                        <img src={dividerImg} alt='divider_image' />
                        <img src={filterImg} alt='filter_image' />
                        {t('componentData.PayeeVerificationScreen.FILTER')}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid
                    container
                    item
                    xs={12}
                    spacing={2}
                    className={clsx(classes.tableContainer)}
                  >
                    <Grid
                      container
                      item
                      xs={12}
                      className={clsx(classes.tableRow)}
                    >
                      {!isMobileView && (
                        <Grid item xs={2}>
                          <Box className={clsx(classes.tableHeaderText)}>
                            {t(
                              'componentData.PayeeVerificationScreen.PAYMENTID'
                            )}
                          </Box>
                        </Grid>
                      )}
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box className={clsx(classes.tableHeaderText)}>
                          {t('componentData.PayeeVerificationScreen.DATE')}
                        </Box>
                      </Grid>
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box className={clsx(classes.tableHeaderText)}>
                          {t('componentData.PayeeVerificationScreen.STATUS')}
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        <Box
                          className={clsx(classes.tableHeaderText)}
                          style={{ textAlign: 'center' }}
                        >
                          {t('componentData.PayeeVerificationScreen.AMOUNT')}
                        </Box>
                      </Grid>
                      {!isMobileView && (
                        <Grid item xs={3}>
                          <Box className={clsx(classes.tableHeaderText)}>
                            {t(
                              'componentData.PayeeVerificationScreen.PAYMENTMETHOD'
                            )}
                          </Box>
                        </Grid>
                      )}
                      {isMobileView && (
                        <Grid item xs={isMobileView ? 3 : 2}>
                          <Box className={clsx(classes.tableHeaderText)}>
                            {t('componentData.PayeeVerificationScreen.PAYMENT')}
                          </Box>
                        </Grid>
                      )}
                      {!isMobileView && (
                        <Grid item xs={isMobileView ? 2 : 1}>
                          <Box className={clsx(classes.tableHeaderText)}>
                            {t('componentData.PayeeVerificationScreen.NOTES')}
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    <Grid
                      container
                      item
                      xs={12}
                      className={clsx(classes.tableRow)}
                    >
                      {!isMobileView && (
                        <Grid item xs={2}>
                          <Box
                            style={{
                              color: '#008CE6',
                              textDecoration: 'underline',
                            }}
                            className={clsx(classes.tableDataText)}
                          >
                            1034008
                          </Box>
                        </Grid>
                      )}
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box
                          style={{ color: isMobileView ? '#219653' : '' }}
                          className={clsx(classes.tableDataText)}
                        >
                          05/28/2021
                        </Box>
                      </Grid>
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box
                          style={{ color: '#219653' }}
                          className={clsx(classes.tableDataText)}
                        >
                          <Box
                            style={{ width: isMobileView ? '100%' : '65px' }}
                          >
                            {t(
                              'componentData.PayeeVerificationScreen.Confirmed'
                            )}
                          </Box>
                          {!isMobileView && (
                            <img
                              src={smallinfo}
                              alt='info_image'
                              width='12%'
                              height='auto'
                            />
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        <Box
                          className={clsx(classes.tableDataText)}
                          flexDirection='column'
                        >
                          $140.00
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box className={clsx(classes.tableDataText)}>
                          <img
                            src={starHalf}
                            alt='halfstar_image'
                            className={clsx(classes.payImg)}
                          />
                          <img
                            src={smallACH}
                            alt='ACH_image'
                            className={clsx(classes.payImg)}
                          />
                          {!isMobileView && 'Bank Account'}
                        </Box>
                      </Grid>
                      {!isMobileView && (
                        <Grid item xs={isMobileView ? 2 : 1}>
                          <Box className={clsx(classes.tableDataText)}>
                            {t('componentData.PayeeVerificationScreen.Reason')}
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    <Grid
                      container
                      item
                      xs={12}
                      className={clsx(classes.tableRow)}
                    >
                      {!isMobileView && (
                        <Grid item xs={2}>
                          <Box
                            style={{
                              color: '#008CE6',
                              textDecoration: 'underline',
                            }}
                            className={clsx(classes.tableDataText)}
                          >
                            1034008
                          </Box>
                        </Grid>
                      )}
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box
                          style={{ color: isMobileView ? '#ED8853' : '' }}
                          className={clsx(classes.tableDataText)}
                        >
                          05/08/2021
                        </Box>
                      </Grid>
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box
                          style={{ color: '#ED8853' }}
                          className={clsx(classes.tableDataText)}
                        >
                          <Box
                            style={{ width: isMobileView ? '100%' : '65px' }}
                          >
                            {t(
                              'componentData.PayeeVerificationScreen.Processed'
                            )}
                          </Box>
                          {!isMobileView && (
                            <img
                              src={smallinfo}
                              alt='info_image'
                              width='12%'
                              height='auto'
                            />
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        <Box
                          className={clsx(classes.tableDataText)}
                          flexDirection='column'
                        >
                          $200.00
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box className={clsx(classes.tableDataText)}>
                          <img
                            src={fullStar}
                            alt='star_image'
                            className={clsx(classes.payImg)}
                          />
                          <img
                            src={smallPrepaid}
                            alt='prepaid_image'
                            className={clsx(classes.payImg)}
                          />
                          {!isMobileView &&
                            t('componentData.PayeeVerificationScreen.Prepaid')}
                        </Box>
                      </Grid>
                      {!isMobileView && (
                        <Grid item xs={isMobileView ? 2 : 1}>
                          <Box className={clsx(classes.tableDataText)}>
                            {t('componentData.PayeeVerificationScreen.Reason')}
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    <Grid
                      container
                      item
                      xs={12}
                      className={clsx(classes.tableRow)}
                    >
                      {!isMobileView && (
                        <Grid item xs={2}>
                          <Box
                            style={{
                              color: '#008CE6',
                              textDecoration: 'underline',
                            }}
                            className={clsx(classes.tableDataText)}
                          >
                            1034008
                          </Box>
                        </Grid>
                      )}
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box
                          style={{ color: isMobileView ? '#008CE6' : '' }}
                          className={clsx(classes.tableDataText)}
                        >
                          05/08/2021
                        </Box>
                      </Grid>
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box
                          style={{ color: '#ED8853' }}
                          className={clsx(classes.tableDataText)}
                        >
                          <Box
                            style={{ width: isMobileView ? '100%' : '65px' }}
                          >
                            {t(
                              'componentData.PayeeVerificationScreen.Processed'
                            )}
                          </Box>
                          {!isMobileView && (
                            <img
                              src={smallinfo}
                              alt='infor_image'
                              width='12%'
                              height='auto'
                            />
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        <Box
                          className={clsx(classes.tableDataText)}
                          flexDirection='column'
                        >
                          $1322.00
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box className={clsx(classes.tableDataText)}>
                          <img
                            src={smallStar}
                            alt='star_image'
                            className={clsx(classes.payImg)}
                          />
                          <img
                            src={smallACH}
                            alt='ACH_image'
                            className={clsx(classes.payImg)}
                          />
                          {!isMobileView && 'Bank Account'}
                        </Box>
                      </Grid>
                      {!isMobileView && (
                        <Grid item xs={isMobileView ? 2 : 1}>
                          <Box className={clsx(classes.tableDataText)}>
                            {t('componentData.PayeeVerificationScreen.Reason')}
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    <Grid
                      container
                      item
                      xs={12}
                      className={clsx(classes.tableRow)}
                    >
                      {!isMobileView && (
                        <Grid item xs={2}>
                          <Box
                            style={{
                              color: '#008CE6',
                              textDecoration: 'underline',
                            }}
                            className={clsx(classes.tableDataText)}
                          >
                            1034008
                          </Box>
                        </Grid>
                      )}
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box
                          style={{ color: isMobileView ? '#008CE6' : '' }}
                          className={clsx(classes.tableDataText)}
                        >
                          05/08/2021
                        </Box>
                      </Grid>
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box
                          style={{ color: '#008CE6' }}
                          className={clsx(classes.tableDataText)}
                        >
                          <Box
                            style={{ width: isMobileView ? '100%' : '65px' }}
                          >
                            {t(
                              'componentData.PayeeVerificationScreen.Initiated'
                            )}
                          </Box>
                          {!isMobileView && (
                            <img
                              src={smallinfo}
                              alt='info_image'
                              width='12%'
                              height='auto'
                            />
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        <Box
                          className={clsx(classes.tableDataText)}
                          flexDirection='column'
                        >
                          $890.00
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box className={clsx(classes.tableDataText)}>
                          <img
                            src={fullStar}
                            alt='fullStar_image'
                            className={clsx(classes.payImg)}
                          />
                          <img
                            src={smallCheck}
                            alt='smallCheckImage'
                            className={clsx(classes.payImg)}
                          />
                          {!isMobileView &&
                            t(
                              'componentData.PayeeVerificationScreen.PaperCheck'
                            )}
                        </Box>
                      </Grid>
                      {!isMobileView && (
                        <Grid item xs={isMobileView ? 2 : 1}>
                          <Box className={clsx(classes.tableDataText)}>
                            {t('componentData.PayeeVerificationScreen.Reason')}
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    <Grid
                      container
                      item
                      xs={12}
                      className={clsx(classes.tableRow)}
                    >
                      {!isMobileView && (
                        <Grid item xs={2}>
                          <Box
                            style={{
                              color: '#008CE6',
                              textDecoration: 'underline',
                            }}
                            className={clsx(classes.tableDataText)}
                          >
                            1034008
                          </Box>
                        </Grid>
                      )}
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box
                          style={{ color: isMobileView ? '#008CE6' : '' }}
                          className={clsx(classes.tableDataText)}
                        >
                          05/08/2021
                        </Box>
                      </Grid>
                      <Grid item xs={isMobileView ? 3 : 2}>
                        <Box
                          style={{ color: '#27AE60' }}
                          className={clsx(classes.tableDataText)}
                        >
                          <Box
                            style={{ width: isMobileView ? '100%' : '65px' }}
                          >
                            {t(
                              'componentData.PayeeVerificationScreen.Confirmed'
                            )}
                          </Box>
                          {!isMobileView && (
                            <img
                              src={smallinfo}
                              alt='info_image'
                              width='12%'
                              height='auto'
                            />
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        <Box
                          className={clsx(classes.tableDataText)}
                          flexDirection='column'
                        >
                          $890.00
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box className={clsx(classes.tableDataText)}>
                          <img
                            src={fullStar}
                            alt='fullStar_image'
                            className={clsx(classes.payImg)}
                          />
                          <img
                            src={smallCheck}
                            alt='small_Check_image'
                            className={clsx(classes.payImg)}
                          />
                          {!isMobileView && 'Check'}
                        </Box>
                      </Grid>
                      {!isMobileView && (
                        <Grid item xs={isMobileView ? 2 : 1}>
                          <Box className={clsx(classes.tableDataText)}>
                            {t('componentData.PayeeVerificationScreen.Reason')}
                          </Box>
                        </Grid>
                      )}
                    </Grid>


                    <Grid
                      container
                      item
                      xs={12}
                      alignItems='center'
                      className={clsx(classes.tableRow)}
                      flexDirection='column'
                    >
                      <Box
                        className={clsx(classes.detailsTextContainer, {
                          [classes.detailsTextContainerMobile]:
                            isMobileView === true,
                        })}
                      >
                        <Box
                          className={clsx(classes.detailsTextFlex, {
                            [classes.detailsTextFlexMob]: isMobileView === true,
                          })}
                        >
                          <Box className={clsx(classes.detailsText)} mr={2}>
                            <img
                              src={fullStar}
                              alt='fullStar_image'
                              className={clsx(classes.payImg)}
                            />
                            {t('componentData.PayeeVerificationScreen.Primary')}
                          </Box>
                          <Box className={clsx(classes.detailsText)} mr={2}>
                            <img
                              src={halfStar}
                              alt='halfStar_image'
                              className={clsx(classes.payImg)}
                            />
                            {t(
                              'componentData.PayeeVerificationScreen.Alternate'
                            )}
                          </Box>
                          <Box className={clsx(classes.detailsText)} mr={2}>
                            <img
                              src={emptyStar}
                              alt='emptyStar_image'
                              className={clsx(classes.payImg)}
                            />
                            {t('componentData.PayeeVerificationScreen.Default')}
                          </Box>
                        </Box>
                        <Box
                          className={clsx(classes.detailsTextFlex, {
                            [classes.detailsTextFlexMobLast]:
                              isMobileView === true,
                          })}
                        >
                          <Box className={clsx(classes.detailsText)}>
                            {t(
                              'componentData.PayeeVerificationScreen.RowsPerPage'
                            )}{' '}
                            5&emsp; &emsp; 1 of 1&emsp;
                          </Box>
                          <Box className={clsx(classes.detailsText)}>
                            <NavigateBeforeIcon
                              style={{
                                color: '#4C4C4C',
                                fontSize: '15',
                              }}
                            />
                            <NavigateNextIcon
                              style={{
                                color: '#4C4C4C',
                                fontSize: '15',
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Box>

          {/* footer */}
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
  withStyles(styles, { withTheme: true })(USBankDashboardScreen)
);
