import React, { Fragment } from 'react';
import {
    InputAdornment, Grid, Paper, Box, Button, TableContainer, CircularProgress,
    Table, TableRow, TableBody, TablePagination, TableCell, IconButton
} from '@material-ui/core';
import { StyledTableHead, StyledTableRow, StyledTableCell, StyledTableFooter } from '~/components/StyledTable';
import TextField from '~/components/Forms/TextField';
import { withStyles } from '@material-ui/styles';
import styles from '../styles';
import SearchIcon from '@material-ui/icons/Search';
import currency from 'currency.js';
import moment from 'moment';
import { withTranslation } from 'react-i18next';

const ReportView = (props) => {
    const { classes, dataList, totalCount, dataColumns, selectedColumns,
        isLoading, page, rowsPerPage, handlePageChange, handleRowsPerPageChange, t } = props;

    const dataConversion = (format, data) => {
        let newValue = data;
        switch (format) {
            case 'date':
                newValue = data ? moment(data).format("MM/DD/YYYY") : "";
                break;
            case 'currency':
                newValue = currency(data, { formatWithSymbol: true }).format();
                break;
            default:
                newValue = data;
                break;
        }

        return newValue;
    }

    return (
        <Box display="flex" className={classes.root} width="100%">
            <TableContainer component={Paper}>
                {/*<Grid container item xs={12} md={12} justify="flex-end" className={classes.gtidItem} >
                            <Box display="flex" justifyContent="flex-end" >
                                <Box p={1}>
                                    <TextField
                                        className={classes.searchBox}
                                        placeholder="Search Client Name"
                                        inputProps={{ 'aria-label': 'Search Users by name / email' }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">
                                                <IconButton
                                                  aria-label="search"
                                                  onClick={() => this.getUserList()}
                                                  onMouseDown={null}
                                                  edge="end"
                                                >
                                                      <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>,
                                        }}
                                        onChange={event => this.setState({ name: event.target.value })}
                                        onKeyDown={(event) => this.handleSearch(event)}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            </Box>
                </Grid>*/}
                <Table stickyHeader aria-label="sticky table">
                    <StyledTableHead>
                        <TableRow>
                            {dataColumns && dataColumns.filter((item, index) => selectedColumns && selectedColumns.indexOf(item.id) != -1).map((column, index) => {
                                return (
                                    <StyledTableCell>
                                        {column.name}
                                    </StyledTableCell>
                                );
                            })
                            }
                        </TableRow>
                    </StyledTableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={(dataColumns && dataColumns.length) || "100%"}>
                                    <Box display="flex" p={5} justifyContent="center" alignItems="center"><CircularProgress color="primary" /></Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            dataList && dataList.map((data, index) => {
                                return <Fragment key={index}>
                                    <StyledTableRow>
                                        {dataColumns && dataColumns.filter((item, index) => selectedColumns && selectedColumns.indexOf(item.id) != -1).map((column, index) => {
                                            return (
                                                <StyledTableCell>
                                                    {dataConversion(column.format, data[index] || "")}
                                                </StyledTableCell>
                                            );
                                        })
                                        }
                                    </StyledTableRow>
                                </Fragment>
                            })
                        )}

                        {dataList.length == 0 && <TableRow>
                            <TableCell colSpan={dataColumns && dataColumns.length || "100%"}>
                                <Box display="flex" p={1} justifyContent="center" alignItems="center">{t('componentData.reportsComp.NoResultFound')}</Box>
                            </TableCell>
                        </TableRow>
                        }
                    </TableBody>
                    <StyledTableFooter>
                        <TableRow>
                            <TablePagination
                                labelRowsPerPage={t('componentData.reportsComp.rowsPerPage')}
                                rowsPerPageOptions={[10, 25, 50]}
                                colSpan={dataColumns && dataColumns.length || "100%"}
                                count={totalCount || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': t('componentData.reportsComp.rowsPerPage') },
                                    native: true,
                                }}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={handleRowsPerPageChange}
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('componentData.fileName.Of')} ${count !== -1 ?
                                    count : `${t('componentData.fileName.MoreThan')} ${to}`}`}
                            />
                        </TableRow>
                    </StyledTableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
}
export default withTranslation()(withStyles(styles)(ReportView));
