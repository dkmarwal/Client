import React, { Component, Fragment } from 'react';
import {
	Grid,
	Box,
	Button,
	CircularProgress,
	Checkbox,
	withStyles,
	Paper,
	Typography,
	MenuItem,
	Tooltip,
	Link
} from '@material-ui/core';
import TextField from "~/components/Forms/TextField";
import Notification from "~/components/Notification";
import MuiAlert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { accessRights } from '~/config/accessRights';
import { withTranslation } from 'react-i18next';
import SyncIcon from '@material-ui/icons/Sync';
import AutoCompleteChip from '~/components/AutoComplete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import { getTimeZoneList, getTemplateList } from "~/redux/actions/payments";
import InfoIcon from '@material-ui/icons/Info';
import { validForOptions, MCDefaultTimeZone } from '~/config/entityTypes';
import moment from 'moment';
import CountryIso3 from '~/components/CSC/CountryIso3';

const styles = (theme) => ({
	cardImageLabel: {
		color: 'rgba(0, 0, 0, 0.26)'
	},
	cardImageIcon: {
		margin: theme.spacing(1),
		verticalAlign: 'middle'
	},
	cardCheckBox: {
		paddingLeft: theme.spacing(0),
		verticalAlign: 'middle'
	},
	errorAlertText: {
		border: '1px solid #E02020',
		background: '#fff',
		color: '#E02020'
	},
	helperTxt: {
		color: '#4C4C4C',
		fontSize: 12,
		fontStyle: 'italic',
		marginTop: '3px'
	},
	infoText: {
		fontSize: theme.spacing(1.5),
		fontStyle: 'italic',
		color: '#4C4C4C'
	},
	button: {
		display: 'inline-block',
		float: 'left',
		width: '120px',
		margin: '0px 10px 0 0',
	}
});

class CardOnly extends Component {
	state = {
		saveProcessing: false,
		timeZoneList: [],
		timeZoneLoading: false,
		alertType: null,
		alertMessage: null,
		templateLoader: {
			loaderIndex: null, status: false
		},
		formData: [{
			programName: "", companyNumber: "", purchaseDetails: [], cardImage: false, timeZoneId: MCDefaultTimeZone, validFor: validForOptions.length > 0 ? validForOptions[0].title : '',
			country: "USA"
		}],
		cardAccountDetailsId: null,
		error: { programName: "", companyNumber: "", purchaseType: '', mccGroup: "", timeZoneId: "" },
		errorIndex: { programName: [], companyNumber: [], purchaseType: [], templateName: [], mccGroup: [], timeZoneId: [] },
		purchaseTemplateAlert: '',
		lastUpdateDateTime: null,
		isRefreshed: false,
		refreshLoader: false
	}

	componentDidMount() {
		this.fetchTimeZoneList();
		const { accountDetails } = this.props;
		if (accountDetails && accountDetails.programDetailsId) {
			const parsedData = (({ programName, companyNumber, purchaseDetails, cardImage, timeZoneId, validFor, programId, country }) =>
				({ programName, companyNumber, purchaseDetails, cardImage, timeZoneId, validFor, programId, country }))(accountDetails);
			this.setState({
				formData: [parsedData],
				cardAccountDetailsId: accountDetails.programDetailsId,
				lastUpdateDateTime: accountDetails.updatedAt ? `${accountDetails.updatedAt ? new Date(accountDetails.updatedAt).toLocaleDateString(this.props.i18n.language,
					{ year: 'numeric', month: 'long', day: 'numeric' }).replace(/[^ -~]/g, '') : ''} |
					${moment.utc(accountDetails.updatedAt).format('h:mm A')}` : ''
			})
		}
	}
	fetchTimeZoneList = async () => {
		this.setState({ timeZoneLoading: true })
		const options = await getTimeZoneList();
		if (options && options.data) {
			this.setState({ timeZoneList: options.data, timeZoneLoading: false })
		}
	}

