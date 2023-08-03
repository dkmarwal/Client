import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, MenuItem } from "@material-ui/core";
import { TextField } from "~/components/Forms";
import CountryPhoneCode from "../../components/Forms/CountryPhoneCode";
import { styles } from "./styles";
import MaskedInput from "../../components/MaskedInput";
import MaskInput from "../../components/MaskInput";
import { Country, City, State } from "../../components/CSC";
import { withTranslation } from 'react-i18next';

class CompanyDetails extends Component {
  render() {
    const {
      classes,
      companyInfoObj,
      checkInput,
      locations,
      validation,
      onBlurValidate,
      onDunsChange,
      isOnboarding,
      t
    } = this.props;
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
                  label= {t('componentData.onboardCompanyDetail.CompanyName')}
                  variant="outlined"
                  value={companyInfoObj.companyName.value}
                  inputProps={{ maxLength: 100 }}
                  onChange={checkInput}
                  onBlur={onBlurValidate}
                  error={
                    validation.companyName && validation.companyName.length > 0
                  }
                  helperText={validation.companyName}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <MaskInput style={{ marginTop: "8px" }}
                  autoFocus={true}
                  maxLength={9}
                  getValue={checkInput}
                  label= {t('componentData.onboardCompanyDetail.DUNSNumber')}
                  name="duns_number"
                  value={companyInfoObj.duns_number.value || ""}
                  disabled={false}
                  getValue={onDunsChange}
                  errorText={validation.duns_number}
                  onBlur={onBlurValidate}
                  variant={"outlined"}
                  error={
                    validation.duns_number && validation.duns_number.length > 0
                  }
                  helperText={validation.duns_number}
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
                  label= {t('componentData.onboardCompanyDetail.CountryCode')}
                  variant="outlined"
                  value={companyInfoObj.countryCode.value}
                  required
                  excludeCountryCode={["CA", "UM"]}
                  onChange={checkInput}
                  onBlur={onBlurValidate}
                  inputProps={{ maxLength: 4 }}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <MaskedInput
                  fullWidth={true}
                  color="secondary"
                  variant="outlined"
                  value={`${companyInfoObj.phone.value}`}
                  name="phone"
                  type="text"
                  label= {t('componentData.onboardCompanyDetail.Phone')}
                  onChange={checkInput}
                  onBlur={onBlurValidate}
                  placeholder={"XXX-XXX-XXXX"}
                  error={Boolean(validation.phone)}
                  helperText={validation.phone}
                  inputProps={{ maxLength: 10 }}
                  formatterProps={{
                    format: "###-###-####",
                    isNumericString: true
                  }}
                  required
                />
                {/* <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="phone"
                  label="Phone*"
                  variant="outlined"
                  value={companyInfoObj.phone.value}
                  onChange={checkInput}
                  onBlur={onBlurValidate}
                  inputProps={{ maxLength: 10 }}
                  error={validation.phone && validation.phone.length > 0}
                  helperText={validation.phone}
                /> */}
              </Grid>
              <Grid item xs={3} sm={3}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="ext"
                  label= {t('componentData.onboardCompanyDetail.Extension')}
                  variant="outlined"
                  value={companyInfoObj.ext.value}
                  onChange={checkInput}
                  onBlur={onBlurValidate}
                  inputProps={{ maxLength: 10 }}
                  error={validation.ext && validation.ext.length > 0}
                  helperText={validation.ext}
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
                  label= {t('componentData.onboardCompanyDetail.Fax')}
                  variant="outlined"
                  value={companyInfoObj.fax.value}
                  onChange={checkInput}
                  onBlur={onBlurValidate}
                  inputProps={{ maxLength: 10 }}
                  error={validation.fax && validation.fax.length > 0}
                  helperText={validation.fax}
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
                  label={companyInfoObj.country.value === "US" ? (isOnboarding ? companyInfoObj.taxidOrSSN.value : t('componentData.onboardCompanyDetail.TaxIdSSN')) : t('componentData.onboardCompanyDetail.BusinessNumber')}
                  type="text"
                  value={companyInfoObj.taxidOrSSN.taxidOrSSNnumber}
                  disabled
                ></TextField>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="website"
                  label= {t('componentData.onboardCompanyDetail.Website')}
                  inputProps={{ maxLength: 200 }}
                  variant="outlined"
                  value={companyInfoObj.website.value}
                  error={validation.website && validation.website.length > 0}
                  helperText={validation.website}
                  onChange={checkInput}
                  onBlur={onBlurValidate}
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
                  label= {t('componentData.onboardCompanyDetail.Address')}
                  variant="outlined"
                  value={companyInfoObj.address.value}
                  inputProps={{ maxLength: 100 }}
                  onChange={checkInput}
                  onBlur={onBlurValidate}
                  helperText={validation.address}
                  error={validation.address && validation.address.length > 0}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={6} sm={6}>
                {/* <TextField
                  select
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="country"
                  label="Country*"
                  variant="outlined"
                  value={companyInfoObj.country.value}
                  onChange={checkInput}
                  onBlur={onBlurValidate}
                >
                  <MenuItem value="USA">USA</MenuItem>
                </TextField> */}
                <Country
                  selectedCountry={companyInfoObj.country.value}
                  error={validation.country && validation.country.length > 0}
                  helperText={validation.country}
                  onChange={checkInput}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                {/* <StateListField
                  select
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="state"
                  label="State/Province*"
                  countryCode="US"
                  variant="outlined"
                  onChange={checkInput}
                  onBlurValidate={onBlurValidate}
                  value={companyInfoObj.state.value}
                  error={validation.state && validation.state.length > 0}
                  helperText={validation.state}
                /> */}
                <State
                  error={validation.state && validation.state.length > 0}
                  helperText={validation.state}
                  onChange={checkInput}
                  selectedState={companyInfoObj.state.value || ""}
                  selectedCountry={companyInfoObj.country.value}
                  label={companyInfoObj.country.value === "US" ? t('componentData.onboardCompanyDetail.State') : t('componentData.onboardCompanyDetail.Province')}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={6} sm={6}>
                {/* <CityListField
                  select
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="city"
                  label="City/Town*"
                  variant="outlined"
                  countryCode="US"
                  state={companyInfoObj.state.value}
                  value={companyInfoObj.city.value}
                  onChange={checkInput}
                  onBlurValidate={onBlurValidate}
                  error={validation.city && validation.city.length > 0}
                  helperText={validation.city}
                /> */}
                <City
                  error={validation.city && validation.city.length > 0}
                  helperText={validation.city}
                  selectedState={companyInfoObj.state.value}
                  selectedCity={companyInfoObj.city.value}
                  selectedCountry={companyInfoObj.country.value}
                  onChange={checkInput}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="zip_code"
                  label={companyInfoObj.country.value === "US" ? t('componentData.onboardCompanyDetail.ZipCode') : t('componentData.onboardCompanyDetail.PostalCode')}
                  variant="outlined"
                  value={companyInfoObj.zip_code.value}
                  onChange={checkInput}
                  onBlur={onBlurValidate}
                  inputProps={{ maxLength: companyInfoObj.country.value === "US"?5:6 }}
                  error={validation.zip_code && validation.zip_code.length !== 0}
                  helperText={validation.zip_code}
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
                    label= {t('componentData.onboardCompanyDetail.LocationType')}
                    variant="outlined"
                    disabled={!isOnboarding}
                    onChange={checkInput}
                    onBlur={onBlurValidate}
                    value={!isOnboarding ? 1 : companyInfoObj.locationType.value}
                  >
                    <MenuItem>{t('componentData.onboardCompanyDetail.Select')}</MenuItem>
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

export default withTranslation()(withStyles(styles)(CompanyDetails));
