import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import ClientHeader from '~/components/Header/ClientHeader';
import styles from '../Login/styles';
import ClientVerification from '~/modules/ClientVerification';
import Stepper from '~/modules/Stepper';
import RemittanceSettings from '~/modules/RemittanceSettings';
import PaymentSettings from '~/modules/PaymentSettings';
import FileSettings from '~/modules/FileSettings';
import ProfileSettings from '~/modules/ProfileSettings';

import B2CPaymentSettings from '~/modules/PaymentSettings/B2C/';
import USbankPaymentSettings from '~/modules/PaymentSettings/USBank/';
import B2CFileSettings from '~/modules/FileSettings/B2C/';
import USbankFileSettings from '~/modules/FileSettings/USbank/';
import B2CProfileSettings from '~/modules/ProfileSettings/B2C/';
import B2CRemittanceSettings from '~/modules/RemittanceSettings/B2C'

import config from '~/config';
import { entityType } from '~/config/entityTypes';
import Cookies from 'universal-cookie';
import { updateLanguage } from '~/redux/actions/user';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';

class Onboarding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHIPAA: false,
      steps: [
        'Profile Details',
        'Payment Information',
        'File Settings',
        'Remittance Setup',
      ],
      processing: false,
      activeStepNo: 0,
      langAnchorEl: null,
      anchorEl: null,
      langMenuOpen: false,
    };
  }

  componentDidMount() {}
  changeActiveStep = (step) => {
    this.setState({ activeStepNo: step });
  };
  handlePaymentDetails = (e) => {
    this.props.history.push(`${config.baseName}/onboard/files`);
  };

  handleLangToggle = (event) => {
    this.setState({
      langMenuOpen: !this.state.langMenuOpen,
      langAnchorEl: event.currentTarget,
    });
  };

  handleLangClose = () => {
    this.setState({
      langMenuOpen: false,
      langAnchorEl: null,
    });
  };

  handleLanguageChange = (event, langCode) => {
    const cookies = new Cookies(window.document.cookie);
    const { isLoggedIn } = this.props.user;
    if (isLoggedIn) {
      this.setState(
        {
          langMenuOpen: false,
        },
        () => {
          // API call to change user selected language
          this.props
            .dispatch(updateLanguage({ locale: langCode }))
            .then((response) => {
              if (!response) {
                return false;
              }
              this.props.i18n.changeLanguage(langCode);
              cookies.set('localeLang', this.props.i18n.language);

              this.setState({
                langMenuOpen: false,
              });
            });
        }
      );
    } else {
      this.props.i18n.changeLanguage(langCode);
      cookies.set('localeLang', this.props.i18n.language);

      this.setState({
        langMenuOpen: false,
      });
    }
    window.location.reload();
  };

  handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.setState({
        langMenuOpen: false,
      });
    }
  };

  render() {
    const { steps, activeStepNo } = this.state;

    const { user } = this.props;
    const appType = parseInt(sessionStorage.getItem('appType')) || entityType.B2B;
    const {isPayeeChoicePortal} = this.props.user;
	
    return (
      <>
        <ClientHeader
          {...this.props}
          isLoggedIn={user.isLoggedIn}
          info={user.userData}
        />

        <Switch>
          <Route
            exact
            path={`${config.baseName}/onboard/verification`}
            component={ClientVerification}
          />
          <Route
            exact
            path={`${config.baseName}/onboard/*`}
            render={(props) => (
              <>
                <Stepper
                  {...this.props}
                  {...props}
                  steps={steps}
                  activeStep={activeStepNo}
                />
                <Switch>
                  <Route
                    exact
                    path={`${config.baseName}/onboard/profile`}
                    render={(props) =>
                      appType === entityType.B2C ? (
                        <B2CProfileSettings
                          {...this.props}
                          changeActiveStep={this.changeActiveStep}
                          isOnboarding={true}
                        />
                      ) : (
                        <ProfileSettings
                          {...this.props}
                          changeActiveStep={this.changeActiveStep}
                          isOnboarding={true}
                        />
                      )
                    }
                  />
                  <Route
                    exact
                    path={`${config.baseName}/onboard/payment`}
                    render={(props) =>
                      appType === entityType.B2C ? (isPayeeChoicePortal?
                        (<USbankPaymentSettings
                          {...this.props}
                          changeActiveStep={this.changeActiveStep}
                        />
                        )
                        : (
                          <B2CPaymentSettings
                            {...this.props}
                            changeActiveStep={this.changeActiveStep}
                          />)
                        )
                        : (
                        <PaymentSettings
                          {...this.props}
                          changeActiveStep={this.changeActiveStep}
                        />
                      )
                    }
                  />
                  <Route
                    exact
                    path={`${config.baseName}/onboard/files`}
                    render={(props) =>
                      appType === entityType.B2C ? (isPayeeChoicePortal ? (
                        <USbankFileSettings
                          {...this.props}
                          changeActiveStep={this.changeActiveStep}
                          isOnboarding={true}
                        />
                      ) : (
                        <B2CFileSettings
                          {...this.props}
                          changeActiveStep={this.changeActiveStep}
                          isOnboarding={true}
                        />)
                      ) : (
                        <FileSettings
                          {...this.props}
                          changeActiveStep={this.changeActiveStep}
                          isOnboarding={true}
                        />
                      )
                    }
                  />
                  <Route
                    exact
                    path={`${config.baseName}/onboard/remittance`}
                    render={(props) =>
                      appType === entityType.B2C ? (
                        <B2CRemittanceSettings
                          {...this.props}
                          changeActiveStep={this.changeActiveStep}
                          isOnboarding={true}
                        />
                      ) : (
                        <RemittanceSettings
                          {...this.props}
                          changeActiveStep={this.changeActiveStep}
                          isOnboarding={true}
                        />
                      )
                    }
                  />
                </Switch>
              </>
            )}
          />
        </Switch>
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user, ...state.client }))(
    withStyles(styles)(Onboarding)
  )
);
