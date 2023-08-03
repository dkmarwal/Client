import React, { Component } from "react";
import { Paper, Box, CircularProgress } from "@material-ui/core";
import { TextField, Button } from "~/components/Forms";
import Notification from "~/components/Notification";
import { login } from "~/redux/actions/user";
import { withStyles } from "@material-ui/core/styles";
import IncedoPayLogo from "~/assets/images/IncedoPayLogo.svg";
import config from "~/config";
import { styles } from "./styles";
import { withTranslation } from 'react-i18next';

class Authentication extends Component {
  state = {
    error: null,
    processing: false,
    credentials: {
      userName: null,
      password: null,
    },
  };
  handleInputChange = (e) => {
    this.setState({
      credentials: {
        ...this.state.credentials,
        [e.target.name]: e.target.value,
      },
    });
  };
  processLogin = (e) => {
    e.preventDefault();    
    const { processing } = this.state;
    if (!processing) {
      this.setState(
        {
          processing: true,
          error: null,
        },
        () => {
          const { credentials } = this.state;
          if (!credentials.userName || !credentials.password) {
            this.setState({ processing: false });
            return;
          }
          this.props
            .dispatch(login(credentials))
            .then((response) => {
              if (response.error) {
                throw response.error;
              }
              this.setState(
                {
                  processing: false,
                },
                () => this.props.history.push(`${config.baseName}/dashboard`)
              );
            })
            .catch((error) => {              
              this.setState({
                processing: false,
                error,
              });
              return false;
            });
        }
      );
    }
  };
  render() {
    const { classes, t } = this.props;
    const { processing, error } = this.state;
    return (
      <Box className={classes.loginContainer}>
        <Paper className={classes.loginBox}>
          <img src={IncedoPayLogo} alt="IncedoPay" className="logo" />
          <form
            noValidate
            onSubmit={this.processLogin}
            className={classes.loginForm}
          >
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="userName"
              label= {t('componentData.authentication.Username')}
              variant="outlined"
              onChange={this.handleInputChange}
            />
            <TextField
              name="password"
              type="password"
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              label= {t('componentData.authentication.Password')}
              variant="outlined"
              onChange={this.handleInputChange}
            />
            <Box className={classes.buttonContainer}>
              {processing ? (
                <CircularProgress color="primary" />
              ) : (
                <Button
                  type="submit"
                  fullWidth={false}
                  variant="contained"
                  color="primary"
                >
                  {t('componentData.authentication.LogIn')}
                </Button>
              )}
            </Box>
          </form>
        </Paper>
        {error && <Notification variant="error" message={error} />}
      </Box>
    );
  }
}

export default withTranslation()(withStyles(styles)(Authentication));
