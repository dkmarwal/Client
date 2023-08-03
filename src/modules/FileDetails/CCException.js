import React from 'react';
import { useHistory } from "react-router-dom";
import { Box } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withStyles } from "@material-ui/core/styles";
import config from "~/config";
import { styles } from "./styles";

const CCException = (props) => {
    let history = useHistory();
    const { paymentException, t, item, classes } = props;

    // group by on purchaseId and recordId key if payment id is 0.
    const groupByCC = (objectArray) => {
        const groups = ['PurchaseId', 'RecordId'], grouped = {};
        objectArray && Object(objectArray).keys && objectArray.forEach(function (a) {
            groups.reduce(function (o, g, i) {
                o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
                return o[a[g]];                                           // at last, then an array
            }, grouped).push(a);
        })
        return grouped;
    };

    const ccPaymentItems = item === "0" ? groupByCC(paymentException[item]) : [];

    return (
        <Box justifyContent="center" alignItems="center">
            <Box fontSize={16} color="#4C4C4C">
                {ccPaymentItems && Object.keys(ccPaymentItems).length ?
                    Object.keys(ccPaymentItems).map((ele, index) => {
                        return (
                            ccPaymentItems[ele] && Object.keys(ccPaymentItems[ele]).length && Object.keys(ccPaymentItems[ele]).map((childele, ind) => {
                                return (
                                    <Box key={`exception-${ind}`} className={classes.ccExceptionBox}
                                        mb={((Object.keys(ccPaymentItems[ele]).length) - 1) == ind && index !== 0 ? 0 : 2}
                                    >
                                        <span>{ele === 'null' || ele === '' ? '' : `Purchase Id = ${ele} and `}</span>
                                        <span>
                                            {(childele === 'null' || childele === '') ? '' : `Record Id = ${childele}`}
                                        </span>
                                        {(childele === 'null' || childele === '') && (ele === 'null' || ele === '') ?
                                            'An error was found in an unidentified payment. Please verify your input file'
                                            :
                                            t('componentData.fileDetails.hasBelowExceptions')
                                        }
                                        <Box>
                                            {ccPaymentItems[ele][childele] && ccPaymentItems[ele][childele].length && ccPaymentItems[ele][childele].map(
                                                (value, index) => (
                                                    <div>
                                                        {index + 1}
                                                        {". "}
                                                        {value.Exception}
                                                    </div>
                                                )
                                            )}
                                        </Box>
                                    </Box>
                                )
                            })
                        )
                    })
                    :
                    <Box className={classes.ccExceptionBox}>
                        {t('componentData.fileDetails.PaymentID')} = {" "}
                        < span
                            onClick={() =>
                                history.push(
                                    `${config.baseName}/payments/paymentDetails?PaymentID=${item}`
                                )
                            }
                        >
                            <u className={classes.pointer}>{item}</u>
                        </span>{" "}
                        {t('componentData.fileDetails.hasBelowExceptions')} {" "}
                        {
                            paymentException[item].map(
                                (value, index) => (
                                    <div>
                                        {index + 1}
                                        {". "}
                                        {value.Exception}
                                    </div>
                                )
                            )
                        }
                    </Box>
                }
            </Box>
        </Box>
    )

}
export default withTranslation()(withStyles(styles)(CCException));