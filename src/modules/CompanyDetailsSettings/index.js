import React from 'react';
import CompanyDetails from '../CompanyDetails';
import {
  Grid,
  Card,
  Box,
  withStyles,
  Button,
  Paper,
  CircularProgress,
} from '@material-ui/core';
import { styles } from './styles';
import Notification from '~/components/Notification';
import {
  saveCompanyDetails,
  fetchCompanyDetails,
  fetchContactTypes,
  getKeyContactInfos,
  getRelatedCompanyInfos,
  deleteRelatedCompanyInfo,
  updateRelatedCompanyInfo,
  updateKeyContactInfo,
  addRelatedCompanyInfo,
  addKeyContactInfo,
  deleteKeyContact
} from '~/redux/helpers/settings';
import { fetchLocations } from '~/redux/actions/client';
import { connect } from 'react-redux';
import { accessRights } from '~/config/accessRights';
import { RelatedCompanyInfo } from '~/modules/RelatedCompanyInfo';
import { KeyContactInfo } from '~/modules/KeyContactInfo';
import { withTranslation } from 'react-i18next';
import { ConfirmDialog } from '~/components/Dialogs';
import trim from 'deep-trim-node';
class CompanyDetailsSettings extends React.Component {
  state = {
    companyRelatedInformation: [],
    keyContactInformation: [],
    locationsTypes: [],
    contactTypes: [],
    isModalActive: false,
    modalMessage: '',
    locations: {},
    validation: {},
    keyContactValidation: {},
    relatedCompanyInfoValidation: {},
    saveCompanyDetails: false,
    companyDetails: {},
    companyInfoObj: {},
    btnLoader: false,
    processingIndex: null,
    editRelatedIndex: null,
    editRelatedFlag: false,
    editKeyIndex: null,
    editKeyFlag: false,
    keyContactBtnLoader: false,
    relatedInfoBtnLoader: false,
    variant: '',
    showConfirmRemoveDialog: false,
    selectedInfoIndex: null,
    selectedInfo: null,
    deleteLoader: false
  };

  constructor(props) {
    super(props);
    this.validateCompanyDetails.bind(this);
  }

  componentDidMount() {
    this.getClientInformation();
    this.getContactTypes();
    this.getRelatedCompanyInfos();
    this.getKeyContactInfos();
    this.getLocations();
  }

  getContactTypes() {
    fetchContactTypes().then((response) => {
      if (!response || response.error) {
        this.setDialogMessage(true, response.message, 'error');
      }
      this.setState({ contactTypes: response.data?.rows ?? [] });
    });
  }

  getKeyContactInfos() {
    let clientId = this.props.user.userData.portalProfileId;
    this.setState({ isLoading: true }, () => {
      getKeyContactInfos(clientId).then((response) => {
        if (response.error) {
          this.setDialogMessage(true, response.message, 'error');
        }
        this.setState({
          keyContactInformation: response.data.rows,
          isLoading: false,
        });
      });
    });
  }

