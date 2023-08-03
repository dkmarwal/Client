import React, { Component } from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import LoginScreen from './LoginScreen';
import PayeeVerificationScreen from './PayeeVerificationScreen';
import Registration from './Registration';
import PaymentPreference from './PaymentPreference';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DashboardScreen from './DashboardScreen/DashboardScreen';
import USBankDashboardScreen from './DashboardScreen/USBank';
import USBankPaymentPreference from './PaymentPreference/USBank';

class Templates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobileView: false,
      count: 1,
    };
  }
  toggleView = () => {
    this.setState({ isMobileView: !this.state.isMobileView });
  };

  prevPage = () => {
    const count = this.state.count;
    if (count === 1) {
      return true;
    }
    this.setState({ count: count - 1 });
  };

  nextPage = () => {
    const count = this.state.count;
    if (count > 4) {
      return true;
    }
    this.setState({ count: count + 1 });
  };
  copyURL = () => {
    const { consumerSlugURL } = this.props;
    navigator.clipboard.writeText(consumerSlugURL);
  };
  render() {
    const {
      classes,
      t,
      theme,
      logo,
      isPoweredBy,
      phoneNo,
      ext,
      clientName,
      consumerSlugURL,
      countryCode,
      isPhoneEnable,
      welcomeMessage,
      user,
      clientEmail,
      isShowEmail,
    } = this.props;
    const { count } = this.state;
    const { isPayeeChoicePortal } = user;

    return (
      <>
        <Box className={classes.templateBox}>
          <Box className={classes.header}>
            {count === 1 && (
              <Box className={classes.heading}>
                {t('componentData.UserLoginScreen.pageName')}
              </Box>
            )}
            {count === 2 && (
              <Box className={classes.heading}>
                {t('componentData.PayeeVerificationScreen.verificationView')}
              </Box>
            )}
            {count === 3 && (
              <Box className={classes.heading}>
                {t('componentData.PayeeVerificationScreen.registrationView')}
              </Box>
            )}
            {count === 4 && (
              <Box className={classes.heading}>
                {t('componentData.PayeeVerificationScreen.selectionView')}
              </Box>
            )}
            {count === 5 && (
              <Box className={classes.heading}>
                {t('componentData.PayeeVerificationScreen.dashboardView')}
              </Box>
            )}
            <Box className={classes.icons}>
              {!isPayeeChoicePortal ? (
                this.state.isMobileView ? (
                  <DesktopWindowsIcon onClick={this.toggleView} />
                ) : (
                  <PhoneAndroidIcon onClick={this.toggleView} />
                )
              ) : null}

              <NavigateBeforeIcon
                onClick={this.prevPage}
                fontSize='small'
                style={{ color: count === 1 ? '#808080' : '#000000' }}
              />
              <NavigateNextIcon
                onClick={this.nextPage}
                fontSize='small'
                style={{ color: count === 5 ? '#808080' : '#000000' }}
              />
            </Box>
          </Box>
          <Box mt={2} className={classes.urlHeader}>
            <Box
              className={classes.heading}
              style={{
                color: '#0B1941',
              }}
            >
              {consumerSlugURL}
            </Box>
            <Box justifyContent='end' style={{ cursor: 'pointer' }}>
              <img
                src={require('~/assets/icons/content_copy.svg')}
                alt='copy to clipboard'
                onClick={() => this.copyURL()}
              />
            </Box>
          </Box>
          {count === 1 && (
            <LoginScreen
              customTheme={theme}
              logo={logo}
              isMobileView={this.state.isMobileView}
              isPoweredBy={isPoweredBy}
              phoneNo={phoneNo}
              ext={ext}
              clientName={clientName}
              countryCode={countryCode}
              isPhoneEnable={isPhoneEnable}
              welcomeMessage={welcomeMessage}
              isPayeeChoicePortal={isPayeeChoicePortal}
              clientEmail={clientEmail}
              isShowEmail={isShowEmail}
            />
          )}
          {count === 2 && (
            <PayeeVerificationScreen
              customTheme={theme}
              logo={logo}
              isMobileView={this.state.isMobileView}
              isPoweredBy={isPoweredBy}
              phoneNo={phoneNo}
              ext={ext}
              clientName={clientName}
              countryCode={countryCode}
              isPhoneEnable={isPhoneEnable}
              isPayeeChoicePortal={isPayeeChoicePortal}
              clientEmail={clientEmail}
              isShowEmail={isShowEmail}
            />
          )}
          {count === 3 && (
            <Registration
              customTheme={theme}
              logo={logo}
              isMobileView={this.state.isMobileView}
              isPoweredBy={isPoweredBy}
              phoneNo={phoneNo}
              ext={ext}
              clientName={clientName}
              countryCode={countryCode}
              isPhoneEnable={isPhoneEnable}
              isPayeeChoicePortal={isPayeeChoicePortal}
              clientEmail={clientEmail}
              isShowEmail={isShowEmail}
            />
          )}
          {count === 4 ? (
            isPayeeChoicePortal ? (
              <USBankPaymentPreference
                customTheme={theme}
                logo={logo}
                isMobileView={this.state.isMobileView}
                isPoweredBy={isPoweredBy}
                phoneNo={phoneNo}
                ext={ext}
                countryCode={countryCode}
                clientName={clientName}
                isPhoneEnable={isPhoneEnable}
                isPayeeChoicePortal={isPayeeChoicePortal}
                clientEmail={clientEmail}
                isShowEmail={isShowEmail}
              />
            ) : (
              <PaymentPreference
                customTheme={theme}
                logo={logo}
                isMobileView={this.state.isMobileView}
                isPoweredBy={isPoweredBy}
                phoneNo={phoneNo}
                ext={ext}
                countryCode={countryCode}
                clientName={clientName}
                isPhoneEnable={isPhoneEnable}
                clientEmail={clientEmail}
                isShowEmail={isShowEmail}
              />
            )
          ) : null}
          {count === 5 ? (
            isPayeeChoicePortal ? (
              <USBankDashboardScreen
                customTheme={theme}
                logo={logo}
                isMobileView={this.state.isMobileView}
                isPoweredBy={isPoweredBy}
                phoneNo={phoneNo}
                ext={ext}
                clientName={clientName}
                countryCode={countryCode}
                isPhoneEnable={isPhoneEnable}
                isPayeeChoicePortal={isPayeeChoicePortal}
                clientEmail={clientEmail}
                isShowEmail={isShowEmail}
              />
            ) : (
              <DashboardScreen
                customTheme={theme}
                logo={logo}
                isMobileView={this.state.isMobileView}
                isPoweredBy={isPoweredBy}
                phoneNo={phoneNo}
                ext={ext}
                clientName={clientName}
                countryCode={countryCode}
                isPhoneEnable={isPhoneEnable}
                clientEmail={clientEmail}
                isShowEmail={isShowEmail}
              />
            )
          ) : null}
        </Box>
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(withStyles(styles)(Templates))
);
