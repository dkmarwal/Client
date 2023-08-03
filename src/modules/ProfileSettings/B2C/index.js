import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '~/components/Forms';
import ContentHeader from '~/components/ContentHeader';
import B2COnboardingCompanyDetails from '~/modules/OnboardingCompanyDetails/B2C/';
import B2CUserDetails from '~/modules/UserDetails/B2C/';
import ImportParentProfileDetails from '~/modules/ImportParentProfileDetails';
import {
  fetchCompanyData,
  fetchB2CParentCompanyData,
  fetchLocations,
  updateB2CCompanyData,
  createB2CUser,
} from '~/redux/actions/client';
import { Box, CircularProgress } from '@material-ui/core';
import Notification from '~/components/Notification';

import config from '~/config';
import { withTranslation } from 'react-i18next';
import trim from 'deep-trim-node';

class ProfileSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isHIPAA: false,
      processing: false,
      clientId: null,
      parentId: null,
      error: false,
      validation: {},
      userValidation: {},
      locations: {},
      showBanner: false,
      signOnType: 'SSO',
      companyInfoObj: {
        companyName: { value: '' },
        address: { value: '' },
        city: { value: '' },
        state: { value: '' },
        zip_code: { value: '' },
        country: { value: 'US' },
        taxidOrSSN: { value: '', taxidOrSSNnumber: '' },
        countryCode: { value: '+1' },
        phone: { value: '' },
        ext: { value: '' },
        fax: { value: '' },
        website: { value: '' },
        duns_number: { value: '' },
        locationType: { value: '' },
      },
      userInfoObj: {
        prefix: { value: 'Mr' },
        f_name: { value: '' },
        l_name: { value: '' },
        phoneCountryCode: { value: '+1' },
        user_phone: { value: '' },
        user_ext: { value: '' },
        user_email: { value: '' },
        user_name: { value: '' },
        user_pass: { value: '' },
        confirm_pass: { value: '' },
        standaloneOrSSONumber: { value: '' },
      },
      parentCompanyData: {},
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    this.setState({ clientId: parseInt(urlParams.get('id')) });
    this.loadData(urlParams.get('id'));
    this.getLocations();
    this.props.changeActiveStep(0);
  }
  importParentsData = () => {
    const { parentCompanyData } = this.state;
    this.prefilledCompanyInfoData(parentCompanyData, false);
    this.setState({ showBanner: false });
  };
  loadData = (id) => {
    const { t, user } = this.props;
    this.props
      .dispatch(fetchCompanyData(id))
      .then((response) => {
        if (!response) {
          throw this.props.client.error;
        }
        const clientData =
          this.props.client.clientDetails.rows &&
          this.props.client.clientDetails.rows[0];
        if (clientData === null || typeof clientData === 'undefined') {
          throw t('componentData.profileSettings.clientNotFound');
        }
        if (
          clientData.parentId !== null ||
          typeof clientData.parentId !== 'undefined'
        ) {
          this.setState({ parentId: clientData.parentId });
          this.getParentCompanyData(id);
        }
        this.prefilledCompanyInfoData(clientData, true);
        const {isPayeeChoicePortal} = user
        if(isPayeeChoicePortal && !clientData.isSSO){
          this.setState({
            signOnType:'StandAlone'
          })
        }
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          error:
            typeof error === 'string'
              ? error
              : t('componentData.profileSettings.unknownErr'),
        });
      });
  };
  getLocations = () => {
    this.props.dispatch(fetchLocations()).then((response) => {
      if (!response) {
        this.setState({
          locations: {},
        });
        return false;
      }
      const location =
        this.props.client.locations && this.props.client.locations.rows;
      this.setState({
        locations: location,
      });
    });
  };
  prefilledCompanyInfoData = (data, isCompanyData) => {
    let { companyInfoObj } = this.state;
    const { t } = this.props;
    companyInfoObj.companyName.value = isCompanyData
      ? data.clientName !== null && typeof data.clientName !== 'undefined'
        ? data.clientName
        : ''
      : companyInfoObj.companyName.value;
    companyInfoObj.address.value = isCompanyData
      ? data.address1 !== null && typeof data.address1 !== 'undefined'
        ? data.address1
        : '' && data.address2 !== null && typeof data.address2 !== 'undefined'
        ? data.address2
        : ''
      : data.clientLocations && data.clientLocations.length > 0
      ? data.clientLocations[0].address1 !== null &&
        typeof data.clientLocations[0].address1 !== 'undefined'
        ? data.clientLocations[0].address1
        : '' &&
          data.clientLocations[0].address2 !== null &&
          typeof data.clientLocations[0].address2 !== 'undefined'
        ? data.clientLocations[0].address2
        : ''
      : '';
    companyInfoObj.city.value = isCompanyData
      ? data.city !== null && typeof data.city !== 'undefined'
        ? data.city
        : ''
      : data.clientLocations && data.clientLocations.length > 0
      ? data.clientLocations[0].city !== null &&
        typeof data.clientLocations[0].city !== 'undefined'
        ? data.clientLocations[0].city
        : ''
      : '';
    companyInfoObj.state.value = isCompanyData
      ? data.stateRegion !== null && typeof data.stateRegion !== 'undefined'
        ? data.stateRegion
        : ''
      : data.clientLocations && data.clientLocations.length > 0
      ? data.clientLocations[0].stateRegion !== null &&
        typeof data.clientLocations[0].stateRegion !== 'undefined'
        ? data.clientLocations[0].stateRegion
        : ''
      : '';
    companyInfoObj.zip_code.value = isCompanyData
      ? data.zipPostal !== null && typeof data.zipPostal !== 'undefined'
        ? data.zipPostal
        : ''
      : data.clientLocations && data.clientLocations.length > 0
      ? data.clientLocations[0].zipPostal !== null &&
        typeof data.clientLocations[0].zipPostal !== 'undefined'
        ? data.clientLocations[0].zipPostal
        : ''
      : '';
    companyInfoObj.country.value = isCompanyData
      ? data.countryIso !== null && typeof data.countryIso !== 'undefined'
        ? data.countryIso
        : 'US'
      : data.clientLocations && data.clientLocations.length > 0
      ? data.clientLocations[0].countryIso !== null &&
        typeof data.clientLocations[0].countryIso !== 'undefined'
        ? data.clientLocations[0].countryIso
        : 'US'
      : 'US';
    if (isCompanyData) {
      companyInfoObj.taxidOrSSN.value = data.isTaxIdSsn
        ? t('componentData.profileSettings.SocialSecurity')
        : t('componentData.profileSettings.FederalTaxID');
      companyInfoObj.taxidOrSSN.taxidOrSSNnumber =
        data.taxId !== null && typeof data.taxId !== 'undefined'
          ? data.taxId
          : '';
    }
    companyInfoObj.countryCode.value = isCompanyData
      ? data.countryCode !== null && typeof data.countryCode !== 'undefined'
        ? data.countryCode
        : '+1'
      : data.clientLocations && data.clientLocations.length > 0
      ? data.clientLocations[0].countryCode !== null &&
        typeof data.clientLocations[0].countryCode !== 'undefined'
        ? data.clientLocations[0].countryCode
        : '+1'
      : '+1';
    companyInfoObj.phone.value =
      data.phoneNumber !== null && typeof data.phoneNumber !== 'undefined'
        ? data.phoneNumber
        : '';
    companyInfoObj.ext.value =
      data.phoneExt !== null && typeof data.phoneExt !== 'undefined'
        ? data.phoneExt
        : '';
    companyInfoObj.fax.value =
      data.fax !== null && typeof data.fax !== 'undefined' ? data.fax : '';
    companyInfoObj.website.value =
      data.website !== null && typeof data.website !== 'undefined'
        ? data.website
        : '';
    companyInfoObj.duns_number.value =
      data.duns !== null && typeof data.duns !== 'undefined' ? data.duns : '';
    companyInfoObj.locationType.value = isCompanyData
      ? data.locationTypeId !== null &&
        typeof data.locationTypeId !== 'undefined'
        ? data.locationTypeId
        : 0
      : data.clientLocations && data.clientLocations.length > 0
      ? data.clientLocations[0].locationTypeId !== null &&
        typeof data.clientLocations[0].locationTypeId !== 'undefined'
        ? data.clientLocations[0].locationTypeId
        : 0
      : 0;
    this.setState({
      companyInfoObj: companyInfoObj,
    });
  };
  handleProfileDetails = (e) => {
    let isCompanyValid = this.validateData();
    let isUserValidate = this.validateUserData();
    let isValid = isCompanyValid && isUserValidate;
    const { t } = this.props;
    if (isValid) {
      this.setState(
        {
          processing: true,
        },
        () => {
          this.saveCompanyInfoData();
        }
      );
    } else {
      this.setState({ error: t('componentData.profileSettings.fillTxt') });
    }
  };
  saveCompanyInfoData = () => {
    this.setState(
      {
        processing: true,
      },
      () => {
        const { companyInfoObj, clientId } = this.state;
        const { t } = this.props;
        const data = trim({
          countryCode: companyInfoObj.countryCode.value,
          phoneNumber: companyInfoObj.phone.value,
          fax: companyInfoObj.fax.value,
          website: companyInfoObj.website.value,
          duns: companyInfoObj.duns_number.value,
          locationTypeId:
            companyInfoObj.locationType.value === ''
              ? 0
              : companyInfoObj.locationType.value,
          phoneExt: companyInfoObj.ext.value,
          address1: companyInfoObj.address.value,
          address2: '',
          city: companyInfoObj.city.value,
          countryIso: companyInfoObj.country.value || null,
          stateRegion: companyInfoObj.state.value,
          zipPostal: companyInfoObj.zip_code.value,
        });
        this.props
          .dispatch(updateB2CCompanyData(clientId, data))
          .then((response) => {
            if (!response) {
              throw this.props.client.error;
            }
            this.saveAdminCredentials();
          })
          .catch((error) => {
            this.setState({
              processing: false,
              error:
                typeof error === 'string'
                  ? error
                  : t('componentData.profileSettings.unknownErr'),
            });
          });
      }
    );
  };
  saveAdminCredentials = () => {
    const { userInfoObj, signOnType, clientId } = this.state;
    const { t } = this.props;
    const data = trim({
      title: userInfoObj.prefix.value,
      firstName: userInfoObj.f_name.value,
      lastName: userInfoObj.l_name.value,
      userName: userInfoObj.user_name.value,
      password: userInfoObj.user_pass.value,
      isSSO: signOnType === 'SSO' ? true : false,
      SSOUserId:
        signOnType === 'SSO' ? userInfoObj.standaloneOrSSONumber.value : null,
      phoneCountryCode: userInfoObj.phoneCountryCode.value,
      phone: userInfoObj.user_phone.value,
      email: userInfoObj.user_email.value,
      isFirstUser: true,
    });
    // Creating user for client portaltype id 2 everytime

    this.props
      .dispatch(createB2CUser(2, clientId, data))
      .then((response) => {
        if (!response) {
          throw this.props.client.error;
        }

        this.props.history.push(
          `${config.baseName}/onboard/payment?id=${this.state.clientId}`
        );
      })
      .catch((error) => {
        this.setState({
          processing: false,
          error:
            typeof error === 'string'
              ? error
              : t('componentData.profileSettings.unknownErr'),
        });
      });
  };
  getParentCompanyData = (id) => {
    this.props.dispatch(fetchB2CParentCompanyData(id)).then((response) => {
      if (!response) {
        this.setState({
          parentCompanyData: {},
        });
        return false;
      }
      const parentsData =
        this.props.client.parentDetails.rows &&
        this.props.client.parentDetails.rows[0].parentInfo;

      if (parentsData === null || typeof parentsData === 'undefined') {
        this.setState({
          parentCompanyData: {},
          showBanner: false,
        });
      } else {
        this.setState({
          parentCompanyData: parentsData,
          showBanner: true,
        });
      }
    });
  };
  onDunsChange = (val) => {
    const { companyInfoObj } = this.state;
    this.setState({
      companyInfoObj: {
        ...companyInfoObj,
        duns_number: { value: val },
      },
    });
  };
  checkInput = (event) => {
    const { companyInfoObj } = this.state;
    let v = event.target.value;
    switch (event.target.name) {
      case 'country':
        this.setState({
          companyInfoObj: {
            ...companyInfoObj,
            country: { value: v },
            state: { value: '' },
            city: { value: '' },
            zip_code: { value: '' },
          },
        });
        break;
      case 'state':
        this.setState({
          companyInfoObj: {
            ...companyInfoObj,
            state: { value: v },
            city: { value: '' },
          },
        });
        break;
      case 'zip_code':
        this.setState({
          companyInfoObj: {
            ...companyInfoObj,
            [event.target.name]: { value: v.replace(/[^a-zA-Z0-9]/g, '') },
          },
        });
        break;
      case 'phone':
      case 'ext':
      case 'duns_number':
        this.setState({
          companyInfoObj: {
            ...companyInfoObj,
            [event.target.name]: { value: v.replace(/[^0-9]/g, '') },
          },
        });
        break;
      case 'fax':
        this.setState({
          companyInfoObj: {
            ...companyInfoObj,
            [event.target.name]: { value: v.replace(/[^0-9+.]/g, '') },
          },
        });
        break;
      default:
        this.setState({
          companyInfoObj: {
            ...companyInfoObj,
            [event.target.name]: {
              value: v,
            },
          },
        });
        break;
    }
  };
  checkUserInput = (event) => {
    const { userInfoObj } = this.state;
    let v = event.target.value;
    switch (event.target.name) {
      case 'user_phone':
        this.setState({
          userInfoObj: {
            ...userInfoObj,
            [event.target.name]: { value: v.replace(/[^0-9]/g, '') },
          },
        });
        break;
      case 'standaloneOrSSONumber':
        this.setState({
          userInfoObj: {
            ...userInfoObj,
            [event.target.name]: { value: v.replace(/[^a-zA-Z0-9]/g, '') },
          },
        });
        break;
      default:
        this.setState({
          userInfoObj: {
            ...userInfoObj,
            [event.target.name]: {
              value: v,
            },
          },
        });
        break;
    }
  };
  validateData = () => {
    let errorText = {};
    const { companyInfoObj } = this.state;
    const { t } = this.props;
    let valid = true;
    for (const [key, value] of Object.entries(companyInfoObj)) {
      if (
        key === 'companyName' &&
        companyInfoObj[key].value.toString().trim().length == 0
      ) {
        valid = false;
        errorText['companyName'] = t(
          'componentData.profileSettings.companyName'
        );
      }
      if (
        key === 'phone' &&
        companyInfoObj[key].value.toString().trim().length !== 10
      ) {
        valid = false;
        errorText['phone'] = t('componentData.profileSettings.phoneLen');
      }
      if (
        key === 'state' &&
        companyInfoObj[key].value.toString().trim().length == 0
      ) {
        valid = false;
        errorText['state'] = t('componentData.profileSettings.selectState');
      }
      if (
        key === 'city' &&
        companyInfoObj[key].value.toString().trim().length == 0
      ) {
        valid = false;
        errorText['city'] = t('componentData.profileSettings.selectCity');
      }
      if (
        key === 'zip_code' &&
        (companyInfoObj[key].value.toString().trim().length === 0 ||
          (companyInfoObj[key].value.toString().trim().length !== 0 &&
            ((companyInfoObj[key].value.toString().trim().length !== 5 &&
              companyInfoObj.country.value === 'US') ||
              (companyInfoObj[key].value.toString().trim().length !== 6 &&
                companyInfoObj.country.value === 'CA'))))
      ) {
        valid = false;
        if (companyInfoObj.country.value === 'CA') {
          errorText['zip_code'] = t(
            'componentData.profileSettings.enterZipCodeCA'
          );
        } else {
          errorText['zip_code'] = t(
            'componentData.profileSettings.enterZipCode'
          );
        }
      }

      if (
        key === 'address' &&
        companyInfoObj[key].value.toString().trim().length == 0
      ) {
        valid = false;
        errorText['address'] = t('componentData.profileSettings.enterAdd');
      }
      if (
        key === 'website' &&
        companyInfoObj[key].value.toString().trim().length !== 0
      ) {
        const re =
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        if (!re.test(companyInfoObj[key].value)) {
          errorText['website'] = t('componentData.profileSettings.enterWeb');
          valid = false;
        }
      }
    }
    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };
  onBlurValidate = (event) => {
    let errorText = {};
    const { name, value } = event.target;
    const { validation, companyInfoObj } = this.state;
    const { t } = this.props;
    delete validation[name];
    switch (name) {
      case 'companyName':
        if (value.length === 0) {
          errorText['companyName'] = t(
            'componentData.profileSettings.companyName'
          );
        }
        break;
      case 'phone':
        if (companyInfoObj.phone.value.length !== 10) {
          errorText['phone'] = t('componentData.profileSettings.phoneLen');
        }
        break;
      case 'state':
        if (value.length === 0) {
          errorText['state'] = t('componentData.profileSettings.selectState');
        }
        break;
      case 'city':
        if (value.length === 0) {
          errorText['city'] = t('componentData.profileSettings.selectCity');
        }
        break;
      case 'address':
        if (value.length === 0) {
          errorText['address'] = t('componentData.profileSettings.enterAdd');
        }
        break;
      case 'zip_code':
        if (!value) {
          errorText['zip_code'] = t(
            'componentData.profileSettings.enterZipCode'
          );
        } else if (!!value && companyInfoObj.country.value === 'US') {
          if (value.length !== 5)
            errorText['zip_code'] = t(
              'componentData.profileSettings.enterZipCode'
            );
        } else if (!!value && companyInfoObj.country.value === 'CA') {
          if (value.length !== 6)
            errorText['zip_code'] = t(
              'componentData.profileSettings.enterZipCodeCA'
            );
        }
        break;
      case 'duns_number':
        if (value.length !== 0 && value.length !== 9) {
          errorText['duns_number'] = t(
            'componentData.profileSettings.DunsNoLen'
          );
        }
        break;
      case 'website':
        if (value.length !== 0) {
          const re =
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
          if (!re.test(value)) {
            errorText['website'] = t('componentData.profileSettings.enterWeb');
          }
        }
        break;
      default:
        break;
    }

    this.setState({
      validation: { ...validation, ...errorText },
    });
  };
  validateUserData = () => {
    let errorText = {};
    const { t } = this.props;
    let valid = true;
    const pwdRegex =
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})';
    const { signOnType, userInfoObj } = this.state;
    const isSSO = signOnType === 'SSO' ? true : false;
    for (const [key, value] of Object.entries(userInfoObj)) {
      if (
        isSSO &&
        key === 'standaloneOrSSONumber' &&
        userInfoObj[key].value.toString().trim().length === 0
      ) {
        valid = false;
        errorText['standaloneOrSSONumber'] = t(
          'componentData.profileSettings.SSOID'
        );
      }
      if (
        key === 'f_name' &&
        userInfoObj[key].value.toString().trim().length === 0
      ) {
        valid = false;
        errorText['f_name'] = t('componentData.profileSettings.fName');
      }
      if (
        key === 'l_name' &&
        userInfoObj[key].value.toString().trim().length === 0
      ) {
        valid = false;
        errorText['l_name'] = t('componentData.profileSettings.lName');
      }
      if (
        key === 'user_phone' &&
        userInfoObj[key].value.toString().trim().length !== 10
      ) {
        valid = false;
        errorText['user_phone'] = t('componentData.profileSettings.phoneLen');
      }
      // if (
      //   key === "user_ext" &&
      //   userInfoObj[key].value.toString().trim().length === 0
      // ) {
      //   valid = false;
      //   errorText["user_ext"] = "Please enter user extension";
      // }
      if (
        !isSSO &&
        key === 'user_name' &&
        userInfoObj[key].value.toString().trim().length === 0
      ) {
        valid = false;
        errorText['user_name'] = t('componentData.profileSettings.userName');
      }
      if (
        !isSSO &&
        key === 'user_pass' &&
        (userInfoObj[key].value.toString().trim().length === 0 ||
          userInfoObj[key].value.match(pwdRegex) === null)
      ) {
        valid = false;
        errorText['user_pass'] = t('componentData.profileSettings.Password');
      }
      if (
        !isSSO &&
        key === 'confirm_pass' &&
        userInfoObj[key].value.toString().trim() !==
          this.state.userInfoObj.user_pass.value.toString().trim()
      ) {
        valid = false;
        errorText['confirm_pass'] = t(
          'componentData.profileSettings.PasswordDoesNotMatch'
        );
      }
      if (key === 'user_email') {
        const userEmail = userInfoObj[key].value.toString().trim();
        const isValidEmail =
          userEmail.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/) ===
          null
            ? false
            : true;
        if (userEmail.length === 0 || !isValidEmail) {
          valid = false;
          errorText['user_email'] = t('componentData.profileSettings.email');
        }
      }
    }
    this.setState({
      userValidation: { ...errorText },
    });
    return valid;
  };
  onUserBlurValidate = (event) => {
    let errorText = {};
    const pwdRegex =
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})';
    const { name, value } = event.target;
    const { signOnType, userValidation } = this.state;
    const { t } = this.props;
    const isSSO = signOnType === 'SSO' ? true : false;
    delete userValidation[name];
    switch (name) {
      case 'standaloneOrSSONumber':
        if (isSSO && value.length === 0) {
          errorText['standaloneOrSSONumber'] = t(
            'componentData.profileSettings.SSOID'
          );
        }
        break;
      case 'f_name':
        if (value.length === 0) {
          errorText['f_name'] = t('componentData.profileSettings.fName');
        }
        break;
      case 'l_name':
        if (value.length === 0) {
          errorText['l_name'] = t('componentData.profileSettings.lName');
        }
        break;
      case 'phoneCountryCode':
        if (value.length === 0) {
          errorText['phoneCountryCode'] = t(
            'componentData.profileSettings.countryCode'
          );
        }
        break;
      // case "user_ext":
      //   {
      //     if (value.length === 0) {
      //       errorText["user_ext"] = "Please enter a phone extension";
      //     }
      //   }
      //   break;
      case 'user_name':
        if (!isSSO && value.length === 0) {
          errorText['user_name'] = t('componentData.profileSettings.userName');
        }
        break;
      case 'user_pass':
        if (!isSSO && (value.length === 0 || value.match(pwdRegex) === null)) {
          errorText['user_pass'] = t('componentData.profileSettings.Password');
        }
        break;
      case 'confirm_pass':
        if (!isSSO && value !== this.state.userInfoObj.user_pass.value) {
          errorText['confirm_pass'] = t(
            'componentData.profileSettings.PasswordDoesNotMatch'
          );
        }
        break;
      case 'user_phone':
        if (value.length !== 10) {
          errorText['user_phone'] = t('componentData.profileSettings.phoneLen');
        }
        break;
      case 'user_email':
        if (
          value.length === 0 ||
          value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/) === null
        ) {
          errorText['user_email'] = t('componentData.profileSettings.email');
        }
        break;
      default:
        break;
    }

    this.setState({
      userValidation: { ...userValidation, ...errorText },
    });
  };
  render() {
    const {
      isLoading,
      processing,
      error,
      companyInfoObj,
      locations,
      userInfoObj,
      validation,
      userValidation,
      signOnType,
      showBanner,
    } = this.state;
    const { t } = this.props;
    if (isLoading) {
      return (
        <Box className='loader-container'>
          <CircularProgress color='primary' />
        </Box>
      );
    }
    return (
      <>
        {showBanner && (
          <Box my={2}>
            <ImportParentProfileDetails
              onConfirm={this.importParentsData}
              onCancel={() => {
                this.setState({
                  showBanner: false,
                });
              }}
            />
          </Box>
        )}
        <Box my={2} mx={6}>
          <ContentHeader
            title={t('componentData.profileSettings.CompanyDetails')}
          />
          <Box my={1}>
            <B2COnboardingCompanyDetails
              companyInfoObj={companyInfoObj}
              locations={locations}
              validation={validation}
              checkInput={this.checkInput}
              onDunsChange={this.onDunsChange}
              onBlurValidate={this.onBlurValidate}
              isOnboarding={this.props.isOnboarding}
            />
          </Box>
          <ContentHeader
            title={t('componentData.profileSettings.SystemAdminCredentials')}
          />
          <Box my={1}>
            <B2CUserDetails
              userInfoObj={userInfoObj}
              signOnType={signOnType}
              userValidation={userValidation}
              checkUserInput={this.checkUserInput}
              onUserBlurValidate={this.onUserBlurValidate}
              onSignOnChange={(selectedValue) => {
                this.setState({
                  signOnType: selectedValue.value,
                });
              }}
            />
          </Box>
          <Box my={4} className={`button-container`}>
            {processing ? (
              <CircularProgress color='primary' />
            ) : (
              <Button
                type='submit'
                fullWidth={false}
                variant='contained'
                color='primary'
                onClick={this.handleProfileDetails}
              >
                {t('componentData.profileSettings.Next')}
              </Button>
            )}
          </Box>
        </Box>
        {error && (
          <Notification
            variant='error'
            message={error}
            handleClose={() => {
              this.setState({ error: false });
            }}
          />
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.client,...state.user }))(ProfileSettings)
);