  updateKeyContactInfo(obj) {
    let clientId = this.props.user.userData.portalProfileId;
    updateKeyContactInfo(obj, clientId).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message, 'error');
      }
    });
  }

  getRelatedCompanyInfos() {
    let clientId = this.props.user.userData.portalProfileId;
    this.setState({ isLoading: true }, () => {
      getRelatedCompanyInfos(clientId).then((response) => {
        if (response.error) {
          this.setDialogMessage(true, response.message, 'error');
        }
        this.setState({
          companyRelatedInformation: response.data.rows,
          isLoading: false,
        });
      });
    });
  }

  addKeyContactInformation() {
    const { keyContactInformation } = this.state;
    keyContactInformation.push({
      title: '',
      firstName: '',      
      lastName: '',
      jobTitle: '',
      phone: '',
      phoneExt: '',      
      email: '',
      locationTypeId: null,
      country: '+1',      
      contactTypeId: null      
    });
    this.setState({
      ...this.state,
    });
  }

  createKeyContactInfo(obj, i) {    
    delete obj['validation'];
    let clientId = this.props.user.userData.portalProfileId;
    if (obj.contactId) {
      delete obj['displayName'];
      delete obj['crmContactId'];
      delete obj['fax'];
      delete obj['city'];
      delete obj['state'];
      delete obj['zipCode'];
      delete obj['primaryLocationId'];
      delete obj['statusId'];      
      delete obj['clientId'];
      this.setState({ keyContactBtnLoader: true, processingIndex: i }, () => {
        updateKeyContactInfo(obj, clientId).then((response) => {
          this.setDialogMessage(true, response.message, 'success');
          this.setState(
            {
              keyContactBtnLoader: false,
              editKeyIndex: null,
              editKeyFlag: false,
            },
            () => this.getKeyContactInfos()
          );
        });
      });
    } else {
      let clientId = this.props.user.userData.portalProfileId;      
      this.setState({ keyContactBtnLoader: true, processingIndex: i }, () => {
        addKeyContactInfo(obj, clientId).then((response) => {
          this.setDialogMessage(true, response.message, 'success');
          this.setState(
            {
              keyContactBtnLoader: false,
              editKeyIndex: null,
              editKeyFlag: false,
            },
            () => this.getKeyContactInfos()
          );
        });
      });
    }
    this.getKeyContactInfos();    
  }

  createRelatedCompanyInfo(obj, i) {
    let clientId = this.props.user.userData.portalProfileId;    
    delete obj['validation'];
    if (obj.legalEntityId) {
      delete obj['clientId'];
      this.setState({ relatedInfoBtnLoader: true, processingIndex: i }, () => {
        this.updateRelatedCompanyInformation(obj, clientId).then((response) => {
          this.setDialogMessage(true, response.message, 'success');
          this.setState(
            {
              relatedInfoBtnLoader: false,
              editRelatedFlag: false,
              editRelatedIndex: null,
            },
            () => this.getRelatedCompanyInfos()
          );
        });
      });
    } else {
      this.setState({ relatedInfoBtnLoader: true, processingIndex: i }, () => {
        addRelatedCompanyInfo(obj, clientId).then((response) => {
          this.getRelatedCompanyInfos();
          this.setDialogMessage(true, response.message, 'success');
          this.setState(
            {
              relatedInfoBtnLoader: false,
              editRelatedFlag: false,
              editRelatedIndex: null,
            },
            () => this.getRelatedCompanyInfos()
          );
        });
      });
    }    
  }

  addRelatedCompanyInformation() {
    const { companyRelatedInformation } = this.state;
    companyRelatedInformation.push({
      name: '',
      taxId: '',
      subsidiary: 0,
      operatingUnit: 0,
      memberOfGUCO: 0,
      other: 0,
    });
    this.setState({
      ...this.state,
    });
  }

  updateRelatedCompanyInformation(obj) {
    let clientId = this.props.user.userData.portalProfileId;
    return updateRelatedCompanyInfo(obj, clientId);
  }

  deleteRelatedCompanyInformation(index) {
    let clientId = this.props.user.userData.portalProfileId;
    const { companyRelatedInformation } = this.state;
    if (
      companyRelatedInformation &&
      companyRelatedInformation[index] &&
      companyRelatedInformation[index]['legalEntityId']
    ) {
      this.setState({ btnLoader: true }, () => {
        deleteRelatedCompanyInfo(
          companyRelatedInformation &&
          companyRelatedInformation[index] &&
          companyRelatedInformation[index]['legalEntityId'],
          clientId
        ).then((response) => {
          if (response.error) {
            this.setState({ btnLoader: false });
            return false;
          }
          this.getRelatedCompanyInfos();
          this.setDialogMessage(true, response.message, 'success');
        });
      });
    } else {
      companyRelatedInformation.splice(index, 1);
    }
    this.setState({ ...this.state, selectedInfoIndex: null });
  }

  deleteKeyContactInfo = (selectedKeyCompanyindex) => {
    const { keyContactInformation } = this.state;
    const { t } = this.props;
    if (
      keyContactInformation &&
      keyContactInformation[selectedKeyCompanyindex] &&
      keyContactInformation[selectedKeyCompanyindex]['contactId']
    ) {
      this.setState({
        deleteLoader: true
      }, () => {
        deleteKeyContact(keyContactInformation[selectedKeyCompanyindex]['contactId']).then((response) => {
          this.setState({ deleteLoader: false })
          if (response.error) {
            this.setDialogMessage(true, response.message || t('componentData.reduxData.SomethingWentWrong'), 'error');
            return false
          }
          this.getKeyContactInfos();
          this.setDialogMessage(true, response.message, 'success');
        })
      })

    } else {
      keyContactInformation.splice(selectedKeyCompanyindex, 1);
    }
    this.setState({ ...this.state, selectedInfoIndex: null });
  };

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

  saveRelatedCompanyInfo() {
    const { companyInfoObj } = this.state;
    let clientId = this.props.user.userData.portalProfileId;
    let payload = trim({
      companyName: companyInfoObj['companyName']['value'],
      federalTaxId: companyInfoObj['taxidOrSSN']['value'],
      fax: companyInfoObj['fax']['value'],
      duns: companyInfoObj['duns_number']['value'],
      website: companyInfoObj['website']['value'],
      phone: companyInfoObj['phone']['value'],
      phoneExt: companyInfoObj['ext']['value'],
      countryCode: companyInfoObj['countryCode']['value'],
      locationTypeID: companyInfoObj['locationType']['value'],
      locationId: null,
      address1: companyInfoObj['address']['value'],
      address2: null,
      city: companyInfoObj['city']['value'],
      stateRegion: companyInfoObj['state']['value'],
      zipPostal: String(companyInfoObj['zip_code']['value']),
      countryIso: companyInfoObj['country']['value'],
    });    
    this.setState({ btnLoader: true }, () => {
      addRelatedCompanyInfo(payload, clientId).then((response) => {       
        this.setState({ btnLoader: false }, () => {
          this.setDialogMessage(true, response.message, 'success');
        });
      });
    });
  }

  saveKeyContactInformation(obj) {
    let clientId = this.props.user.userData.portalProfileId;
    let payload = trim({
      contactId: obj[''] ? obj[''] : null,
      title: obj['title'] ? obj['title'] : null,
      firstName: obj['firstName'] ? obj['firstName'] : null,
      lastName: obj['lastName'] ? obj['lastName'] : null,      
      jobTitle: obj['jobTitle'] ? obj['jobTitle'] : null,
      phone: obj['phone'] ? obj['phone'] : null,
      phoneExt: obj['phoneExt'] ? obj['phoneExt'] : null,
      fax: obj['fax'] ? obj['fax'] : null,
      email: obj['email'] ? obj['email'] : null,
      locationTypeId: obj['locationTypeId'] ? obj['locationTypeId'] : null,
      country: obj['country'] ? obj['country'] : null,
      city: obj['city'] ? obj['city'] : null,
      state: obj['state'] ? obj['state'] : null,
      zipCode: String(obj['zipCode']) ? obj['zipCode'] : null,
      contactTypeId: obj['contactTypeId'] ? obj['contactTypeId'] : null,
      clientId: obj['clientId'] ? obj['clientId'] : null,
    });
    
    this.setState({ btnLoader: true }, () => {
      saveCompanyDetails(payload, clientId).then((response) => {        
        this.setState({ btnLoader: false }, () => {
          this.setDialogMessage(true, response.message, 'success');
        });
      });
    });
  }

  saveCompanyDetails(companyDetails) {    
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
      });
      
      this.setState({ btnLoader: true }, () => {
        saveCompanyDetails(payload_, clientId).then((response) => {          
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
      fetchCompanyDetails(clientId).then((response) => {        
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
          identificationType: {value: data && data['identificationType']},
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

  editRelatedIndex(index) {
    this.setState({ editRelatedIndex: index, editRelatedFlag: true });
  }
  editKeyIndex(index) {
    this.setState({ editKeyIndex: index, editKeyFlag: true });
  }

  onCancelDelete = () => {
    this.setState({
      showConfirmRemoveDialog: false,
      selectedInfoIndex: null,
      selectedInfo: null
    });
  };

  onConfirmDelete = () => {
    if (this.state.selectedInfo === "RelatedCompany") {
      this.deleteRelatedCompanyInformation(this.state.selectedInfoIndex)
    } else if (this.state.selectedInfo === "KeyContact") {
      this.deleteKeyContactInfo(this.state.selectedInfoIndex)
    }
    this.setState({
      showConfirmRemoveDialog: false,
      selectedInfo: null
    })
  };

  onDeleteIconClick = (index, selectedInfoName) => {
    this.setState({
      showConfirmRemoveDialog: true,
      selectedInfoIndex: index,
      selectedInfo: selectedInfoName,
    });
  };

  renderDeleteDialog = (title, message) => {
    return (
      <ConfirmDialog
        title={title}
        message={message}
        onCancel={() => this.onCancelDelete()}
        onConfirm={() => this.onConfirmDelete()}
      />
    );
  };

  render() {
    const {      
      companyDetails,
      locationsTypes,
      validation,
      companyRelatedInformation,
      keyContactInformation,
      isModalActive,
      modalMessage,
      contactTypes,
      btnLoader,
      keyContactBtnLoader,
      relatedInfoBtnLoader,
      processingIndex,
      editRelatedIndex,
      editKeyIndex,
      saveCompanyDetails,
      isLoading,
      variant,
    } = this.state;

    const { t } = this.props;
    const { classes, user } = this.props;
    const { theme } = this.props.clientConfig.layout;
    const { countryList } = this.props.csc;    

    const isSettingCompanyEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_COMPANY_DETAILS_EDIT']
        )) ||
      false;
    const isSettingRelatedCompanyViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_RELATED_COMPANY_INFORMATION_VIEW']
        )) ||
      false;
    const isSettingRelatedCompanyAddEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_RELATED_COMPANY_INFORMATION_ADD']
        )) ||
      false;
    const isSettingRelatedCompanyEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_RELATED_COMPANY_INFORMATION_EDIT']
        )) ||
      false;
    const isSettingKeyContactViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_KEY_CONTACT_INFORMATION_VIEW']
        )) ||
      false;
    const isSettingKeyContactAddEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_KEY_CONTACT_INFORMATION_ADD']
        )) ||
      false;
    const isSettingKeyContactEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_KEY_CONTACT_INFORMATION_EDIT']
        )) ||
      false;
    const isSettingRelatedCompanyDeleteEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_RELATED_COMPANY_INFORMATION_DELETE']
        )) ||
      false;
    const isSettingKeyContactDeleteEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_KEY_CONTACT_INFORMATION_DELETE']
        )) ||
      false;
    const isKeyContactDeleteIconVisible = keyContactInformation.filter((info) => info.contactId).length > 1

    const payerTypeId = user.userData.payerTypeId;

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
                  payerTypeId={payerTypeId}
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

        {isSettingRelatedCompanyViewEnabled &&
          companyRelatedInformation &&
          companyRelatedInformation.map((info, index) => (
            <RelatedCompanyInfo
              classes={classes}
              info={info}
              index={index}
              relatedInfoBtnLoader={relatedInfoBtnLoader}
              processingIndex={processingIndex}
              isSettingRelatedCompanyDeleteEnabled={
                isSettingRelatedCompanyDeleteEnabled
              }
              isSettingRelatedCompanyEditEnabled={
                isSettingRelatedCompanyEditEnabled
              }
              theme={theme}
              editRelatedIndex={editRelatedIndex}
              _editRelatedIndex={(i) => this.editRelatedIndex(i)}
              deleteRelatedCompanyInformation={(i) =>
                this.onDeleteIconClick(i, 'RelatedCompany')
              }
              createRelatedCompanyInfo={(obj, i) =>
                this.createRelatedCompanyInfo(obj, i)
              }
            />
          ))}

        {isSettingRelatedCompanyAddEnabled && (
          <Box mx={6} mt={4}>
            <Card className={classes.contentBackground}>
              <span
                className={classes.addFieldButton}
                style={{
                  color: theme.palette.primary.light,
                  border: `1px solid ${theme.palette.background.default}`,
                  textTransform: `uppercase`,
                }}
                onClick={this.addRelatedCompanyInformation.bind(this)}
              >
                <span className={classes.checkedIcon}>
                  <img
                    className={classes.checkClass}
                    src={require(`~/assets/icons/addIcon.svg`)}
                    alt=""
                    æ
                  />
                </span>
                {t('componentData.companyDetailSetting.CompanyInformation')}
              </span>
            </Card>
          </Box>
        )}

        {isSettingKeyContactViewEnabled &&
          keyContactInformation &&
          keyContactInformation.map((info, index) => (
            <KeyContactInfo
              classes={classes}
              info={info}
              index={index}
              isSettingKeyContactEditEnabled={isSettingKeyContactEditEnabled}
              isSettingKeyContactDeleteEnabled={isSettingKeyContactDeleteEnabled}
              theme={theme}
              processingIndex={processingIndex}
              editKeyIndex={editKeyIndex}
              _editKeyIndex={(i) => this.editKeyIndex(i)}
              contactTypes={contactTypes}
              locationsTypes={locationsTypes}
              keyContactBtnLoader={keyContactBtnLoader}
              createKeyContactInfo={(obj, i) =>
                this.createKeyContactInfo(obj, i)
              }
              isDeleteIconVisible={isKeyContactDeleteIconVisible}
              deleteKeyContactInfo={() =>
                this.onDeleteIconClick(index, 'KeyContact')
              }
              deleteLoader={this.state.deleteLoader}
            />
          ))}

        {isSettingKeyContactAddEnabled && (
          <Box mx={6} mt={4}>
            <Card className={classes.contentBackground}>
              <span
                className={classes.addFieldButton}
                style={{
                  color: theme.palette.primary.light,
                  border: `1px solid ${theme.palette.background.default}`,
                  textTransform: `uppercase`,
                }}
                onClick={this.addKeyContactInformation.bind(this)}
              >
                <span className={classes.checkedIcon}>
                  <img
                    className={classes.checkClass}
                    src={require(`~/assets/icons/addIcon.svg`)}
                    alt=""
                    æ
                  />
                </span>
                {t('componentData.companyDetailSetting.ContactInformation')}
              </span>
            </Card>
          </Box>
        )}

        {isModalActive && modalMessage && (
          <Notification
            variant={variant}
            message={modalMessage}
            handleClose={() => this.setState({ isModalActive: false })}
          />
        )}
        {this.state.showConfirmRemoveDialog &&
          this.renderDeleteDialog('', this.state.selectedInfo === 'KeyContact' ?
            t('componentData.Settings.DeleteKeyContact')
            : t('componentData.Settings.DeleteCompanyInfo'))}
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
