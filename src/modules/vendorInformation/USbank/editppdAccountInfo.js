import React, { Component } from "react";
import { Grid, Box, Typography, Paper } from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { Button } from "~/components/Forms";
import { TextField } from "~/components/Forms";
import CountryPhoneCode from "~/components/Forms/CountryPhoneCode";
import moment from "moment";
import { updatePayeeDetails } from "~/redux/helpers/B2C/suppliers";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { withTranslation } from "react-i18next";
import { AlertDialog } from "~/components/Dialogs";
import MaskInput from '~/components/MaskInput';
import DatePicker from 'react-datepicker';
import MaskedInput from "../../../components/MaskedInput"
import { fetchUSBankPrepaidCardData } from '~/redux/actions/USbank/payments';
import {
	MenuItem,
	InputAdornment,
} from "@material-ui/core";
import EventIcon from '@material-ui/icons/Event';
import StateIso from "~/components/CSC/StateIso";
import CityIso from "~/components/CSC/CityIso";
import CountryIso from "~/components/CSC/CountryIso";
import { updatepayeeDetails } from "~/redux/helpers/USbank/payee";

class EditPPDView extends Component {
	state = {
		contactData: this.props.data,
		accountTypeList: this.props.accountTypeList,
		validation: {},
		alertMessage: null,
		alertMessageCallbackType: null,
		finalCardDetails: this.props.finalCardDetails,
		startDate: null,
	};


	hideAlertMessage = () => {
		this.setState({
			alertMessage: null,
			alertMessageCallbackType: null,
		});
	};

	goBack = () => {
		this.setState({
			alertMessage: null,
			alertMessageCallbackType: null,
		});
		//refresh payee list
		this.props.updateCTAsData();
	};
	handleGovExpiryDate = (date) => {
		const { contactData } = this.state;
		
		this.setState({
			contactData: {
				...contactData,
				// [e.target.name]: date.toLocaleDateString(),
				govExpiredDate: date,
			},
		})
	};
	handleDOBActivatedAt = (date) => {
		const { contactData } = this.state;
		
		this.setState({
			contactData: {
				...contactData,
				// [e.target.name]: date.toLocaleDateString(),
				dateOfBirth: date,
			},
		})
	  };

