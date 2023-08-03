import React, { Component, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  CssBaseline,
  Button,
} from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  userInfo,
  logout,
  keepSessionLive,
  fetchSupportedLanguageList,
  fetchIsPayeeChoicePortal
} from '~/redux/actions/user';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import Sidebar from '~/modules/Sidebar';
import Login from '~/views/Login/index';
import ResetPassword from '~/views/Login/ResetPassword';
import SessionOut from '~/views/SessionOut/';
import Unauthorise from '~/views/Unauthorise/';
import config from '~/config';
import { IdleTimeOutModal } from '~/components/Dialogs';
import IdleTimer from 'react-idle-timer';
import Onboarding from '~/views/Onboarding';
import Cookies from 'universal-cookie';
import { fetchSSODetails } from '~/redux/helpers/sso.js';
import { fetchBankPortalAccessDetails } from '~/redux/helpers/user';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import favicon from '~/assets/images/favicon.ico';
import usBankFav from "~/assets/images/usbank-favicon.ico"
import { Helmet } from 'react-helmet';

import '~/App.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { I18nextProvider } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

const cookies = new Cookies();
const moduleMap = {};

const navigateToBankPortal = (portalProfileId) => {
  const token = cookies.get('@clientAccessToken');
  const bankId = cookies.get('@clientUserId');
  fetchBankPortalAccessDetails(bankId, token).then((response) => {
    const { accessToken, refreshToken } = response && response.data;
    const { userId, portalProfileId } =
      response && response.data && response.data.userData;
    // console.log(cookies.getAll(), "COOKIES_BANK");
    // console.log(accessToken, "ACCESS_TOKEN_REQUESTED_FROM_CLIENT");
    window.location.href = `${config.bankPortalBase}migrate/${portalProfileId}/${accessToken}/${refreshToken}/${userId}`;
    //window.location.href = `http://localhost:3001/migrate/${portalProfileId}/${accessToken}/${refreshToken}/${userId}`;
  });
};

