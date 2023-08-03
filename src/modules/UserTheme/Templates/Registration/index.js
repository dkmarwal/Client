import React, { Component } from "react";
import styles from "./styles";
import select from "~/assets/images/select.png";
import Line1 from "~/assets/images/Line1.png";
import lineGreen from "~/assets/images/lineGreen.png";
import registerActive from "~/assets/images/register_active.png";
import verifyIcongreen from "~/assets/images/verifyIcongreen.png";
import Footer from "../Footer";
import Header from "../Header";
import { withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import clsx from "clsx";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      isMobileView,
      customTheme,
      theme,
      logo,
      classes,
      t,
      isPoweredBy,
      phoneNo,
      ext,
      clientName,
      countryCode,
      isPhoneEnable,
      isPayeeChoicePortal,
      clientEmail,
      isShowEmail
    } = this.props;

    return (
      <>
        <Box className={classes.mainContainer}>
          <Header isMobileView={isMobileView} logo={logo} isPayeeChoicePortal={isPayeeChoicePortal} clientName={clientName} />

          {/* heading & image section */}
          <Box
            style={{ background: customTheme.primaryBackground || "" }}
            className={clsx(classes.subContainer, {
              [classes.subContainerMobile]: isMobileView === true,
            })}
          >
            <Box
              className={clsx(classes.navSection, {
                [classes.navSectionMobile]: isMobileView === true,
              })}
            >
              <Box
                className={clsx(classes.paymentHeading, {
                  [classes.paymentHeadingMobile]: isMobileView === true,
                })}
              >
                <Box
                  component="span"
                  className={clsx(classes.headingText, {
                    [classes.headingTextMobile]: isMobileView === true,
                  })}
                >
                  {t("componentData.PayeeVerificationScreen.YourPaymentOf")}{" "}
                  <Box
                    component="span"
                    style={{ fontWeight: "bold" }}
                    className={`${
                      isMobileView ? classes.emphasizeMobile : classes.emphasize
                    }`}
                  >
                    $6,200.00
                  </Box>{" "}
                  {t("componentData.PayeeVerificationScreen.from")}{" "}
                  <Box
                    component="span"
                    style={{ fontWeight: "bold" }}
                    className={`${
                      isMobileView ? classes.emphasizeMobile : classes.emphasize
                    }`}
                  >
                    {clientName || ""}
                  </Box>{" "}
                  {t("componentData.PayeeVerificationScreen.isJust")} 2{" "}
                  {t("componentData.PayeeVerificationScreen.stepsAway")}
                </Box>
              </Box>

              <Box
                className={clsx(classes.imageContainer, {
                  [classes.imageContainerMobile]: isMobileView === true,
                })}
              >
                {isMobileView ? (
                  <>
                    <Box
                      className={clsx(classes.payeeImages, {
                        [classes.payeeImagesMobile]: isMobileView === true,
                      })}
                    >
                      <img
                        src={verifyIcongreen}
                        alt="verify_image"
                        className={clsx(classes.payeeImageMobile)}
                      />
                      <Box
                        className={clsx(classes.payeeImagesLabel, {
                          [classes.payeeImageLabelMobile]: isMobileView === true,
                        })}
                        style={{ color: "#2B2D30" }}
                      >
                        {t(
                          "componentData.PayeeVerificationScreen.VerifyYourself"
                        )}
                      </Box>
                    </Box>
                    <Box
                      style={{ width: "2%", marginTop: "40px" }}
                      className={clsx(classes.payeeImages, {
                        [classes.payeeImagesMobile]: isMobileView === true,
                      })}
                    >
                      <img
                        src={lineGreen}
                        alt="line_image"
                        className={clsx(classes.payeeLineMobile)}
                      />
                    </Box>
                    <Box
                      className={clsx(classes.payeeImages, {
                        [classes.payeeImagesMobile]: isMobileView === true,
                      })}
                    >
                      <img
                        src={registerActive}
                        alt="register_image"
                        className={clsx(classes.payeeImageMobile)}
                      />
                      <Box
                        className={clsx(classes.payeeImagesLabel, {
                          [classes.payeeImageLabelMobile]: isMobileView === true,
                        })}
                      >
                        {t("componentData.PayeeVerificationScreen.Register")}
                      </Box>
                    </Box>
                    <Box
                      style={{ width: "2%", marginTop: "40px" }}
                      className={clsx(classes.payeeImages, {
                        [classes.payeeImagesMobile]: isMobileView === true,
                      })}
                    >
                      <img
                        src={Line1}
                        alt="line_image"
                        className={clsx(classes.payeeLineMobile)}
                      />
                    </Box>
                    <Box
                      className={clsx(classes.payeeImages, {
                        [classes.payeeImagesMobile]: isMobileView === true,
                      })}
                    >
                      <img
                        src={select}
                        alt="select_image"
                        className={clsx(classes.payeeImageMobile)}
                      />
                      <Box
                        className={clsx(classes.payeeImagesLabel, {
                          [classes.payeeImageLabelMobile]: isMobileView === true,
                        })}
                        style={{ fontSize: isMobileView ? "10px" : "" }}
                      >
                        {t(
                          "componentData.PayeeVerificationScreen.SelectPayment"
                        )}
                      </Box>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box className={clsx(classes.payeeImages)}>
                      <img
                        src={verifyIcongreen}
                        alt="verifyimage"
                        className={clsx(classes.payeeImage)}
                      />
                      <Box
                        className={clsx(classes.payeeImagesLabel)}
                        style={{ color: "#2B2D30" }}
                      >
                        {t(
                          "componentData.PayeeVerificationScreen.VerifyYourself"
                        )}
                      </Box>
                    </Box>
                    <Box
                      style={{ width: "2%", marginTop: "40px" }}
                      className={clsx(classes.payeeImages)}
                    >
                      <img
                        src={lineGreen}
                        alt="lineimage"
                        className={clsx(classes.payeeLine)}
                      />
                    </Box>
                    <Box className={clsx(classes.payeeImages)}>
                      <img
                        src={registerActive}
                        alt="registerimage"
                        className={clsx(classes.payeeImage)}
                      />
                      <Box className={clsx(classes.payeeImagesLabel)}>
                        {t("componentData.PayeeVerificationScreen.Register")}
                      </Box>
                    </Box>
                    <Box
                      style={{ width: "2%", marginTop: "40px" }}
                      className={clsx(classes.payeeImages)}
                    >
                      <img
                        src={Line1}
                        alt="lineimage"
                        className={clsx(classes.payeeLine)}
                      />
                    </Box>
                    <Box className={clsx(classes.payeeImages)}>
                      <img
                        src={select}
                        alt="selectimage"
                        className={clsx(classes.payeeImage)}
                      />
                      <Box className={clsx(classes.payeeImagesLabel)}>
                        {t(
                          "componentData.PayeeVerificationScreen.SelectPayment"
                        )}
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            </Box>

            {/* form section */}
            <Box
              className={clsx(classes.formContainer, {
                [classes.formContainerMobile]: isMobileView === true,
              })}
            >
              <Box
                className={clsx(classes.formHeadingContainer, {
                  [classes.formHeadingContainerMobile]: isMobileView === true,
                })}
              >
                <Box>
                  <Box
                    component="span"
                    className={clsx(classes.formHeading, {
                      [classes.formHeadingMobile]: isMobileView === true,
                    })}
                  >
                    {t("componentData.UserRegistrationScreen.UserRegistration")}{" "}
                  </Box>
                </Box>
                <Box>
                  <Box
                    component="span"
                    className={clsx(classes.formHeadingText, {
                      [classes.formHeadingTextMobile]: isMobileView === true,
                    })}
                  >
                    {t("componentData.UserRegistrationScreen.PleaseHelp")}
                  </Box>
                </Box>
              </Box>

              <Box
                className={clsx(classes.formItemContainer, {
                  [classes.formItemContainerMobile]: isMobileView === true,
                })}
              >
                <Box
                  className={clsx(classes.formItemFormFieldContainer, {
                    [classes.formItemFormFieldContainerMobile]:
                      isMobileView === true,
                  })}
                >
                  <Box
                    className={clsx(classes.formItemFormField, {
                      [classes.formItemformFieldMobile]: isMobileView === true,
                    })}
                  >
                    {t("componentData.UserRegistrationScreen.CreateUsername")}
                    <Box className={classes.iconAlignmentInfo}>
                      <InfoOutlined fontSize="small" />
                    </Box>
                  </Box>
                </Box>
                <Box
                  className={clsx(classes.formItemFormFieldContainer, {
                    [classes.formItemFormFieldContainerMobile]:
                      isMobileView === true,
                  })}
                >
                  <Box
                    className={clsx(classes.formItemFormField, {
                      [classes.formItemformFieldMobile]: isMobileView === true,
                      [classes.itemWidthMobile]: isMobileView === true,
                      [classes.itemWidth]: isMobileView === false,
                    })}
                  >
                    {t("componentData.UserRegistrationScreen.CreatePassword")}
                    <Box className={classes.iconAlignmentEye}>
                      <VisibilityOff fontSize="small" />
                    </Box>
                  </Box>
                  <Box
                    className={clsx(classes.formItemFormField, {
                      [classes.formItemformFieldMobile]: isMobileView === true,
                      [classes.itemWidthMobile]: isMobileView === true,
                      [classes.itemWidth]: isMobileView === false,
                    })}
                  >
                    {t("componentData.UserRegistrationScreen.ConfirmPassword")}
                  </Box>
                </Box>

                <Box
                  className={clsx(classes.formItemFormFieldContainer, {
                    [classes.formItemFormFieldContainerMobile]:
                      isMobileView === true,
                  })}
                >
                  <Box
                    className={clsx(classes.formItemFormField, {
                      [classes.formItemformFieldMobile]: isMobileView === true,
                    })}
                  >
                    {t("componentData.UserRegistrationScreen.SecurityQuestion")}
                  </Box>
                </Box>

                <Box
                  className={clsx(classes.formItemFormFieldContainer, {
                    [classes.formItemFormFieldContainerMobile]:
                      isMobileView === true,
                  })}
                >
                  <Box
                    className={clsx(classes.formItemFormField, {
                      [classes.formItemformFieldMobile]: isMobileView === true,
                    })}
                  >
                    {t("componentData.UserRegistrationScreen.SecurityAnswer")}
                  </Box>
                </Box>

                <Box
                  className={clsx(classes.formItemFormFieldContainer, {
                    [classes.formItemFormFieldContainerMobile]:
                      isMobileView === true,
                  })}
                >
                  <Box
                    className={clsx(classes.formItemFormField, {
                      [classes.formItemformFieldMobile]: isMobileView === true,
                    })}
                  >
                    {t("componentData.UserRegistrationScreen.SSN")}
                    <Box className={classes.iconAlignmentEye}>
                      <VisibilityOff fontSize="small" />
                    </Box>
                    <Box className={classes.iconAlignmentInfo}>
                      <InfoOutlined fontSize="small" />
                    </Box>
                  </Box>
                </Box>

                <Box className={classes.formButtonContainer}>
                  <Box
                    style={{
                      background: customTheme.primaryColor || "",
                      marginLeft: isMobileView === false ? "50px" : "",
                    }}
                    className={classes.formButton}
                  >
                    <Box
                      component="span"
                      style={{
                        color: theme.palette.getContrastText(
                          customTheme.primaryColor
                            ? customTheme.primaryColor
                            : "#FFFFFF"
                        ),
                      }}
                      className={classes.formButtonText}
                    >
                      {t("componentData.UserRegistrationScreen.btnReg")}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* footer section */}
          <Footer
            isMobileView={isMobileView}
            isPoweredBy={isPoweredBy}
            phoneNo={phoneNo}
            ext={ext}
            countryCode={countryCode}
            isPhoneEnable={isPhoneEnable}
            isPayeeChoicePortal={isPayeeChoicePortal}
            clientEmail={clientEmail}
            isShowEmail={isShowEmail}
            logo={logo}
            clientName={clientName}
          />
        </Box>
      </>
    );
  }
}
export default withTranslation()(
  withStyles(styles, { withTheme: true })(Registration)
);
