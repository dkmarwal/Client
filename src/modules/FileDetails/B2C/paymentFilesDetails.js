import React, { Component } from "react";
import Notification from "~/components/Notification";
import { Grid, Box,} from "@material-ui/core";
import { Button } from "~/components/Forms";
import { withStyles } from "@material-ui/core/styles";
import { downloadPaymentFile } from "~/redux/helpers/files";
import config from "~/config";
import { styles } from "./styles";
import { withTranslation } from 'react-i18next';
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from '@material-ui/core/Tooltip';

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
				const fileName = `${response.headers["file-name"]}`;
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
		const { classes, paymentFileData, t } = this.props;
		const { error } = this.state;
		
		const CDMPaymentVal = paymentFileData?.TotalCDMPaymentCount ?? 0;
		const nonCDMPaymentVal = paymentFileData?.TotalNONCDMPaymentCount ?? 0;	
		

		return (
			<>
				<Grid container spacing={2} alignItems="stretch" style={{margin: "0 23px"}}>
					<Grid item xs={6}>
						<Box
							className={classes.outerBox}
							bgcolor="white"
						>
							<Box
								fontSize={16}
								textAlign="left"
								color="primary"
								alignItems="left"
								pb={2}
								className={classes.BoxTitle}
							>
								{" "}
								{t('componentData.paymentFileDetail.PaymentFileDetails')}{" "}
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
										{t('componentData.paymentFileDetail.ReceivedOn')}{" "}
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
					<Grid item xs={6}>
						<Box
							bgcolor="white"
							display="flex"
							flexDirection="column"
							justifyContent="space-between"
							height="100%"
							className={classes.outerBox}
						>
							<Box textAlign="center" pb={2} className={classes.BoxTitle}>
								{" "}
								{t('componentData.paymentFileDetail.TotalPaymentAmount')}{" "}
							</Box>
							<Box p={2} alignItems="center" justifyContent="center" display="flex"
								flexDirection="column" height="100%">
								<Box display="flex" flexDirection="column" width={1}>
									<Box
										display="flex"
										flexDirection="row"
										justifyContent="center"
										pb={2}
										alignItems="center"
									>
										<Box fontSize={16} width="30%">
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
										<Box fontSize={16} width="30%">
										</Box>
										<Box fontSize={16} width="30%">
											{" "}
											{t('componentData.paymentFileDetail.totalAmount')}
										</Box>
									</Box>
								</Box>
								<Box display="flex" justifyContent="center" alignItems="center">
									<Box fontSize={16} color="#4C4C4C" className={classes.paymentTypeList}>
										<ul>
											<li>
												<span onClick={() =>
													this.props.history.push(
														`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}`
													)
												}>{t('componentData.paymentFileDetail.TotalNoPayments')}</span>
												<label onClick={() =>
													this.props.history.push(
														`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}`
													)
												}>{paymentFileData?.TotalPaymentCount ?? "0"}</label>
											</li>

											{CDMPaymentVal > 0 && (
												<li>
													<span onClick={() =>
														this.props.history.push(
															`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`
														)
													}>
														<Tooltip title={t('componentData.paymentFileDetail.CDMTooltip')} arrow placement="top">
															<InfoIcon />
														</Tooltip>													
														{t('componentData.paymentFileDetail.CDMPayer')}
													</span>
													<label onClick={() =>
														this.props.history.push(
															`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`
														)
													}>{paymentFileData?.TotalCDMPaymentCount ?? "0"}</label>
												</li>
											)}			
																					
											{nonCDMPaymentVal > 0 && (
												<li>
													<span onClick={() =>
														this.props.history.push(
															`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`
														)
													}>
														<Tooltip title={t('componentData.paymentFileDetail.NonCDMTooltip')} arrow placement="top">
															<InfoIcon />
														</Tooltip>
														{t('componentData.paymentFileDetail.NonCDMPayer')}
													</span>
													<label onClick={() =>
														this.props.history.push(
															`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`
														)
													}>{paymentFileData?.TotalNONCDMPaymentCount ?? "0"}</label>
												</li>
											)}	

											<li>
												<span onClick={() =>
													this.props.history.push(
														`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&AddFilter=3`
													)
												}>
													<Tooltip title={t('componentData.paymentFileDetail.unsucessTooltip')} arrow placement="top">
														<InfoIcon />
													</Tooltip>
													{t('componentData.paymentFileDetail.unsucessfulPayments')}
												</span>
												<label onClick={() =>
													this.props.history.push(
														`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&AddFilter=3`
													)
												}>{paymentFileData?.UnsuccessfulPaymentCount ?? "0"}</label>
											</li>


										</ul>
									</Box>
								</Box>
							</Box>
						</Box>

					</Grid>
					{error && <Notification variant="error" message={error} />}
				</Grid>
			</>
		);
	}
}

export default withTranslation()(withStyles(styles)(PaymentFilesDetails));
