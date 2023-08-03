import React, { Component } from 'react';
import styles from './styles';
import cityLogo from '~/assets/images/cityLogo.png';
import phoneImg from '~/assets/images/phoneImg.png';
import mailImg from '~/assets/images/mail.png';
import lockImg from '~/assets/images/lock.png';
import helpImg from '~/assets/images/help.png';
import USBankLogo from '~/assets/images/USBANK 1.svg';
import logoDummy from '~/assets/images/logoDummy.png';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { Box, Divider } from '@material-ui/core';
import clsx from 'clsx';
import { getFormattedPhoneNumber } from '~/utils/common';
import { Typography } from 'antd';

class Footer extends Component {
  render() {
    const {
      isMobileView,
      classes,
      t,
      isPoweredBy,
      phoneNo,
      ext,
      countryCode,
      isPhoneEnable,
      isPayeeChoicePortal,
      clientEmail,
      isShowEmail,
      logo,
      clientName,
    } = this.props;

    return (
      <>
        <Box
          className={clsx(classes.pmFooter, {
            [classes.pmFooterMobile]: isMobileView === true,
          })}
        >
          <Box
            className={clsx(classes.citiLogoContainer, {
              [classes.citiLogoContainerMobile]: isMobileView === true,
            })}
          >
            {!isPayeeChoicePortal && isPoweredBy === 1 && (
              <>
                <Box component='span' fontSize={8} alignItems='flex-end'>
                  {t('componentData.PayeeVerificationScreen.PoweredBy')} &nbsp;
                </Box>
                <Box>
                  <img src={cityLogo} alt='city Logo' width='24' />
                </Box>
              </>
            )}
            {isPayeeChoicePortal && (
              <>
                <Box>
                  <img src={USBankLogo} width='30' alt='USBank_Logo' />
                </Box>
                <Box m={'auto'} ml={1.5} mr={1.5}>
                  <img
                    src={logo ? logo : logoDummy}
                    width='24'
                    alt='clientLogo'
                  />
                </Box>
                <Typography style={{ margin: 'auto', color: '#4c4c4c' }}>
                  {`Powered by U.S. Bank and ${clientName}. Your payment choice data is secured by U.S. Bank`}
                </Typography>
              </>
            )}
          </Box>

          <Box
            className={clsx(classes.footerDataContainer, {
              [classes.footerDataContainerMobile]: isMobileView === true,
            })}
            flexDirection='row'
          >
            {isPhoneEnable === 1 && (
              <Box
                className={clsx(classes.phoneNo, {
                  [classes.phoneNoMobile]: isMobileView === true,
                })}
              >
                {!isPayeeChoicePortal &&
                  t('componentData.PayeeVerificationScreen.NeedHelp?')}{' '}
                &nbsp;
                {phoneNo ? (
                  <>
                    <img src={phoneImg} alt='phoneImg_image' width='10' />
                    {countryCode ? `${countryCode}-` : null}
                    {getFormattedPhoneNumber(phoneNo)}
                  </>
                ) : null}{' '}
                {!isPayeeChoicePortal && ext ? <span>ext. {ext}</span> : null}
              </Box>
            )}
            {isPayeeChoicePortal && isPhoneEnable === 1 && (
                <Divider
                  orientation='vertical'
                  flexItem
                  style={{ margin: '0 4px' }}
                />
              )}

            <Box className={clsx(classes.pdf)}>
              <Box
                mx={isPayeeChoicePortal ? 0.5 : 1}
                color={isPayeeChoicePortal ? '#4c4c4c' : 'secondary.main'}
              >
                {!isPayeeChoicePortal ? (
                  t('componentData.PayeeVerificationScreen.Terms')
                ) : isShowEmail ? (
                  <>
                    <img
                      src={mailImg}
                      style={{ marginRight: '4px' }}
                      alt='mailImg_image'
                      width='10'
                    />
                    <span style={{ textDecoration: 'underline' }}>
                      {clientEmail}
                    </span>
                  </>
                ) : null}
              </Box>

              {isPayeeChoicePortal && isShowEmail && (
                <Divider
                  orientation='vertical'
                  flexItem
                  style={{ margin: '0 4px' }}
                />
              )}
              <Box
                mr={isPayeeChoicePortal ? 0.5 : 1}
                color={isPayeeChoicePortal ? '#4c4c4c' : 'secondary.main'}
              >
                {isPayeeChoicePortal ? (
                  <>
                    <img
                      src={lockImg}
                      style={{ marginRight: '4px' }}
                      alt='Lock_Img'
                    />
                    <span style={{ textDecoration: 'underline' }}>
                      {t('componentData.PayeeVerificationScreen.privacyPolicy')}
                    </span>
                  </>
                ) : (
                  t('componentData.PayeeVerificationScreen.Privacy')
                )}
              </Box>
              <Divider
                orientation='vertical'
                flexItem
                style={{ margin: '0 4px' }}
              />
              <Box
                mr={0}
                color={isPayeeChoicePortal ? '#4c4c4c' : 'secondary.main'}
              >
                {isPayeeChoicePortal ? (
                  <>
                    <img src={helpImg} alt='Help_Img' />
                    <span style={{ textDecoration: 'underline' }}>
                      {t('componentData.PayeeVerificationScreen.FAQs')}
                    </span>
                  </>
                ) : (
                  t('componentData.PayeeVerificationScreen.FAQ')
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
}
export default withTranslation()(
  withStyles(styles, { withTheme: true })(Footer)
);
