import React, { useState } from "react";
import { Box, Grid, Typography, Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import PinDropIcon from "@material-ui/icons/PinDrop";
import { useHistory } from "react-router-dom";

import { styles } from "./styles";
import config from "~/config";
import moment from 'moment';

const LeftPanel = (props) => {
  let history = useHistory();
  const [seeMore, setSeeMore] = useState(false);
  const { t, classes, data, payeeRegInfoId } = props;

  const routeToPaymentList = () => {
    history.push({
      pathname: `${config.baseName}/payments/paymentDetails`,
      state: {
        payeeId: payeeRegInfoId
      }
    })
  };

  const formatAddress = (add) => {
    let address = add ? add.trim() : '';

    const lastCh = address ? address.charAt(address.length - 1) : '';
    if (lastCh === ',') {
      address = address.slice(0, -1);
    }
    return address;
  }

  const formatDate = (date) => {
    return date ? moment(date).format('DD MMM YYYY') : '';
  }

  return data && Object.keys(data).length !== 0 ? (
    <>
      <Grid item xs={12}>
        <Box pb={3}>
          <Box display="flex">
            <Typography className={classes.headerTag}>
              {t('componentData.PayeeDetails.headText')}
            </Typography>
            {data ? <Box pl={2} pt={1}>
              <Chip size="small" label={data.payeeActiveStatus ? data.status : t('componentData.PayeeDetails.deactivatedTxt')} />
            </Box> : null}
          </Box>
          {data && data.lastUpdatedDate ? (
            <Typography className={classes.captionText}>
              {t('componentData.PayeeDetails.lastUpdateOn')}{' '}{formatDate(data.lastUpdatedDate)}
            </Typography>
          ) : null}
        </Box>
      </Grid>

      <Grid container spacing={2}>
        {data && data.payeeName ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.payeeName')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>{data.payeeName}</Typography>
          </Grid>
        </> : null
        }

        {data && data.payeeId ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.payeeID")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.payeeId}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.payeeStatusId == 2 ?
          (data && data.supplierRemorseDate ? <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.remorseDate')}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>{formatDate(data.supplierRemorseDate)}</Typography>
            </Grid>
          </> : null)
          :
          (data && data.onboardingDate ? <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.onboardingDate')}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>{formatDate(data.onboardingDate)}</Typography>
            </Grid>
          </> : null)
        }

        {data && (data.status || data.reason) ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.statusReason')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>
              {`${data.status} | ${data.reason}`}
            </Typography>
          </Grid>
        </> : null
        }

        {data && data.campaignName ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.campaignName')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>{data.campaignName}</Typography>
          </Grid>
        </> : null
        }

        {data && data.campaignID ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.campaignId')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>{data.campaignID}</Typography>
          </Grid>
        </> : null
        }

        {data && data.campaignStatus ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.campaignStatus')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>{data.campaignStatus}</Typography>
          </Grid>
        </> : null
        }

        {data && data.leadId ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.leadId")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.leadId}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.taxId ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.taxID")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.taxId}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.buyerName ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.buyerName')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>{data.buyerName}</Typography>
          </Grid>
        </> : null
        }

        {data && data.buyerId ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.buyerId")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.buyerId}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.siteId ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.siteId')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>{data.siteId}</Typography>
          </Grid>
        </> : null
        }

        {data && data.source ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.source")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.source}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.committedSpend ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.committedSpend")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.committedSpend}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.transactionCount ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.tranxCount")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.transactionCount}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.currentPaymentMethod ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.currentPaymentMethod')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>{data.currentPaymentMethod}</Typography>
          </Grid>
        </> : null
        }

        {data && data.paymentMethodPreference ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.paymentMethodPref')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>{data.paymentMethodPreference}</Typography>
          </Grid>
        </> : null
        }

        {data && data.terms ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.terms")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.terms}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.notes ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.notes")}
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.workBreak}>
              <Typography className={classes.valueLabel}>
                {!seeMore ? data.notes.slice(0, 100) : data.notes}
                {data.notes.length > 100 &&
                  <Box
                    className={classes.seeMorelink}
                    component="span"
                    onClick={() => setSeeMore(!seeMore)}
                  >
                    {!seeMore
                      ? t("componentData.PayeeDetails.readMore")
                      : t("componentData.PayeeDetails.showLess")}
                  </Box>}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.paymentRemmittenceEmail ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.payRemittanceEmail")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.paymentRemmittenceEmail}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.paymentRemittancePhoneNumber ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.paymentRemPhoneNo')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>{data.paymentRemittancePhoneNumber}</Typography>
          </Grid>
        </> : null
        }

        {data && data.payeeLastactivateDate ? <>
          <Grid item xs={4}>
            <Typography className={classes.keyLabel}>{t('componentData.PayeeDetails.lastActivityDate')}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography className={classes.valueLabel}>{formatDate(data.payeeLastactivateDate)}</Typography>
          </Grid>
        </> : null
        }
      </Grid>


      <Grid container spacing={2} className={classes.payeeContact}>
        {data && data.email ? (
          <>
            <Grid item xs={4}>
              <Box display={"flex"}>
                <EmailIcon
                  fontSize="small"
                  color="primary"
                  style={{ marginRight: 5 }}
                />
                <Typography className={classes.keyLabel}>
                  {t("componentData.PayeeDetails.email")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.email}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.phoneNumber ? (
          <>
            <Grid item xs={4}>
              <Box display={"flex"}>
                <PhoneIcon
                  fontSize="small"
                  color="primary"
                  style={{ marginRight: 5 }}
                />
                <Typography className={classes.keyLabel}>
                  {t("componentData.PayeeDetails.phoneNo")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.phoneNumber}
              </Typography>
            </Grid>
          </>
        ) : null}

        {data && data.address ? (
          <>
            <Grid item xs={4}>
              <Box display={"flex"}>
                <PinDropIcon
                  fontSize="small"
                  color="primary"
                  style={{ marginRight: 5 }}
                />
                <Typography className={classes.keyLabel}>
                  {t("componentData.PayeeDetails.address")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {formatAddress(data.address)}
              </Typography>
            </Grid>
          </>
        ) : null}
      </Grid>

      <Grid container spacing={2}>
        {data && data.numberOfPayments ? (
          <Grid item xs={12}>
            <Box component="span" className={classes.linkText} onClick={routeToPaymentList}>
              {data.numberOfPayments}{" "}
              {t("componentData.PayeeDetails.paymentMade")}
            </Box>
          </Grid>
        ) : null}

        {data && data.payeeDeactivateReason ? (
          <>
            <Grid item xs={4}>
              <Typography className={classes.keyLabel}>
                {t("componentData.PayeeDetails.payeeDeactivate")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.valueLabel}>
                {data.payeeDeactivateReason}
              </Typography>
            </Grid>
          </>
        ) : null}
      </Grid>
    </>
  ) : (
    <Box display="block" textAlign="center" width={1} my={6}>
      <img src={require("~/assets/icons/bankFile_No_data.svg")} alt="" />
      <Box py={3} color="#A1A1A1" fontSize={14} display="block">
        {t("componentData.customTable.NoDatatoShow")}
      </Box>
    </Box>
  );
};

export default withTranslation()(withStyles(styles)(LeftPanel));
