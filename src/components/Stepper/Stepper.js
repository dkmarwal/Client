import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import StepCancelled from '~/assets/icons/step_cancelled.svg';
import StepFailed from '~/assets/icons/Step_failed.svg';
import StepCompleted from '~/assets/icons/Step_completed.svg';
import clsx from 'clsx'

const stepLabelStyles = makeStyles({
  label: {
    height: '18px',
    fontSize: '16px',
    letterSpacing: 0,
    lineHeight: '16px',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  exceptionConnector:{
    '& .MuiStep-completed, & .MuiStepConnector-active': {
        '& .MuiStepConnector-lineHorizontal': {
          borderColor: '#f44336 !important',
        },
      },
  },
  customStepperWrapper: {
    '& .MuiStep-completed, & .MuiStepConnector-active': {
      '& .MuiStepConnector-lineHorizontal': {
        borderColor: theme.palette.secondary.main,
      },
    },
    '& .MuiStepLabel-completed': {
      color: theme.palette.secondary.main,
    },
    '& .MuiStepLabel-active ': {
      color: theme.palette.secondary.main,
      fontWeight: 600,
    },
    '& .MuiStepIcon-root.MuiStepIcon-completed': {
      height: '34px',
      width: '34px',
      color: '#fff',
      border: `2px solid ${theme.palette.secondary.main}`,
      borderRadius: '50%',
      // backgroundColor: theme.palette.secondary.main
    },
    '& .MuiStepIcon-root.MuiStepIcon-active': {
      border: `2px solid ${theme.palette.secondary.main}`,
      '& .MuiStepIcon-text': {
        fill: theme.palette.secondary.main,
      },
    },
    '& .MuiStepIcon-root': {
      height: '34px',
      width: '34px',
      color: '#fff',
      border: '2px solid #CECECE',
      borderRadius: '50%',
      '& .MuiStepIcon-text': {
        fill: '#ccc',
      },
    },
    '& .MuiStepIcon-root.Mui-error': {
      color: '#f44336 !important',
      border: '2px solid #f44336',
      padding: '2px',
    },
    '& .MuiStepLabel-label.Mui-error': {
      color: '#f44336 !important',
    },
    '& .MuiStepConnector-alternativeLabel': {
      top: '16px',
      left: 'calc(-50% + 17px)',
      right: 'calc(50% + 17px)',
      position: 'absolute',
    },
    '& .MuiStepConnector-lineHorizontal': {
      borderTopWidth: '2px',
    },
    '& span.MuiTypography-root.MuiTypography-caption': {
      display: 'block',
    },
  },
}));

export default function CustomizedSteppers(props) {
  const { isPaymentCancelled = false, stepsList, activeStep } = props;
  const classes = useStyles();
  const stepLabelClasses = stepLabelStyles();

  const renderStepIcon = (imgSrc) => {
    if (imgSrc) {
      return <img src={imgSrc} alt="" />;
    }
    return null;
  };

  const getSrcIcon = (stepIndexVal) => {
    if (isPaymentCancelled) {
      if (stepIndexVal < activeStep) {
        return StepFailed;
      } else if (stepIndexVal === activeStep) {
        return StepCancelled;
      }
      return null;
    } else {
      if (stepIndexVal < activeStep) {
        return StepCompleted;
      }
      return null;
    }
  };

  return (
    <div className={classes.root}>
      <div className={clsx(classes.customStepperWrapper,isPaymentCancelled && classes.exceptionConnector)}>
        <Stepper alternativeLabel activeStep={activeStep}>
          {stepsList.map((el, index) => (
            <Step key={el.StatusID}>
              <StepLabel
                classes={stepLabelClasses}
                error={
                  el.Description.toUpperCase().includes('EXCEPTION') ||
                  (isPaymentCancelled && index <= activeStep)
                    ? true
                    : false
                }
                icon={renderStepIcon(getSrcIcon(index)) ?? el.StatusID}
              >
                {el.Description}
                {index <= activeStep && (
                  <Typography variant="caption">
                    {el.StatusUpdatedAt ? el.StatusUpdatedAt : ''}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
}
