import React from 'react';
import {
  Grid,
  Box,
  withStyles,
  Button,
  Paper,
  CircularProgress
} from '@material-ui/core';
import { styles } from './styles';
import Notification from '~/components/Notification';
import {
  saveB2CCompanyDetails,
  fetchB2CCompanyDetails
} from '~/redux/helpers/settings';
import { fetchLocations } from '~/redux/actions/client';
import { connect } from 'react-redux';
import { accessRights } from '~/config/accessRights';

import CompanyDetails from '~/modules/CompanyDetails';
import { withTranslation } from 'react-i18next';
import trim from 'deep-trim-node';
class CompanyDetailsSettings extends React.Component {
  state = {
    companyRelatedInformation: [],
    locationsTypes: [],
    isModalActive: false,
    modalMessage: '',
    locations: {},
    validation: {},
    saveCompanyDetails: false,
    companyDetails: {},
    btnLoader: false,
    variant: '',
  };

  constructor(props) {
    super(props);
    this.validateCompanyDetails.bind(this);
  }

  componentDidMount() {
    this.getClientInformation();
    this.getLocations();
  }

  validateCompanyDetails = (companyDetails) => {
    let errorText = {};
    let valid = true;
    const { t } = this.props;
    if (
      !companyDetails['companyName'] ||
      this.state.companyDetails['companyName'].value.toString().trim().length ===
      0
    ) {
      valid = false;
      errorText['companyName'] = t(
        'componentData.companyDetailSetting.CompanyNameEmpty'
      );
    }
    if (
      !companyDetails['address'] ||
      companyDetails['address'].toString().trim().length === 0
    ) {
      valid = false;
      errorText['address'] = t(
        'componentData.companyDetailSetting.AddressEmpty'
      );
    }
    if (
      !companyDetails['phone'] ||
      companyDetails['phone'].toString().trim().length === 0
    ) {
      valid = false;
      errorText['phone'] = t('componentData.companyDetailSetting.PhoneEmpty');
    }
    if (
      companyDetails['phone'] &&
      companyDetails['phone'].toString().trim().length !== 10
    ) {
      valid = false;
      errorText['phone'] = t('componentData.companyDetailSetting.phoneLen');
    }
    if (
      !companyDetails['state'] ||
      !companyDetails['state'].toString().trim() ||
      companyDetails['state'].toString().trim().length === 0
    ) {
      valid = false;
      errorText['state'] = t('componentData.companyDetailSetting.StateEmpty');
    }
    if (
      !companyDetails['city'] ||
      !companyDetails['city'].toString().trim() ||
      companyDetails['city'].toString().trim().length === 0
    ) {
      valid = false;
      errorText['city'] = t('componentData.companyDetailSetting.CityEmpty');
    }
    if (
      !companyDetails['country'] ||
      !companyDetails['country'].toString().trim() ||
      companyDetails['country'].toString().trim().length === 0
    ) {
      valid = false;
      errorText['country'] = t(
        'componentData.companyDetailSetting.countryEmpty'
      );
    }
    if (
      !companyDetails['zip_code'] ||
      !companyDetails['zip_code'].toString().trim() ||
      companyDetails['zip_code'].toString().trim().length === 0
    ) {
      valid = false;
      errorText['zip_code'] = t(
        'componentData.companyDetailSetting.zipCodeEmpty'
      );
    }
    if (
      companyDetails['duns_number'] &&
      companyDetails['duns_number'].toString().trim().length > 0 &&
      companyDetails['duns_number'].toString().trim().length !== 9
    ) {
      valid = false;
      errorText['duns_number'] = t(
        'componentData.companyDetailSetting.DUNSLen'
      );
    }

    if (
      companyDetails['website'] &&
      companyDetails['website'].toString().trim().length > 0
    ) {
      const re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
      if (!re.test(companyDetails['website'])) {
        errorText['website'] = t(
          'componentData.companyDetailSetting.validWebsite'
        );
        valid = false;
      }
    }

    if ((companyDetails['isSSO'] === 1) && 
    (!companyDetails['ssoUserId'] ||
    companyDetails['ssoUserId'].toString().trim().length === 0
    )
    ) {
      valid = false;
      errorText['ssoUserId'] = t(
        'componentData.companyDetailSetting.ssoCustomerIdEmpty'
      );
    } else if ((companyDetails['isSSO'] === 1) && (companyDetails['ssoUserId'].toString().trim().length !== 12)) {
      valid = false;
      errorText['ssoUserId'] = t(
        'componentData.companyDetailSetting.ssoCustomerIdLen' 
      );
    }

    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };

  toggleCheck(obj, keyName) {
    let inverse = !obj[keyName];
    obj[keyName] = inverse ? 1 : 0;
    this.setState({ ...this.state });
  }

  checkInput = (event) => {
    const { companyDetails } = this.state;
    let v = event.target.value;
    switch (event.target.name) {
      case 'zip_code':
      case 'phone':
      case 'ext':
      case 'duns_number':
      case 'fax':
        this.setState({
          companyDetails: {
            ...companyDetails,
            [event.target.name]: { value: v.replace(/[^0-9+.]/g, '') },
          },
        });
        break;
      default:
        this.setState({
          companyDetails: {
            ...companyDetails,
            [event.target.name]: {
              value: v,
            },
          },
        });
        break;
    }
  };

  saveCompanyDetails(companyDetails) {
    const {isPayeeChoicePortal} = this.props.user
    let clientId = this.props.user.userData.portalProfileId;
    let isFormValid = this.validateCompanyDetails(companyDetails);    
    if (isFormValid) {
      let payload_ = trim({
        clientName: companyDetails['companyName'] || null,        
        fax:
          String(companyDetails['fax']).trim().length > 0
            ? companyDetails['fax']
            : null,
        duns:
          String(companyDetails['duns_number']).trim().length > 0
            ? companyDetails['duns_number']
            : null,
        website:
          String(companyDetails['website']).trim().length > 0
            ? companyDetails['website']
            : null,
        phoneNumber:
          String(companyDetails['phone']).trim().length > 0
            ? companyDetails['phone']
            : null,
        phoneExt:
          String(companyDetails['ext']).trim().length > 0
            ? companyDetails['ext']
            : null,
        countryCode:
          String(companyDetails['countryCode']).trim().length > 0
            ? companyDetails['countryCode']
            : null,        
        locationTypeId:
          String(companyDetails['locationType']).trim().length > 0
            ? companyDetails['locationType']
            : null,
        locationId:
          String(companyDetails['locationId']).trim().length > 0
            ? companyDetails['locationId']
            : null,
        address1:
          String(companyDetails['address']).trim().length > 0
            ? companyDetails['address']
            : null,
        address2: null,
        city:
          String(companyDetails['city']).trim().length > 0
            ? companyDetails['city']
            : null,
        stateRegion:
          String(companyDetails['state']).trim().length > 0
            ? companyDetails['state']
            : null,
        zipPostal:
          String(companyDetails['zip_code']).trim().length > 0
            ? String(companyDetails['zip_code'])
            : null,
        countryIso:
          String(companyDetails['country']).trim().length > 0
            ? String(companyDetails['country'])
            : null,
        // isSSO: isPayeeChoicePortal
        //     ? (companyDetails['isSSO'] === 1 ? companyDetails['isSSO'] : 0) 
        //     : undefined,
        // ssoUserId: isPayeeChoicePortal
        //     ? (companyDetails['isSSO'] === 1 ? companyDetails['ssoUserId'] : null) 
        //     : undefined,
      });

      this.setState({ btnLoader: true }, () => {
        saveB2CCompanyDetails(payload_, clientId).then((response) => {
          this.setState({ btnLoader: false }, () => {
            this.setDialogMessage(true, response.message, 'success');
          });
        });
      });
    }
    this.setState({ saveCompanyDetails: false });
  }

