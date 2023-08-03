import React from "react";
import {
  Grid,
  Card,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import MaskInput from "../../components/MaskInput";
import { withTranslation } from 'react-i18next';

class relatedCompanyInfo extends React.Component {
  state = {
    name: "",
    taxId: "",
    subsidiary: 0,
    operatingUnit: 0,
    memberOfGUCO: 0,
    other: 0,
    validation: {},
  };

  componentDidMount() {
    const { info } = this.props;
    this.setState({ ...info });
  }

  componentDidUpdate(prevProps) {
    if (this.props.info !== prevProps.info) {
      this.setState({ ...this.props.info });
    }
  }

  validateRelatedCompanyInfo = (obj) => {
    let errorText = {};
    let valid = true;
    const { taxId, name } = this.state;
    const { t } = this.props;
    if (!name || name.toString().trim().length == 0) {
      valid = false;
      errorText["name"] = t('componentData.relatedCompyInfo.LegalEntityEmp');
    }
    if (
      !taxId ||
      taxId.trim().length == 0 ||
      taxId.trim() > 999999999 ||
      taxId.trim() < 100000000
    ) {
      valid = false;
      errorText["taxId"] = t('componentData.relatedCompyInfo.taxIDLen');
    }

    this.setState({
      validation: errorText,
    });
    return valid;
  };

  render() {
    const {
      classes,
      info,
      index,
      isSettingRelatedCompanyDeleteEnabled,
      isSettingRelatedCompanyEditEnabled,
      theme,
      processingIndex,
      relatedInfoBtnLoader,
      editRelatedIndex,
      t
    } = this.props;
    const {
      name,
      taxId,
      subsidiary,
      operatingUnit,
      memberOfGUCO,
      other,
      validation,
    } = this.state;

    return (
      <Box mx={6} mt={4}>
        <Card
          className={classes.contentBackground}
          disabled={
            info["legalEntityId"] && !editRelatedIndex == index ? true : false
          }
        >
          <Box pb={7} className={classes.keyContactInfoHeader}>
            <h3 className={classes.settingHeading}>
              {t('componentData.relatedCompyInfo.RelatedCompanyInformation')}
            </h3>

            <span className={classes.floatRight}>
              {editRelatedIndex != index && info["legalEntityId"] ? (
                <EditIcon
                  style={{ width: "22px", cursor: 'pointer' }}
                  onClick={() => this.props._editRelatedIndex(index)}
                />
              ) : null}
              {isSettingRelatedCompanyDeleteEnabled && (
                <img
                  style={{
                    width: "22px",
                    verticalAlign: "inherit",
                    margin: "0 25px",
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    this.props.deleteRelatedCompanyInformation(index)
                  }
                  alt="Delete"
                  src={require(`~/assets/icons/delete.svg`)}
                  className="menu-icon"
                />
              )}
            </span>
          </Box>
          <Grid
            container
            spacing={2}
            style={
              info["legalEntityId"] && editRelatedIndex != index
                ? {
                  opacity: 0.6,
                  pointerEvents: "none",
                  paddingLeft: "10px",
                }
                : {}
            }
          >
            {/* <Box mx={0}> */}
            <Grid container xs={12} sm={12} spacing={2}>
              <Grid item xs={6} sm={6}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="name"
                  label={t('componentData.relatedCompyInfo.LegalEntityName')}
                  inputProps={{ maxLength: 100 }}
                  variant="outlined"
                  value={name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                  // onBlur={this.validateRelatedCompanyInfo}
                  // inputProps={{ maxLength: 5 }}
                  error={
                    validation && validation.name && validation.name.length > 0
                  }
                  helperText={validation && validation.name}
                />
              </Grid>

              <Grid item xs={6} sm={6}>
                {/* <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="taxId"
                  label= {t('componentData.relatedCompyInfo.GSTN')}
                  variant="outlined"
                  value={taxId}
                  onChange={(e) => this.setState({ taxId: e.target.value })}
                  // onBlur={this.validateRelatedCompanyInfo}
                  inputProps={{ maxLength: 9 }}
                  error={
                    validation &&
                    validation.taxId &&
                    validation.taxId.length > 0
                  }
                  helperText={validation && validation.taxId}
                /> */}

                <MaskInput style={{ marginTop: "0px" }}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  maxLength={9}
                  getValue={(val) => {
                    this.setState({ taxId: val })
                  }}
                  label={t('componentData.relatedCompyInfo.GSTN')}
                  name="taxId"
                  inputProps={{ maxLength: 9 }}
                  value={taxId}
                  // getValue={onDunsChange}
                  disabled={false}
                  errorText={validation.duns_number}
                  // onBlur={onBlurValidate}
                  variant={"outlined"}
                  error={
                    validation &&
                    validation.taxId &&
                    validation.taxId.length > 0
                  }
                  helperText={validation && validation.taxId}
                />
              </Grid>
            </Grid>

            <Grid sm={12} xs={12}>
              <Box my={3} mx={0}>
                <h3>{t('componentData.relatedCompyInfo.Relation')}</h3>
              </Box>

              <Box mx={0}>
                <Grid container>
                  <Grid item xs={4} sm={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={subsidiary}
                          onChange={() =>
                            this.setState({
                              subsidiary: subsidiary == 0 ? 1 : 0,
                              memberOfGUCO: 0,
                              operatingUnit: 0,
                              other: 0
                            })
                          }
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label={t('componentData.relatedCompyInfo.Subsidiary')}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={operatingUnit}
                          onChange={() =>
                            this.setState({
                              operatingUnit: operatingUnit == 0 ? 1 : 0,
                              memberOfGUCO: 0,
                              subsidiary: 0,
                              other: 0
                            })
                          }
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label={t('componentData.relatedCompyInfo.Division')}
                    />
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item xs={4} sm={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={memberOfGUCO}
                          onChange={() =>
                            this.setState({
                              memberOfGUCO: memberOfGUCO === 0 ? 1 : 0,
                              operatingUnit: 0,
                              subsidiary: 0,
                              other: 0
                            })
                          }
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label={t('componentData.relatedCompyInfo.memberOfGroup')}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={other}
                          onChange={() =>
                            this.setState({
                              other: other == 0 ? 1 : 0,
                              memberOfGUCO: 0,
                              operatingUnit: 0,
                              subsidiary: 0,
                            })
                          }
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label={t('componentData.relatedCompyInfo.Other')}
                    />
                  </Grid>
                </Grid>
              </Box>
              {isSettingRelatedCompanyEditEnabled && (
                <Box
                  mt={6}
                  mb={2}
                  pt={2}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {relatedInfoBtnLoader && processingIndex == index ? (
                    <Box display="flex" justifyContent="flex-end">
                      <CircularProgress color="primary" />
                    </Box>
                  ) : (
                    <Button
                      className={`${classes.floatRight} ${classes.saveButton}`}
                      style={{
                        background: theme.palette.button.primary,
                        color: theme.palette.secondary.contrastText,
                        height: "40px",
                      }}
                      onClick={() => {
                        if (this.validateRelatedCompanyInfo()) {
                          const {
                            name,
                            taxId,
                            subsidiary,
                            operatingUnit,
                            memberOfGUCO,
                            other,
                            legalEntityId,
                          } = this.state;
                          this.props.createRelatedCompanyInfo(
                            {
                              legalEntityId,
                              name,
                              taxId,
                              subsidiary,
                              operatingUnit,
                              memberOfGUCO,
                              other,
                            },
                            index
                          );
                        }
                      }}
                    >
                      {t('componentData.relatedCompyInfo.Save')}
                    </Button>
                  )}
                </Box>
              )}
            </Grid>
            {/* </Box> */}
          </Grid>
        </Card>
      </Box>
    );
  }
}

export const RelatedCompanyInfo = withTranslation()(relatedCompanyInfo);