	handleChange = (i, e, typeIndex) => {
		const { name, value, checked } = e.target;
		const { formData } = this.state;
		let newFormValues = [...formData];
		let { purchaseDetails } = newFormValues[i];

		switch (name) {
			case 'programName':
				newFormValues[i][name] = value.replace(/[^A-Za-z0-9 ]/g, '');
				break;
			case 'purchaseType':
			case 'templateName':
				purchaseDetails[typeIndex][name] = value.replace(/[^A-Za-z0-9 ]/g, '');
				break;
			case 'cardImage':
				newFormValues[i][name] = checked;
				break;
			case 'companyNumber':
				newFormValues[i][name] = value.replace(/[^0-9]/g, '');
				break;
			case 'validFor':
				newFormValues[i][name] = value;
				break;
			default:
				newFormValues[i][name] = value;
		}
		this.setState({ formData: newFormValues })
	}

	handleTimeZoneChange = (values, index) => {
		const { formData } = this.state;
		let newFormValues = [...formData];
		if (values) {
			newFormValues[index]["timeZoneId"] = values.timeZoneId;
			this.setState({ formData: newFormValues })
		}
	}

	fetchTemplateList = async (index, e) => {
		let errors = { ...this.state.errorIndex };
		const { t } = this.props;
		let validation = {};
		let programValue = e.target.value.trim();
		let copyFormData = [...this.state.formData];
		if (programValue) {
			const isExist = this.state.formData.filter(x => x.programName == programValue);
			if (isExist.length > 1) {
				validation["programName"] = t('componentData.masterCardDetails.programDuplicateErr');
				errors.programName.push(index);
				this.setState({
					error: { ...validation },
					errorIndex: { ...errors }
				});
			}
			else {
				this.setState({
					templateLoader: {
						status: true,
						loaderIndex: index
					}
				})
				const removeProgramInd = errors.programName && errors.programName.indexOf(index);
				if (removeProgramInd > -1) {
					errors.programName.splice(removeProgramInd, 1);
				}
				const response = await getTemplateList([programValue]); // INCEDO USD TEST COMPANY
				let createData = [];
				this.setState({
					templateLoader: {
						status: false,
						loaderIndex: null
					}
				})

				if (response && response.length) {
					if (response[0]?.errorCode == "ERROR") {
						this.setState({
							purchaseTemplateAlert: response[0]?.errorDescription || t('componentData.reduxData.SomethingWentWrong')
						});
						errors.templateName.push(0);
					}
				}
				else {
					if (response.result && response.result.length > 0) {
						response.result.forEach(templateItem => {
							const { purchaseTemplates, messageId, programId, errorDescription } = templateItem;
							copyFormData[index].messageId = messageId;
							copyFormData[index].programId = programId;
							if (purchaseTemplates && purchaseTemplates.length) {
								purchaseTemplates.forEach(item => {
									createData.push({
										purchaseType: 'ALLPURCHASES',
										templateId: item.templateId,
										templateDescription: item.templateDescription,
										templateName: item.templateName,
										mccGroup: ["ALL MCCs"]
									});
								});
								const removeTemplateInd = errors.templateName && errors.templateName.indexOf(index);
								if (removeTemplateInd > -1) {
									errors.templateName.splice(removeTemplateInd, 1);
								}
							}
							else {
								if (errors.templateName.includes(index) === false) {
									errors.templateName.push(index);
								}
								this.setState({
									purchaseTemplateAlert: errorDescription ? errorDescription : t('componentData.masterCardDetails.purchaseTemplateErr')
								});
							}
						})
					} else {
						if (errors.templateName.includes(index) === false) {
							errors.templateName.push(index);
						}
						this.setState({
							purchaseTemplateAlert: t('componentData.masterCardDetails.purchaseTemplateErr')
						});
					}
				}

				copyFormData[index].purchaseDetails = createData;
				this.setState({
					formData: copyFormData,
					errorIndex: errors
				})
			}
		}
		else {
			copyFormData[index].purchaseDetails = [];
			this.setState({
				formData: copyFormData,
				errorIndex: { ...errors },
				purchaseTemplateAlert: ''
			})
		}
	}

