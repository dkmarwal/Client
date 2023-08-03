import React, { Component } from "react";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import {
  Grid,
  Tabs,
  Tab,
  Button,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  uploadFaq,
  uploadPrivacyPolicy,
  fetchBrandingData,
  fetchFAQData,
  fetchPrivacyPolicyData,
  fetchTermsAndConditionData,
  uploadTermsAndCondition,
} from "~/redux/helpers/B2C/branding";

import { withTranslation } from "react-i18next";
import Notification from "~/components/Notification";
import PropTypes from "prop-types";
import UploadDocuments from "~/modules/UploadDocuments";
import { accessRights } from "~/config/accessRights";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: "70%" }}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

class UploadBrandingDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationMSg: null,
      notificationVariant: null,
      selectedTabValue: 0,
      brandingData: null,
      apiFaqFileData: {},
      apiPrivacyFileData: {},
      apiTACFileData: {},
      isEditorEnable: false,
      receivedFileData: null,
      receivedHTMLData: null,
      enableSubmitBtn: true,
      selectedTabID: 0,
      isFaqLoaded: null,
      isTACLoaded: null,
      isPPLoaded: null,
      isUploading: false,
      isAPIFile: null,
    };
  }

  componentDidMount() {
    this.getDefaultActiveTabs();
    this.fetchBrandingData();
  }

  handleChange = (event, newValue) => {
    this.setState(
      {
        selectedTabValue: newValue,
        selectedTabID: Number(
          event.currentTarget?.getAttribute("id")?.split("vertical-tab-")[1]
        ),
      },
      () => {
        this.submitBtnViewFn();
      }
    );
  };

  getDefaultActiveTabs = () => {
    const { user } = this.props;
    const isFAQEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["BRANDING_FAQS_VIEW"])) ||
      false;

    const isPrivacyPolicyEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["BRANDING_PRIVACY_POLICY_VIEW"]
        )) ||
      false;

    const isTACEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["BRANDING_TERM_AND_CONDITION_VIEW"]
        )) ||
      false;

    if (isFAQEnabled) {
      this.setState(
        {
          selectedTabID: 0,
        },
        () => {
          this.submitBtnViewFn();
        }
      );
    } else if (!isFAQEnabled && isPrivacyPolicyEnabled) {
      this.setState(
        {
          selectedTabID: 1,
        },
        () => {
          this.submitBtnViewFn();
        }
      );
    } else if (!isFAQEnabled && !isPrivacyPolicyEnabled && isTACEnabled) {
      this.setState(
        {
          selectedTabID: 2,
        },
        () => {
          this.submitBtnViewFn();
        }
      );
    } else if (!isFAQEnabled && isPrivacyPolicyEnabled && !isTACEnabled) {
      this.setState(
        {
          selectedTabID: 1,
        },
        () => {
          this.submitBtnViewFn();
        }
      );
    }
  };

  submitBtnViewFn = () => {
    const { selectedTabID } = this.state;
    const { user } = this.props;
    const isFAQEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["BRANDING_FAQS_EDIT"])) ||
      false;

    const isPrivacyPolicyEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["BRANDING_PRIVACY_POLICY_EDIT"]
        )) ||
      false;

    const isTACEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["BRANDING_TERM_AND_CONDITION_EDIT"]
        )) ||
      false;

    if (selectedTabID === 0 && !isFAQEnabled) {
      this.setState({
        enableSubmitBtn: false,
      });
    } else if (selectedTabID === 1 && !isPrivacyPolicyEnabled) {
      this.setState({
        enableSubmitBtn: false,
      });
    } else if (selectedTabID === 2 && !isTACEnabled) {
      this.setState({
        enableSubmitBtn: false,
      });
    } else {
      this.setState({
        enableSubmitBtn: true,
      });
    }

    const slugURL = this.state?.brandingData?.consumerSlugUrl ?? null;
    if (Boolean(slugURL)) {
      if (selectedTabID === 0) {
        this.getFAQData();
      } else if (selectedTabID === 1) {
        this.getPrivacyPolicyData();
      } else if (selectedTabID === 2) {
        this.getTermsAndConditionData();
      }
    }
  };

  fetchBrandingData = () => {
    const clientId = this.props.user.userData.portalProfileId;
    const appType = this.props.user.userData.appType;
    fetchBrandingData(clientId, appType).then((response) => {
      if (!response.error) {
        this.setState(
          {
            brandingData: response.data || null,
          },
          () => {
            this.getFAQData();
            this.getPrivacyPolicyData();
            this.getTermsAndConditionData();
          }
        );
      } else {
        this.setState({
          notificationMSg: response.message,
          notificationVariant: "error",
        });
      }
    });
  };

  getFAQData = () => {
    this.setState(
      {
        isFaqLoaded: false,
      },
      () => {
        const { consumerSlugUrl } = this.state.brandingData;
        fetchFAQData(consumerSlugUrl).then((response) => {
          if (!response.error) {
            if (response["content-disposition"] === null) {
              this.setState({
                ...this.state,
                isFaqLoaded: true,
                apiFaqFileData: {
                  type: "html",
                  data: JSON.parse(response.data).data.htmlContent || null,
                },
              });
            } else {
              const type = response["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
              });

              let filename = response["content-disposition"]?.split("filename=")[1]?.trim();
              filename = Boolean(filename) ? filename?.replace(/^"|"$/g, "") : filename;
              filename = Boolean(filename) ? /_(.+)/.exec(filename)[1] : filename;

              const getFileSize = Number(response["content-length"]);

              this.setState({
                ...this.state,
                isFaqLoaded: true,
                apiFaqFileData: {
                  type: "file",
                  data: data || null,
                  name: filename,
                  size: getFileSize,
                },
              });
            }
          } else {
            this.setState({
              isFaqLoaded: true,
            });
          }
        });
      }
    );
  };

  getPrivacyPolicyData = () => {
    this.setState(
      {
        isPPLoaded: false,
      },
      () => {
        const { consumerSlugUrl } = this.state.brandingData;
        fetchPrivacyPolicyData(consumerSlugUrl).then((response) => {
          if (!response.error) {
            if (response["content-disposition"] === null) {
              this.setState({
                ...this.state,
                isPPLoaded: true,
                apiPrivacyFileData: {
                  type: "html",
                  data: JSON.parse(response.data).data.htmlContent || null,
                },
              });
            } else {
              const type = response["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
              });

              let filename = response["content-disposition"]?.split("filename=")[1]?.trim();
              filename = Boolean(filename) ? filename?.replace(/^"|"$/g, "") : filename;
              filename = Boolean(filename) ? /_(.+)/.exec(filename)[1] : filename;

              const getFileSize = Number(response["content-length"]);

              this.setState({
                ...this.state,
                isPPLoaded: true,
                apiPrivacyFileData: {
                  type: "file",
                  data: data || null,
                  name: filename,
                  size: getFileSize,
                },
              });
            }
          } else {
            this.setState({
              isPPLoaded: true,
            });
          }
        });
      }
    );
  };

  getTermsAndConditionData = () => {
    this.setState(
      {
        isTACLoaded: false,
      },
      () => {
        const { consumerSlugUrl } = this.state.brandingData;
        fetchTermsAndConditionData(consumerSlugUrl).then((response) => {
          if (!response.error) {
            if (response["content-disposition"] === null) {
              this.setState({
                ...this.state,
                isTACLoaded: true,
                apiTACFileData: {
                  type: "html",
                  data: JSON.parse(response.data).data.htmlContent || null,
                },
              });
            } else {
              const type = response["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
              });

              let filename = response["content-disposition"]?.split("filename=")[1]?.trim();
              filename = Boolean(filename) ? filename?.replace(/^"|"$/g, "") : filename;
              filename = Boolean(filename) ? /_(.+)/.exec(filename)[1] : filename;

              const getFileSize = Number(response["content-length"]);

              this.setState({
                ...this.state,
                isTACLoaded: true,
                apiTACFileData: {
                  type: "file",
                  data: data || null,
                  name: filename,
                  size: getFileSize,
                },
              });
            }
          } else {
            this.setState({
              isTACLoaded: true,
            });
          }
        });
      }
    );
  };

  receivedFileData = (data) => {
    if (Boolean(data)) {
      this.setState({
        isEditorEnable: data.isCheked,
        receivedFileData: data.fileData,
        receivedHTMLData: data.htmlData,
        isAPIFile: data.isAPiFile,
      });
    }
  };

  saveBtnClicked = () => {
    const {
      selectedTabID,
      isEditorEnable,
      receivedFileData,
      receivedHTMLData,
      isAPIFile,
    } = this.state;

    if (isAPIFile && !isEditorEnable && Boolean(receivedFileData)) {
      this.setState({
        notificationMSg: this.props.t(
          "componentData.documents.uploadNewFileTxt"
        ),
        notificationVariant: "error",
      });
    } else {
      const formData = new FormData();

      if (!isEditorEnable && Boolean(receivedFileData)) {
        formData.append("file", receivedFileData);
      } else if (isEditorEnable && Boolean(receivedHTMLData)) {
        formData.append("htmlContent", receivedHTMLData);
      }

      if (selectedTabID === 0) {
        this.setState(
          {
            apiFaqFileData: {
              type: !isEditorEnable && receivedFileData ? "file" : "html",
              data:
                !isEditorEnable && receivedFileData
                  ? receivedFileData
                  : receivedHTMLData,
              name:
                !isEditorEnable && receivedFileData
                  ? receivedFileData.name
                  : null,
              size:
                !isEditorEnable && receivedFileData
                  ? receivedFileData.size
                  : null,
            },
          },
          () => {
            this.saveFaqData(formData);
          }
        );
      } else if (selectedTabID === 1) {
        this.setState(
          {
            apiPrivacyFileData: {
              type: !isEditorEnable && receivedFileData ? "file" : "html",
              data:
                !isEditorEnable && receivedFileData
                  ? receivedFileData
                  : receivedHTMLData,
              name:
                !isEditorEnable && receivedFileData
                  ? receivedFileData.name
                  : null,
              size:
                !isEditorEnable && receivedFileData
                  ? receivedFileData.size
                  : null,
            },
          },
          () => {
            this.savePrivacyPolicyData(formData);
          }
        );
      } else if (selectedTabID === 2) {
        this.setState(
          {
            apiTACFileData: {
              type: !isEditorEnable && receivedFileData ? "file" : "html",
              data:
                !isEditorEnable && receivedFileData
                  ? receivedFileData
                  : receivedHTMLData,
              name:
                !isEditorEnable && receivedFileData
                  ? receivedFileData.name
                  : null,
              size:
                !isEditorEnable && receivedFileData
                  ? receivedFileData.size
                  : null,
            },
          },
          () => {
            this.saveTermsAndConditionData(formData);
          }
        );
      }
    }
  };

  saveFaqData = (data) => {
    this.setState(
      {
        isUploading: true,
      },
      () => {
        uploadFaq(data).then((response) => {
          if (!response.error) {
            this.setState({
              notificationMSg: response.message,
              notificationVariant: "success",
              isUploading: false,
            });
          } else {
            this.setState({
              notificationMSg: response.message,
              notificationVariant: "error",
              isUploading: false,
            });
          }
        });
      }
    );
  };

  savePrivacyPolicyData = (data) => {
    this.setState(
      {
        isUploading: true,
      },
      () => {
        uploadPrivacyPolicy(data).then((response) => {
          if (!response.error) {
            this.setState({
              notificationMSg: response.message,
              notificationVariant: "success",
              isUploading: false,
            });
          } else {
            this.setState({
              notificationMSg: response.message,
              notificationVariant: "error",
              isUploading: false,
            });
          }
        });
      }
    );
  };

  saveTermsAndConditionData = (data) => {
    this.setState(
      {
        isUploading: true,
      },
      () => {
        uploadTermsAndCondition(data).then((response) => {
          if (!response.error) {
            this.setState({
              notificationMSg: response.message,
              notificationVariant: "success",
              isUploading: false,
            });
          } else {
            this.setState({
              notificationMSg: response.message,
              notificationVariant: "error",
              isUploading: false,
            });
          }
        });
      }
    );
  };

  render() {
    const { classes, t, user } = this.props;
    const {
      notificationMSg,
      notificationVariant,
      selectedTabValue,
      enableSubmitBtn,
      apiFaqFileData,
      apiPrivacyFileData,
      apiTACFileData,
      isFaqLoaded,
      isPPLoaded,
      isTACLoaded,
      isUploading,
    } = this.state;

    const isFAQEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["BRANDING_FAQS_VIEW"])) ||
      false;

    const isPrivacyPolicyEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["BRANDING_PRIVACY_POLICY_VIEW"]
        )) ||
      false;

    const isTACEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["BRANDING_TERM_AND_CONDITION_VIEW"]
        )) ||
      false;

    return (
      <>
        <div className={classes.themeBox}>
          <Grid container>
            <Grid container>
              <Grid item lg={3} className={classes.borderRight}>
                <Box width={1} justifyContent="flex-start" alignItems="start">
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={selectedTabValue}
                    onChange={this.handleChange}
                    aria-label=""
                    className={classes.tabs}
                  >
                    {isFAQEnabled && (
                      <Tab
                        label={t("componentData.documents.FAQs")}
                        {...a11yProps(0)}
                      />
                    )}

                    {isPrivacyPolicyEnabled && (
                      <Tab
                        label={t("componentData.documents.PrivacyPolicy")}
                        {...a11yProps(1)}
                      />
                    )}

                    {isTACEnabled && (
                      <Tab
                        label={t("componentData.documents.TermsConditions")}
                        {...a11yProps(2)}
                      />
                    )}
                  </Tabs>{" "}
                </Box>
              </Grid>
              <Grid item lg={9}>
                {isFAQEnabled && (
                  <TabPanel value={selectedTabValue} index={0}>
                    {!isFaqLoaded ? (
                      <CircularProgress style={{ margin: "50px 0 0 30px" }} />
                    ) : (
                      <UploadDocuments
                        headingTxt={t("componentData.documents.UploadFAQTxt")}
                        paraTxt={t("componentData.documents.FAQPara")}
                        paraTxt2={t("componentData.documents.SystemAcceptTxt")}
                        noFileTxt={t("componentData.documents.NoFileUploaded")}
                        uploadBtnTxt={t("componentData.documents.Upload")}
                        orTxt={t("componentData.documents.OR")}
                        editorCheckTxt={t(
                          "componentData.documents.EnableFAQEditor"
                        )}
                        popupYesBtn={t("componentData.documents.OKAY")}
                        popupBodyTxt1={t(
                          "componentData.documents.enableFaqPopupTxt"
                        )}
                        popupBodyTxt2={t(
                          "componentData.documents.disableFaqPopupTxt"
                        )}
                        fileSizeTxt={t("componentData.documents.fileSizeTxt")}
                        documentData={this.receivedFileData}
                        apiData={apiFaqFileData}
                      />
                    )}
                  </TabPanel>
                )}

                {isPrivacyPolicyEnabled && (
                  <TabPanel
                    value={selectedTabValue}
                    index={
                      !isFAQEnabled && !isPrivacyPolicyEnabled
                        ? 0
                        : isFAQEnabled && !isPrivacyPolicyEnabled
                        ? 1
                        : !isFAQEnabled && isPrivacyPolicyEnabled
                        ? 0
                        : 1
                    }
                  >
                    {!isPPLoaded ? (
                      <CircularProgress style={{ margin: "50px 0 0 30px" }} />
                    ) : (
                      <UploadDocuments
                        headingTxt={t(
                          "componentData.documents.UploadPrivacyPolicy"
                        )}
                        paraTxt={t("componentData.documents.privacyPolicyPara")}
                        paraTxt2={t("componentData.documents.SystemAcceptTxt")}
                        noFileTxt={t("componentData.documents.NoFileUploaded")}
                        uploadBtnTxt={t("componentData.documents.Upload")}
                        orTxt={t("componentData.documents.OR")}
                        editorCheckTxt={t(
                          "componentData.documents.EnablePrivacyPolicyEditor"
                        )}
                        popupYesBtn={t("componentData.documents.OKAY")}
                        popupBodyTxt1={t(
                          "componentData.documents.enablePrivacyPopupTxt"
                        )}
                        popupBodyTxt2={t(
                          "componentData.documents.disablePrivacyPopupTxt"
                        )}
                        fileSizeTxt={t("componentData.documents.fileSizeTxt")}
                        documentData={this.receivedFileData}
                        apiData={apiPrivacyFileData}
                      />
                    )}
                  </TabPanel>
                )}

                {isTACEnabled && (
                  <TabPanel
                    value={selectedTabValue}
                    index={
                      !isFAQEnabled && !isPrivacyPolicyEnabled
                        ? 0
                        : isFAQEnabled && !isPrivacyPolicyEnabled
                        ? 1
                        : !isFAQEnabled && isPrivacyPolicyEnabled
                        ? 1
                        : 2
                    }
                  >
                    {!isTACLoaded ? (
                      <CircularProgress style={{ margin: "50px 0 0 30px" }} />
                    ) : (
                      <UploadDocuments
                        headingTxt={t(
                          "componentData.documents.constionHeading"
                        )}
                        paraTxt={t("componentData.documents.constionPara")}
                        paraTxt2={t("componentData.documents.SystemAcceptTxt")}
                        noFileTxt={t("componentData.documents.NoFileUploaded")}
                        uploadBtnTxt={t("componentData.documents.Upload")}
                        orTxt={t("componentData.documents.OR")}
                        editorCheckTxt={t(
                          "componentData.documents.constionEditorTxt"
                        )}
                        popupYesBtn={t("componentData.documents.OKAY")}
                        popupBodyTxt1={t(
                          "componentData.documents.constionEnablePopupTxt"
                        )}
                        popupBodyTxt2={t(
                          "componentData.documents.constionDisbalePopupTxt"
                        )}
                        fileSizeTxt={t("componentData.documents.fileSizeTxt")}
                        documentData={this.receivedFileData}
                        apiData={apiTACFileData}
                      />
                    )}
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </Grid>
          {isUploading ? (
            <CircularProgress
              style={{ margin: "50px auto 20px", display: "block" }}
            />
          ) : (
            enableSubmitBtn && (
              <Button
                variant="contained"
                color="primary"
                className={classes.saveBtn}
                onClick={() => this.saveBtnClicked()}
              >
                {t("componentData.documents.save")}
              </Button>
            )
          )}

          {notificationVariant && (
            <Notification
              variant={notificationVariant}
              message={notificationMSg}
              handleClose={() => {
                this.setState({ notificationVariant: null });
              }}
            />
          )}
        </div>
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(withStyles(styles)(UploadBrandingDocument))
);