	handleChange = (name, e) => {
		const { contactData } = this.state;
		const { value } = e.target;
		let finalValue = "";

		switch (name) {

			case "homePhone":
				finalValue = value.replace(/[^0-9-]/g, "");
				break;
			case "govLocation":
				finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
				break;
			case "employerState":
				finalValue = value.replace(/[^a-zA-Z0-9-.# /,^$]/g, "");
				break;
			case "uniqueId":
				finalValue = value.replace(/[^0-9-]/g, "");
				break;
			case "ssn":
				finalValue = value.replace(/[^0-9-]/g, "");
				break;
			case "govIdValue":
				finalValue = value.replace(/[^0-9-]/g, "");
				break;
			case "routingCode":
				finalValue = value.replace(/[^0-9-]/g, "");
				break;

			default:
				finalValue = value;
				break;
		}
		this.setState({
			contactData: {
				...contactData,
				[name]: finalValue
			},
		});

	};

	handleSubmit = () => {
		const isValid = this.validateForm();
		if (isValid) {
		  this.saveProfileData();
		}
	  };

	validateForm = () => {
		const { contactData,finalCardDetails } = this.state;
		const { t } = this.props;
		let valid = true;
		const contactValidation = {};
		if ( finalCardDetails.isUniqueId && (contactData.uniqueId === null || (contactData.uniqueId !== null && contactData.uniqueId.toString().trim().length === 0))) {
			contactValidation["uniqueId"] = t(
				"componentData.addPayee.error.uniqueId"
			);
			valid = false;
		}

		if (finalCardDetails.isEmail && (!contactData || !contactData.emailId || contactData.emailId.trim() === "")) {
			contactValidation["emailId"] = t("componentData.editContactView.emailReq");
			valid = false;
		  }
		if (finalCardDetails.isEmail &&  (contactData && contactData.emailId && contactData.emailId.trim().length > 0)) {
			const re =
			  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(contactData.emailId.trim().toLowerCase())) {
			  contactValidation["emailId"] = t(
				"componentData.editContactView.InvalidEmail"
			  );
			  valid = false;
			}
		  }

		if (finalCardDetails.isMobilePhone &&
			((!contactData.mobilePhone || !contactData.mobilePhone?.trim()?.length))) {
			contactValidation["mobilePhone"] = t(
				"componentData.addPayee.error.mobilePhone"
			);
			valid = false;
		}
		else if (finalCardDetails.isMobilePhone && contactData.mobilePhone.toString().trim().length !== 10) {
			contactValidation["mobilePhone"] = t(
				"componentData.addPayee.error.phoneLength"
			);
			valid = false;
		}

		if (finalCardDetails.isHomePhone &&
			(!contactData.homePhone || !contactData.homePhone?.trim()?.length)) {
			contactValidation["homePhone"] = t(
				"componentData.addPayee.error.homePhone"
			);
			valid = false;
		}
		else if (finalCardDetails.isHomePhone && contactData.homePhone.toString().trim().length !== 10) {
			contactValidation["homePhone"] = t(
				"componentData.addPayee.error.phoneLength"
			);
			valid = false;
		}

		if (finalCardDetails.isDateOfBirth && contactData.isDateOfBirth === null) {
			contactValidation["dateOfBirth"] = t(
				"componentData.addPayee.error.dateOfBirth"
			);
			valid = false;
		}
		

		  if (finalCardDetails.isAddress && (!contactData.address1 || !contactData.address1.trim().length)) {
			contactValidation["address1"] = t(
			  "componentData.addPayee.error.address_line1"
			);
			valid = false;
		  }
		//   if (finalCardDetails.isAddress && (!contactData.address2 || !contactData.address2.trim().length)) {
		// 	contactValidation["address2"] = t(
		// 	  "componentData.addPayee.error.address_line2"
		// 	);
		// 	valid = false;
		//   }
		
	   
		  if (finalCardDetails.isAddress && (!contactData.country|| !contactData.country.trim().length)) {
			contactValidation["country"] = t(
			  "componentData.addPayee.error.country"
			);
			valid = false;
		  }
		  if (finalCardDetails.isAddress && (!contactData.state|| !contactData.state.trim().length)) {
			contactValidation["state"] = t(
			  "componentData.addPayee.error.state"
			);
			valid = false;
		  }
		  if (finalCardDetails.isAddress && (!contactData.city|| !contactData.city.trim().length)) {
			contactValidation["city"] = t(
			  "componentData.addPayee.error.city"
			);
			valid = false;
		  }
		  if ( finalCardDetails.isAddress && (!contactData.postalCode || !contactData.postalCode.trim().length)) {
			contactValidation["zipcode"] = t(
			  "componentData.addPayee.error.zipcode"
			);
			valid = false;
		  }

		if (finalCardDetails.isSsn &&
			(contactData.ssn === null || (contactData.ssn !== null && contactData.ssn.toString().trim().length === 0))
		) {
			contactValidation["ssn"] = t("componentData.addPayee.error.SSN");
			valid = false;
		}

		if (finalCardDetails.isEmployeeState &&
			(contactData.employerState === null || (contactData.employerState !== null && contactData.employerState.toString().trim().length === 0))
		) {
			contactValidation["employerState"] = t("componentData.addPayee.error.employerState");
			valid = false;
		}else if (finalCardDetails.isEmployeeState &&contactData.employerState.toString().trim().length < 2) {
			valid = false;
			contactValidation["employerState"] = t(
			  "componentData.addPayee.error.employerStatemin"
			);}

		if (  finalCardDetails.isGovLocation &&
			(contactData.govLocation === null || (contactData.govLocation !== null && contactData.govLocation.toString().trim().length === 0))
		) {
			contactValidation["govLocation"] = t("componentData.addPayee.error.govLocation");
			valid = false;
		}
		
		if (finalCardDetails.govIdTypeId &&
			(!contactData.govIdValue || !contactData.govIdValue?.trim()?.length)) {
			contactValidation["govIdValue"] = t(
				"componentData.addPayee.error.govIdValue"
			);
			valid = false;
		}
		else if (finalCardDetails.govIdTypeId &&
			finalCardDetails.govIdTypeId && contactData.govIdValue.toString().trim().length !== 10) {
			contactValidation["govIdValue"] = t(
				"componentData.addPayee.error.govIdValueLength"
			);
			valid = false;
		}

		if (finalCardDetails.govIdTypeId  && contactData.govExpiredDate === null) {
			contactValidation["govExpiredDate"] = t(
				"componentData.addPayee.error.govExpiredDate"
			);
			valid = false;
		}

		
		this.setState({ validation: { ...contactValidation } });
		return valid;
	};

	saveProfileData = () => {
		const { vendorDetail } = this.props;
		const consumerId = vendorDetail?.consumerId || null;
    	const paymentID = vendorDetail?.primaryPaymentMethodId || null;
    	const { contactData,finalCardDetails } = this.state;

		const data = {
			consumerId:consumerId,
			paymentMethodId:paymentID,
			paymentMethodInfo:{
				lastName:  finalCardDetails.isName ? (contactData.lastName || null):null,
				firstName: finalCardDetails.isName ? (contactData.firstName || null):null,
				address1: finalCardDetails.address? (contactData.address1||null) : null,
				address2: finalCardDetails.address? (contactData.address2 || null):null,
				city: finalCardDetails.address? (contactData.city || null):null,
				state: finalCardDetails.address? (contactData.state || null):null,
				country: finalCardDetails.address? (contactData.country || null):null,
				postalCode: finalCardDetails.address? (contactData.postalCode || null):null,
				ssn: finalCardDetails.isSsn ? (contactData.ssn || null):null,
				emailId: finalCardDetails.isEmail ? (contactData.emailId || null):null,
				homePhone: finalCardDetails.isHomePhone? (contactData.homePhone || null):null,
				mobilePhone: finalCardDetails.isMobilePhone? (contactData.mobilePhone || null):null,
				employerState: finalCardDetails.isEmployeeState ? (contactData.employerState || null):null,
				govIdType: finalCardDetails.govIdTypeId ? (finalCardDetails.govIdType || null):null,
				govIdValue: finalCardDetails.govIdTypeId ? (contactData.govIdValue || null):null,
				govLocation: finalCardDetails.isGovLocation ? (contactData.govLocation || null):null,
				uniqueId: finalCardDetails.isUniqueId ? (contactData.uniqueId || null):null,
				dateOfBirth: finalCardDetails.isDateOfBirth ? (contactData.dateOfBirth? moment(contactData.dateOfBirth).format('MM/DD/YYYY'):null):null,
				govExpiredDate: finalCardDetails.govIdTypeId? (contactData.govExpiredDate? moment(contactData.govExpiredDate).format('MM/DD/YYYY'):null):null,
				//phoneCountryCode: contactData.phoneCountryCode || contactData.phoneNumber ? "+1" : null,
			}
		};
		

		updatepayeeDetails(data).then((response) => {
			if (response.error) {
			  this.setState({
				alertMessage: response.message,
				alertMessageCallbackType: null,
			  });
			  return false;
			}
	
			this.setState({
			  alertMessage: response.message,
			  alertMessageCallbackType: "REDIRECT",
			});
		  })
		  .catch((error) => {});
	};
	render() {
		const { classes, t } = this.props;
		const { validation, contactData, alertMessage, alertMessageCallbackType, accountTypeList, finalCardDetails } =
			this.state;
		return (
			<>
				<Paper>
					<Grid
						container
						className={classes.details}
						style={{ padding: "25px" }}
						direction="row"
					>
						{finalCardDetails.isName ? (
							<>
							<Grid item xs={6} md={6} className={classes.gridItem}>
							<TextField
								fullWidth={true}
								color="secondary"
								autoComplete="off"
								name="firstName"
								label={t("componentData.addPayee.FirstName")}
								variant="outlined"
								value={contactData.firstName || ""}
								inputProps={{ maxLength: 50 }}
								onChange={(e) =>
									this.setState({
										contactData: {
											...contactData,
											[e.target.name]: e.target.value,
										},
									})
								}
								error={Boolean(validation.firstName)}
								helperText={validation.firstName}
								disabled={contactData.isRegistered}
							/>
							</Grid>
							<Grid item xs={6} md={6} className={classes.gridItem}>
							<TextField
								fullWidth={true}
								color="secondary"
								autoComplete="off"
								name="lastName"
								label={t("componentData.addPayee.LastName")}
								variant="outlined"
								value={contactData.lastName || ""}
								inputProps={{ maxLength: 50 }}
								onChange={(e) =>
									this.setState({
										contactData: {
											...contactData,
											[e.target.name]: e.target.value,
										},
									})
								}
								error={Boolean(validation.lastName)}
								helperText={validation.lastName}
								disabled={contactData.isRegistered}
							/>
							</Grid>
							</>
						) : null}
						{finalCardDetails.isUniqueId ? <Grid item xs={6} md={6} className={classes.gridItem}>
							<Box my={1}>
								<TextField
									fullWidth={true}
									color="secondary"
									autoComplete="off"
									autoFocus={true}
									variant="outlined"
									label={t(
										"componentData.addPayee.uniqueId"
									)}
									error={validation.uniqueId}
									helperText={validation.uniqueId}
									value={contactData.uniqueId || ""}
									name="uniqueId"
									inputProps={{
										// minLength: 10,
										maxLength: 50,
									}}

									onChange={(e) =>
										this.setState({
											contactData: {
												...contactData,
												[e.target.name]: e.target.value,
											},
										})
									}
									required
									disabled={contactData.isRegistered}
								/>
							</Box>
						</Grid> : null}
						{finalCardDetails.isEmail ? <Grid item xs={6} md={6} className={classes.gridItem}>
							<Box my={1}>
							<TextField
								required
								error={validation && validation.emailId}
								helperText={(validation && validation.emailId) || ""}
								fullWidth={true}
								autoComplete="off"
								label={t("componentData.editContactView.email")}
								variant="outlined"
								color="secondary"
								value={(contactData && contactData.emailId) || ""}
								name="emailId"
								onChange={(e) =>
									this.setState({
									contactData: {
										...contactData,
										[e.target.name]: e.target.value,
									},
									})
								}
								inputProps={{
									maxLength: 48,
								}}
								disabled={contactData.isRegistered}
								/>
							</Box>
						</Grid> : null}
						{finalCardDetails.isMobilePhone ? <Grid item xs={6} md={6} className={classes.gridItem}>
							<MaskedInput
								fullWidth={true}
								color="secondary"
								variant="outlined"
								value={contactData.mobilePhone|| ""}
								name="mobilePhone"
								type="text"
								label={t("componentData.addPayee.mobilePhone")}
								onChange={(e) =>
									this.setState({
										contactData: {
											...contactData,
											[e.target.name]: e.target.value,
										},
									})
								}
								placeholder={"XXX-XXX-XXXX"}
								error={Boolean(validation.mobilePhone)}
								helperText={validation.mobilePhone}
								inputProps={{ maxLength: 10 }}
								formatterProps={{
									format: "###-###-####",
									isNumericString: true,
								}}
								required
								disabled={contactData.isRegistered}
							//   disabled={disableEdit}
							/>
						</Grid> : null}
						{finalCardDetails.isHomePhone ? <Grid item xs={6} md={6} className={classes.gridItem}>
							<MaskedInput
								fullWidth={true}
								color="secondary"
								variant="outlined"
								value={contactData.homePhone|| ""}
								name="homePhone"
								type="text"
								label={t("componentData.addPayee.homePhone")}
								onChange={(e) =>
									this.setState({
										contactData: {
											...contactData,
											[e.target.name]: e.target.value,
										},
									})
								}
								placeholder={"XXX-XXX-XXXX"}
								error={Boolean(validation.homePhone)}
								helperText={validation.homePhone}
								inputProps={{ maxLength: 10 }}
								formatterProps={{
									format: "###-###-####",
									isNumericString: true,
								}}
								required
								disabled={contactData.isRegistered}
							//   disabled={disableEdit}
							/>
						</Grid> : null}
						{finalCardDetails.isDateOfBirth ? <Grid item xs={6} md={6} className={classes.gridItem}>
						<Box position="relative">
								<DatePicker
									customInput={
										<TextField
											fullWidth={true}
											color="secondary"
											autoComplete="off"
											autoFocus={true}
											variant="outlined"
											label={t(
												"componentData.addPayee.DOB"
											)}
											error={validation.dateOfBirth}
											helperText={validation.dateOfBirth}
											// selected={this.state.startDate}
											name="dateOfBirth"
											className="fullWidth"
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<EventIcon
															fontSize="small"
															style={{ cursor: "pointer" }}
														/>
													</InputAdornment>
												),
											}}
										/>
									}
									name="dateOfBirth"
									placeholderText={"Date of Birth"}
									dateFormat="MM/dd/yyyy"
									className={classes.datePicker}
									selected={contactData.dateOfBirth ? new Date(contactData.dateOfBirth): ""}
									// selected={this.state.dateOfBirth}
									disabled={contactData.isRegistered}
									maxDate={new Date()}
                              showYearDropdown
                              yearDropdownItemNumber={115}
									onChange={this.handleDOBActivatedAt}
									required
								/>
							
							</Box>
						</Grid> : null}
						{finalCardDetails.isAddress ? (
                        <>
							<Grid item xs={6} md={6} className={classes.gridItem}>
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t("componentData.addPayee.address_line1")}
                              error={validation.address1}
                              helperText={validation.address1}
                              name="address1"
                              onChange={(e) => {
                                this.handleChange("address1", e);
                              }}
                              inputProps={{ minLength: 1, maxLength: 35 }}
                              //value={address1}
							  value={contactData.address1 || ""}
							  disabled={contactData.isRegistered}
                              required
                            />
                          </Grid>
						  <Grid item xs={6} md={6} className={classes.gridItem}>
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              label={t("componentData.addPayee.address_line2")}
                              error={validation.address2}
                              helperText={validation.address2}
                              name="address2"
                              onChange={(e) => {
                                this.handleChange("address2", e);
                              }}
                              inputProps={{ maxLength: 35, minLength: 1 }}
                              value={contactData.address2 || ""}
							  disabled={contactData.isRegistered}
                            //   required
                            />
                          </Grid>
						  <Grid item xs={6} md={6} className={classes.gridItem}>
                          <Grid item xs={12} md={12} style={{ marginTop: "8px" }}>
                            <CountryIso
                              selectedCountry={contactData.country}
                              label={t("componentData.addPayee.Country")}
                              error={validation.country}
                              helperText={validation.country}
                              //value={country}
							  value={contactData.country || ""}
                              name="country"
                              required
							  disabled={contactData.isRegistered}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) =>
                                this.handleChange("country", e)
                              }
                            />
                          </Grid>
                        </Grid>
						<Grid item xs={6} md={6} className={classes.gridItem}>
                          <Grid item xs={12} md={12} style={{ marginTop: "8px" }}>
                            <StateIso
                              label={t("componentData.addPayee.state")}
                              error={validation.state}
                              helperText={validation.state}
                              selectedState={contactData.state || ""}
                              selectedCountry={contactData.country || ""}
                              //value={state}
							  value={contactData.state || ""}
                              name="state"
                              required
                              InputLabelProps={{
                                shrink: true,
                              }}
							  disabled={contactData.isRegistered}
                              onChange={(e) => this.handleChange("state", e)}
                            />
                          </Grid>
                        </Grid>
						<Grid item xs={6} md={6} className={classes.gridItem}>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            style={{ marginTop: "8px" }}
                          >
                            <CityIso
                              name="city"
                              label={t("componentData.addPayee.city")}
                              error={validation.city}
                              helperText={validation.city}
                              selectedState={contactData.state || ""}
                              selectedCountry={contactData.country || ""}
                              selectedCity={contactData.city || ""}
							  value={contactData.city || ""}
                              required={true}
                              InputLabelProps={{
                                shrink: true,
                              }}
							  disabled={contactData.isRegistered}
                              onChange={(e) => this.handleChange("city", e)}
                            />
                          </Grid>
                        </Grid>
						<Grid item xs={6} md={6} className={classes.gridItem}>
                            <TextField
                              label={t("componentData.addPayee.zipCode")}
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              autoFocus={true}
                              variant="outlined"
                              error={Boolean(validation.postalCode)}
                              helperText={validation.postalCode}
                              name="postalCode"
                              onChange={(e) =>
                                this.handleChange("postalCode", e)
                              }
                              inputProps={{ minLength: 5, maxLength: 10 }}
							  disabled={contactData.isRegistered}
                              required
							  value={contactData.postalCode || ""}
                            />
                        </Grid>
						</>
                      	) : null}
						{finalCardDetails.isSsn ? <Grid item xs={6} md={6} className={classes.gridItem}>
							
								<TextField
									fullWidth={true}
									color="secondary"
									autoComplete="off"
									autoFocus={true}
									variant="outlined"
									label={t("componentData.addPayee.SSN")}
									error={validation.ssn}
									helperText={validation.ssn}
									value={contactData.ssn || ""}
									disabled={contactData.isRegistered}
									name="ssn"
									inputProps={{
										// minLength: 10,
										maxLength: 9,
									}}
									onChange={(e) =>
										this.setState({
											contactData: {
												...contactData,
												[e.target.name]: e.target.value,
											},
										})
									}
									required
								/>
				
						</Grid> : null}
						{finalCardDetails.isEmployeeState ? <Grid item xs={6} md={6} className={classes.gridItem}>
								<TextField
									fullWidth={true}
									color="secondary"
									autoComplete="off"
									autoFocus={true}
									variant="outlined"
									label={t('componentData.addPayee.isEmployeeState')}
									error={validation.employerState}
									helperText={validation.employerState}
									disabled={contactData.isRegistered}
									value={contactData.employerState || ""}
									name="employerState"
									inputProps={{
										// maxLength: 9,
										minLength:2,
										maxLength: 4,
									}}
									onChange={(e) =>
										this.setState({
											contactData: {
												...contactData,
												[e.target.name]: e.target.value,
											},
										})
									}
									required
								/>
						</Grid> : null}	
						{finalCardDetails.isGovLocation ? <Grid item xs={6} md={6} className={classes.gridItem}>
								<TextField
									fullWidth={true}
									color="secondary"
									autoComplete="off"
									autoFocus={true}
									variant="outlined"
									disabled={contactData.isRegistered}
									label={t(
										"componentData.addPayee.govLocation"
									)}
									error={validation.govLocation}
									helperText={validation.govLocation}
									value={contactData.govLocation || ""}
									name="govLocation"
									inputProps={{
										maxLength: 20,
									}}
									onChange={(e) =>
										this.setState({
											contactData: {
												...contactData,
												[e.target.name]: e.target.value,
											},
										})
									}
									required
								/>
						</Grid> : null}
						{finalCardDetails.govIdTypeId ? <Grid item xs={6} md={6} className={classes.gridItem}>
								<TextField
									fullWidth={true}
									color="secondary"
									autoComplete="off"
									autoFocus={true}
									variant="outlined"
									label={t(
										"componentData.addPayee.govID"
									)}
									error={validation.govIdValue}
									helperText={validation.govIdValue}
									value={contactData.govIdValue || ""}
									disabled={contactData.isRegistered}
									name="govIdValue"
									inputProps={{
										// minLength: 10,
										maxLength: 50,
									}}
									onChange={(e) =>
										this.setState({
											contactData: {
												...contactData,
												[e.target.name]: e.target.value,
											},
										})
									}
									required
								/>
						</Grid> : null}
						{finalCardDetails.govIdTypeId ? <Grid item xs={6} md={6} className={classes.gridItem} style={{marginTop: '8px'}}>
						<Box position="relative">
								<DatePicker
									customInput={
										<TextField
											fullWidth={true}
											color="secondary"
											autoComplete="off"
											autoFocus={true}
											variant="outlined"
											label={t(
												"componentData.addPayee.govExpiredDate"
											)}
											error={validation.govExpiredDate}
											disabled={contactData.isRegistered}
											helperText={validation.govExpiredDate}
											name="govExpiredDate"
											className="fullWidth"
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<EventIcon
															fontSize="small"
															style={{ cursor: "pointer" }}
														/>
													</InputAdornment>
												),
											}}
										/>
									}
									disabled={contactData.isRegistered}
									placeholderText={t(
										"componentData.addPayee.govExpiredDate"
									)}
									dateFormat="MM/dd/yyyy"
									className={classes.datePicker}
									selected={contactData.govExpiredDate ? new Date(contactData.govExpiredDate): ""}
									onChange={this.handleGovExpiryDate}
									minDate={new Date()}
									required
								/>
								</Box>
						</Grid> : null}
						
						
						


						

						<Grid item xs={12}>
							<Box my={4} className={`button-container`}>
								<Box mx={2}>
									<Button
										type="submit"
										fullWidth={false}
										variant="outlined"
										color="primary"
										className={classes.btnSave}
										onClick={this.props.onCancel}
									>
										<Typography variant="h4">
											{" "}
											{t("componentData.editContactView.cancel")}
										</Typography>
									</Button>
								</Box>
								<Box mx={2}>
								{ !contactData.isRegistered &&	<Button
										type="submit"
										fullWidth={false}
										variant="contained"
										color="primary"
										onClick={this.handleSubmit}
										style={{ padding: "10px" }}
									>
										<span
											style={{
												height: "18px",
											}}
										>
											<span className={classes.checkIconClass}>
												<CheckCircleIcon />
											</span>
										</span>
										<Typography variant="h4">
											{t("componentData.editContactView.SAVEANDEXIT")}
										</Typography>
									</Button>}
								</Box>
							</Box>
						</Grid>
					</Grid>
				</Paper>
				{alertMessage &&
					this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
			</>
		);
	}
	renderAlertMessage = (title, message, callbackType) => {
		return (
			<AlertDialog
				dialogClassName={"alert-dialoge-root"}
				title={title}
				message={message}
				onConfirm={() => {
					callbackType === "REDIRECT" ? this.goBack() : this.hideAlertMessage();
				}}
			/>
		);
	};
}

export default withTranslation()(withStyles(styles)(EditPPDView));
