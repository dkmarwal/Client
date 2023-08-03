import React, { Component } from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/styles';
import { Grid, CircularProgress, Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import {
  saveUserThemeData,
  fetchBrandingData,
} from '~/redux/helpers/B2C/branding';

import { withTranslation } from 'react-i18next';
import SideBar from './SideBar';
import Templates from './Templates';
import Notification from '~/components/Notification';
import { accessRights } from '~/config/accessRights';

class UserTheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brandingData: null,
      notificationMSg: null,
      notificationVariant: null,
      userTheme: {
        primaryColor: null,
        accentColor: null,
        primaryBackground: null,
      },
      logo: null,
      phone: null,
      clientEmail: null,
      fromEmail: null,
      themes: null,
      selectedThemeID: null,
      isPoweredBy: 0,
      slugURL: null,
      welcomeMessage: null,
      validation: {},
      isUploadning: false,
      phoneExt: null,
      phoneCountryCode: null,
      isPhoneEnable: null,
      fromEmailDisplayName: null,
      isShowEmail: null,
    };
  }

  componentDidMount() {
    this.fetchBrandingData();
  }

  fetchBrandingData = () => {
    const clientId = this.props.user.userData.portalProfileId;
    const appType = this.props.user.userData.appType;
    fetchBrandingData(clientId, appType).then((response) => {
      if (!response.error) {
        this.setState({
          brandingData: response.data || null,
        });
      } else {
        this.setState({
          notificationMSg: response.message,
          notificationVariant: 'error',
        });
      }
    });
  };

  getUserThemeData = (data) => {
    if (Boolean(data)) {
      this.setState({
        ...this.state,
        userTheme: {
          primaryColor:
            data?.themes[data.themeIndex]?.themeColorPrimary || null,
          accentColor: data?.themes[data.themeIndex]?.themeColorAccent || null,
          primaryBackground:
            data?.themes[data.themeIndex]?.themeColorBackground || null,
        },
        logo: data.logo || null,
        themes: data.themes || null,
        phone: data.phone || null,
        phoneExt: data.phoneExt || null,
        clientEmail: data.clientEmail || null,
        fromEmail: data.fromEmail || null,
        slugURL: data.slugUrl || null,
        welcomeMessage: data.welcomeMessage || null,
        isPoweredBy: data.isPoweredBy || 0,
        selectedThemeID: data.selectedThemeID || null,
        phoneCountryCode: data.phoneCountryCode || null,
        isPhoneEnable: data.isPhoneEnable,
        fromEmailDisplayName: data.senderDisplayName || '',
        isShowEmail: data.isShowEmail,
      });
    }
  };

  saveThemeData = () => {
    const {
      logo,
      phone,
      clientEmail,
      fromEmail,
      isPoweredBy,
      slugURL,
      themes,
      phoneExt,
      phoneCountryCode,
      isPhoneEnable,
      fromEmailDisplayName,
      welcomeMessage,
      isShowEmail
    } = this.state;

    const payload = {
      checkStatus: isPoweredBy || null,
      consumerSlugUrl: slugURL || null,
      fromEmail: fromEmail || null,
      logo: logo || null,
      supportEmail: clientEmail || null,
      supportPhone: phone || null,
      themes: themes,
      loginWelcomeMsg: welcomeMessage || null,
      phoneExt: phoneExt || null,
      countryCode: phoneCountryCode || null,
      showPhoneNumber: isPhoneEnable,
      fromEmailDisplayName: fromEmailDisplayName || '',
      isShowEmail:isShowEmail
    };

    const isErr = this.formValidation();
    if (isErr) {
      this.setState({
        notificationMSg: this.props.t('componentData.themes.ValidationError'),
        notificationVariant: 'error',
      });
    } else {
      this.setState(
        {
          isUploadning: true,
        },
        () => {
          saveUserThemeData(payload).then((response) => {
            if (!response.error) {
              this.setState({
                notificationMSg: response.message,
                notificationVariant: 'success',
                isUploadning: false,
              });
              this.fetchBrandingData();
            } else {
              this.setState({
                notificationMSg: response.message,
                notificationVariant: 'error',
                isUploadning: false,
              });
            }
          });
        }
      );
    }
  };

  formValidation = () => {
    const {
      logo,
      phone,
      clientEmail,
      fromEmail,
      slugURL,
      brandingData,
      welcomeMessage,
    } = this.state;

    const { user } = this.props;
    const bankParentProfileId = user.userData.activeBankParentProfileId;

    const reg =
      /^(([^>()\[\]\\.,;:\s@"]+(\.[^>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;

    const finalFromEmail = Boolean(fromEmail)
      ? fromEmail + brandingData?.fromEmailDomain ?? ''
      : brandingData?.fromEmailDomain ?? '';

    let isFromEmailCorrect = true;

    if (Boolean(finalFromEmail) && !reg.test(finalFromEmail)) {
      isFromEmailCorrect = false;
    }

    const validation = {};
    let isError = false;

    if (!Boolean(logo)) {
      validation.logo = false;
      isError = true;
    }
    if (!Boolean(phone)) {
      validation.phone = false;
      isError = true;
    }
    if (!Boolean(clientEmail) || !reg.test(clientEmail)) {
      validation.clientEmail = false;
      isError = true;
    }
    if (!Boolean(isFromEmailCorrect) && bankParentProfileId === 1) {
      validation.fromEmail = false;
      isError = true;
    }
    if (!Boolean(slugURL) && bankParentProfileId === 1) {
      validation.slugURL = false;
      isError = true;
    }
    if (!Boolean(welcomeMessage)) {
      validation.welcomeMessage = false;
      isError = true;
    }

    this.setState({
      validation: validation,
    });

    return isError;
  };

  render() {
    const { classes, t, user } = this.props;
    const {
      notificationMSg,
      notificationVariant,
      welcomeMessage,
      brandingData,
      logo,
      validation,
      isUploadning,
      isPoweredBy,
      phone,
      phoneExt,
      phoneCountryCode,
      isPhoneEnable,
      isShowEmail,
      clientEmail
    } = this.state;
    const isBrandingEditEnable =
      (user.userRoles &&
        user.userRoles.includes(accessRights['BRANDING_SUPPLIER_SITE_EDIT'])) ||
      false;
    return (
      <>
        <div className={classes.themeBox}>
          <Grid container>
            <Grid item xs={3}>
              <SideBar
                validationErr={validation}
                brandingData={brandingData}
                userThemeData={this.getUserThemeData}
              />
            </Grid>

            <Grid
              item
              xs={9}
              style={{ borderLeft: '1px solid #d9d9d9', padding: 15 }}
            >
              <Templates
                theme={this.state.userTheme}
                logo={logo}
                isPoweredBy={isPoweredBy}
                phoneNo={phone}
                ext={phoneExt}
                clientName={brandingData?.clientName ?? ''}
                consumerSlugURL={brandingData?.consumerLoginUrl ?? ''}
                welcomeMessage={welcomeMessage || ''}
                countryCode={phoneCountryCode}
                isPhoneEnable={isPhoneEnable}
                isPayeeChoicePortal={user?.isPayeeChoicePortal}
                isShowEmail={isShowEmail}
                clientEmail={clientEmail}
              />
            </Grid>
          </Grid>
        </div>

        {isUploadning ? (
          <Box
            style={{
              margin: '30px auto',
              display: 'block',
              textAlign: 'center',
            }}
          >
            <CircularProgress color='primary' />
          </Box>
        ) : isBrandingEditEnable ? (
          <Button
            variant='contained'
            color='primary'
            className={classes.themeSaveBtn}
            onClick={() => this.saveThemeData()}
          >
            {t('componentData.themes.SAVE')}
          </Button>
        ) : null}

        {notificationVariant && (
          <Notification
            variant={notificationVariant}
            message={notificationMSg}
            handleClose={() => {
              this.setState({ notificationVariant: null });
            }}
          />
        )}
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(withStyles(styles)(UserTheme))
);
