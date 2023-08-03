import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import App from './App';
import { connect } from 'react-redux';
import config from '~/config';
import { CircularProgress } from '@material-ui/core';
import { fetchSSODetails } from '~/redux/helpers/sso.js';
import SSOComponent from '~/views/SSO';
import i18n from './i18n';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
export class Wrapper extends React.Component {
  state = {
    showSSO: false,
    clientResponse: [],
  };

  componentDidMount = () => {
    if (config.willTranslate){
      const lang = cookies.get('localeLang');
      i18n.changeLanguage(lang || 'en');
    }
  }
  updateCookie(name, value) {
    document.cookie = name + '=' + value + `; Path=${config.baseName}/;`;
  }

  getSSODetails() {
    return fetchSSODetails();
  }

  setCookie(name, value) {
    document.cookie = name + '=' + value + `; Path=${config.baseName}/;`;
  }

  deleteCookie(name) {
    document.cookie =
      name +
      `=; Path=${config.baseName}/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  deleteAllCookies() {
    this.deleteCookie('@clientUserId');
    this.deleteCookie('@clientAccessToken');
    this.deleteCookie('@clientRefreshToken');
  }

  routeToDashboard = (userId) => {
    fetchSSODetails(userId).then((response) => {
      this.deleteAllCookies();
      this.setCookie('@clientAccessToken', response.data.accessToken);
      this.setCookie('@clientRefreshToken', response.data.refreshToken);
      this.setCookie('@clientUserId', response.data.userData.userId);
      window.location.href = `${config.baseURL}/dashboard`;
    });
  };

  render() {
    return (
      <div>
        <Switch>
          <Route
            key={3}
            exact
            path={'/migrate/:bankUserId/:accessToken/:refreshToken'}
            render={(props) => {
              const bankUserId = props.match.params.bankUserId;
              const accessToken = props.match.params.accessToken;
              const refreshToken = props.match.params.refreshToken;

              //this.deleteAllCookies();

              // this.setCookie("@clientAccessToken", accessToken);
              // this.setCookie("@clientRefreshToken", refreshToken);
              // this.setCookie("@clientUserId", bankUserId);
              this.updateCookie('@clientAccessToken', accessToken);
              this.updateCookie('@clientRefreshToken', refreshToken);
              this.updateCookie('@clientUserId', bankUserId);

              setTimeout(() => {
                window.location.href = `${config.baseName}/dashboard`;
              });
              return (
                <div>
                  <CircularProgress color="primary" />
                </div>
              );
            }}
          />
          <Route
            key={1}
            exact
            path={'/ssologin'}
            render={(props) => {
              const params = new Map(
                window.location.search
                  .slice(1)
                  .split('&')
                  .map((param) => param.split('='))
              );
              let token = params.get('token');

              this.deleteAllCookies();
              this.setCookie('@clientAccessToken', token);

              if (!this.state.showSSO) {
                this.getSSODetails().then((response) => {
                  if (response.error) {
                    props.history.push('/unauthorized');
                    return false;
                  }
                  if (response.data?.accessToken) {
                    this.deleteAllCookies();
                    this.setCookie(
                      '@clientAccessToken',
                      response.data.accessToken
                    );
                    this.setCookie(
                      '@clientRefreshToken',
                      response.data.refreshToken
                    );
                    this.setCookie(
                      '@clientUserId',
                      response.data.userData.userId
                    );
                    window.location.href = `${config.baseURL}/dashboard`;
                    // window.location.href = "http://localhost:3001/dashboard"
                  } else if (response.data?.clientData?.length > 1) {
                    this.setState({
                      showSSO: true,
                      clientResponse: response,
                    });
                  } else {
                    props.history.push('/unauthorized');
                    return false;
                  }
                });
              }
              return (
                <>
                  {this.state.showSSO ? (
                    <SSOComponent
                      routeToDashboard={this.routeToDashboard}
                      clientResponse={this.state.clientResponse}
                      {...props}
                    />
                  ) : (
                    <div>
                      <CircularProgress color="primary" />
                    </div>
                  )}
                </>
              );
            }}
          />
          <Route key={2} path={'/'} component={App} />
        </Switch>
      </div>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.clientConfig,
  moduleData: state.moduleData,
}))(withRouter((props) => <Wrapper {...props} />));
