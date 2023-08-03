import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Stepper, Step, StepLabel, Typography, Tooltip, StepConnector } from '@material-ui/core';
import StepCancelled from '~/assets/icons/cc_step_cancelled.svg';
import StepPaid from '~/assets/icons/cc_step_paid.svg';
import StepExpired from '~/assets/icons/cc_step_expired.svg';
import StepCreationFailed from '~/assets/icons/cc_step_creationFailed.svg';
import StepFailed from '~/assets/icons/Step_failed.svg';
import StepCompleted from '~/assets/icons/cc_step_completed.svg';
import clsx from 'clsx';
import { withTranslation } from "react-i18next";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { CCStepperConst } from '~/config/entityTypes';

const stepLabelStyles = makeStyles({
    label: {
        height: '18px',
        fontSize: '16px',
        letterSpacing: 0,
        lineHeight: '16px',
        textAlign: 'center',
        textTransform: 'uppercase'
    }
});

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    customStepperWrapper: {
        // '& .MuiStep-completed, & .MuiStepConnector-active': {
        //     '& .MuiStepConnector-lineHorizontal': {
        //         borderColor: '#33C3A4'
        //     }
        // },
        '& .MuiStepLabel-completed': {
            color: '#33C3A4',
        },
        '& .MuiStepLabel-active ': {
            color: '#D97934',
            fontWeight: 600
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
            border: `2px solid #D97934`,
            '& .MuiStepIcon-text': {
                fill: '#D97934'
            }
        },
        '& .MuiStepIcon-root': {
            height: '34px',
            width: '34px',
            color: '#fff',
            border: '2px solid #CECECE',
            borderRadius: '50%',
            '& .MuiStepIcon-text': {
                fill: '#ccc'
            }
        },
        '& .MuiStepIcon-root.Mui-error': {
            color: '#f44336 !important',
            border: '2px solid #f44336',
            padding: '2px'
        },
        '& .MuiStepLabel-label.Mui-error': {
            color: '#f44336 !important'
        },
        '& .MuiStepConnector-alternativeLabel': {
            top: '16px',
            left: 'calc(-50% + 17px)',
            right: 'calc(50% + 17px)',
            position: 'absolute'
        },
        '& .MuiStepConnector-lineHorizontal': {
            borderTopWidth: '2px'
        },
        '& span.MuiTypography-root.MuiTypography-caption': {
            display: 'block'
        }
    },
    customWidth: {
        maxWidth: 100,
        fontSize: 10
    },
    cancelled: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'red'
    },
    connectorActive: {
        '& $connectorLine': {
            borderColor: '#D97934'
        }
    },
    connectorCompleted: {
        '& $connectorLine': {
            borderColor: '#33C3A4'
        }
    },
    connectorDisabled: {
        '& $connectorLine': {
            borderColor: theme.palette.grey[100]
        }
    },
    connectorLine: {
        transition: theme.transitions.create('border-color')
    }
}));

const CardSteppers = (props) => {
    const { isPaymentCancelled = false, stepsList, activeStep, t } = props;
    const classes = useStyles();
    const stepLabelClasses = stepLabelStyles();

    const renderStepIcon = (item, el) => {
        if (item < activeStep) {
            return <img src={StepCompleted} alt="" />;
        }
        else if (el.Description === CCStepperConst.CANCELLED) {
            return <Box style={{ position: 'relative' }}>
                <img src={StepCancelled} alt="" />
                <Box className={classes.cancelled}>{el.StatusID}</Box>
            </Box>;
        }
        // else if (el.Description == 'Posted' || el.Description == 'Partially Posted' ||
        //     el.Description == 'Authorized' || el.Description == 'Partially Authorized') {
        //     return <Box style={{ position: 'relative' }}>
        //         <img src={StepPaid} alt="" />
        //         <Box className={classes.paid}>{el.StatusID}</Box>
        //     </Box>;
        // }
        else if (el.Description === CCStepperConst.EXPIRED) {
            return <img src={StepExpired} alt="" />;
        }
        else if (el.Description === CCStepperConst.CREATIONFAILED) {
            return <img src={StepCreationFailed} alt="" />;
        }
        else {
            return el.StatusID;
        }
    }

    const renderInfoIcon = (desc) => {
        switch (desc) {
            case CCStepperConst.CREATIONFAILED:
                return (
                    <Box component="span">
                        <Tooltip title={t('componentData.CCPaymentTransaction.creationFailedTooltip')} arrow placement='right' classes={{ tooltip: classes.customWidth }}>
                            <InfoOutlinedIcon color="primary" fontSize="small" />
                        </Tooltip>
                    </Box>
                )
            case CCStepperConst.CANCELLED:
                return (
                    <Box component="span">
                        <Tooltip title={t('componentData.CCPaymentTransaction.cancelledTooltip')} arrow placement='right' classes={{ tooltip: classes.customWidth }}>
                            <InfoOutlinedIcon color="primary" fontSize="small" />
                        </Tooltip>
                    </Box>
                )
            case CCStepperConst.EXPIRED:
                return (
                    <Box component="span">
                        <Tooltip title={t('componentData.CCPaymentTransaction.expiredTooltip')} arrow placement='right' classes={{ tooltip: classes.customWidth }}>
                            <InfoOutlinedIcon color="primary" fontSize="small" />
                        </Tooltip>
                    </Box>
                )
            default:
                return null;
        }
    }

    return (
        <div className={classes.root}>
            <div className={clsx(classes.customStepperWrapper, isPaymentCancelled && classes.exceptionConnector)}>
                <Stepper alternativeLabel activeStep={activeStep}
                    connector={<StepConnector
                        classes={{
                            active: classes.connectorActive,
                            completed: classes.connectorCompleted,
                            disabled: classes.connectorDisabled,
                            line: classes.connectorLine
                        }} />}
                >
                    {stepsList.map((el, index) => (
                        <Step key={el.StatusID}>
                            <StepLabel
                                classes={stepLabelClasses}
                                error={
                                    el.Description.includes(CCStepperConst.EXCEPTION) || el.Description.includes(CCStepperConst.CREATIONFAILED) ||
                                        el.Description.includes(CCStepperConst.CANCELLED) || el.Description.includes(CCStepperConst.EXPIRED) ||
                                        el.Description.includes(CCStepperConst.DISAPPROVED) ||
                                        (isPaymentCancelled && index <= activeStep)
                                        ? true
                                        : false
                                }
                                icon={renderStepIcon(index, el)}
                            >
                                <Box display="inline-flex">
                                    <Box>
                                        {el.Description}
                                        {index <= activeStep && (
                                            <Typography variant="caption">
                                                {el.StatusUpdatedAt ? el.StatusUpdatedAt : ''}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box>
                                        {renderInfoIcon(el.Description)}
                                    </Box>
                                </Box>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
        </div>
    );
}

export default withTranslation()(CardSteppers);
