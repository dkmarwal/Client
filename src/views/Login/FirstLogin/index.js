import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import {
  Paper,
  Grid,
  withStyles,
  Button,
  MenuItem,
  Box,
  CircularProgress,  
  Typography  
} from "@material-ui/core";
import TextField from "~/components/Forms/TextField";

import { fetchSecurityQuestions } from "~/redux/actions/user";

const styles = () => ({
  container: {
    width: "40%",
    margin: "auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    background: "#fff",
    borderRadius: "7px",
    transform: "translate(-50%,-50%)",
    padding: "20px",
  },
  verifyBtn: {
    float: "right",
    marginTop: "10px",
    color: "#fff",
    fontSize: 14,
    minWidth: 135,
  },
  inputField: {
    /*color: "#fff",*/
    margin: "14px 14px 14px 10px",
    width: "95%",
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 5,
    },
  },
});

class FirstLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      confirmPassword: null,
      securityQuestionId: null,
      securityAnswer: null,
      validation: {},
      securityQuestionList: null,
      processing: false,
      errors: [],
      error: null,
      buttonDisabled: true,
    };
  }

  componentDidMount = () => {
    this.fetchSQList();
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.error) {
      return {
        errors: [nextProps.error],
      };
    }
    return null;
  }

  fetchSQList = () => {
    this.props.dispatch(fetchSecurityQuestions()).then((response) => {
      if (!response) {
        this.setState({
          error: this.props.user.error,
          alertMessageCallbackType: null,
          isLoading: false,
        });
        return false;
      }

      this.setState({
        isLoading: false,
        securityQuestionList: this.props.user.securityQuestionList,
      });
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validateInput = () => {
    const { password, confirmPassword, securityQuestionId, securityAnswer } =
      this.state;
    let valid = true;
    let validation = {};
    const { t } = this.props;
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!password || !re.test(password.trim())) {
      validation["password"] = t("componentData.firstLogin.passLimitTxt");
      valid = false;
    }
    
    if (
      !confirmPassword ||
      confirmPassword !== password ||
      confirmPassword.length === 0
    ) {
      validation["confirmPassword"] = t(
        "componentData.firstLogin.passNotMatched"
      );
      valid = false;
    }
    if (!securityQuestionId || securityQuestionId === 0) {
      validation["securityQuestionId"] = true;
      valid = false;
    }
    if (
      !securityAnswer ||
      (securityAnswer.length > 0 && securityAnswer.length < 6)
    ) {
      validation["securityAnswer"] = t(
        "componentData.firstLogin.securityLenTxt"
      );
      valid = false;
    }
    this.setState({ validation: { ...validation } });
    return valid;
  };

  onSubmit = async () => {
    const isValid = this.validateInput();
    if (isValid) {
      this.setState(
        {
          processing: true,
        },
        async () => {
          const {
            password,            
            securityQuestionId,
            securityAnswer,
          } = this.state;
          const { processReset } = this.props;
          await processReset({
            password,
            securityQuestionId,
            securityAnswer,
          }).then((response) => {
            if (!response) {
              this.setState({
                error: this.props.user.error,
                processing: false,
              });

              return false;
            }

            this.setState({
              processing: false,
              buttonDisabled: true,
              error: null             
            });
          });
        }
      );
    }
  };

  render() {
    const { t } = this.props;
    const { classes } = this.props;
    const tooltipObj = {
      title: t("componentData.firstLogin.passTypeTxt"),
      arrow: true,
      placement: "top-end",
    };
    const {
      password,
      confirmPassword,
      securityQuestionId,
      securityAnswer,
      securityQuestionList,
      validation,
      error,
    } = this.state;

    return (
      <Paper className={classes.container} elevation={5}>
        <Grid container className={classes.inner}>
          <Grid xs={12}>
            <Box
              display="flex"
              color="rgba(0,0,0,0.87)"
              pb={2}
              mt={2}
              justifyContent="center"
              fontSize={24}
            >
              {t("componentData.firstLogin.passAndSecurityTxt")}
            </Box>
          </Grid>
          <Grid xs={12}>
            <TextField
              required
              error={validation && validation.password}
              helperText={validation && validation.password}
              className={classes.inputField}
              name="password"
              id="password"
              label={t("componentData.firstLogin.newPassLebel")}
              type="password"
              variant="outlined"
              value={password}
              onChange={this.handleChange}
              inputProps={{ minLength: 8 }}
              InputLabelProps={{
                shrink: true,
              }}
              tooltipProps={tooltipObj}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              required
              error={validation && validation.confirmPassword}
              helperText={validation && validation.confirmPassword}
              className={classes.inputField}
              name="confirmPassword"
              id="confirmPassword"
              label={t("componentData.firstLogin.confirmPassLebel")}
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={this.handleChange}
              inputProps={{ minLength: 8 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid xs={12}>
            <Box>
              <TextField
                label={t("componentData.firstLogin.securityQueTxt")}
                required
                error={validation && validation.securityQuestionId}
                helperText={validation && validation.securityQuestionId}
                className={classes.inputField}
                fullWidth={true}                
                select
                value={securityQuestionId || ""}
                autoComplete="off"
                variant="outlined"
                name="securityQuestionId"
                onChange={this.handleChange}
              >
                {securityQuestionList ? (
                  securityQuestionList.map((option) => (
                    <MenuItem key={option.questionId} value={option.questionId}>
                      {option.question}
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
          </Grid>
          <Grid xs={12}>
            <TextField
              required
              error={validation && validation.securityAnswer}
              helperText={validation && validation.securityAnswer}
              className={classes.inputField}
              name="securityAnswer"
              id="securityAnswer"
              label={t("componentData.firstLogin.securityAnsTxt")}
              type="password"
              variant="outlined"
              value={securityAnswer}
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid xs={12}>
            <Box display="flex" justifyContent="center">
              <Typography variant="subtitle1" color="error">
                {error}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center" mb={2}>
              <Button
                variant="contained"
                color="primary"
                className={classes.verifyBtn}
                disableElevation
                onClick={this.onSubmit}
              >
                {t("componentData.firstLogin.submitBtn")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user }))(withStyles(styles)(FirstLogin))
);