	validateData() {
		let valid = true, validation = {}, errorInd = {
			programName: [], companyNumber: [], purchaseType: [], templateName: [], mccGroup: [],
			timeZoneId: []
		};
		const { formData } = this.state;
		const { t } = this.props;

		formData.forEach((item, index) => {
			const { programName, companyNumber, timeZoneId, purchaseDetails } = item;
			if (!programName || programName.trim().length === 0) {
				validation["programName"] = t('componentData.masterCardDetails.programRequiredErr');
				errorInd["programName"].push(index);
				valid = false;
			}

			if (!companyNumber || companyNumber.trim().length === 0) {
				validation["companyNumber"] = t('componentData.masterCardDetails.companyRequiredErr');
				errorInd["companyNumber"].push(index);
				valid = false;
			}
			if (!timeZoneId) {
				validation["timeZoneId"] = t('componentData.masterCardDetails.timeZoneRequiredErr');
				errorInd["timeZoneId"].push(index);
				valid = false;
			}
			if (purchaseDetails.length) {
				let typeErrorInd = [], mccErrorIndexes = [];
				purchaseDetails.forEach((typeItem, ind) => {
					const { purchaseType } = typeItem;

					if (!purchaseType || purchaseType.trim().length === 0) {
						validation["purchaseType"] = t('componentData.masterCardDetails.purchaseTypeRequiredErr');
						typeErrorInd.push(ind);
						valid = false;
					}
				});
				errorInd["purchaseType"][index] = typeErrorInd;
				errorInd["mccGroup"][index] = mccErrorIndexes;
			}
			else {
				errorInd["templateName"].push(index);
				validation["templateName"] = t('componentData.masterCardDetails.purchaseTemplateRequiredErr')
				valid = false
			}
		})
		this.setState({
			error: { ...validation },
			errorIndex: { ...errorInd }
		});
		return valid;
	}

	saveDetails() {
		const { formData, cardAccountDetailsId } = this.state;
		const programName = formData[0].programName.trim();
		formData[0].programName = programName;
		const valid = this.validateData();
		const { t, saveACHDetails, refreshData, setDialogMessage, closeModal } = this.props;

		if (!this.props.isAddAccount) {
			formData[0].programDetailsId = cardAccountDetailsId;
		}
		if (valid) {
			this.setState({ saveProcessing: true }, () => {
				saveACHDetails(formData).then((response) => {
					if (response.error) {
						setDialogMessage(true, response.message, 'error');
					} else {
						this.setState({ saveProcessing: false }, () => {
							refreshData();
							setDialogMessage(true, response.message, 'success');
							closeModal();
						});
					}
				})
			})
		}
		else {
			this.setState({
				saveProcessing: false,
				alertType: 'error',
				alertMessage: t('componentData.commonErr.validationMsg')
			});
		}
	}
	onRefreshClick = async () => {
		let errors = { ...this.state.errorIndex };
		const { accountDetails, t } = this.props;
		let formDataClone = [...this.state.formData];
		let createList = [];

		if (accountDetails && accountDetails.programDetailsId) {
			this.setState({ refreshLoader: true });
			const programName = formDataClone[0].programName.trim();
			if (programName) {
				const templateList = await getTemplateList([programName]);
				if (templateList && templateList.length) {
					if (templateList[0]?.errorCode == "ERROR") {
						this.setState({
							purchaseTemplateAlert: templateList[0]?.errorDescription || t('componentData.reduxData.SomethingWentWrong')
						});
						errors.templateName.push(0);
					}
				}
				else {
					if (templateList.result && templateList.result.length && templateList.result[0].errorCode == null && templateList.result[0].errorDescription == null) {
						templateList.result[0].purchaseTemplates.forEach(item => {
							const existObj = accountDetails.purchaseDetails.find(x => x.templateName == item.templateName);
							if (existObj && existObj.Id) {
								createList.push(existObj);
							} else {
								createList.push({
									purchaseType: 'ALLPURCHASES',
									templateName: item.templateName,
									templateId: item.templateId,
									templateDescription: item.templateDescription,
									mccGroup: ["ALL MCCs"]
								});
							}
						});
					}
					else if (templateList.result && templateList.result.length && templateList.result[0].errorCode != null && templateList.result[0].errorDescription != null) {
						if (errors.templateName.includes(0) === false) {
							errors.templateName.push(0);
						}
						this.setState({
							purchaseTemplateAlert: templateList.result[0]?.errorDescription || t('componentData.reduxData.SomethingWentWrong')
						});
					}
					else {
						if (errors.templateName.includes(0) === false) {
							errors.templateName.push(0);
						}
						this.setState({
							purchaseTemplateAlert: t('componentData.reduxData.SomethingWentWrong'),
							errorIndex: errors
						});
					}
				}
			}
			else {
				if (errors.templateName.includes(0) === false) {
					errors.templateName.push(0);
				}
				this.setState({
					purchaseTemplateAlert: t('componentData.masterCardDetails.programEmptyErr'),
					errorIndex: errors
				});
			}
			formDataClone[0].purchaseDetails = createList;
			this.setState({
				formData: formDataClone,
				isRefreshed: true,
				refreshLoader: false,
				lastUpdateDateTime: `${new Date().toLocaleDateString(this.props.i18n.language,
					{ year: 'numeric', month: 'long', day: 'numeric' }).replace(/[^ -~]/g, '')} |
				  ${new Date().toLocaleTimeString(this.props.i18n.language, { hour: '2-digit', minute: '2-digit' })}`
			})
		}
	}
	hideAlertMessage = () => {
		this.setState({
			alertType: null,
			alertMessage: null
		});
	}
	renderSnackbar = (type, message) => {
		return (
			<Notification
				variant={type}
				message={message}
				handleClose={this.hideAlertMessage}
			/>
		);
	};

