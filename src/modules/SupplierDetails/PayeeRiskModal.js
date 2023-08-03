import React from 'react';
import { Grid, Box, Dialog, DialogContent, DialogTitle, Typography, Button } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import { TextField } from "~/components/Forms";
import { styles } from "./styles";

const PayeeRiskModal = (props) => {
    const { t, classes, open, handleClose, handleOnChange, howlongNotConsider,
        reasonNotConsider, otherReason, handleConfirm } = props;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-describedby="confirm-dialog-description"
            maxWidth={"sm"}
            fullWidth
            className={classes.riskModal}
        >
            <Box>
                <DialogTitle>
                    <Box textAlign="right">
                        <CloseIcon onClick={handleClose} className="closeBtn" fontSize="small" />
                    </Box>
                    <Box>
                        <Typography className={classes.modalHeading}>
                            {t("componentData.PayeeDetails.dontConsiderHead")}
                        </Typography>
                        <Typography className={classes.modalSubHeading}>
                            {t("componentData.PayeeDetails.dontConsiderSubHead")}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="howlongNotConsider"
                                label={t("componentData.PayeeDetails.howLongNotConsider")}
                                variant="outlined"
                                value={howlongNotConsider}
                                onChange={handleOnChange}
                                SelectProps={{
                                    native: true
                                }}
                            >
                                <option key="1" value={1}>{t("componentData.PayeeDetails.notConsiderOption1")}</option>
                                <option key="2" value={2}>{t("componentData.PayeeDetails.notConsiderOption2")}</option>
                                <option key="3" value={3}>{t("componentData.PayeeDetails.notConsiderOption3")}</option>
                                <option key="4" value={4}>{t("componentData.PayeeDetails.notConsiderOption4")}</option>
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="reasonNotConsider"
                                label={t("componentData.PayeeDetails.reasonNotConsider")}
                                variant="outlined"
                                value={reasonNotConsider}
                                onChange={handleOnChange}
                                SelectProps={{
                                    native: true
                                }}
                            >
                                <option key="1" value={1}>{t("componentData.PayeeDetails.reasonNotConsiderOption1")}</option>
                                <option key="2" value={2}>{t("componentData.PayeeDetails.reasonNotConsiderOption2")}</option>
                                <option key="3" value={3}>{t("componentData.PayeeDetails.reasonNotConsiderOption3")}</option>
                            </TextField>
                        </Grid>



                        <Grid item xs={12}>
                            {reasonNotConsider === 3 &&
                                <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="otherReason"
                                    label={t("componentData.PayeeDetails.otherReason")}
                                    variant="outlined"
                                    value={otherReason || ''}
                                    onChange={handleOnChange}
                                    inputProps={{
                                        maxLength: 100,
                                      }}
                                />
                            }
                        </Grid>

                    </Grid>

                    <Grid item xs={12} className={classes.payeeContact}>
                        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleClose}
                                >
                                    {t("componentData.PayeeDetails.cancelBtn")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleConfirm}
                                >
                                    {t("componentData.PayeeDetails.confirmButton")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Box>
        </Dialog>
    )
}
export default withTranslation()(withStyles(styles)(PayeeRiskModal));