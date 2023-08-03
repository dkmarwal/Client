import React from 'react';
import {
  Grid,
  Card,
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CountryPhoneCode from '../../components/Forms/CountryPhoneCode';
import MaskedInput from '../../components/MaskedInput';
import { withTranslation } from 'react-i18next';

class keyContactInfo extends React.Component {
  state = {
    title: '',
    firstName: '',
    //"displayName": "",
    lastName: '',
    jobTitle: '',
    phone: '',
    phoneExt: '',
    //"fax": "",
    email: '',
    locationTypeId: null,
    country: '+1',
    //"city": "",
    //"state": "",
    //"zipCode": null,
    contactTypeId: null,
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

  validateKeyContactForm = () => {
    const errorText = {};
    let valid = true;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
    const obj = this.state;
    const { t } = this.props;
    if (
      !obj ||
      !obj['firstName'] ||
      obj['firstName'].toString().trim().length == 0
    ) {
      valid = false;
      errorText['firstName'] = t('componentData.keyContactInfo.firstNameEmp');
    }
    if (!obj['lastName'] || obj['lastName'].toString().trim().length == 0) {
      valid = false;
      errorText['lastName'] = t('componentData.keyContactInfo.lastNameEmp');
    }
    if (obj['lastName'] && obj['lastName'].toString().trim().length > 50) {
      valid = false;
      errorText['lastName'] = t('componentData.keyContactInfo.lastNameMaxLen');
    }
    if (obj['firstName'] && obj['firstName'].toString().trim().length > 50) {
      valid = false;
      errorText['firstName'] = t('componentData.keyContactInfo.fNameMaxLen');
    }
    if (!obj['phone'] || obj['phone'].toString().trim().length !== 10) {
      valid = false;
      errorText['phone'] = t('componentData.keyContactInfo.phoneLen');
    }
    if (!obj['title'] || obj['title'].toString().trim().length == 0) {
      valid = false;
      errorText['title'] = t('componentData.keyContactInfo.preffix');
    }
    if (!obj['jobTitle'] || obj['jobTitle'].toString().trim().length == 0) {
      valid = false;
      errorText['jobTitle'] = t('componentData.keyContactInfo.jobEmp');
    }
    if (!obj['email'] || obj['email'].toString().trim().length == 0) {
      valid = false;
      errorText['email'] = t('componentData.keyContactInfo.emailEmp');
    }
    if (obj['email'] && obj['email'].toString().trim().length > 50) {
      valid = false;
      errorText['email'] = t('componentData.keyContactInfo.emailMaxL');
    }
    if (obj['jobTitle'] && obj['jobTitle'].toString().trim().length > 50) {
      valid = false;
      errorText['jobTitle'] = t('componentData.keyContactInfo.jobTitleMinL');
    }
    if (obj['locationTypeId'] == null) {
      valid = false;
      errorText['locationTypeId'] = t('componentData.keyContactInfo.location');
    }
    
    if (
      !obj['contactTypeId'] ||
      obj['contactTypeId'].toString().trim().length == 0
    ) {
      valid = false;
      errorText['contactTypeId'] = t('componentData.keyContactInfo.Contact');
    }

    if (obj['email'] && !emailRegex.test(String(obj['email']).toLowerCase())) {
      valid = false;
      errorText['email'] = t('componentData.keyContactInfo.validEmail');
    }

    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };

  render() {
    const {
      classes,
      info,
      index,
      isSettingKeyContactEditEnabled,
      isSettingKeyContactDeleteEnabled,
      theme,
      processingIndex,
      editKeyIndex,
      contactTypes,
      locationsTypes,
      keyContactBtnLoader,
      t,
      deleteKeyContactInfo,
      isDeleteIconVisible,
      deleteLoader = false,
    } = this.props;

    const {
      title,
      firstName,
      lastName,
      jobTitle,
      phone,
      phoneExt,
      email,
      locationTypeId,
      country,
      contactTypeId,
      validation,
    } = this.state;

    return (
      <Box mx={6} mt={4}>
        <Card
          className={classes.contentBackground}
          disabled={info['contactId'] && editKeyIndex !== index ? true : false}
        >
          <Box pb={8} className={classes.keyContactInfoHeader}>
            <h3 className={classes.settingHeading}>
              {t('componentData.keyContactInfo.titleTxt')}
            </h3>
            <span
              className={classes.floatRight}

              // onClick={() => this.deleteKeyContactInformation(index)}
            >
              {editKeyIndex !== index && info['contactId'] ? (
                <EditIcon
                  style={{ width: '22px', cursor: 'pointer' }}
                  onClick={() => this.props._editKeyIndex(index)}
                />
              ) : null}
              {isDeleteIconVisible && isSettingKeyContactDeleteEnabled ? (
                deleteLoader ? (
                  <Box
                    width="100px"
                    display="flex"
                    mt={1.875}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress color="primary" />
                  </Box>
                ) : (
                  <img
                    style={{
                      width: '22px',
                      verticalAlign: 'inherit',
                      margin: '0 25px',
                      cursor: 'pointer',
                    }}
                    alt="Delete"
                    src={require(`~/assets/icons/delete.svg`)}
                    className="menu-icon"
                    onClick={() => deleteKeyContactInfo(index)}
                  />
                )
              ) : null}
            </span>
          </Box>
          <Grid
            style={
              info['contactId'] && editKeyIndex !== index
                ? {
                    opacity: 0.6,
                    pointerEvents: 'none',
                    paddingLeft: '10px',
                  }
                : {}
            }
          >
            <Grid container spacing={2}>
              {/* <Box mx={0}> */}
              <Grid container xs={12} sm={12} spacing={2}>
                <Grid item xs={2} sm={2}>
                  <TextField
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    select
                    required={true}
                    name="title"
                    label={t('componentData.keyContactInfo.PrefixTitle')}
                    variant="outlined"
                    value={title}
                    onChange={(e) => this.setState({ title: e.target.value })}
                    // onBlur={() => this.validateKeyContactForm(info)}
                    // inputProps={{ maxLength: 5 }}
                    error={
                      validation &&
                      validation.title &&
                      validation.title.length > 0
                    }
                    helperText={validation && validation.title}
                  >
                    <MenuItem>{t('componentData.keyContactInfo.Select')}</MenuItem>
                    <MenuItem id={'mr'} key={'mr'} value={'Mr'}>
                    {t('componentData.keyContactInfo.MrPrefix')}
                    </MenuItem>
                    <MenuItem id={'ms'} key={'ms'} value={'Ms'}>
                    {t('componentData.keyContactInfo.MsPrefix')}
                    </MenuItem>
                    <MenuItem id={'mrs'} key={'mrs'} value={'Mrs'}>
                    {t('componentData.keyContactInfo.MrsPrefix')}
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <TextField
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="firstName"
                    label={t('componentData.keyContactInfo.fName')}
                    variant="outlined"
                    value={firstName}
                    inputProps={{ maxLength: 50 }}
                    onChange={(e) =>
                      this.setState({ firstName: e.target.value })
                    }
                    // onBlur={() => this.validateKeyContactForm(info)}
                    // inputProps={{ maxLength: 5 }}
                    error={
                      validation &&
                      validation.firstName &&
                      validation.firstName.length > 0
                    }
                    helperText={validation && validation.firstName}
                  />
                </Grid>
                <Grid item xs={2} sm={2}>
                  <TextField
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="lastName"
                    label={t('componentData.keyContactInfo.lName')}
                    variant="outlined"
                    value={lastName}
                    inputProps={{ maxLength: 50 }}
                    onChange={(e) =>
                      this.setState({ lastName: e.target.value })
                    }
                    // onBlur={() => this.validateKeyContactForm(info)}
                    // inputProps={{ maxLength: 5 }}
                    // error={validation.zip_code && validation.zip_code.length > 0}
                    // helperText={validation.zip_code}
                    error={
                      validation &&
                      validation.lastName &&
                      validation.lastName.length > 0
                    }
                    helperText={validation && validation.lastName}
                  />
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="email"
                    required={true}
                    label={t('componentData.keyContactInfo.Email')}
                    variant="outlined"
                    value={email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    // onBlur={() => this.validateKeyContactForm(info)}
                    error={
                      validation &&
                      validation.email &&
                      validation.email.length > 0
                    }
                    inputProps={{
                      maxLength: 50,
                    }}
                    helperText={validation && validation.email}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                xs={12}
                sm={12}
                spacing={2}
                style={{ marginTop: '25px' }}
              >
                <Grid item xs={3} sm={3}>
                  <TextField
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    required={true}
                    name="jobTitle"
                    label={t('componentData.keyContactInfo.JobTitle')}
                    variant="outlined"
                    value={jobTitle}
                    inputProps={{ maxLength: 50 }}
                    onChange={(e) =>
                      this.setState({ jobTitle: e.target.value })
                    }
                    // onBlur={() => this.validateKeyContactForm(info)}
                    // inputProps={{ maxLength: 5 }}
                    error={
                      validation &&
                      validation.jobTitle &&
                      validation.jobTitle.length > 0
                    }
                    helperText={validation && validation.jobTitle}
                  />
                </Grid>
                <Grid item xs={3} sm={3}>
                  <TextField
                    fullWidth={true}
                    color="secondary"
                    select
                    autoComplete="off"
                    required={true}
                    name="contactTypeId"
                    label={t('componentData.keyContactInfo.ContactType')}
                    variant="outlined"
                    value={contactTypeId || ''}
                    onChange={(e) =>
                      this.setState({ contactTypeId: e.target.value })
                    }
                    // onBlur={() => this.validateKeyContactForm(info)}
                    error={
                      validation &&
                      validation.contactTypeId &&
                      validation.contactTypeId.length > 0
                    }
                    helperText={validation && validation.contactTypeId}
                  >
                    <MenuItem>
                      {t('componentData.keyContactInfo.Select')}
                    </MenuItem>
                    {contactTypes &&
                      contactTypes.map((option, i) => (
                        <MenuItem
                          id={option.contactTypeID}
                          key={option.contactTypeID}
                          value={option.contactTypeID}
                        >
                          {option.description}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
                <Grid item xs={1} sm={1}>
                  <Box my={-1}>
                    <CountryPhoneCode
                      select
                      fullWidth={true}
                      color="secondary"
                      required={true}
                      autoComplete="off"
                      name="country"
                      label={t('componentData.keyContactInfo.Country')}
                      variant="outlined"
                      value={country}
                      onChange={(e) =>
                        this.setState({ country: e.target.value })
                      }
                      // onBlur={() => this.validateKeyContactForm(info)}
                      inputProps={{ maxLength: 4 }}
                      excludeCountryCode={['CA', 'UM']}
                      style={{ width: '100px' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={3} sm={3}>
                  <Box my={-1}>
                    <MaskedInput
                      value={phone}
                      name="phone"
                      fullWidth={true}
                      color="secondary"
                      variant="outlined"
                      // mask={"(999)999-9999"}
                      type={'text'}
                      // isMaterialDesign={true}
                      label={t('componentData.keyContactInfo.PhNu')}
                      required
                      formatterProps={{
                        isNumericString: true,
                        format: '###-###-####',
                      }}
                      onChange={(e) =>
                        this.setState({
                          phone: e.target.value.replace(/[^0-9]/g, ''),
                        })
                      }
                      inputProps={{ maxLength: 10 }}
                      placeholder={'XXX-XXX-XXXX'}
                      error={Boolean(validation && validation.phone)}
                      helperText={validation && validation.phone}
                      style={{ width: '220px', marginLeft: '28px' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={2} sm={2}>
                  <TextField
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="phoneExt"
                    required={false}
                    label={t('componentData.keyContactInfo.Extension')}
                    variant="outlined"
                    value={phoneExt}
                    onChange={(e) =>
                      this.setState({ phoneExt: e.target.value })
                    }
                    // onBlur={() => this.validateKeyContactForm(info)}
                    inputProps={{ maxLength: 10 }}
                    error={
                      validation &&
                      validation.phoneExt &&
                      validation.phoneExt.length > 0
                    }
                    helperText={validation && validation.phoneExt}
                  />
                </Grid>

                <Grid item xs={6} sm={6}>
                  <TextField
                    fullWidth={true}
                    //color="secondary"
                    select
                    autoComplete="off"
                    required={true}
                    name="locationTypeId"
                    label={t('componentData.keyContactInfo.LocationType')}
                    variant="outlined"
                    value={locationTypeId || ' '}
                    onChange={(e) =>
                      this.setState({ locationTypeId: e.target.value })
                    }
                    // onBlur={() => this.validateKeyContactForm(info)}
                    inputProps={{ maxLength: 5 }}
                    error={
                      validation &&
                      validation.locationTypeId &&
                      validation.locationTypeId.length > 0
                    }
                    helperText={validation && validation.locationTypeId}
                  >
                    {locationsTypes &&
                      locationsTypes.map((location) => (
                        <MenuItem value={location.locationTypeId}>
                          {location.description}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              </Grid>
              {/* </Box> */}
            </Grid>
            {isSettingKeyContactEditEnabled && (
              <Box
                mt={6}
                mb={1}
                pt={2}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {keyContactBtnLoader && processingIndex == index ? (
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
                    onClick={() => {
                      const {
                        contactId,
                        title,
                        firstName,
                        lastName,
                        jobTitle,
                        phone,
                        phoneExt,
                        email,
                        locationTypeId,
                        country,
                        contactTypeId,
                      } = this.state;
                      const obj = {
                        contactId,
                        title,
                        firstName,
                        lastName,
                        jobTitle,
                        phone,
                        phoneExt,
                        email,
                        locationTypeId,
                        country,
                        contactTypeId,
                      };
                      if (this.validateKeyContactForm()) {
                        this.props.createKeyContactInfo(obj, index);
                      }
                    }}
                  >
                    {t('componentData.keyContactInfo.Save')}
                  </Button>
                )}
              </Box>
            )}
          </Grid>
        </Card>
      </Box>
    );
  }
}

export const KeyContactInfo = withTranslation()(keyContactInfo);