const AuthRoute = (props) => {
  const {
    render,
    alias,
    claims,
    isLoggedIn,
    userAccessRights,
    pageAccessRights,
    ...rest
  } = props;
  const { t } = useTranslation();
  //const { info } = this.props.user;
  //props.dispatch(fetchIsPayeeChoicePortal())
  //let portalTypeId = props.user.userData.portalTypeId;
  const [backToBankDisabled, setBackToBankDisabled] = useState(false);
  let bankParentProfileId = props.user.userData.activeBankParentProfileId;
  return (
    <I18nextProvider i18n={i18n}>
      <Route
        {...rest}
        render={(props) =>
          isLoggedIn ? (
            <div>
              {/* <Helmet>
                <link
                  rel="shortcut icon"
                  type="image/x-icon"
                  href={favicon}
                  sizes="16x16"
                  data-react-helmet="true"
                />
              </Helmet> */}
              {!claims || !claims.includes(alias) ? (
                <div>
                  {render(props)}

                  {bankParentProfileId == 1 && (
                    <Box className="bottomFixedOverlay">
                      <Button
                        className={'giantButton'}
                        disabled={backToBankDisabled}
                        variant="contained"
                        onClick={() => {
                          setBackToBankDisabled(true);
                          navigateToBankPortal(bankParentProfileId);
                        }}
                      >
                        {/* style={{margin: "0 5px 0 0"}} */}
                        <ArrowBackIcon
                          color="#ffffff"
                          style={{ margin: '0 5px 0 0' }}
                        />
                        {t('componentData.SmallTxt.gotoYourAcc')}
                      </Button>
                    </Box>
                  )}
                </div>
              ) : (
                <div>{t('componentData.SmallTxt.UnauthorizedAccess')}</div>
              )}
            </div>
          ) : (
            <Redirect to={`${config.baseName}/`} />
          )
        }
      />
    </I18nextProvider>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      pathname: null,
      isLoading: true,
      timeout: config.sessionTimeout - config.showPopupTime - 180000, //less 2 min in milli seconds
      isTimedOut: false,
      logout: false,
      showModal: false,
      run: false,
      steps: [
        {
          target: '#f8d4be99-0924-4a2f-92ef-a86eda1cbb93',
          content:
            'Manage your payees profile and information. This feature facilitates a complete view of your payee information and status along with the details of your supplier enrolment campaigns.',
          disableBeacon: true,
          placement: 'right',
        },
        {
          target: '#e1b4faef-d8b4-43be-9319-87c4ffb04d1a',
          content:
            'Manage your payees profile and information. This feature facilitates a complete view of your payee information and status along with the details of your supplier enrolment campaigns.',
          placement: 'right',
          disableBeacon: true,
        },
        {
          target: '#c363b0de-b9d9-4845-b678-01d24e8300c3',
          content:
            'Manage your payees profile and information. This feature facilitates a complete view of your payee information and status along with the details of your supplier enrolment campaigns.',
          placement: 'right',
          disableBeacon: true,
        },
        {
          target: '#a7146643-90b8-429c-9ff3-945068022ffe',
          content:
            'Manage your payment instruction files and payments. Provides you the ability to upload/approve/reject/recalculate payment files along with tracking and reconciliation of your payment transactions',
          placement: 'right',
          disableBeacon: true,
        },
        {
          target: '#bf16a6ad-9fbd-4ed0-a443-7b5b88a272ea',
          content:
            'Check out newly added static reports and report builder. Provides you the ability to view, download, create and subscribe to reports and have them automatically delivered via email',
          placement: 'right',
          disableBeacon: true,
        },
        {
          target: '#ed087c13-0c87-4f1b-8440-ed774d03ee67',
          content:
            'Lets you configure your portal instance by updating information related to your company details, payment accounts, remittance advices setup and supplier validations to be performed',
          placement: 'right',
          disableBeacon: true,
        },
        {
          target: '#b7bed1be-59e7-48a4-9b63-94072523e651',
          content:
            'Enables you to use your logo and company specific content on remittance advices , emails and supplier enrollment page',
          placement: 'right',
          disableBeacon: true,
        },
        {
          target: '.LeftNav',
          content:
            'Access your profile/account for self-service and log out of the system from here.',
          placement: 'bottom',
          disableBeacon: true,
        },
      ],
    };
    this.idleTimer = null;
    //this.onAction = this._onAction.bind(this);
    //this.onActive = this._onActive.bind(this);
    this.onIdle = this._onIdle.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location.pathname !== state.pathname) {
      if (
        state.pathname !== null &&
        props.location.pathname !== state.pathname
      ) {
      }
      return {
        pathname: props.location.pathname,
      };
    }
    return null;
  }

  componentDidMount = () => {
    if (
      (this.props.user.isLoggedIn && !this.props.clientConfig) ||
      !this.props.clientConfig.clientId
    ) {
      //this.props.dispatch(fetchClientConfig());
    }
    this.props.dispatch(fetchIsPayeeChoicePortal())
    this.props.dispatch(userInfo()).then((response) => {
      this.setState({
        isLoading: false,
      });

      if (config.willTranslate) {
        //set user selected language
        const lang = cookies.get('localeLang');
        const { userData } = this.props.user;
        //check for bank admin user
        if (
          userData.activeBankParentProfileId &&
          userData.activeBankParentProfileId == 1
        ) {
          //for bank admin user
          i18n.changeLanguage(lang || 'en');
        } else {
          i18n.changeLanguage(userData.locale || lang || 'en');
        }
      }

      this.checkSession(); //Check at the time of page refresh
      setInterval(() => {
        this.checkSession();
      }, 60000); //Check in every one minutes

      if (config.willTranslate) {
        this.getLanguageList(i18n.language);
      }
    });


  };

  checkSession = () => {
    //const clientId = cookies.get("@clientUserId") ? parseInt(cookies.get("@clientUserId")) : null;

    if (
      !this.state.showModal &&
      this.props.user &&
      this.props.user.isLoggedIn
    ) {
      const tokenExpiryTime = this.props.user.userData.exp; //in seconds
      const currentTime = Math.floor(Date.now() / 1000); //convert to seconds
      if (
        tokenExpiryTime > currentTime &&
        currentTime >= tokenExpiryTime - 120
      ) {
        //refresh token
        this.updateSession();
      }
    }
  };
  componentDidUpdate() {
    if (config.willTranslate) {
      if (!this.props.user.slList) {
        this.getLanguageList(i18n.language);
      }
    }
  }

  getLanguageList = (lang) => {
    const { userData } = this.props.user;
    const appType = (userData && userData?.appType) || 1;//Default to 1 in client portal
    this.props.dispatch(fetchSupportedLanguageList({lang:lang, appType: appType})).then((response) => {
      if (!response) {
      }
    });
  };

  /*_onAction(e) {
    //console.log("On action");
    //console.log('last active time', Date(this.idleTimer.getLastActiveTime()));
    //console.log('time remaining', this.idleTimer.getRemainingTime()/60000);
    //console.log('time elapsed', this.idleTimer.getElapsedTime()/60000);
    //console.log('id idle', this.idleTimer.isIdle());
    //console.log('total idle time', this.idleTimer.getTotalIdleTime());
    const totalIdleTime = this.idleTimer.getTotalIdleTime();
    const clientId = cookies.get("@clientUserId");
    const { userData } = this.props.user;
    if (totalIdleTime >= config.sessionTimeout) {
      if (this.props.user && this.props.user.isLoggedIn && (clientId == userData.userId)) {
        this.idleTimer.reset();
        //this.setState({ logout: true, isTimedOut: true, showModal: false });
        console.log("in _onAction logout");
        //this.props.dispatch(logout());
      } else {
        this.idleTimer.reset();
      }
    } else {
      if (!this.state.showModal && this.props.user && this.props.user.isLoggedIn && (clientId == userData.userId)) {
        const tokenExpiryTime = this.props.user.userData.exp;//in seconds
        const currentTime = Math.floor(Date.now() / 1000); //convert to seconds
        console.log("tokenExpiryTime", moment(tokenExpiryTime * 1000).format("DD-MM-YYYY h:mm:ss"));
        if (tokenExpiryTime > currentTime && currentTime >= (tokenExpiryTime - 60)) {
          //refresh token
          this.updateSession();
        }
      }

      this.setState({ isTimedOut: false });
    }
  }*/

  _onActive(e) {
    const totalIdleTime = this.idleTimer.getTotalIdleTime();
    const clientId = cookies.get('@clientUserId')
      ? parseInt(cookies.get('@clientUserId'))
      : null;
    const { userData } = this.props.user;
    if (totalIdleTime >= config.sessionTimeout) {
      if (
        this.props.user &&
        this.props.user.isLoggedIn &&
        clientId === userData.userId
      ) {
        this.idleTimer.reset();
        //this.setState({ logout: true, isTimedOut: true, showModal: false });
        //this.props.dispatch(logout());
      } else {
        this.idleTimer.reset();
      }
    } else {
      if (
        !this.state.showModal &&
        this.props.user &&
        this.props.user.isLoggedIn &&
        clientId === userData.userId
      ) {
        const tokenExpiryTime = this.props.user.userData.exp; //in seconds
        const currentTime = Math.floor(Date.now() / 1000); //convert to seconds

        if (
          tokenExpiryTime > currentTime &&
          currentTime >= tokenExpiryTime - 120
        ) {
          //refresh token
          this.updateSession();
        }
      }
      this.idleTimer.reset();
      this.setState({ isTimedOut: false });
    }
  }

  _onIdle(e) {
    //const clientId = cookies.get("@clientUserId") ? parseInt(cookies.get("@clientUserId")) : null;
    if (this.props.user && this.props.user.isLoggedIn) {
      this.setState({ showModal: true });
      setTimeout(() => {
        if (
          this.state.showModal &&
          this.props.user &&
          this.props.user.isLoggedIn
        ) {
          this.idleTimer.reset();
          this.setState({ logout: true, isTimedOut: true, showModal: false });
          this.props.dispatch(logout());
        }
      }, config.showPopupTime);
    }
  }

  updateSession = () => {
    try {
      this.props.dispatch(keepSessionLive()).then((response) => {
        if (!response) {
        }
        this.idleTimer.reset(); //reset timer
      });
    } catch (ex) {
      //this.idleTimer.reset(); //reset timer
    }
  };

  keepUpdateSession = () => {
    try {
      this.props.dispatch(keepSessionLive()).then((response) => {
        if (!response) {
          this.setState({ showModal: false });
        }
        this.idleTimer.reset(); //reset timer
        this.setState({ showModal: false });
      });
    } catch (ex) {
      this.setState({ showModal: false });
      this.idleTimer.reset(); //reset timer
    }
  };

  getSSODetails() {
    return fetchSSODetails();
  }

  render() {
    const { error, isLoading, showModal} = this.state;
    const { clientConfig, user, dispatch, t } = this.props;
    const { isPayeeChoicePortal } = this.props.user;
    //if (!clientConfig.clientId || user.isLoggedIn === null) {
    if (!clientConfig.clientId || isLoading) {
      return null;
    }

    return (
      <MuiThemeProvider
        theme={createMuiTheme(
          clientConfig && clientConfig.layout
            ? this.themeConfig(clientConfig.layout.theme)
            : {}
        )}
      >
        <IdleTimer
          ref={(ref) => {
            this.idleTimer = ref;
          }}
          startOnMount={true}
          element={document}
          onIdle={this.onIdle}
          debounce={250}
          timeout={this.state.timeout}
        />
        <Helmet>
            <title>{isPayeeChoicePortal ? "U.S. Bank" : "Citibank"}</title>
              <meta name="title" content={isPayeeChoicePortal ? "U.S. Bank" : "Citibank"} />
              <meta name="description" content={isPayeeChoicePortal ? "U.S. Bank" : "Citibank"} />
              <meta name="keywords" content={isPayeeChoicePortal ? "U.S. Bank" : "Citibank"} />
              <link
                id="favicon"
                rel="shortcut icon"
                type="image/x-icon"
                href={isPayeeChoicePortal ? usBankFav : favicon}
                sizes="16x16"
                data-react-helmet="true"
          />
        </Helmet>

        <CssBaseline />
        {!clientConfig.clientId ? (
          error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Box
              display="flex"
              p={10}
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress color="primary" />
            </Box>
          )
        ) : (
          <Switch>
            <Route
              key={2}
              exact
              path={'/'}
              render={(props) => (
                <Fragment>
                  <Box>
                    <Login {...props} forgotPasswordView={false} />
                  </Box>
                </Fragment>
              )}
            />
            <Route
              key={21}
              exact
              path={'/forgot-password'}
              render={(props) => (
                <Fragment>
                  <Box>
                    <Login {...props} forgotPasswordView={true} />
                  </Box>
                </Fragment>
              )}
            />
            <Route key={3} exact path={'/onboard/*'} component={Onboarding} />
            <Route
              key={4}
              exact
              path={'/reset-password'}
              component={ResetPassword}
            />
            <Route
              key={5}
              exact
              path={'/sessionout'}
              {...this.props}
              component={SessionOut}
            />
            <Route
              {...this.props}
              exact
              key={6}
              path={`/unauthorized`}
              component={Unauthorise}
            />
            {clientConfig.routes.map((page) =>
              page.accessRights.length === 0
                ? page.paths.map((path, pathIndex) => (
                    <AuthRoute
                      alias={page.alias}
                      user={user}
                      claims={user.userRoles}
                      key={`${page.id}-path-${pathIndex}`}
                      exact
                      isLoggedIn={user.isLoggedIn}
                      path={`${config.baseName}${path}`}
                      render={(props) => {
                        const View =
                          require(`~/views/${page.viewName}`).default;
                        return page.displaySidebar ? (
                          <>
                            <Header
                              {...props}
                              isLoggedIn={user.isLoggedIn}
                              info={user.userData}
                            />
                            <div className="sidebar">
                              <Sidebar
                                {...props}
                                dispatch={dispatch}
                                user={user}
                                data={clientConfig.navigation.sidebar}
                                settings={clientConfig.layout}
                                pages={clientConfig.pages}
                              />
                            </div>
                            <div className={`has-sidebar`} style={this.props.i18n.language === "fr"? {marginLeft:"5.5rem"}: {} } >
                              <Box mt={12}>
                                <View
                                  {...props}
                                  key={`module-${pathIndex}`}
                                  dispatch={dispatch}
                                  user={user}
                                />
                              </Box>
                            </div>
                            <Box>
                              {' '}
                              <Footer {...props} />{' '}
                            </Box>
                          </>
                        ) : (
                          <View
                            {...props}
                            key={`module-${pathIndex}`}
                            dispatch={dispatch}
                            user={user}
                          />
                        );
                      }}
                    />
                  ))
                : page.paths.map(
                    (path, pathIndex) =>
                      this.userHasPageAccess(
                        user.accessRights,
                        page.accessRights
                      ) && (
                        <AuthRoute
                          key={`${page.id}-path-${pathIndex}`}
                          alias={page.alias}
                          user={user}
                          claims={user.userRoles}
                          isLoggedIn={user.isLoggedIn}
                          path={`${config.baseName}${path}`}
                          render={(props) => {
                            const View =
                              require(`~/views/${page.viewName}`).default;
                            return page.displaySidebar ? (
                              <Fragment>
                                <Header
                                  {...props}
                                  isLoggedIn={user.isLoggedIn}
                                  info={user.userData}
                                />
                                <div className="sidebar">
                                  <Sidebar
                                    {...props}
                                    dispatch={dispatch}
                                    user={user}
                                    data={clientConfig.navigation.sidebar}
                                    settings={clientConfig.layout}
                                    pages={clientConfig.pages}
                                  />
                                </div>
                                <div className={`has-sidebar`} style={this.props.i18n.language !== "en"? {marginLeft:"5.5rem"}: {} } >
                                  <View
                                    {...props}
                                    key={`module-${pathIndex}`}
                                    dispatch={dispatch}
                                    user={user}
                                  />
                                </div>

                                <Footer {...props} />
                              </Fragment>
                            ) : (
                              <View
                                {...props}
                                key={`module-${pathIndex}`}
                                dispatch={dispatch}
                                user={user}
                              />
                            );
                          }}
                        />
                      )
                  )
            )}
            {clientConfig.loginHardwall ? (
              <AuthRoute
                isLoggedIn={user.isLoggedIn}
                claims={user.userRoles}
                user={user}
                path={`${config.baseName}/`}
                render={(props) => (
                  <div>{t('componentData.SmallTxt.pageNotFound')}</div>
                )}
              />
            ) : (
              <Route
                path={`${config.baseName}/`}
                render={(props) => (
                  <div>{t('componentData.SmallTxt.pageNotFound')}</div>
                )}
              />
            )}
          </Switch>
        )}

        {showModal &&
          this.renderAlertMessage(
            t('componentData.SmallTxt.IdleHead'),
            t('componentData.SmallTxt.IdleMsg'),
            showModal
          )}
      </MuiThemeProvider>
    );
  }

  renderAlertMessage = (title, message, showModal) => {
    return (
      <IdleTimeOutModal
        open={showModal}
        title={title}
        message={message}
        onConfirm={() => this.keepUpdateSession()}
      />
    );
  };

  userHasPageAccess = (userAccessRights, pageAccessRights) => {
    return true;
    /* let hasAccess = false;
    pageAccessRights.forEach((accessRight) => {
      if (
        userAccessRights[accessRight.accessName] &&
        userAccessRights[accessRight.accessName].indexOf(
          accessRight.description
        ) !== -1
      ) {
        hasAccess = true;
      }
    });
    return hasAccess; */
  };

  renderModules = (moduleList, props, pageTitle, defaultPage) => {
    const { dispatch, user, moduleData } = this.props;
    return (
      <Fragment>
        {moduleList.map((module, moduleIndex) => {
          if (module.moduleName === 'Row') {
            return (
              <Grid
                key={`module-${moduleIndex}`}
                id={module.id}
                container
                spacing={1}
                {...module.moduleSettings?.layout}
              >
                {this.renderModules(
                  module.modules,
                  props,
                  pageTitle,
                  defaultPage
                )}
              </Grid>
            );
          }
          if (module.moduleName === 'Column') {
            return (
              <Grid
                key={`module-${moduleIndex}`}
                id={module.id}
                item
                {...module.moduleSettings.width}
                {...module.moduleSettings?.layout}
              >
                {this.renderModules(
                  module.modules,
                  props,
                  pageTitle,
                  defaultPage
                )}
              </Grid>
            );
          }
          try {
            const Module = this.loadModule(module.moduleName);
            return (
              <Module
                {...props}
                key={`module-${moduleIndex}`}
                id={module.id}
                defaultPage={defaultPage}
                dispatch={dispatch}
                user={user}
                pageTitle={pageTitle}
                data={module.moduleData || moduleData[module.id] || null}
                dataSettings={module.moduleDataSettings}
                settings={module.moduleSettings}
              >
                {module.modules && module.modules.length > 0
                  ? this.renderModules(
                      module.modules,
                      props,
                      pageTitle,
                      defaultPage
                    )
                  : null}
              </Module>
            );
          } catch (error) {
            return null;
          }
        })}
      </Fragment>
    );
  };

  loadModule = (moduleName) => {
    if (!moduleMap[moduleName]) {
      moduleMap[moduleName] = require(`~/modules/${moduleName}`).default;
    }
    return moduleMap[moduleName];
  };

  themeConfig = (theme) => {
    return {
      palette: {
        ...theme.palette,
      },
      typography: {
        ...theme.typography,
      },
      overrides: {},
    };
  };
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
    moduleData: state.moduleData,
  }))(withRouter((props) => <App {...props} />))
);
