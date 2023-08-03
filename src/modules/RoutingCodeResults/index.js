import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField, TableCell, TableRow, TableHead, TableContainer, Table, TableBody, TableFooter, TablePagination, CircularProgress, Grid, Box, Button, Typography } from "@material-ui/core";
import { fetchRoutingCodes } from '~/redux/actions/payments';

import { withTranslation } from 'react-i18next';
import { compose } from 'redux';

class RoutingCodeResults extends Component {

    state = {
        rows: [],
        loading: false,
        validation: {},
        routingCode: "",
        routingCodeList: [],
        updateProgress: false,
        page: 0,
        rowsPerPage: 10,
        sortColumn: "",
        sortOrder: "",
    }

    componentDidMount() {
        /*const { accountDetails, user } = this.props;
        const payeeId = user.info.portalProfileId
        let filters = { payeeId: payeeId, routingCode: accountDetails && accountDetails.routingNumber, accountType: accountDetails && accountDetails.type, isCrossBorder: accountDetails && accountDetails.isCrossBorder };
        this.setState({ loading: true }, () => {
            getBankList({ filters }).then((response) => {
                this.setState({ rows: response && response.data.rows, loading: false });
            })
        })*/
        //this.getRoutingCodes();
    }

    handleChange = (field, event) => {
        this.setState({ routingCode: event.target.value });
    }

    handlePageChange = (event, page) => {
        const { sortColumn, sortOrder } = this.state;
        const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
        this.setState({
            page,
            sortColumn: sortColumn,
            sortOrder: newSortOrder
        }, () => this.getRoutingCodes())
    }

    handleRowsPerPageChange = (event) => {
        const { sortOrder } = this.state;
        const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
        this.setState({
            page: 0,
            rowsPerPage: parseInt(event.target.value, 10),
            sortOrder: newSortOrder
        }, () => this.getRoutingCodes())
    }

    getRoutingCodes = () => {
        const { routingCode, page, rowsPerPage, sortColumn, sortOrder } = this.state;
        const { accountDetails } = this.props;
        const payeeId = accountDetails.payeeId
        let filters = { payeeId: payeeId, routingCode: accountDetails && accountDetails.routingNumber, accountType: accountDetails && accountDetails.type, isCrossBorder: accountDetails && accountDetails.isCrossBorder };

        this.setState({
            updateProgress: true
        }, () => {
            if (routingCode !== "") {
                this.props.dispatch(fetchRoutingCodes({ routingCode: routingCode, page, rowsPerPage, sortColumn, sortOrder })).then((response) => {
                    if (!response) {
                        this.setState({
                            alertType: "error",
                            alertMessageCallbackType: null,
                            alertMessage: this.props.payment.error,
                            updateProgress: false
                        });
                        return false;
                    }

                    this.setState({
                        isLoading: false,
                        updateProgress: false,
                        routingCodeList: this.props.payment.routingCodes,
                        totalCount: this.props.payment.totalCount,
                    })
                })
            } else {
                this.setState({ updateProgress: false });
            }
        })
    }

    handleSearch = () => {
        const { routingCode, rows } = this.state;

        this.setState({
            updateProgress: true,
        }, () => {
            const selectedRoutingCodes = rows && rows.filter(item => item.routingCode.startsWith(routingCode));
            this.setState({ routingCodeList: selectedRoutingCodes, updateProgress: false });
        });

    }

    onSelectBank(row) {
        this.props.onSelectBank(row);
    }

    render() {
        const { t } = this.props
        const { routingCodeList, loading, validation, routingCode, updateProgress, totalCount, rowsPerPage, page } = this.state;
        return (
            <Box>
                <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <Box p={1} flexGrow={1}>
                        <TextField
                            label={t('componentData.routingCodeResults.label.routingCode')}
                            error={validation.routingCode}
                            helperText={validation.routingCode}
                            fullWidth={true}
                            autoComplete="off"
                            variant="outlined"
                            value={routingCode || ""}
                            name="routingCode"
                            maxLength={2}
                            onChange={(event) => this.handleChange("routingCode", event)}
                        />
                    </Box>
                    <Box p={1} pt={2}>
                        {updateProgress ? (
                            <CircularProgress color="primary" />
                        ) : (
                            <Button variant="contained" color="primary" onClick={() => this.getRoutingCodes()} >
                                {t('componentData.routingCodeResults.label.search')}
                            </Button>
                        )}
                    </Box>

                </Box>

                <Box pt={1} justifyContent="center" display="flex"><Typography variant="h3">{t('componentData.routingCodeResults.label.bankSearch')} </Typography> </Box>
                {loading ? <Grid><CircularProgress style={{ margin: "10px auto", display: "table" }} color="primary" /> </Grid> :
                    <TableContainer>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell> </TableCell>
                                    <TableCell>{t('componentData.routingCodeResults.tabelHeaders.routingCode')}</TableCell>
                                    <TableCell>{t('componentData.routingCodeResults.tabelHeaders.bankName')}</TableCell>
                                    <TableCell align="right">{t('componentData.routingCodeResults.tabelHeaders.address')}</TableCell>
                                    <TableCell align="right">{t('componentData.routingCodeResults.tabelHeaders.city')}</TableCell>
                                    <TableCell align="right">{t('componentData.routingCodeResults.tabelHeaders.state')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {routingCodeList ? routingCodeList.map((row) => (
                                    <TableRow key={row.routingCode}>
                                        <TableCell component="th" scope="row"><input onChange={() => this.onSelectBank(row)} name="bank" type="radio" /> </TableCell>
                                        <TableCell align="right">{row.routingCode}</TableCell>
                                        <TableCell align="right">{row.bankName}</TableCell>
                                        <TableCell align="right">{row.address}</TableCell>
                                        <TableCell align="right">{row.city}</TableCell>
                                        <TableCell align="right">{row.state}</TableCell>
                                    </TableRow>
                                )) :
                                    <TableRow>
                                        <TableCell align="center" colSpan="6">{t('componentData.routingCodeResults.label.noRecords')}</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 50, { label: 'All', value: totalCount || 10 }]}
                                        colSpan={6}
                                        count={totalCount || 0}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: { 'aria-label': 'rows per page' },
                                            native: true,
                                        }}
                                        labelRowsPerPage={t('componentData.routingCodeResults.label.rowsPerPage')}
                                        onChangePage={this.handlePageChange}
                                        onChangeRowsPerPage={this.handleRowsPerPageChange}
                                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('componentData.fileName.Of')} ${count !== -1 ? count : `${t('componentData.fileName.MoreThan')} ${to}`}`}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                }

            </Box>
        );
    }
}

export default connect((state) => ({ ...state.user, ...state.payment }))(compose(withTranslation())(RoutingCodeResults));
