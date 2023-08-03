import React, { Component } from 'react';
import styles from './styles';
import keyboard_arrow_down from '~/assets/images/keyboard_arrow_down.png';
import arrow_drop_down from '~/assets/images/arrow_drop_down.png';
import User from '~/assets/images/User.png';
import logoDummy from '~/assets/images/logoDummy.png';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import clsx from 'clsx';
class Header extends Component {
  render() {
    const { isMobileView, logo, classes, t, clientName, isPayeeChoicePortal } =
      this.props;

    return (
      <Box
        className={clsx(classes.payeeBox, {
          [classes.payeeBoxMobile]: isMobileView === true,
        })}
      >
        <Box display='flex' alignItems='center'>
          <Box
            className={clsx(classes.LogoBox, {
              [classes.LogoBoxMobile]: isMobileView === true,
            })}
          >
            <>
              {isMobileView ? (
                <img
                  src={logo ? logo : logoDummy}
                  className={classes.logo}
                  alt='metLifeLogo'
                  width='100%'
                  height='auto'
                />
              ) : (
                <img
                  src={logo ? logo : logoDummy}
                  className={classes.logo}
                  alt='metLifeLogo'
                  width='78px'
                  height='16px'
                />
              )}
            </>
            <Box className={classes.midBorder}></Box>
          </Box>
          <Box
            style={{ color: '#4c4c4c' }}
            className={clsx({
              [classes.payeeHeadingMobile]: isMobileView === true,
            })}
          >
            {!isPayeeChoicePortal
              ? t('componentData.PayeeVerificationScreen.paymentExchange')
              : clientName}
          </Box>
        </Box>
        {isMobileView ? (
          <Box className='hl_m' width='25%'>
            <Box component='span'>
              {t('componentData.PayeeVerificationScreen.EN')}
            </Box>
            &nbsp;
            <Box component='span'>
              <img
                src={arrow_drop_down}
                alt='down arrow'
                width='16px'
                height='16px'
              />
            </Box>
            &nbsp;
            {/* <Box component="span"><img src={Notification} alt="down arrow" width="24px" height="24px"  /></Box>&nbsp;&nbsp;&nbsp; */}
            <Box component='span'>
              <img src={User} alt='down arrow' width='24px' height='24px' />
            </Box>
          </Box>
        ) : (
          <Box className='hl_r'>
            <Box component='span'>
              {t('componentData.PayeeVerificationScreen.EN')}
            </Box>
            <img
              src={keyboard_arrow_down}
              alt='down arrow'
              width='24px'
              height='25.02px'
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
          </Box>
        )}
      </Box>
    );
  }
}
export default withTranslation()(
  withStyles(styles, { withTheme: true })(Header)
);
