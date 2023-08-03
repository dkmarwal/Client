import React from "react";
import {
  Grid,  
  Box,  
  Paper, 
  TableRow,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer  
} from "@material-ui/core";
import { connect } from "react-redux";
import styles from "./styles";
import { withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/styles";

class Files extends React.Component {
  state = {
    fileList: [
      {
        fileId: "123456",
        fileName: "Farmer Joe",
        status: "Processed with exceptions",
      },
    ],
    totalCount: 10,
    page: 0,
    rowsPerPage: 10,
  };

  componentDidMount() {}
  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: +event.target.value,
      page: 0,
    });
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };
  handleSearchClick = () => {
    this.setState(
      {
        page: 0,
        rowsPerPage: 10,
      },
      () => {
        // this.getUserList();
      }
    );
  };
  handleSearch = (event) => {
    if (event.keyCode === 13) {
      this.setState(
        {
          page: 0,
          rowsPerPage: 10,
        },
        () => {
          // this.getUserList();
        }
      );
    }
  };
  render() {
    const { classes, t } = this.props;
    const {
      fileList,
      totalCount,
      page,
      rowsPerPage,
    } = this.state;
    const columns = [
      { id: "fileName", label: "File Name" },
      { id: "dateReceived", label: "Date Received" },
      { id: "status", label: "Status" },
    ];
    
    return (
      <Grid item xs={12} className={classes.campaignsStatus}>
        <Paper className={classes.table} elevation={0}>
          <Grid container item xs={12} md={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              flexGrow={1}
              alignItems="start"
            >
              <Box display="flex" justifyContent="flex-start">
                <Box p={2} fontSize={12} color={"#828282"}>
                  Total 12 files are received for this campaign 
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid container item xs={12} md={12}>
            <Grid item xs={12}>
              <Box
                display="flex"
                width="100%"
                justifyContent="flex-start"
              ></Box>
            </Grid>
          </Grid>
          <Grid container item xs={12} md={12}>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align="left"
                          className={classes.supTable}
                        >
                          <Box
                            fontSize={16}
                            fontWeight="600"
                            color="rgba(18,18,18,0.87)"
                          >
                            {t(
                              `componentData.CCEnrollmentCampaign.${column.label}`
                            )}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  {fileList && fileList.length === 0 && (
                    <Grid
                      container
                      style={{
                        padding: "10px 0",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        style={{
                          position: "absolute",
                          left: "48%",
                        }}
                      >
                        {t("componentData.mySupplier.NoResultsFound")}
                      </Grid>
                    </Grid>
                  )}
                  <TableBody className={classes.bodyTextColor}>
                    {fileList &&
                      fileList.map((file) => (
                        <TableRow>
                          <TableCell
                            align="left"
                            className={classes.textBold}
                            title={file.fileName}
                          >
                            {file?.fileName || "-"}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.textBold}
                            key={file.fileId}
                          >
                            {file?.fileId || "-"}
                          </TableCell>
                          <TableCell align="left">
                            {" "}
                            {file?.status || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                labelRowsPerPage={t("componentData.supplierDetail.rowsPerPage")}
                rowsPerPageOptions={[10, 25, 50]}
                colSpan={3}
                component="div"
                count={totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": t("componentData.supplierDetail.rowsPerPage"),
                  },
                  native: true,
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} ${t("componentData.fileName.Of")} ${
                    count !== -1
                      ? count
                      : `${t("componentData.fileName.MoreThan")} ${to}`
                  }`
                }
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(withStyles(styles)(Files))
);