  getClientInformation() {    
    let clientId = this.props.user.userData.portalProfileId;    
    this.setState({ isLoading: true }, () => {
      fetchB2CCompanyDetails(clientId).then((response) => {        
        if (response.error) {
          this.setDialogMessage(true, response.message, 'success');
        }
        const { data } = response;
        const clientLocation =
          data &&
          data['clientLocations'] &&
          data['clientLocations'].length > 0 &&
          data['clientLocations'][0];
        let newObj = {
          companyName: { value: (data && data['clientName']) || "" },
          address: {
            value:
              clientLocation &&
              `${clientLocation['address1'] || ''} ${clientLocation['address2'] || ''
              }`,
          },
          city: {
            value: clientLocation && clientLocation['city'],
          },
          state: {
            value: clientLocation && clientLocation['stateRegion'],
          },
          zip_code: {
            value: clientLocation && clientLocation['zipPostal'],
          },
          country: { value: clientLocation && clientLocation['countryIso'] },
          taxidOrSSN: { value: (data && data['taxId']) || null, taxidOrSSNnumber: (data && data['taxId']) || null },
          countryCode: {
            value: (clientLocation && clientLocation['countryCode']) || '+1',
          },
          phone: { value: (data && data['phoneNumber']) || null },
          ext: { value: (data && data['phoneExt']) || null },
          fax: { value: (data && data['fax']) || null },
          website: {
            value: clientLocation && clientLocation['website'],
          },
          duns_number: { value: (data && data['duns']) || null },
          locationType: {
            value: clientLocation && clientLocation['locationTypeId'],
          },
          email: { value: (data && data['emailAddress']) || null },
          clientId: { value: (data && data['clientId']) || null },
          locationId: {
            value: clientLocation && clientLocation['locationId'],
          },
          isSSO: { value: (data && data['isSSO']) || 0 },
          ssoUserId: { value: (data && data['ssoUserId']) || null }
        };

        this.setState({ companyDetails: newObj, isLoading: false });        
      });
    });
  }

  setDialogMessage(flag, message, variant) {
    this.setState({
      isModalActive: flag,
      modalMessage: message,
      variant: variant,
    });
  }

  handleTextChange = (e, obj) => {
    obj[e.target.name] = e.target.value;
    this.setState({ ...this.state });
  };

  getLocations() {
    this.props.dispatch(fetchLocations()).then((response) => {
      this.setState({ locationsTypes: this.props.client.locations.rows });
    });
  }

  render() {
    const {
      companyDetails,
      locationsTypes,
      validation,
      isModalActive,
      modalMessage,
      btnLoader,
      saveCompanyDetails,
      isLoading,
      variant,
    } = this.state;

    const { t } = this.props;
    const { classes, user } = this.props;
    const { theme } = this.props.clientConfig.layout;
    const { countryList } = this.props.csc;
    const { isPayeeChoicePortal } = user;

    const isSettingCompanyEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_COMPANY_DETAILS_EDIT']
        )) ||
      false;
    return (
      <div>
        <Box mx={6}>
          <Paper
            style={{
              boxShadow:
                '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 0px 0px rgba(0,0,0,0.12)',
            }}
          >
            {isLoading ? (
              <Box p={5} display="flex" justifyContent="center">
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <Grid>
                <Box mx={4} pt={4} pb={0} color="primary.text.main">
                  <h3 className={classes.settingHeading}>
                    {t('componentData.companyDetailSetting.CompanyDetails')}
                  </h3>
                  <span>
                    {t('componentData.companyDetailSetting.reqField')}
                  </span>
                </Box>

                <CompanyDetails
                  countryList={countryList}
                  companyInfoObj={companyDetails}
                  locations={locationsTypes}
                  validation={validation}
                  saveForm={saveCompanyDetails}
                  saveCompanyDetails={this.saveCompanyDetails.bind(this)}                  
                  onDunsChange={(val) => {
                    const { companyDetails } = this.state;
                    this.setState({
                      companyDetails: {
                        ...companyDetails,
                        duns_number: { value: val },
                      },
                    });
                  }}                  
                  isOnboarding={false}
                  disableEdit={!isSettingCompanyEditEnabled}
                />

                {isSettingCompanyEditEnabled && (
                  <Box
                    p={5}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {btnLoader ? (
                      <Box display="flex" justifyContent="flex-end">
                        <CircularProgress color="primary" />
                      </Box>
                    ) : (
                      <Button
                        className={`${classes.floatRight} ${classes.saveButton}`}
                        style={{
                          background: theme.palette.button.primary,
                          color: theme.palette.secondary.contrastText,
                          height: '40px',
                        }}
                        onClick={() =>
                          this.setState({ saveCompanyDetails: true })
                        }
                      >
                        {t('componentData.companyDetailSetting.Save')}
                      </Button>
                    )}
                  </Box>
                )}
              </Grid>
            )}
          </Paper>
        </Box>

        {isModalActive && modalMessage && (
          <Notification
            variant={variant}
            message={modalMessage}
            handleClose={() => this.setState({ isModalActive: false })}
          />
        )}
      </div>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
    ...state.client,
    ...state.csc,
  }))(withStyles(styles)(CompanyDetailsSettings))
);
