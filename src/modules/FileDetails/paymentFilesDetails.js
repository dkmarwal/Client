import React, { Component } from "react";
import Notification from "~/components/Notification";
import { Grid, Box } from "@material-ui/core";
import { Button } from "~/components/Forms";
import { withStyles } from "@material-ui/core/styles";
import { downloadPaymentFile } from "~/redux/helpers/files";
import config from "~/config";
import { styles } from "./styles";
import { withTranslation } from 'react-i18next';
import BankFileDetails from "./bankFileDetails";
import CCPaymentDetails from "./ccPaymentDetails";
import { PayerTypes, CCFileType } from "~/config/entityTypes";

class PaymentFilesDetails extends Component {
	state = { error: false };
	downLoadPaymentsFile = (id) => {
		const { t } = this.props;
		downloadPaymentFile(id)
			.then((response) => {
				if (response && response.error) {
					this.setState({ error: t('componentData.paymentFileDetail.FileNotExists') });
					return;
				}

				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				const fileName = `${response.headers["x-file-name"]}`;
				link.setAttribute("download", fileName);
				document.body.appendChild(link);
				link.click();
				link.remove();

				this.setState({ error: false });
			})
			.catch((error) => {
				this.setState({ error: t('componentData.paymentFileDetail.FileNotExists') });
			});
	};
	render() {
		const { t, classes, paymentFileData, bankData, canDownload, user } = this.props;
		const { error } = this.state;
		const totalPayment = paymentFileData
			? parseInt(paymentFileData.TotalCheckUSDPayments) +
			parseInt(paymentFileData.TotalCheckCADPayments) +
			parseInt(paymentFileData.TotalACHUSDPayments) +
			parseInt(paymentFileData.TotalACHCADPayments) +
			parseInt(paymentFileData.TotalVCAUSDPayments) +
			parseInt(paymentFileData.TotalVCACADPayments)
			: 0;

		const isCCUser = user.userData && user.userData.payerTypeId == PayerTypes.CARDS || false;

		return (
			<Grid container spacing={2} alignItems="stretch">
				{/********1st Box*******/}
				<Grid item xs={isCCUser ? 6 : 5}>
					<Box bgcolor="white" borderRadius={8}>
						<Box className={classes.TitleHeadTxt} py={1}>
							{isCCUser && (paymentFileData && paymentFileData.ActionTypeId === CCFileType.MODIFY) ?
								(paymentFileData && paymentFileData.ActionTypeId === CCFileType.CANCEL) ? t('componentData.paymentFileDetail.cancelFileDetails') :
									t('componentData.paymentFileDetail.modifyFileDetails') : t('componentData.paymentFileDetail.PaymentFileDetails')}
						</Box>
						<Box p={2}>
							<Box
								display="flex"
								justifyContent="space-between"
								pb={2}
								alignItems="center"
								className={classes.TitleText}
							>
								<Box fontSize={16} width="40%">
									{" "}
									{t('componentData.paymentFileDetail.FileID')}
								</Box>
								<Box fontSize={15} width="60%">
									{" "}
									{paymentFileData.FileID || ""}
								</Box>
							</Box>
							<Box
								display="flex"
								justifyContent="space-between"
								pb={2}
								alignItems="center"
								className={classes.TitleText}
							>
								<Box fontSize={16} width="40%">
									{" "}
									{t('componentData.paymentFileDetail.UploadedAt')}{" "}
								</Box>
								<Box fontSize={15} width="60%">
									{" "}
									{paymentFileData.FileUploaded || "--"}
								</Box>
							</Box>
							<Box
								display="flex"
								justifyContent="space-between"
								pb={2}
								alignItems="center"
								className={classes.TitleText}
							>
								<Box fontSize={16} width="40%">
									{" "}
									{t('componentData.paymentFileDetail.ApprovedBy')}{" "}
								</Box>
								<Box fontSize={15} width="60%">
									{" "}
									{paymentFileData.ApprovedBy || "--"}
								</Box>
							</Box>
							<Box
								display="flex"
								justifyContent="space-between"
								pb={2}
								alignItems="center"
								className={classes.TitleText}
							>
								<Box fontSize={16} width="40%">
									{" "}
									{t('componentData.paymentFileDetail.ApprovedAt')}{" "}
								</Box>
								<Box fontSize={15} width="60%">
									{" "}
									{paymentFileData.FileApprovedAt || "--"}
								</Box>
							</Box>
							<Box
								display="flex"
								justifyContent="space-between"
								pb={2}
								alignItems="center"
								className={classes.TitleText}
							>
								<Box fontSize={16} width="40%">
									{" "}
									{t('componentData.paymentFileDetail.FileStatus')}
								</Box>
								<Box fontSize={15} width="60%">
									{" "}
									<Button size="small" className={classes.btnLighGreen}>
										{" "}
										{paymentFileData.FileStatus || "--"}
									</Button>
								</Box>
							</Box>
							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
								className={classes.TitleText}
							>
								<Box fontSize={16} width="40%">
									{" "}
									{t('componentData.paymentFileDetail.TotalPayments')}
								</Box>
								<Box fontSize={15} width="60%">
									{" "}
									<u
										style={{ cursor: "pointer" }}
										onClick={() =>
											this.props.history.push(
												`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}`
											)
										}
									>
										{paymentFileData.TotalPayments || 0} {t('componentData.paymentFileDetail.payments')} {" "}
									</u>
								</Box>
							</Box>
						</Box>
					</Box>
				</Grid>
				{/********2nd box *********/}

				{isCCUser ?
					<CCPaymentDetails
						paymentFileData={paymentFileData}
					/>
					:
					<Grid item xs={3}>
						{totalPayment != 0 ?
							<Box
								bgcolor="white"
								display="flex"
								flexDirection="column"
								justifyContent="space-between"
								height="100%"
								p={2}
								boxShadow={
									"0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.2)"
								}
							>
								<Box textAlign="center" pb={2} className={classes.TitleText}>
									{" "}
									{t('componentData.paymentFileDetail.PaymentTotalAmount')}{" "}
								</Box>
								<Box alignItems="center" justifyContent="center" display="flex"
									flexDirection="column" height="100%">
									<Box display="flex" flexDirection="column" width={1}>
										<Box
												display="flex"
												flexDirection="row"
												justifyContent="center"
												pb={2}
												alignItems="center"
											>
												<Box fontSize={16} width="50%">
													{" "}
													<img
														src={require(`~/assets/icons/USAFlag.svg`)}
														alt={t('componentData.paymentFileDetail.USAFlag')}
													/>{" "}
													{t('componentData.paymentFileDetail.USD')}{" "}
												</Box>
												<Box fontSize={15} width="30%">
													{" "}
													${paymentFileData.TotalAmountUSD || 0}
												</Box>
											</Box>

											<Box
												display="flex"
												flexDirection="row"
												justifyContent="center"
												pb={2}
												alignItems="center"
											>
												{/* <Box fontSize={16} width="50%">
										{" "}
										<img
											src={require(`~/assets/icons/CanadianFlag.svg`)}
											alt={t('componentData.paymentFileDetail.CanadianFlag')}
										/>{" "}
										{t('componentData.paymentFileDetail.CAD')}
									</Box> */}
												{/* <Box
										display="flex"
										flexDirection="row"
										justifyContent="center"
										pb={2}
										alignItems="center"
									> */}
												<Box fontSize={16} width="50%">
													{" "}
													<img
														src={require(`~/assets/icons/CanadianFlag.svg`)}
														alt={t('componentData.paymentFileDetail.CanadianFlag')}
													/>{" "}
													{t('componentData.paymentFileDetail.CAD')}
												</Box>
												<Box fontSize={16} width="30%">
													{" "}
													${paymentFileData.TotalAmountCAD || 0}
												</Box>
												{/* </Box> */}
											</Box>
									</Box>
									<Box display="flex" justifyContent="center" alignItems="center" pb={1}>
										<Box fontSize={16} color="#4C4C4C">
											{" "}
											{t('componentData.paymentFileDetail.from')}{" "}
											<u
												style={{ cursor: "pointer" }}
												onClick={() =>
													this.props.history.push(
														`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}`
													)
												}
											>
												{isNaN(totalPayment) ? 0 : totalPayment} {t('componentData.paymentFileDetail.processedPayments')}{" "}
											</u>
										</Box>
									</Box>
								</Box>
							</Box>
							: null
						}
					</Grid>
				}

				{/********3rd Box*******/}
				{bankData.length > 0 ?
					<Grid item xs={4}>
						<Box borderRadius={8}
							bgcolor="white"
							justifyContent="space-between"
							height="100%"
							textAlign="center"
						>
							<Box
								textAlign="center" py={1} className={classes.TitleHeadTxt}
							>
								{" "}
								{t('componentData.fileDetails.BankFiles')}{" "}
							</Box>
							<Box alignItems="center" display="flex"
								flexDirection="column" height="100%">
								<Box display="flex" flexDirection="column" width={1}>

									{bankData.length > 0 ? (
										<Box my={1}>
											<BankFileDetails
												bankData={bankData}
												canDownload={canDownload}
											/>
										</Box>
									) : (
										<Box
											display="flex"
											justifyContent="center"
											flexDirection="column"
											pt={1}
										>
											<img
												src={require(`~/assets/icons/bankFile_No_data.svg`)}
												alt={t('componentData.fileDetails.NoDataToshow')}
												style={{ height: "210px" }}
											/>
											<Box
												display="flex"
												flexDirection="row"
												justifyContent="center"
												mt={1}
												color="#A1A1A1"
												fontSize={16}
											>
												{" "}
												{t('componentData.fileDetails.NoDataToshow')}
											</Box>
										</Box>
									)}
								</Box>
							</Box>
						</Box>
					</Grid>
					: null}
				{error && <Notification variant="error" message={error} />}
			</Grid>
		);
	}
}

export default withTranslation()(withStyles(styles)(PaymentFilesDetails));
