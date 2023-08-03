import React, { Component } from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/styles';
import {
  Grid,
  Box,
  Tooltip,
  Typography,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import ReactGPicker from 'react-gcolor-picker';
import CancelIcon from '@material-ui/icons/Cancel';
import LockIcon from '@material-ui/icons/Lock';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { payeeThemeLength } from '~/config/entityTypes';
import Phone from '~/components/TextBox/Phone';
import { accessRights } from '~/config/accessRights';

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logo: null,
      themes: null,
      selectedThemeID: null,
      isPrimaryBoxClicked: false,
      isAccentBoxClicked: false,
      isbackgroundBoxClicked: false,
      phoneNumber: null,
      clientEmail: null,
      fromEmail: null,
      isCorrectPhone: true,
      isCorrectClientEmail: true,
      isCorrectFromEmail: true,
      slugUrl: null,
      welcomeMessage: null,
      isPoweredBy: 0,
      phoneExt: null,
      phoneCountryCode: null,
      hasSlugValue: true,
      hasWelcomeMessage: true,
      hasLogoVal: true,
      themeIndex: 0,
      openPopup: false,
      fromEmailDomain: null,
      isPhoneEnable: null,
      senderDisplayName: null,
      isShowEmail:null,
      imageFiles: [],
      images:[],
      hasErrorLogoVal: false,
    };
  }

  componentDidUpdate = (prevProps) => {
    const { brandingData, validationErr } = this.props;
    if (
      Boolean(brandingData) &&
      this.props.brandingData !== prevProps.brandingData
    ) {
      this.setState(
        {
          logo: brandingData.logo || null,
          slugUrl: brandingData.consumerSlugUrl || null,
          welcomeMessage: brandingData.loginWelcomeMsg || null,
          fromEmail: brandingData.fromEmailUserName || null,
          clientEmail: brandingData.supportEmail || null,
          phoneNumber: brandingData.supportPhone || null,
          phoneExt: brandingData.phoneExt || null,
          themes: brandingData.themes || null,
          selectedThemeID: brandingData.clientThemeId,
          isPoweredBy: brandingData.checkStatus || 0,
          fromEmailDomain: brandingData.fromEmailDomain || null,
          phoneCountryCode: brandingData.countryCode || null,
          isPhoneEnable: brandingData.showPhoneNumber || null,
          senderDisplayName: brandingData.fromEmailDisplayName || null,
          isShowEmail: brandingData.isShowEmail || null
        },
        () => {
          this.getSelectedThemeIndex();
        }
      );
    }

    if (validationErr !== prevProps.validationErr) {
      this.setState(
        {
          hasLogoVal: validationErr?.logo ?? true,
          isCorrectPhone: validationErr?.phone ?? true,
          isCorrectClientEmail: validationErr?.clientEmail ?? true,
          isCorrectFromEmail: validationErr?.fromEmail ?? true,
          hasSlugValue: validationErr?.slugURL ?? true,
          hasWelcomeMessage: validationErr?.welcomeMessage ?? true,
        },
        () => {
          this.getSelectedThemeIndex();
        }
      );
    }
  };

  getSelectedThemeIndex = () => {
    const { themes, selectedThemeID } = this.state;
    if (Boolean(themes)) {
      let index = null;
      if (selectedThemeID === null) {
        index = themes.findIndex((x) => x.isDefault === 1);
      } else {
        if (typeof selectedThemeID != 'number') {
          index = themes.findIndex((x) => x.themeName === selectedThemeID);
        } else {
          index = themes.findIndex((x) => x.clientThemeId === selectedThemeID);
        }
        if (index === -1) {
          index = themes.findIndex((x) => x.isDefault === 1);
        }
      }

      this.setState(
        {
          themeIndex: index,
        },
        () => {
          this.setThemeData();
        }
      );
    }
  };

  validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  uploadLogo = (e) => {
    const tempThis = this;
    var FR = new FileReader();
      const files = e.target.files;
      const isValidFile = this.validateFile(files[0]);
      if (!isValidFile) {
        tempThis.setState({hasErrorLogoVal: true});
        return false;
        } else {
        var FR = new FileReader();
        FR.addEventListener('load', function (file) {
          if (Boolean(file.target.result)) {
            tempThis.pushLogoImg(file.target.result);
            tempThis.setState({hasErrorLogoVal: false});
          }
        });
        FR.readAsDataURL(e.target.files[0]);
      }
  };

  pushLogoImg = (logoImg) => {
    this.setState(
      {
        logo: logoImg,
        hasLogoVal: true,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  resetLogo = () => {
    this.setState(
      {
        logo: '',
      },
      () => {
        this.setThemeData();
      }
    );
  };

  selectedTheme = (e) => {
    var allElements = document.querySelectorAll('[boxId="themeBoxDiv"]');
    for (var i = 0, len = allElements.length; i < len; i++) {
      allElements[i].setAttribute('isselected', 'false');
    }
    e.currentTarget.setAttribute('isselected', 'true');

    const name = e.currentTarget.getAttribute('name');
    let tempTheme = this.state.themes;

    tempTheme = tempTheme.map((e) => {
      if (name === e.themeName) {
        return { ...e, isActive: 1 };
      } else {
        return { ...e, isActive: 0 };
      }
    });

    this.setState(
      {
        themes: tempTheme,
        selectedThemeID: name,
        isPrimaryBoxClicked: false,
        isAccentBoxClicked: false,
        isbackgroundBoxClicked: false,
      },
      () => {
        this.getSelectedThemeIndex();
      }
    );
  };

  primaryColorChange = (color) => {
    const { themeIndex } = this.state;
    const tempTheme = this.state.themes;
    tempTheme[themeIndex].themeColorPrimary = color;

    this.setState(
      {
        themes: tempTheme,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  accentColorChange = (color) => {
    const { themeIndex } = this.state;
    const tempTheme = this.state.themes;
    tempTheme[themeIndex].themeColorAccent = color;

    this.setState(
      {
        themes: tempTheme,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  backgroundColorChange = (color) => {
    const { themeIndex } = this.state;
    const tempTheme = this.state.themes;
    tempTheme[themeIndex].themeColorBackground = color;

    this.setState(
      {
        themes: tempTheme,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  primaryColorBoxClicked = () => {
    this.setState({
      isPrimaryBoxClicked: true,
      isAccentBoxClicked: false,
      isbackgroundBoxClicked: false,
    });
  };

  accentColorBoxClicked = () => {
    this.setState({
      isAccentBoxClicked: true,
      isPrimaryBoxClicked: false,
      isbackgroundBoxClicked: false,
    });
  };

  backgroundColorBoxClicked = () => {
    this.setState({
      isAccentBoxClicked: false,
      isPrimaryBoxClicked: false,
      isbackgroundBoxClicked: true,
    });
  };

  closePickerFn = () => {
    this.setState({
      isAccentBoxClicked: false,
      isPrimaryBoxClicked: false,
      isbackgroundBoxClicked: false,
    });
  };

  handlePhoneChange = (e) => {
    this.setState(
      {
        phoneNumber: e?.target?.value?.phone.replace(/[^+{1}0-9]/g, '') ?? null,
        phoneExt: e?.target?.value?.ext.replace(/[^+{1}0-9]/g, '') ?? null,
        phoneCountryCode: e?.target?.value?.ccode ?? null,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  handlePhoneBlur = () => {
    const { phoneNumber } = this.state;
    if (Boolean(phoneNumber) && phoneNumber.length !== 10) {
      this.setState({
        isCorrectPhone: false,
      });
    } else {
      this.setState({
        isCorrectPhone: true,
      });
    }
  };

  handleClientEmail = (e) => {
    this.setState(
      {
        clientEmail: e.target.value,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  handleClientEmailBlur = () => {
    const reg =
      /^(([^>()\[\]\\.,;:\s@"]+(\.[^>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;

    const { clientEmail } = this.state;

    if (Boolean(clientEmail) && !reg.test(clientEmail)) {
      this.setState({
        isCorrectClientEmail: false,
      });
    } else {
      this.setState({
        isCorrectClientEmail: true,
      });
    }
  };

  handleFromEmail = (e) => {
    this.setState(
      {
        fromEmail: e.target.value,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  handleWelcomeMessage = (e) => {
    this.setState(
      {
        welcomeMessage: e.target.value,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  handleFromEmailBlur = () => {
    const reg =
      /^(([^>()\[\]\\.,;:\s@"]+(\.[^>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;

    const { fromEmail, fromEmailDomain } = this.state;
    const finalEmail = fromEmail + fromEmailDomain;

    if (Boolean(finalEmail) && !reg.test(finalEmail)) {
      this.setState({
        isCorrectFromEmail: false,
      });
    } else {
      this.setState({
        isCorrectFromEmail: true,
      });
    }
  };

  handleSlugURL = (e) => {
    this.setState(
      {
        slugUrl: e.target.value.replace(/[^a-zA-Z0-9 @$._-]/g, ''),
      },
      () => {
        this.setThemeData();
      }
    );
  };

  handleSlugURLBlur = () => {
    const { slugUrl } = this.state;
    if (Boolean(slugUrl)) {
      this.setState({
        hasSlugValue: true,
      });
    } else {
      this.setState({
        hasSlugValue: false,
      });
    }
  };

  handleSenderDisplayName = (e) => {
    this.setState(
      {
        senderDisplayName: e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''),
      },
      () => {
        this.setThemeData();
      }
    );
  };

  addNewTheme = () => {
    let tempTheme = this.state.themes;
    if (Boolean(tempTheme)) {
      tempTheme = tempTheme.map((e) => {
        return { ...e, isActive: 0 };
      });
      const index = tempTheme.findIndex((x) => x.isDefault === 1);

      tempTheme.push({
        themeColorAccent: tempTheme[index]?.themeColorAccent,
        themeColorBackground: tempTheme[index]?.themeColorBackground,
        themeColorPrimary: tempTheme[index]?.themeColorPrimary,
        themeName: `custom${tempTheme.length}`,
        isActive: 1,
      });
      this.setState(
        {
          themes: tempTheme,
          selectedThemeID: `custom${Number(tempTheme.length - 1)}`,
          themeIndex: Number(tempTheme.length - 1),
        },
        () => {
          var allElements = document.querySelectorAll('[boxId="themeBoxDiv"]');
          for (var i = 0, len = allElements.length; i < len; i++) {
            if (allElements[i]) {
              allElements[i].setAttribute('isselected', 'false');
            }
          }
          if (allElements[this.state.themeIndex]) {
            allElements[this.state.themeIndex].setAttribute(
              'isselected',
              'true'
            );
          }
          this.setThemeData();
        }
      );
    }
  };

  deleteActiveTheme = () => {
    this.setState({
      openPopup: true,
    });
  };

  poweredByCheck = (e) => {
    this.setState(
      {
        isPoweredBy: Boolean(e.currentTarget.checked) ? 1 : 0,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  handlePopupClose = () => {
    this.setState({
      openPopup: false,
    });
  };

  handlePopupAgree = () => {
    this.setState(
      {
        openPopup: false,
      },
      () => {
        const { selectedThemeID, themes } = this.state;
        let count = 0;
        const tempTheme = [];
        const index = themes.findIndex((x) => x.isDefault === 1);
        themes.map((data) => {
          const isNum = typeof selectedThemeID;
          if (
            (isNum !== 'number' && data.themeName !== selectedThemeID) ||
            (isNum === 'number' && data.clientThemeId !== selectedThemeID)
          ) {
            if (data.themeName !== 'Default') {
              count += 1;
              const tempdata = {
                ...data,
                themeName: `custom${count}`,
                isActive: 0,
              };
              tempTheme.push(tempdata);
            } else {
              const tempdata = {
                ...data,
                isActive: 1,
              };
              tempTheme.push(tempdata);
            }
          }
        });

        this.setState(
          {
            themes: tempTheme,
            selectedThemeID: 'Default',
            themeIndex: index,
          },
          () => {
            const index = themes.findIndex((x) => x.isDefault === 1);

            var allElements = document.querySelectorAll(
              '[boxId="themeBoxDiv"]'
            );
            for (var i = 0, len = allElements.length; i < len; i++) {
              if (allElements[i]) {
                allElements[i].setAttribute('isselected', 'false');
              }
            }
            if (allElements[index]) {
              allElements[index].setAttribute('isselected', 'true');
            }

            this.setThemeData();
          }
        );
      }
    );
  };

  handlePhoneOnOff = (e) => {
    this.setState(
      {
        isPhoneEnable: e.currentTarget.checked === true ? 1 : 0,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  handleEmailOnOff = (e) => {
    this.setState(
      {
        isShowEmail: e.currentTarget.checked === true ? 1 : 0,
      },
      () => {
        this.setThemeData();
      }
    );
  };

  setThemeData = () => {
    const {
      logo,
      themes,
      selectedThemeID,
      phoneNumber,
      clientEmail,
      fromEmail,
      isPoweredBy,
      slugUrl,
      themeIndex,
      phoneExt,
      phoneCountryCode,
      isPhoneEnable,
      senderDisplayName,
      welcomeMessage,
      isShowEmail
    } = this.state;

    this.props.userThemeData({
      logo: logo,
      themes: themes,
      phone: phoneNumber,
      phoneExt: phoneExt,
      clientEmail: clientEmail,
      fromEmail: fromEmail,
      slugUrl: slugUrl,
      welcomeMessage: welcomeMessage,
      isPoweredBy: isPoweredBy,
      selectedThemeID: selectedThemeID,
      themeIndex: themeIndex,
      phoneCountryCode: phoneCountryCode,
      isPhoneEnable: isPhoneEnable,
      senderDisplayName: senderDisplayName,
      isShowEmail:isShowEmail
    });
  };

  render() {
    const { classes, t } = this.props;
    const {
      logo,
      themes,
      isPrimaryBoxClicked,
      isAccentBoxClicked,
      isbackgroundBoxClicked,
      phoneNumber,
      isCorrectPhone,
      isCorrectClientEmail,
      clientEmail,
      fromEmail,
      slugUrl,
      isPoweredBy,
      phoneExt,
      phoneCountryCode,
      isCorrectFromEmail,
      hasSlugValue,
      hasLogoVal,
      hasWelcomeMessage,
      themeIndex,
      openPopup,
      fromEmailDomain,
      isPhoneEnable,
      senderDisplayName,
      welcomeMessage,
      isShowEmail,
      hasErrorLogoVal
    } = this.state;
    const { user } = this.props;
    const bankParentProfileId = user.userData.activeBankParentProfileId;

    const isBrandingEditEnable =
      (user.userRoles &&
        user.userRoles.includes(accessRights['BRANDING_SUPPLIER_SITE_EDIT'])) ||
      false;

    const str1 = Boolean(fromEmail) ? fromEmail : '';
    const str2 = Boolean(fromEmailDomain) ? fromEmailDomain : '';
    const fromEmailTooltipText = str1 + str2;

    return (
      <>
        <div>
          <Grid container>
            <Box pr={2} mr={2} className={classes.SideBarBox}>
              <Typography variant='h3'>
                <b>{t('componentData.themes.Note')}</b>{' '}
                {t('componentData.themes.noteTxt')}
              </Typography>

              <Box className={classes.logoBox}>
                <Typography variant='h1'>
                  {t('componentData.themes.Logo')}
                  <Tooltip
                    title={t('componentData.themes.logoTooltip')}
                    placement='left-bottom'
                    arrow={true}
                  >
                    <InfoOutlinedIcon />
                  </Tooltip>
                </Typography>

                <Box className='logoHolder'>
                  <label
                    htmlFor='icon-button-file'
                    className={classes.logoBoxCircle}
                    style={{
                      pointerEvents: !isBrandingEditEnable ? 'none' : 'auto',
                      opacity: !isBrandingEditEnable ? '0.5' : '1',
                    }}
                  >
                    {!Boolean(logo) ? (
                      <p>{t('componentData.themes.UploadLogo')}</p>
                    ) : (
                      <img src={logo} alt='logo' />
                    )}

                    <input
                      disabled={!isBrandingEditEnable}
                      accept='image/*'
                      id='icon-button-file'
                      type='file'
                      onChange={(e)=>{this.uploadLogo(e)}}
                    />

                    {isBrandingEditEnable ? (
                      <Box className={classes.cameraBtn}>
                        <IconButton
                          color='primary'
                          aria-label='upload picture'
                          component='span'
                        >
                          <PhotoCamera />
                        </IconButton>
                      </Box>
                    ) : null}
                  </label>

                  {logo && isBrandingEditEnable && (
                    <Box
                      className={classes.logoCloseBtn}
                      onClick={() => this.resetLogo()}
                    >
                      <CloseIcon />
                    </Box>
                  )}
                </Box>
                {hasErrorLogoVal ? (
                  <h2>{t('componentData.themes.logoTooltip')}</h2>
                ): null}
                {!hasLogoVal ? (
                  <h2>{t('componentData.themes.LogoRequired')}</h2>
                ) : null}
              </Box>

              <Box className={classes.colorThemeBox}>
                <Typography variant='h1'>
                  {t('componentData.themes.Theme')}
                  {Boolean(themes) ? (
                    themes[themeIndex]?.themeName === 'Default' ? (
                      <label>{t('componentData.themes.DefaultTheme')}</label>
                    ) : (
                      <span
                        onClick={() => this.deleteActiveTheme()}
                        style={{
                          pointerEvents: !isBrandingEditEnable
                            ? 'none'
                            : 'auto',
                          opacity: !isBrandingEditEnable ? '0.5' : '1',
                        }}
                      >
                        {t('componentData.themes.DeleteSelected')}
                      </span>
                    )
                  ) : null}
                </Typography>

                <Box
                  className={classes.themeBoxContainer}
                  style={{
                    pointerEvents: !isBrandingEditEnable ? 'none' : 'auto',
                    opacity: !isBrandingEditEnable ? '0.5' : '1',
                  }}
                >
                  {Boolean(themes) ? (
                    <>
                      {themes.map((e, index) => {
                        return (
                          <Box
                            key={index}
                            colorAccent={e.themeColorAccent}
                            colorBackground={e.themeColorBackground}
                            colorPrimary={e.themeColorPrimary}
                            name={e.themeName || 'Default'}
                            className={clsx(classes.themeBox)}
                            boxId='themeBoxDiv'
                            onClick={(e) => this.selectedTheme(e)}
                            isSelected={e.isActive === 1 ? 'true' : 'false'}
                          >
                            <span
                              style={{ background: e.themeColorPrimary }}
                            ></span>
                            <span
                              style={{ background: e.themeColorAccent }}
                            ></span>
                            <span
                              style={{ background: e.themeColorBackground }}
                            ></span>

                            {e.isDefault === 1 ? (
                              <Box className='lockIconHolder'>
                                <Box className='lockIcon'>
                                  <LockIcon />
                                </Box>
                              </Box>
                            ) : null}

                            <Box className='checkIcon'>
                              <CheckCircleIcon />
                            </Box>
                          </Box>
                        );
                      })}
                      <Box
                        className={clsx(classes.themeBox)}
                        id='addThemeBtn'
                        onClick={() => this.addNewTheme()}
                        disabled={
                          Boolean(themes) && themes.length === payeeThemeLength
                            ? true
                            : false
                        }
                        style={{
                          fontSize:
                            user.userData.locale !== 'en' ? '13px' : '16px',
                          lineHeight:
                            user.userData.locale !== 'en' ? '13px' : '20px',
                        }}
                      >
                        {t('componentData.themes.AddNew')}
                      </Box>
                    </>
                  ) : (
                    <Typography variant='caption'>
                      {t('componentData.themes.ThemesNotFound')}
                    </Typography>
                  )}
                </Box>

                {Boolean(themes) ? (
                  <Box
                    className={classes.colorSelectionBox}
                    style={{
                      pointerEvents: !isBrandingEditEnable ? 'none' : 'auto',
                      opacity: !isBrandingEditEnable ? '0.5' : '1',
                    }}
                  >
                    <Grid container style={{ marginBottom: 15 }}>
                      <Grid
                        item
                        xs={6}
                        style={{ paddingTop: 3 }}
                        className='leftBox'
                      >
                        <Typography variant='h4'>
                          {t('componentData.themes.Buttons')}
                        </Typography>
                        <Tooltip
                          title={t('componentData.themes.buttonsTooltip')}
                          placement='left-bottom'
                          arrow={true}
                        >
                          <InfoOutlinedIcon />
                        </Tooltip>
                      </Grid>

                      <Grid item xs={6} style={{ position: 'relative' }}>
                        <Box
                          className={classes.colorPickerBox}
                          onClick={(e) => this.primaryColorBoxClicked(e)}
                          style={{
                            pointerEvents:
                              themeIndex ===
                              themes.findIndex((x) => x.isDefault === 1)
                                ? 'none'
                                : 'auto',
                          }}
                        >
                          <label
                            style={{
                              background: Boolean(themes)
                                ? themes[themeIndex]?.themeColorPrimary
                                : null,
                            }}
                          ></label>

                          <span>
                            {Boolean(themes)
                              ? themes[themeIndex]?.themeColorPrimary
                              : null}
                          </span>
                        </Box>

                        {themeIndex ===
                        themes.findIndex((x) => x.isDefault === 1) ? (
                          <Box className={classes.colorIcockIcon}>
                            <LockIcon />
                          </Box>
                        ) : null}

                        <div className={classes.PhotoshopPickerBox}>
                          {Boolean(isPrimaryBoxClicked) && (
                            <>
                              <CancelIcon
                                className={classes.closePicker}
                                onClick={this.closePickerFn}
                              />
                              <ReactGPicker
                                value={themes[themeIndex]?.themeColorPrimary}
                                onChange={this.primaryColorChange}
                                showAlpha={false}
                                solid={true}
                                gradient={false}
                                defaultColors={[]}
                                format='hex'
                              />
                            </>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container style={{ marginBottom: 15 }}>
                      <Grid
                        item
                        xs={6}
                        style={{ paddingTop: 3 }}
                        className='leftBox'
                      >
                        <Typography variant='h4'>
                          {t('componentData.themes.Highlight')}
                        </Typography>
                        <Tooltip
                          title={t('componentData.themes.HighlightTooltip')}
                          placement='left-bottom'
                          arrow={true}
                        >
                          <InfoOutlinedIcon />
                        </Tooltip>
                      </Grid>

                      <Grid item xs={6} style={{ position: 'relative' }}>
                        <Box
                          className={classes.colorPickerBox}
                          onClick={(e) => this.accentColorBoxClicked(e)}
                          style={{
                            pointerEvents:
                              themeIndex ===
                              themes.findIndex((x) => x.isDefault === 1)
                                ? 'none'
                                : 'auto',
                          }}
                        >
                          <label
                            style={{
                              background: Boolean(themes)
                                ? themes[themeIndex]?.themeColorAccent
                                : null,
                            }}
                          ></label>

                          <span>
                            {Boolean(themes)
                              ? themes[themeIndex]?.themeColorAccent
                              : null}
                          </span>
                        </Box>

                        {themeIndex ===
                        themes.findIndex((x) => x.isDefault === 1) ? (
                          <Box className={classes.colorIcockIcon}>
                            <LockIcon />
                          </Box>
                        ) : null}

                        <div className={classes.PhotoshopPickerBox}>
                          {Boolean(isAccentBoxClicked) && (
                            <>
                              <CancelIcon
                                className={classes.closePicker}
                                onClick={this.closePickerFn}
                              />
                              <ReactGPicker
                                value={themes[themeIndex]?.themeColorAccent}
                                onChange={this.accentColorChange}
                                showAlpha={false}
                                solid={true}
                                gradient={false}
                                defaultColors={[]}
                                format='hex'
                              />
                            </>
                          )}
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container style={{ marginBottom: 15 }}>
                      <Grid
                        item
                        xs={6}
                        style={{ paddingTop: 3 }}
                        className='leftBox'
                      >
                        <Typography variant='h4'>
                          {t('componentData.themes.Background')}
                        </Typography>
                        <Tooltip
                          title={t('componentData.themes.BackgroundTooltip')}
                          placement='left-bottom'
                          arrow={true}
                        >
                          <InfoOutlinedIcon />
                        </Tooltip>
                      </Grid>

                      <Grid item xs={6} style={{ position: 'relative' }}>
                        <Box
                          className={classes.colorPickerBox}
                          onClick={(e) => this.backgroundColorBoxClicked(e)}
                          style={{
                            pointerEvents:
                              themeIndex ===
                              themes.findIndex((x) => x.isDefault === 1)
                                ? 'none'
                                : 'auto',
                          }}
                        >
                          <label
                            style={{
                              background: Boolean(themes)
                                ? themes[themeIndex]?.themeColorBackground
                                : null,
                            }}
                          ></label>

                          <span>
                            {Boolean(themes)
                              ? themes[themeIndex]?.themeColorBackground
                              : null}
                          </span>
                        </Box>

                        {themeIndex ===
                        themes.findIndex((x) => x.isDefault === 1) ? (
                          <Box className={classes.colorIcockIcon}>
                            <LockIcon />
                          </Box>
                        ) : null}

                        <div className={classes.PhotoshopPickerBox}>
                          {Boolean(isbackgroundBoxClicked) && (
                            <>
                              <CancelIcon
                                className={classes.closePicker}
                                onClick={this.closePickerFn}
                              />
                              <ReactGPicker
                                value={themes[themeIndex]?.themeColorBackground}
                                onChange={this.backgroundColorChange}
                                showAlpha={false}
                                solid={true}
                                gradient={false}
                                defaultColors={[]}
                                format='hex'
                              />
                            </>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </Box>
                ) : null}
              </Box>

              <Box className={classes.phoneBox}>
                <Phone
                  error={isCorrectPhone ? false : true}
                  helperText={
                    isCorrectPhone
                      ? null
                      : t('componentData.themes.phoneValidation')
                  }
                  disabled={!isBrandingEditEnable}
                  id='phone'
                  name='Phone'
                  ext={phoneExt || ''}
                  value={phoneNumber || ''}
                  ccode={phoneCountryCode || ''}
                  isExt={true}
                  prefixCcode='+1'
                  fullWidth={true}
                  variant='outlined'
                  onChange={(e) => this.handlePhoneChange(e)}
                  onBlur={() => this.handlePhoneBlur()}
                  required={true}
                  removeFocus={true}
                />
              </Box>

              <Box className={classes.OnOffPhone}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPhoneEnable}
                      onChange={(e) => this.handlePhoneOnOff(e)}
                      name='isPhoneEnable'
                      color='primary'
                    />
                  }
                  label={t('componentData.themes.ShowPhoneNumber')}
                />
              </Box>

              <Box className={classes.phoneBox}>
                <TextField
                  disabled={!isBrandingEditEnable}
                  id='outlined-basic'
                  label={t('componentData.themes.ClientEmail')}
                  variant='outlined'
                  error={isCorrectClientEmail ? false : true}
                  helperText={
                    isCorrectClientEmail
                      ? null
                      : t('componentData.themes.ClientEmailErr')
                  }
                  onChange={(e) => this.handleClientEmail(e)}
                  onBlur={() => this.handleClientEmailBlur()}
                  value={clientEmail}
                  InputLabelProps={{
                    shrink: Boolean(clientEmail) ? true : false,
                  }}
                  required={true}
                  className={user.userData.locale !== 'en' ? 'longTxt' : null}
                />
              </Box>
              <Box className={classes.OnOffPhone}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isShowEmail}
                      onChange={(e) => this.handleEmailOnOff(e)}
                      name='isShowEmail'
                      color='primary'
                    />
                  }
                  label={t('componentData.themes.ShowClientEmail')}
                />
              </Box>

              {!this.props.user.isPayeeChoicePortal && (
                <Box className={classes.phoneBox}>
                  <TextField
                    disabled={
                      bankParentProfileId === 1 && isBrandingEditEnable
                        ? false
                        : true
                    }
                    id='outlined-basic'
                    label={t('componentData.themes.senderDisplayName')}
                    variant='outlined'
                    onChange={(e) => this.handleSenderDisplayName(e)}
                    value={senderDisplayName}
                    InputLabelProps={{
                      shrink: Boolean(senderDisplayName) ? true : false,
                    }}
                    inputProps={{
                      maxLength: 255,
                    }}
                    required={false}
                    className={user.userData.locale !== 'en' ? 'longTxt' : null}
                  />
                  <Tooltip
                    title={t('componentData.themes.senderDisplayNameTooltip')}
                    placement='right-bottom'
                    arrow={true}
                    className={'tooltip'}
                  >
                    <InfoOutlinedIcon />
                  </Tooltip>
                </Box>
              )}
              <Box className={classes.phoneBox}>
                <TextField
                  id='fromEmail'
                  label={t('componentData.themes.FromEmail')}
                  variant='outlined'
                  value={fromEmail}
                  title={fromEmailTooltipText}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required={
                    bankParentProfileId === 1 && isBrandingEditEnable
                      ? true
                      : false
                  }
                  disabled={
                    bankParentProfileId === 1 && isBrandingEditEnable
                      ? false
                      : true
                  }
                  error={isCorrectFromEmail ? false : true}
                  helperText={
                    isCorrectFromEmail
                      ? null
                      : t('componentData.themes.FromEmailErr')
                  }
                  onChange={(e) => this.handleFromEmail(e)}
                  onBlur={() => this.handleFromEmailBlur()}
                  className={user.userData.locale !== 'en' ? 'longTxt' : null}
                />
                {Boolean(fromEmailDomain) && (
                  <>
                    <Typography
                      variant='h6'
                      className={classes.fromDomainName}
                      title={fromEmailTooltipText}
                    >
                      {fromEmailDomain}
                    </Typography>
                  </>
                )}

                <Tooltip
                  title={t('componentData.themes.FromEmailTooltip')}
                  placement='right-bottom'
                  arrow={true}
                  className={'tooltip'}
                >
                  <InfoOutlinedIcon />
                </Tooltip>
              </Box>

              <Box className={classes.phoneBox}>
                <TextField
                  id='outlined-basic'
                  label={t('componentData.themes.URLSlug')}
                  variant='outlined'
                  value={slugUrl}
                  InputLabelProps={{
                    shrink: Boolean(slugUrl) ? true : false,
                  }}
                  required={
                    bankParentProfileId === 1 && isBrandingEditEnable
                      ? true
                      : false
                  }
                  disabled={
                    bankParentProfileId === 1 && isBrandingEditEnable
                      ? false
                      : true
                  }
                  error={hasSlugValue ? false : true}
                  helperText={
                    hasSlugValue ? null : t('componentData.themes.URLSlugErr')
                  }
                  onChange={(e) => this.handleSlugURL(e)}
                  onBlur={() => this.handleSlugURLBlur()}
                  autoComplete='off'
                  inputProps={{
                    maxLength: 50,
                  }}
                  className={user.userData.locale !== 'en' ? 'longTxt' : null}
                />
                <Tooltip
                  title={t('componentData.themes.URLSlugTooltip')}
                  placement='right-bottom'
                  arrow={true}
                  className={'tooltip'}
                >
                  <InfoOutlinedIcon />
                </Tooltip>
              </Box>
              {!this.props.user.isPayeeChoicePortal && (
                <Box className={classes.phoneBox}>
                  <TextField
                    id='welcomeMessage'
                    label={t('componentData.themes.WelcomeMessage')}
                    variant='outlined'
                    multiline
                    rows={5}
                    value={welcomeMessage || ''}
                    InputLabelProps={{
                      shrink: Boolean(welcomeMessage) ? true : false,
                    }}
                    inputProps={{
                      maxLength: 200,
                    }}
                    required={true}
                    error={hasWelcomeMessage ? false : true}
                    helperText={
                      hasWelcomeMessage
                        ? null
                        : t('componentData.themes.WelcomeMessageErr')
                    }
                    onChange={(e) => this.handleWelcomeMessage(e)}
                    autoComplete='off'
                    className={user.userData.locale !== 'en' ? 'longTxt' : null}
                  />
                </Box>
              )}

              {!this.props.user.isPayeeChoicePortal && (
                <Box className={classes.poweredByBox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isPoweredBy}
                        onChange={(e) => this.poweredByCheck(e)}
                        name='checkedB'
                        color='primary'
                        disabled={!isBrandingEditEnable}
                      />
                    }
                    label={t('componentData.themes.PoweredByCitiLogo')}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </div>

        <Dialog
          open={openPopup}
          onClose={this.handlePopupClose}
          aria-labelledby='responsive-dialog-title'
          className={classes.confirmationDialog}
        >
          <DialogContent>
            <DialogContentText>
              {t('componentData.themes.popupContent')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handlePopupClose} color='primary'>
              {t('componentData.themes.Cancel')}
            </Button>
            <Button onClick={this.handlePopupAgree} color='primary' autoFocus>
              {t('componentData.themes.Delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(withStyles(styles)(SideBar))
);
