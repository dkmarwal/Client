import React from "react";
import {
  Grid,
  Box,
  makeStyles,
  Button,
  IconButton,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import CreateIcon from "@material-ui/icons/Create";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";
import { withTranslation } from "react-i18next";
import { accessRights } from "~/config/accessRights";

const useStyles = makeStyles(() => ({
  root: {
    margin: "0px",
  },
  container: {
    minHeight: 440,
    margin: "20px 50px 5px",
    width: "100%",
  },
  heading: {
    padding: "10px",
  },
  mediumBtn: {
    width: "130px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: "#008CE6",
    position: "fixed",
    zIndex: 4,
    right: "42px",
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#008CE6",
      borderRadius: "28px",
    },
  },
  row: {
    backgroundColor: "#ffffff",
    marginBottom: "15px",
    display: "block",
    height: "75",
    boxShadow:
      "0 6px 10px 0 rgba(0,0,0,0.07), 0 1px 18px 0 rgba(0,0,0,0.06), 0 3px 5px -1px rgba(0,0,0,0.1)",
  },
  smallIcon: {
    width: "50px",
  },
  name: {
    width: "100%",
    padding: "22px 45px",
    color: "#0B1941",
    fontSize: "16px",
    letterSpacing: "0.11px",
    lineHeight: "24px",
  },
}));

function RolesTable(props) {
  const classes = useStyles();
  const { t } = props;
  const {
    page,
    rowsPerPage,
    rows,
    handleChangePage,
    handleChangeRowsPerPage,
    editData,
    claims,
  } = props;

  const isRoleAddEnabled =
    (claims && claims.includes(accessRights["USER_ROLE_ADD"])) || false;

  return (
    <Box mx={6} my={3}>
      <Grid container item xs={12} md={12} justify="flex-end">
        <Box mt={"-40px"}>
          {isRoleAddEnabled && (
            <Button
              variant="contained"
              color="primary"
              className={classes.mediumBtn}
              style={props.i18n.language === "fr" ? { width: 230 } : {}}
              startIcon={<AddOutlinedIcon />}
              onClick={() => editData("add", "", "", "1", true)}
            >
              {t("componentData.roleListView.addRole")}
            </Button>
          )}
        </Box>
        <Box my={2} pt={1} width="100%">
          <Grid container item xs={12} md={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                          className={classes.row}
                        >
                          <TableCell className={classes.name}>
                            {row.roleName}
                          </TableCell>
                          <TableCell align="right" style={{ padding: 0 }}>
                            <IconButton
                              color="primary"
                              title={
                                row.isCustom
                                  ? t("componentData.roleListView.EditRole")
                                  : t("componentData.roleListView.viewRole")
                              }
                              component="span"
                              onClick={() =>
                                editData(
                                  row.roleId,
                                  row.roleName,
                                  row.description,
                                  row.isCustom,
                                  false
                                )
                              }
                            >
                              {row.isCustom ? (
                                <CreateIcon className={classes.smallIcon} />
                              ) : (
                                <RemoveRedEyeIcon
                                  className={classes.smallIcon}
                                />
                              )}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              labelRowsPerPage={t("componentData.roleListView.Rowsperpage")}
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              style={{ width: "100%" }}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('componentData.fileName.Of')} ${count !== -1 ? count : `${t('componentData.fileName.MoreThan')} ${to}`}`}
            />
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
}

export default withTranslation()(RolesTable);
