import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, MenuItem, FormControlLabel, Checkbox, Tooltip,} from "@material-ui/core";
import { TextField } from "~/components/Forms";
import CountryPhoneCode from "../../components/Forms/CountryPhoneCode";
import { styles } from "./styles";
import MaskedInput from "../../components/MaskedInput";
import MaskInput from "../../components/MaskInput";
import { Country, City, State } from "../../components/CSC";
import { withTranslation } from 'react-i18next';
import { PayerTypes } from '~/config/entityTypes';
import { connect } from "react-redux";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

class CompanyDetails extends Component {
  state = {
    companyName: "",
    duns_number: "",
    countryCode: "",
    phone: "",
    ext: "",
    fax: "",
    taxidOrSSN: "",
    website: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip_code: "",
    locationType: "",
    locationId: null,
    identificationType: "",
    isSSO: 0,
    ssoUserId: null,
  };

  componentDidMount() {
    this.prepareObject(this.props);
  }

  prepareObject(props) {
    const { companyInfoObj } = props;
    const {
      address,
      city,
      companyName,
      country,
      countryCode,
      duns_number,
      ext,
      fax,
      locationId,
      locationType,
      phone,
      state,
      taxidOrSSN,
      website,
      zip_code,
      identificationType,
      isSSO,
      ssoUserId,
      t,
    } = companyInfoObj;

    this.setState(
      {
        companyName: companyName && companyName["value"],
        duns_number: duns_number && duns_number["value"],
        countryCode: countryCode && countryCode["value"],
        phone: phone && phone["value"],
        ext: ext && ext["value"],
        fax: fax && fax["value"],
        taxidOrSSN: taxidOrSSN && taxidOrSSN["value"],
        website: website && website["value"],
        address: address && address["value"],
        country: country && country["value"],
        state: state && state["value"],
        city: city && city["value"],
        zip_code: zip_code && zip_code["value"],
        locationType: locationType && locationType["value"],
        locationId: locationId && locationId["value"],
        identificationType: identificationType && identificationType["value"],
        isSSO: isSSO && isSSO["value"],
        ssoUserId: ssoUserId && ssoUserId["value"],
      },
      () => {
        // console.log(this.state, "COMPANYDETAILS2")
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps["saveForm"] == false && this.props["saveForm"] == true) {
      const {
        companyName,
        duns_number,
        countryCode,
        phone,
        ext,
        fax,
        taxidOrSSN,
        website,
        address,
        country,
        state,
        city,
        zip_code,
        locationType,
        locationId,
        isSSO,
        ssoUserId,
      } = this.state;
      this.props.saveCompanyDetails({
        companyName: companyName ? companyName : null,
        duns_number: duns_number ? duns_number : null,
        countryCode: countryCode ? countryCode : null,
        phone: phone ? phone : null,
        ext: ext ? ext : null,
        fax: fax ? fax : null,
        taxidOrSSN: taxidOrSSN ? taxidOrSSN : null,
        website: website ? website : null,
        address: address ? address : null,
        country: country ? country : null,
        state: state ? state : null,
        city: city ? city : null,
        zip_code: zip_code ? zip_code : null,
        locationType: locationType ? locationType : null,
        locationId: locationId ? locationId : null,
        isSSO: isSSO ? isSSO : null,
        ssoUserId: ssoUserId ? ssoUserId : null,
      });
    }
    if (prevProps["companyInfoObj"] != this.props["companyInfoObj"]) {
      this.prepareObject(this.props);
    }
  }

  onChange = (event) => {
    const { name, type, checked } = event.target;
    let { value } = event.target;
    if (type === 'checkbox') {
      value = +checked;
    }
    if (type === 'select') {
      value = value === '' ? null : value;
    }
    this.setState({
      [name]: name === 'taxId' ? value.replace(/[^0-9]/g, '') : value,
      ssoUserId:
      name === 'isSSO' && !value
        ? null
        : name !== 'ssoUserId'
        ? this.state.ssoUserId
        : value.replace(/[^0-9A-Za-z]/g, ''),
    });
  };

  tooltipSSO = {
    title: this.props.t('componentData.companyDetail.ssoInfo'),
    arrow: true,
    placement: 'right-end',
  };

  isPayeeChoicePortal = this.props.user;

  render() {
    const { t, payerTypeId } = this.props;
    const {
      classes,      
      locations,
      validation,      
      isOnboarding,      
      disableEdit,
    } = this.props;

    const {isPayeeChoicePortal} = this.props.user;

    const {
      companyName,
      duns_number,
      countryCode,
      phone,
      ext,
      fax,
      taxidOrSSN,
      website,
      address,
      country,
      state,
      city,
      zip_code,
      locationType,
      identificationType,
      isSSO,
      ssoUserId,
    } = this.state;

    return (
      <Box className={classes.contentBackground}>
        <Grid container spacing={4}>
          <Grid item xs={6} sm={6}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="companyName"
                  autoFocus={true}
                  label={t('componentData.companyDetail.CompanyName')}
                  variant="outlined"
                  value={companyName}
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => {
                    this.setState({ companyName: e.target.value });
                  }}                  
                  error={
                    validation.companyName && validation.companyName.length > 0
                  }
                  helperText={validation.companyName}
                  required
                  disabled={disableEdit}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>                
                <MaskInput
                  style={{ marginTop: "8px" }}
                  maxLength={9}
                  getValue={(val) => {
                    this.setState({ duns_number: val });
                  }}
                  label={t('componentData.companyDetail.DUNSNumber')}
                  name="duns_number"
                  value={duns_number}                  
                  errorText={validation.duns_number}                  
                  variant={"outlined"}
                  error={
                    validation.duns_number && validation.duns_number.length > 0
                  }
                  helperText={validation.duns_number}
                  disabled={disableEdit}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4} style={{ marginTop: "8px" }}>
              <Grid item xs={3} sm={3}>
                <CountryPhoneCode
                  select
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="countryCode"
                  label={t('componentData.companyDetail.CountryCode')}
                  variant="outlined"
                  value={countryCode}
                  required
                  excludeCountryCode={["CA", "UM"]}
                  onChange={(e) => {
                    this.setState({ countryCode: e.target.value });
                  }}                  
                  inputProps={{ maxLength: 4 }}
                  disabled={disableEdit}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <MaskedInput
                  fullWidth={true}
                  color="secondary"
                  variant="outlined"
                  value={`${phone}`}
                  name="phone"
                  type="text"
                  label={t('componentData.companyDetail.Phone')}
                  onChange={(e) => {
                    this.setState({ phone: e.target.value });
                  }}                  
                  placeholder={"XXX-XXX-XXXX"}
                  error={Boolean(validation.phone)}
                  helperText={validation.phone}
                  inputProps={{ maxLength: 10 }}
                  formatterProps={{
                    format: "###-###-####",
                    isNumericString: true,
                  }}
                  required
                  disabled={disableEdit}
                />                
              </Grid>
              <Grid item xs={3} sm={3}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="ext"
                  label={t('componentData.companyDetail.Extension')}
                  variant="outlined"
                  value={ext}
                  onChange={(e) => {
                    this.setState({ ext: e.target.value.replace(/[^0-9]/g, "") });
                  }}                  
                  inputProps={{ maxLength: 10 }}
                  error={validation.ext && validation.ext.length > 0}
                  helperText={validation.ext}
                  disabled={disableEdit}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="fax"
                  label={t('componentData.companyDetail.Fax')}
                  variant="outlined"
                  value={fax}
                  onChange={(e) => {
                    this.setState({ fax: e.target.value.replace(/[^0-9+.]/g, "") });
                  }}                  
                  inputProps={{ maxLength: 10 }}
                  error={validation.fax && validation.fax.length > 0}
                  helperText={validation.fax}
                  disabled={disableEdit}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={6} sm={6}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  name="taxidOrSSN"
                  id="taxid_SSN_text"
                  label={
                    country === "US"
                      ? isOnboarding
                        ? taxidOrSSN
                        : payerTypeId == PayerTypes.CARDS ? identificationType ? identificationType : t('componentData.clientVarification.identificationNumber') : t('componentData.companyDetail.TaxIdSSN')
                      : t('componentData.companyDetail.BusinessNumber')
                  }
                  type="text"
                  value={taxidOrSSN}
                  disabled
                ></TextField>
              </Grid>
            </Grid>
            {isPayeeChoicePortal && (
                <>
                  <Grid item xs={12} style={{marginTop: '10px'}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean(isSSO)}
                          color='primary'
                          onChange={this.onChange}
                          name='isSSO'
                          disabled={true}
                          icon={<CheckBoxOutlineBlankIcon />}
                          checkedIcon={<CheckBoxIcon />}
                        />
                      }
                      label={t('componentData.companyDetail.isSSO')}
                    />
                    <Tooltip {...this.tooltipSSO}>
                      <Box
                        p={1}
                        component='div'
                        display='inline'
                        style={{ verticalAlign: 'middle' }}
                      >
                        <InfoOutlinedIcon
                          color='primary'
                          style={{ marginTop: '4px' }}
                        />
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth={true}
                      color='secondary'
                      autoComplete="off"
                      name={'ssoUserId'}
                      autoFocus={true}
                      label={t('componentData.companyDetail.ssoCustomerId')}
                      value={ssoUserId || ''}
                      required={Boolean(isSSO)}
                      onChange={this.onChange}
                      error={
                        validation.ssoUserId && validation.ssoUserId.length > 0
                      }
                      helperText={validation.ssoUserId || ''}
                      inputProps={{
                        maxLength: 12,
                      }}
                      variant="outlined"
                      disabled={true}
                      style={{marginTop: '20px'}}
                    />
                  </Grid>
                </>
              )}
          </Grid>
          <Grid item xs={6} sm={6}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="website"
                  label={t('componentData.companyDetail.Website')}
                  variant="outlined"
                  value={website}
                  error={validation.website && validation.website.length > 0}
                  helperText={validation.website}
                  onChange={(e) => {
                    this.setState({ website: e.target.value });
                  }}
                  inputProps={{
                    maxLength: 200,
                  }}
                  disabled={disableEdit}                
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="address"
                  label={t('componentData.companyDetail.Address')}
                  variant="outlined"
                  value={address}
                  inputProps={{ maxLength: 100 }}
                  onInput={(e) => {
                    this.setState({ address: e.target.value });
                  }}                  
                  helperText={validation.address}
                  error={validation.address && validation.address.length > 0}
                  required
                  disabled={disableEdit}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={6} sm={6}>                
                <Country
                  selectedCountry={country || ""}
                  error={validation.country && validation.country.length > 0}
                  helperText={validation.country}
                  onChange={(e) =>
                    this.setState({
                      country: e.target.value,
                      state: "",
                      city: "",
                      zip_code: "",
                    })
                  }
                  disabled={disableEdit}
                />
              </Grid>
              <Grid item xs={6} sm={6}>                
                <State
                  error={validation.state && validation.state.length > 0}
                  helperText={validation.state}
                  onChange={(e) =>
                    this.setState({ state: e.target.value, city: "" })
                  }
                  disabled={disableEdit}
                  selectedState={state || ""}
                  selectedCountry={country || ""}
                  label={country === "US" ? t('componentData.companyDetail.State') : t('componentData.companyDetail.Province')}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={6} sm={6}>                
                <City
                  error={validation.city && validation.city.length > 0}
                  helperText={validation.city}
                  selectedState={state || ""}
                  selectedCity={city || ""}
                  selectedCountry={country || ""}
                  onChange={(e) => this.setState({ city: e.target.value })}
                  disabled={disableEdit}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="zip_code"
                  label={country === "US" ? t('componentData.companyDetail.ZipCode') : t('componentData.companyDetail.PostalCode')}
                  variant="outlined"
                  value={zip_code}
                  onChange={(e) => this.setState({ zip_code: e.target.value })}
                  inputProps={{ maxLength: country === "US" ? 5 : 6 }}
                  error={validation.zip_code && validation.zip_code.length > 0}
                  helperText={validation.zip_code}
                  disabled={disableEdit}
                />
              </Grid>
            </Grid>

            {true && (
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    select
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="locationType"
                    label={t('componentData.companyDetail.LocationType')}
                    variant="outlined"
                    disabled={!isOnboarding}
                    onChange={(e) =>
                      this.setState({ locationType: e.target.value })
                    }                    
                    value={locationType || 1}
                  >
                    <MenuItem>{t('componentData.companyDetail.Select')}</MenuItem>
                    {locations &&
                      Object.keys(locations).map((option) => (
                        <MenuItem
                          id={`locationType_${locations[option] &&
                            locations[option].locationTypeId
                            }`}
                          key={`locationType_${locations[option] &&
                            locations[option].locationTypeId
                            }`}
                          value={
                            locations[option] &&
                            locations[option].locationTypeId
                          }
                        >
                          {locations[option] && locations[option].description}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              </Grid>
            )}

              

          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default withTranslation() (
  connect((state) => ({ ...state.user }))(withStyles(styles)(CompanyDetails))
)