	render() {
		const {
			savingDetails,
			formData,
			errorIndex,
			error,
			timeZoneList,
			timeZoneLoading,
			alertMessage,
			alertType,
			templateLoader,
			purchaseTemplateAlert,
			lastUpdateDateTime,
			isRefreshed,
			refreshLoader
		} = this.state;

		let { t, onCancel, isAddAccount, classes, user } = this.props;

		const isSettingPaymentMethodAddEnabled =
			(user.userRoles &&
				user.userRoles.includes(
					accessRights["SETTINGS_PAYMENT_METHODS_ADD"]
				)) ||
			false;
		const isSettingPaymentMethodEditEnabled =
			(user.userRoles &&
				user.userRoles.includes(
					accessRights["SETTINGS_PAYMENT_METHODS_EDIT"]
				)) ||
			false;
		const canEdit =
			isSettingPaymentMethodAddEnabled || isSettingPaymentMethodEditEnabled
				? true
				: false;

		return (
			<Grid container>
				{
					isAddAccount ?
						<Grid item xs={12}>
							<Box mt={1} mb={2} style={{ color: '#0B1941', fontSize: '20px' }}>
								{t('componentData.masterCardDetails.addNewMastercard')}
							</Box>
						</Grid>
						:
						<>
							<Grid item xs={12}>
								<Box fontSize={24} style={{ color: '#0B1941' }}>
									{t('componentData.masterCardDetails.updateMastercardSetup')}
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Box display={"flex"} my={1} fontSize={14}>
									<Box color={isRefreshed ? '#33C3A4' : '#4C4C4C'}>
										{isRefreshed ? t('componentData.masterCardDetails.templateUpdateText')
											: t('componentData.masterCardDetails.lastUpdateText')} {lastUpdateDateTime}
									</Box>

									<Box mx={1}>
										{!refreshLoader ?
											<Link component="button" variant="body2" underline='none' color="secondary"
												onClick={this.onRefreshClick}
												disabled={!canEdit}
											>
												<SyncIcon fontSize="small" className={classes.cardCheckBox} />
												{t('componentData.masterCardDetails.refreshBtn')}
											</Link>
											:
											<Box mx={2}>
												<CircularProgress color="primary" size={20} />
											</Box>
										}
									</Box>

									<Box>
										<Tooltip placement='top' title={t('componentData.masterCardDetails.cardUpdateSubHead')}>
											<InfoIcon fontSize="small" color='primary' />
										</Tooltip>
									</Box>
								</Box>
							</Grid>

							<Grid item xs={12}>
								<Box my={1}>
									{t('componentData.masterCardDetails.cardUpdateCaption')}
								</Box>
							</Grid>
						</>
				}

				{/* <MasterCard /> */}

				<Grid container spacing={2}>
					{formData.map((element, index) => (
						<Fragment key={index}>
							<Grid item xs={6}>
								<TextField
									color="secondary"
									inputProps={{
										maxLength: 50,
										minLength: 1
									}}
									label={t('componentData.masterCardDetails.programName')}
									placeholder={t('componentData.masterCardDetails.programName')}
									error={errorIndex.programName.includes(index)}
									helperText={errorIndex.programName.includes(index) ?
										error.programName : ''}
									fullWidth={true}
									autoComplete="off"
									InputLabelProps={{ shrink: true }}
									variant="outlined"
									value={element.programName || ""}
									name="programName"
									onChange={e => this.handleChange(index, e)}
									onBlur={e => this.fetchTemplateList(index, e)}
									disabled={!canEdit}
								/>
							</Grid>

							<Grid item xs={6}>
								<Autocomplete
									id="timezone-select"
									options={timeZoneList}
									disableClearable
									getOptionLabel={(option) => option.utcTimezone}
									value={(element.timeZoneId && timeZoneList.find(x => x.timeZoneId === element.timeZoneId)) || {}}
									onChange={(e, values) => {
										this.handleTimeZoneChange(values, index)
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label={t('componentData.masterCardDetails.timeZone')}
											placeholder={t('componentData.masterCardDetails.timeZonePlaceholder')}
											InputLabelProps={{ shrink: true }}
											variant="outlined"
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<React.Fragment>
														{timeZoneLoading ? <CircularProgress color="primary" size={20} /> : null}
														{params.InputProps.endAdornment}
													</React.Fragment>
												),
											}}
											error={errorIndex.timeZoneId.includes(index)}
											helperText={errorIndex.timeZoneId.includes(index) ?
												error.timeZoneId : ''}
										/>
									)}
									disabled={!canEdit}
								/>
							</Grid>

							<Grid item xs={6}>
								<TextField
									color="secondary"
									inputProps={{
										maxLength: 7,
										minLength: 1
									}}
									label={t('componentData.masterCardDetails.programNumber')}
									placeholder={t('componentData.masterCardDetails.programNumber')}
									error={errorIndex.companyNumber.includes(index)}
									helperText={errorIndex.companyNumber.includes(index) ?
										error.companyNumber : ''}
									fullWidth={true}
									autoComplete="off"
									InputLabelProps={{ shrink: true }}
									variant="outlined"
									value={element.companyNumber || ''}
									name="companyNumber"
									onChange={e => this.handleChange(index, e)}
									//onBlur={handleBlur}
									disabled={!canEdit}
								/>
							</Grid>

							<Grid item xs={3} style={{ paddingTop: '1.5rem' }}>
								<Box className={classes.cardImageLabel}>
									<Checkbox
										name="cardImage"
										checked={element.cardImage}
										onChange={e => this.handleChange(index, e)}
										inputProps={{ 'aria-label': 'primary checkbox' }}
										className={classes.cardCheckBox}
										//disabled={!canEdit}
										disabled={true} // we don't need in this phase
									/>
									<CreditCardIcon className={classes.cardImageIcon} />
									{t('componentData.masterCardDetails.cardImage')}
								</Box>
							</Grid>

							<Grid item xs={3}>
								<TextField
									select
									fullWidth={true}
									color="secondary"
									autoComplete="off"
									name="validFor"
									label={t('componentData.masterCardDetails.validFor')}
									variant="outlined"
									onChange={(e, values) => {
										this.handleChange(index, e)
									}}
									value={element.validFor}
									defaultValue={validForOptions.length > 0 && validForOptions[0].title}
									disabled={!canEdit}
								>
									{validForOptions &&
										validForOptions.map((option) => (
											<MenuItem
												id={option.id}
												key={option.id}
												value={option.title}
											>
												{option.title}
											</MenuItem>
										))}
								</TextField>
								<Typography className={classes.infoText}>
									{t('componentData.masterCardDetails.validForUpdateText')}
								</Typography>
							</Grid>

							<Grid item xs={6}>
							<CountryIso3
                                selectedCountry={element.country || ""}
								disabled={!canEdit}
                                // error={errorIndex.country.includes(index)}
                                // helperText={errorIndex.country.includes(index) ?
                                //     error.country : ''}
                                onChange={e => this.handleChange(index, e)}
                            />
							</Grid>

							{templateLoader.status && templateLoader.loaderIndex != null && templateLoader.loaderIndex == index ?
								<Grid item xs={12} sm={12}>
									<Box textAlign={"center"}>
										<CircularProgress color="primary" />
									</Box>
								</Grid>
								:
								element.purchaseDetails.length ?
									<Paper elevation={1} className={classes.paper}>
										<Grid container>
											{element.purchaseDetails.map((item, ind) => (
												<Fragment key={"item" + ind}>
													<Grid item xs={12} sm={12} className={classes.gridItem}>
														<Box pl={1} my={1} display={"flex"}>
															<Typography>{t('componentData.masterCardDetails.purchaseTemplate')} {ind + 1}</Typography>
														</Box>
													</Grid>

													<Grid item xs={12} sm={6} className={classes.gridItem}>
														<Box mx={1} my={1}>
															<TextField
																color="secondary"
																inputProps={{
																	maxLength: 70,
																	minLength: 1
																}}
																label={t('componentData.masterCardDetails.templateName')}
																placeholder={t('componentData.masterCardDetails.templateName')}
																fullWidth={true}
																autoComplete="off"
																InputLabelProps={{ shrink: true }}
																variant="outlined"
																value={item.templateName}
																name="templateName"
																onChange={e => this.handleChange(index, e, ind)}
																disabled={true}
															/>
														</Box>
													</Grid>

													<Grid item xs={12} sm={6} className={classes.gridItem}>
														<Box mx={1} my={1} pt={1}>
															<AutoCompleteChip
																label={t('componentData.masterCardDetails.merchantCategoryCode')}
																name="mccGroup"
																value={item.mccGroup}
																options={[]}
																disabled={true}
																parentIndex={index}
																childIndex={ind}
																isError={errorIndex.mccGroup[index] && errorIndex.mccGroup[index].includes(ind)}
																helperText={errorIndex.mccGroup[index] && errorIndex.mccGroup[index].includes(ind) ?
																	error.mccGroup : ''}
															/>
														</Box>
													</Grid>

													<Grid item xs={12} sm={6} className={classes.gridItem}>
														<Box mx={1} my={1}>
															<TextField
																color="secondary"
																inputProps={{
																	maxLength: 69,
																	minLength: 1
																}}
																label={t('componentData.masterCardDetails.purchaseType')}
																placeholder={t('componentData.masterCardDetails.purchaseType')}
																error={errorIndex.purchaseType[index] && errorIndex.purchaseType[index].includes(ind)}
																helperText={errorIndex.purchaseType[index] && errorIndex.purchaseType[index].includes(ind) ?
																	error.purchaseType : ''}
																fullWidth={true}
																autoComplete="off"
																InputLabelProps={{ shrink: true }}
																variant="outlined"
																value={item.purchaseType}
																name="purchaseType"
																onChange={e => this.handleChange(index, e, ind)}
																disabled={!canEdit}
															/>
														</Box>
													</Grid>
													{!(element.purchaseDetails.length === ind + 1) ?
														<Grid item xs={12} sm={12} className={classes.gridItem}>
															<Box my={1} mx={1}>
																<Divider className={classes.divider} />
															</Box>
														</Grid>
														: null}
												</Fragment>
											))}
										</Grid>
									</Paper> : null
							}

							{purchaseTemplateAlert && errorIndex.templateName.includes(index) ?
								<Grid item xs={12} sm={12} className={classes.gridItem}>
									<Box my={2} mx={1}>
										<MuiAlert severity="error" className={classes.errorAlertText}>
											{t('componentData.masterCardDetails.templateError')} {purchaseTemplateAlert}
										</MuiAlert>
									</Box>
								</Grid> : null}
						</Fragment>
					))}
				</Grid>

				{canEdit && (
					<Grid item xs={12} justify="center">
						<Box mt={5}>
							<Box
								style={{
									justify: 'center',
									margin: '0 auto',
									display: 'table',
									width: '340px',
								}}
							>
								<Box px={5}>
									<Button
										variant="outlined"
										className={classes.button}
										onClick={onCancel}
									>
										{t('componentData.addAccountVCA.Cancel')}
									</Button>
								</Box>

								<Box px={2}>
									{savingDetails ? (
										<CircularProgress color="primary" />
									) : (
										<Button
											variant="contained"
											className={classes.button}
											color="primary"
											onClick={this.saveDetails.bind(this)}
											disabled={templateLoader.status}
										>
											{t('componentData.addAccountVCA.Save')}
										</Button>
									)}
								</Box>
							</Box>
						</Box>
					</Grid>)
				}
				{alertMessage && this.renderSnackbar(alertType, alertMessage)}
			</Grid>
		)
	}

}

export default withTranslation()(connect((state) => ({
	...state.user, ...state.client, ...state.clientConfig
}))(withStyles(styles)(CardOnly)));
