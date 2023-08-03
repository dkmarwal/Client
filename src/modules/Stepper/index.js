import React, { Component } from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import {
  Typography,
  Box,
  Stepper as MUIStepper,
  Step as MUIStep,
  StepLabel as MUIStepLabel,
  StepConnector as MUIStepConnector,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import { withTranslation } from "react-i18next";

const StyledStepConnector = withStyles((theme) => ({
  alternativeLabel: {
    marginTop: "0rem",
    color: "red",
  },
  active: {
    "& $line": {
      borderColor: theme.palette.secondary.main,
    },
  },
  completed: {
    "& $line": {
      borderColor: theme.palette.secondary.main,
    },
  },
  line: {
    margin: "0.4rem 0rem",
    borderColor: theme.palette.border.main,
    borderTopWidth: 2,
  },
}))(MUIStepConnector);

const StyledStepLabel = (props) => {
  const { classes, active, completed, icon } = props;
  return (
    <Box
      className={clsx(classes.stepLabelContainer, {
        [classes.activeStepLabel]: active,
        [classes.activeCompleted]: completed,
      })}
    >
      {completed ? (
        <img
          className={classes.checkedIcon}
          src={require(`~/assets/icons/checkTick.svg`)}
          alt=""
        />
      ) : (
        <Typography variant="body1">{icon}</Typography>
      )}
    </Box>
  );
};

class Stepper extends Component {
  state = {
    steps: this.props.steps,
  };
  render() {
    const { t } = this.props;
    const { classes, activeStep } = this.props;
    const { steps } = this.state;
    return (
      <Box className={classes.stepperContainer}>
        <MUIStepper
          activeStep={activeStep}
          alternativeLabel
          connector={<StyledStepConnector />}
        >
          {steps.map((label) => (
            <MUIStep key={label}>
              <MUIStepLabel
                StepIconComponent={(props) => (
                  <StyledStepLabel classes={classes} {...props} />
                )}
              >
                <Typography variant="body1" className={classes.stepperLabel}>
                  {t(`componentData.onBoarding.${label}`)}
                </Typography>
              </MUIStepLabel>
            </MUIStep>
          ))}
        </MUIStepper>
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
    ...state.filters,
  }))(withStyles(styles)(Stepper))
);
