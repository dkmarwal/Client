import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Table, TableContainer, TableBody, TableHead, TableRow, TableCell, TablePagination, Grid, Box, TextField, IconButton, CircularProgress } from '@material-ui/core';
import { withTranslation, useTranslation } from 'react-i18next';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { debounce } from 'lodash';
import NumberFormat from 'react-number-format';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import { styles } from '../../styles';
import { StyledTableFooter } from '~/components/StyledTable';
import { getInvoiceList } from '~/redux/helpers/clientPaymentTransactions';
import { SnackbarComponent } from '~/components/Notification/snackbar';

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
        flexFlow: 1
    }
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#CCE4FF',
        color: '#000000 !important',
        fontSize: 14, 
        padding: '7px',
        "& input":{
            width: 90
        }     
    },
    body: {
        fontSize: 14,
        color: '#4C4C4C !important',
        padding: '8px 20px',
        borderBottom: 'none'
    }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover
        }
    }
}))(TableRow);

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;
    const { t } = useTranslation();

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label={t('componentData.customTable.firstpage')}
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label={t('componentData.customTable.previouspage')}
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label={t('componentData.customTable.nextpage')}
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label={t('componentData.customTable.lastpage')}
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const InvoiceDetails = (props) => {
    const { classes, t, clientId, paymentId } = props;
    const [invoiceList, setInvoiceList] = useState({});
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({
        message: '', type: '', open: false
    });
    const [filterParams, setFilterParams] = useState({
        clientID: clientId,
        paymentID: paymentId,
        invoiceNumber: '',
        invoiceDate: '',
        purchaseOrderNumber: '',
        currency: '',
        totalAmount: 0
    });

    useEffect(() => {
        fetchInvoiceList();
    }, [paymentId, filterParams, page, rowsPerPage])

    const handleChangeRowsPerPage = (event) => {
        setInvoiceList({});
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    const handleChangePage = (e, page) => {
        setInvoiceList({});
        setPage(page + 1);
    };

    const isValidDate = (dateString) => {
        // First check for the pattern
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) { return false; }

        // Parse the date parts to integers
        var parts = dateString.split('/');
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month === 0 || month > 12) { return false; }

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    };

    const fetchInvoiceList = async () => {
        let param = {
            ...filterParams,
            page: page,
            pageSize: rowsPerPage
        }
        setIsLoading(true);
        const res = await getInvoiceList(param);

        if (res.result && res.result.length > 0) {
            setIsLoading(false);
            setInvoiceList(res.result[0]);
        } else {
            setIsLoading(false);
            setNotification({
                message: t('componentData.reduxData.SomethingWentWrong'),
                type: 'error',
                open: true
            })
        }
    }

    const changeFilter = useCallback(debounce((paramsObj) => {
        setPage(1);
        setFilterParams(paramsObj);
    }, 1000), []
    );

    const onChangeInput = (e) => {
        const { id, value } = e.target;
        let newObj = { ...filterParams };
        switch (id) {
            case "totalAmount":
                const val = value || 0;
                if (!/^[0-9\.]+$/.test(val) || val.length > 10) { return false; }
                newObj[id] = val;
                break;
            default:
                newObj[id] = value || null;
                break;
        }
        if (JSON.stringify(newObj) !== JSON.stringify({ ...filterParams })) {
            changeFilter(newObj);
            setFilterParams(newObj);
        }
    };

    const handleClose = () => {
        setNotification({ message: '', type: '', open: false });
    };

    const currencyFormateFn=(val)=> val.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    return (
        <>
            <TableContainer className={classes.table}>
                <Table 
                    aria-label="customized table"                    
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>
                                <Box>{t('componentData.InvoiceDetails.invoiceNumber')}</Box>
                                <Box>
                                    <TextField
                                        className={classes.searchtextField}
                                        size="small"
                                        id="invoiceNumber"
                                        variant="outlined"
                                        value={filterParams.invoiceNumber || ''}
                                        onChange={onChangeInput}
                                    />
                                </Box>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Box>{t('componentData.InvoiceDetails.invoiceDate')}</Box>
                                <Box>
                                    <NumberFormat
                                        className={classes.invoiceDateInput}
                                        format="##/##/####"
                                        id="invoiceDate"
                                        //disabled={isLoading}
                                        placeholder={t('componentData.customTable.dateFormate')}
                                        value={filterParams.invoiceDate || ''}
                                        onChange={(e) => {
                                            const date = e.target.value;
                                            if (isValidDate(date) || date === '') {
                                                onChangeInput(e);
                                            }
                                            else if (
                                                // this condition has been applied for replacing invalid date with previous 
                                                // valid value
                                                !(
                                                    date.match(/M/g) ||
                                                    date.match(/D/g) ||
                                                    date.match(/Y/g) ||
                                                    []
                                                ).length &&
                                                !isValidDate(date)
                                            ) {
                                                //setTempValueDate(!tempValueDate)
                                                // handleInValidDate();
                                            }
                                        }}
                                        mask={['M', 'M', 'D', 'D', 'Y', 'Y', 'Y', 'Y']}
                                        style={{
                                            width: "150px"
                                        }}
                                    />
                                </Box>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Box>{t('componentData.InvoiceDetails.purOrderNo')}</Box>
                                <Box>
                                    <TextField
                                        className={classes.searchtextField}
                                        size="small"
                                        variant="outlined"
                                        id="purchaseOrderNumber"
                                        value={filterParams.purchaseOrderNumber || ''}
                                        onChange={onChangeInput}
                                    />
                                </Box>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Box>{t('componentData.InvoiceDetails.currency')}</Box>
                                <Box>
                                    <TextField
                                        className={classes.searchtextField}
                                        size="small"
                                        variant="outlined"
                                        id="currency"
                                        value={filterParams.currency || ''}
                                        onChange={onChangeInput}
                                    />
                                </Box>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Box>{t('componentData.InvoiceDetails.totalAmount')}</Box>
                                <Box>
                                    <TextField
                                        className={classes.searchtextField}
                                        size="small"
                                        variant="outlined"
                                        id="totalAmount"
                                        value={filterParams.totalAmount || ''}
                                        onChange={onChangeInput}
                                    />
                                </Box>
                            </StyledTableCell>
                            <StyledTableCell width={300}></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {!isLoading ?
                        <TableBody>
                            {invoiceList.invoiceDetails && invoiceList.invoiceDetails.length ?
                                invoiceList.invoiceDetails.map((row, index) => {
                                    return (
                                        <StyledTableRow key={`inv-${index}`}>
                                            <StyledTableCell>{row.invoiceNumber}</StyledTableCell>
                                            <StyledTableCell>{row.invoiceDate}</StyledTableCell>
                                            <StyledTableCell>{row.purchaseOrderNumber}</StyledTableCell>
                                            <StyledTableCell>{row.currency}</StyledTableCell>
                                            <StyledTableCell>
                                                {currencyFormateFn(row?.totalAmount?.toFixed(2))}
                                            </StyledTableCell>
                                            <StyledTableCell width={220}></StyledTableCell>
                                        </StyledTableRow>
                                    )
                                })
                                :
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Box display="block" textAlign="center" width={1} my={6}>
                                            <img
                                                src={require('~/assets/icons/bankFile_No_data.svg')}
                                                alt=""
                                            />
                                            <Box py={3} color="#A1A1A1" fontSize={14} display="block">
                                                {t('componentData.customTable.NoDatatoShow')}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                        :
                        <Box display="flex" justifyContent="center">
                            <CircularProgress color="primary" />
                        </Box>
                    }
                    <StyledTableFooter>
                        <TableRow className={classes.paginationRow}>
                            <TablePagination
                                labelRowsPerPage={t('componentData.customTable.rowsPerPage')}
                                rowsPerPageOptions={[10, 25, 50]} // { label: 'All', value: -1 }
                                colSpan={7}
                                count={invoiceList.totalInvoiceDetails && invoiceList.totalInvoiceDetails[0].totalRecords || 0}
                                rowsPerPage={rowsPerPage}
                                page={page - 1}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': t('componentData.customTable.rowsPerPage')
                                    },
                                    native: true
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('componentData.fileName.Of')} ${count !== -1 ?
                                    count : `${t('componentData.fileName.MoreThan')} ${to}`}`}
                            />
                        </TableRow>
                    </StyledTableFooter>
                </Table>

                <Box style={{float: 'right'}}>                    
                    <Box my={1.2} textAlign="end" style={{display:'inline-block'}}>
                        {t('componentData.InvoiceDetails.totalSumVal')}
                    </Box>                
                
                    <Box my={1} mx={2.5} textAlign="end" style={{display:'inline-block'}}>
                        {currencyFormateFn(invoiceList.totalInvoiceDetails && invoiceList.totalInvoiceDetails[0].totalRemmittenceAmount || 0)}                        
                    </Box>                    
                </Box>

            </TableContainer>
            <SnackbarComponent
                openSnackbar={notification.open}
                handleClose={handleClose}
                snackbarMessage={notification.message}
                icon={false}
                messageVariant={notification.type}
            />
        </>
    )
}

export default withTranslation()(withStyles(styles)(InvoiceDetails));
