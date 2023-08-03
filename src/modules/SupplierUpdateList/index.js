/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import _ from "lodash";
import {
  Grid,
  Typography,
  Box,
  Table,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  makeStyles,
  Button,
  Chip,
  Link,
  TableHead,
} from "@material-ui/core";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import SearchIcon from "@material-ui/icons/Search";
import ReviewPayeeUpdateFilters from "~/modules/ReviewPayeeUpdateFilters";
import { CustomDialog } from "~/components/Dialogs/index.js";
import moment from "moment";
import { useSelector } from "react-redux";
import CustomCard from "~/components/CustomCard";
const useStyles = makeStyles((theme) => ({
  searchBox: {
    maxWidth: "270px",
    fontSize: "16px",
    letterSpacing: "0.44px",
    lineHeight: "24px",
    background: "white",
    borderRadius: "4px",
  },
  smallBtn: {
    maxWidth: "98px",
    fontSize: "14px",
    color: "#0B1941",
  },
  smallIcon: {
    width: "20px",
    height: "17px",
    color: "#0B1941",
  },
  iconText: {
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
}));

const SupplierUpdateList = (props) => {
  const { supplierUpdateList } = useSelector(
    (state) => state.suppliers.suppliers
  );
  const classes = useStyles();
  const { t } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actionNeeded, setActionNeeded] = useState(false);
  const [payeeIdSearch, setPayeeIdSearch] = useState(null);
  const [tempDateFilter, setTempDateFilter] = useState(-1);
  const [typeOfPayeeUpdates, setTypeOfPayeeUpdates] = useState([
    {
      id: 0,
      label: "Company Information",
      actionType: "COMPANY",
      selected: false,
    },
    {
      id: 1,
      label: "Bank Account Information",
      actionType: "BANK_ACCOUNT",
      selected: false,
    },
    {
      id: 2,
      label: "Contact Information",
      actionType: "CONTACT",
      selected: false,
    },
    {
      id: 3,
      label: "Location Information",
      actionType: "LOCATION",
      selected: false,
    },
    {
      id: 4,
      label: "Virtual Card Information",
      actionType: "VIRTUAL_CARD",
      selected: false,
    },
    {
      id: 5,
      label: "Wire Information",
      actionType: "WIRE",
      selected: false,
    },
    {
      id: 6,
      label: "Cross Border Information",
      actionType: "CROSS_BORDER",
      selected: false,
    },
  ]);
  const [filtersSelected, setFiltersSelected] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [payeeNameSearch, setPayeeNameSearch] = useState(null);
  const [clicked, setClicked] = useState(false);

  const getDateFilterLabel = (index) => {
    switch (index) {
      case 1:
        return "Today";
      case 2:
        return "Last 7 Days";
      case 3:
        return "Last 30 Days";
      case 4:
        return "Previous Month";
      case 0:
        return "Custom";
      default:
    }
  };

  useEffect(() => {
    if (actionNeeded) {
      setTypeOfPayeeUpdates(
        typeOfPayeeUpdates.map((list, item) => {
          return item.actionType !== "BANK_ACCOUNT" ||
            item.actionType !== "VIRTUAL_CARD"
            ? {
                ...list,
                selected: false,
              }
            : {
                ...list,
              };
        })
      );
    }
  }, [actionNeeded]);

  useEffect(() => {
    if (clicked) {
      applyPayeeFilter();
    }
  }, [clicked]);

  useEffect(() => {
    const selectedCardIndex = _.findIndex(
      supplierUpdateList,
      (item) => item.payeeActionTypeId === props.selectedCard
    );
    const newPage =
      selectedCardIndex !== -1
        ? Math.floor(selectedCardIndex / rowsPerPage)
        : 0;
    page !== newPage && setPage(newPage);
  }, [props.selectedCard]);

  useEffect(() => {
    supplierUpdateList.length > 0 && handleChangePage(null, 0);
  }, [rowsPerPage]);

  const handleChangePage = (e, newPage) => {
    //Setting selected card first and then changing page
    const nextIndex = newPage * rowsPerPage;
    handleClick(
      supplierUpdateList[nextIndex].payeeId,
      supplierUpdateList[nextIndex].actionId,
      supplierUpdateList[nextIndex].actionType,
      supplierUpdateList[nextIndex].action,
      supplierUpdateList[nextIndex].payeeActionTypeId,
      supplierUpdateList[nextIndex].needApproval
    );
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
  };
  const renderContent = (action, actionType) => {
    switch (actionType) {
      case "CLEARING_HOUSE":
        if (action === "CREATE") {
          return t("componentData.supplierUdateList.newClearingHouseAdd");
        } else if (action === "UPDATE") {
          return t("componentData.supplierUdateList.ClearingHouseUp");
        }
        break;
      case "CONTACT":
        if (action === "CREATE") {
          return t("componentData.supplierUdateList.newContact");
        } else if (action === "UPDATE") {
          return t("componentData.supplierUdateList.contactUp");
        }
        break;
      case "COMPANY":
        if (action === "CREATE") {
          return t("componentData.supplierUdateList.newComp");
        } else if (action === "UPDATE") {
          return t("componentData.supplierUdateList.compUp");
        }
        break;
      case "BANK_ACCOUNT":
        if (action === "CREATE") {
          return t("componentData.supplierUdateList.newBankAdd");
        } else if (action === "UPDATE") {
          return t("componentData.supplierUdateList.bankAccUp");
        } else if (action === "SHARE") {
          return t("componentData.supplierUdateList.bankAccSh");
        } else if (action === "UNSHARE") {
          return t("componentData.supplierUdateList.bankAccUnSh");
        }
        break;
      case "VIRTUAL_CARD":
        if (action === "CREATE") {
          return t("componentData.supplierUdateList.VCAdd");
        } else if (action === "UPDATE") {
          return t("componentData.supplierUdateList.VCUpdated");
        } else if (action === "SHARE") {
          return t("componentData.supplierUdateList.VCShared");
        } else if (action === "UNSHARE") {
          return t("componentData.supplierUdateList.VCUnShared");
        }
        break;
      case "CROSS_BORDER":
        if (action === "CREATE") {
          return t("componentData.supplierUdateList.CBAdd");
        } else if (action === "UPDATE") {
          return t("componentData.supplierUdateList.CBUpdated");
        } else if (action === "SHARE") {
          return t("componentData.supplierUdateList.CBSh");
        } else if (action === "UNSHARE") {
          return t("componentData.supplierUdateList.CBUnSh");
        }
        break;
      case "WIRE":
        if (action === "CREATE") {
          return t("componentData.supplierUdateList.wireAdd");
        } else if (action === "UPDATE") {
          return t("componentData.supplierUdateList.wireUpdate");
        } else if (action === "SHARE") {
          return t("componentData.supplierUdateList.wireSh");
        } else if (action === "UNSHARE") {
          return t("componentData.supplierUdateList.wireUnsh");
        }
        break;
      case "LOCATION":
        if (action === "CREATE") {
          return t("componentData.supplierUdateList.locationAdd");
        } else if (action === "UPDATE") {
          return t("componentData.supplierUdateList.locationUp");
        }
        break;
      default:
    }
  };

  const handleChipClick = (item, index, type) => {
    setTypeOfPayeeUpdates(
      typeOfPayeeUpdates.map((list, i) => {
        return index === i
          ? {
              ...list,
              selected: !item.selected,
            }
          : {
              ...list,
            };
      })
    );
  };

  const handleClick = async (
    payeeId,
    actionId,
    actionType,
    action,
    payeeActionTypeId,
    needApproval
  ) => {
    props.onClickHandler(
      payeeId,
      actionId,
      actionType,
      action,
      payeeActionTypeId,
      needApproval
    );
  };

  const getFormattedDate = (dateVal) => {
    return moment(dateVal).format("YYYY-MM-DD");
  };

  const handleDateChange = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const onChangeFilter = (index) => {
    const FromDate = new Date();
    const ToDate = new Date();
    switch (index) {
      case 1:
        handleDateChange(
          getFormattedDate(new Date()),
          getFormattedDate(new Date())
        );
        break;
      case 2:
        FromDate.setDate(new Date().getDate() - 7);
        handleDateChange(getFormattedDate(FromDate), getFormattedDate(ToDate));
        break;
      case 3:
        FromDate.setDate(new Date().getDate() - 30);
        handleDateChange(getFormattedDate(FromDate), getFormattedDate(ToDate));
        break;
      case 4:
        FromDate.setMonth(FromDate.getMonth() - 1);
        ToDate.setMonth(ToDate.getMonth() - 1);
        FromDate.setDate(1);
        ToDate.setFullYear(ToDate.getFullYear(), ToDate.getMonth() + 1, 0);
        handleDateChange(getFormattedDate(FromDate), getFormattedDate(ToDate));
        break;
      case 0:
        handleDateChange(undefined, undefined);
        break;
      default:
    }
  };

  const removeSelectedFilter = (type, obj) => {
    return obj.filter((f) => f.type !== type);
  };

  const getTypeOfPayeeUpdates = () =>
    typeOfPayeeUpdates.reduce(
      (a, o) => (o.selected && a.push({ ...o, type: "actionTypes" }), a),
      []
    );

  const getActionTypes = () =>
    typeOfPayeeUpdates.reduce(
      (actions, obj) => (obj.selected && actions.push(obj.actionType), actions),
      []
    );
  const setSelectedFilters = () => {
    const selectedAction = getActionTypes();

    let obj = [];
    obj =
      tempDateFilter !== -1 || tempDateFilter === 0
        ? [
            ...obj,
            {
              type: "tempDateFilter",
              label: getDateFilterLabel(tempDateFilter),
            },
          ]
        : removeSelectedFilter("tempDateFilter", obj);

    obj = actionNeeded
      ? [...obj, { type: "actionNeeded", label: "Requires Attention" }]
      : removeSelectedFilter("actionNeeded", obj);

    obj = payeeIdSearch
      ? [...obj, { type: "payeeIdSearch", label: "Payee ID" }]
      : removeSelectedFilter("payeeIdSearch", obj);

    obj = selectedAction.length
      ? [...obj, ...getTypeOfPayeeUpdates()]
      : removeSelectedFilter("actionTypes", obj);
    obj = Array.from(new Set(obj.map(JSON.stringify))).map(JSON.parse);
    setFiltersSelected(obj);
  };

  const applyPayeeFilter = () => {
    setSelectedFilters();
    const formattedStartDate =
      tempDateFilter === 0 ? getFormattedDate(startDate) : startDate;
    const formattedEndDate =
      tempDateFilter === 0 ? getFormattedDate(endDate) : endDate;
    const actionTypes = getActionTypes();

    props
      .onFiltersChange({
        payeeIdSearch,
        actionNeeded,
        formattedStartDate,
        formattedEndDate,
        actionTypes,
        payeeNameSearch,
      })
      .then(() => {
        props.fetchClientSupplierUpdate(
          {
            payeeIdSearch,
            actionNeeded,
            formattedStartDate,
            formattedEndDate,
            actionTypes,
            payeeNameSearch,
          },
          true
        );

        setClicked(false);
        setPage(0);
      });
  };

  const resetPayeeFilter = () => {
    setTempDateFilter(-1);
    setStartDate(null);
    setEndDate(null);
    setActionNeeded(false);
    setPayeeIdSearch(null);
    setTypeOfPayeeUpdates(
      typeOfPayeeUpdates.map((list, i) => {
        return {
          ...list,
          selected: false,
        };
      })
    );
    setClicked(true);
  };

  const handleDateFilterChange = (index) => {
    setTempDateFilter(index);
    onChangeFilter(index);
  };

  const handleSearch = (event) => {
    if (event.keyCode === 13) {
      applyPayeeFilter();
    }
  };

  const handleOnDelete = (filter) => {
    switch (filter.type) {
      case "payeeIdSearch":
        setPayeeIdSearch(null);
        break;
      case "actionNeeded":
        setActionNeeded(null);
        break;
      case "tempDateFilter":
        setTempDateFilter(-1);
        setStartDate(null);
        setEndDate(null);
        break;
      case "actionTypes":
        handleChipClick(filter, filter.id);
        break;
      default:
    }
    setClicked(true);
  };

  const selectedCardIndex = _.findIndex(
    supplierUpdateList,
    (supplierUpdateListItem) =>
      supplierUpdateListItem.payeeActionTypeId === props.selectedCard
  );
  if (props.isLoading) {
    return (
      <Box className="loader-container">
        <CircularProgress color="primary" />
      </Box>
    );
  }
  return (
    <>
      {supplierUpdateList && supplierUpdateList.length === 0 && (
        <Grid container>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item xs={12} justify="center">
              <Box>
                <Grid item xs={12}>
                  <Typography variant="h2">
                    {t("componentData.supplierUdateList.zeroUpdates")}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Grid container p={1} style={{ margin: "8px 0px" }}>
                    <Grid sm={6} xs={6} item>
                      {/* <Paper> */}
                      <TextField
                        className={classes.searchBox}
                        placeholder={t(
                          "componentData.supplierUdateList.searchByPayeeName"
                        )}
                        inputProps={{ "aria-label": "Search by payee name" }}
                        value={payeeNameSearch || ""}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="search"
                                onClick={applyPayeeFilter}
                                onMouseDown={null}
                                edge="end"
                              >
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        onChange={(event) =>
                          setPayeeNameSearch(event.target.value)
                        }
                        onKeyDown={handleSearch}
                        variant="outlined"
                        size="small"
                        style={{ color: "#000" }}
                      />
                      {/* </Paper> */}
                    </Grid>
                    <Grid sm={3} xs={3} style={{ textAlign: "center" }} item>
                      <Button
                        color="primary"
                        aria-label="View"
                        title={t("componentData.addView.ViewFilter")}
                        component="span"
                        className={classes.smallBtn}
                        onClick={() => {
                          setShowFilter(!showFilter);
                        }}
                      >
                        <img
                          src={require(`~/assets/icons/icon_filter.svg`)}
                          alt={t("componentData.supplierUdateList.viewFilter")}
                          className={classes.smallIcon}
                        />
                        <Typography variant="h6" className={classes.iconText}>
                          {t("componentData.supplierUdateList.filters")}
                        </Typography>
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container p={1} style={{ margin: "8px 0px" }}>
                    <Grid xs={12} sm={10} p={1} item>
                      {filtersSelected.length > 0 &&
                        filtersSelected
                          .slice(
                            0,
                            filtersSelected.length > 2 && !showAll
                              ? 2
                              : filtersSelected.length
                          )
                          .map((item, index) => {
                            return (
                              <Chip
                                label={t(
                                  `componentData.supplierUdateList.${item.label}`
                                )}
                                key={index}
                                // onClick={handleClick}
                                onDelete={() => {
                                  handleOnDelete(item);
                                }}
                                style={{ margin: "2px" }}
                              />
                            );
                          })}
                    </Grid>
                    {filtersSelected.length > 2 && (
                      <Grid xs={12} sm={2} style={{ textAlign: "center" }} item>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => {
                            setShowAll(!showAll);
                          }}
                        >
                          {showAll
                            ? t("componentData.supplierUdateList.less")
                            : t("componentData.supplierUdateList.more")}
                        </Link>
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Box mt={3} mb={3}>
                    <Paper elevation={3} square={true}>
                      <Box display="block" textAlign="center" p={8} width={1}>
                        <img
                          src={require(`~/assets/icons/bankFile_No_data.svg`)}
                          alt={t(
                            "componentData.supplierUdateList.NoDataToShow"
                          )}
                          width="200"
                        />
                        <Box
                          display="block"
                          mt={1}
                          color="#A1A1A1"
                          fontSize={14}
                        >
                          {t("componentData.supplierUdateList.NoDataToShow")}
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Box m={5}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[3, 5, 10]}
                      count={supplierUpdateList.length || 0}
                      rowsPerPage={rowsPerPage}
                      labelRowsPerPage={t(
                        "componentData.supplierUdateList.CardsPerPage"
                      )}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} ${t("componentData.fileName.Of")} ${
                          count !== -1
                            ? count
                            : `${t("componentData.fileName.MoreThan")} ${to}`
                        }`
                      }
                    />
                  </TableRow>
                </TableHead>
              </Table>
            </Box>
          </Grid>
        </Grid>
      )}
      {supplierUpdateList && supplierUpdateList.length > 0 && (
        <Box width="38%">
          <>
            <Box>
              {" "}
              <Typography variant="h2">{`${selectedCardIndex + 1} ${t(
                "componentData.supplierUdateList.of"
              )} ${supplierUpdateList.length} ${t(
                "componentData.supplierUdateList.updates"
              )}`}</Typography>
            </Box>
            <Grid container p={1} style={{ margin: "8px" }}>
              <Grid sm={9} xs={12} item>
                {/* <Paper> */}
                <TextField
                  className={classes.searchBox}
                  placeholder={t(
                    "componentData.supplierUdateList.searchByPayeeName"
                  )}
                  inputProps={{ "aria-label": "Search by payee name" }}
                  value={payeeNameSearch || ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="search"
                          onClick={applyPayeeFilter}
                          onMouseDown={null}
                          edge="end"
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={(event) => setPayeeNameSearch(event.target.value)}
                  onKeyDown={handleSearch}
                  variant="outlined"
                  size="small"
                  style={{ color: "#000" }}
                />
                {/* </Paper> */}
              </Grid>
              <Grid sm={3} xs={12} style={{ textAlign: "center" }} item>
                <Button
                  color="primary"
                  aria-label="View"
                  title={t("componentData.addView.ViewFilter")}
                  component="span"
                  className={classes.smallBtn}
                  onClick={() => {
                    setShowFilter(!showFilter);
                  }}
                >
                  <img
                    src={require(`~/assets/icons/icon_filter.svg`)}
                    alt={t("componentData.supplierUdateList.viewFilter")}
                    className={classes.smallIcon}
                  />
                  <Typography variant="h6" className={classes.iconText}>
                    {t("componentData.supplierUdateList.filters")}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Grid container p={1} style={{ margin: "8px" }}>
              <Grid xs={12} sm={10} p={1} item>
                {filtersSelected.length > 0 &&
                  filtersSelected
                    .slice(
                      0,
                      filtersSelected.length > 2 && !showAll
                        ? 2
                        : filtersSelected.length
                    )
                    .map((item, index) => {
                      return (
                        <Chip
                          label={t(
                            `componentData.supplierUdateList.${item.label}`
                          )}
                          key={index}
                          // onClick={handleClick}
                          onDelete={() => {
                            handleOnDelete(item);
                          }}
                          style={{ margin: "2px" }}
                        />
                      );
                    })}
              </Grid>
              {filtersSelected.length > 2 && (
                <Grid xs={12} sm={2} style={{ textAlign: "center" }} item>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                      setShowAll(!showAll);
                    }}
                  >
                    {showAll
                      ? t("componentData.supplierUdateList.less")
                      : t("componentData.supplierUdateList.more")}
                  </Link>
                </Grid>
              )}
            </Grid>
            {supplierUpdateList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(
                (
                  {
                    payeeId,
                    clientPayeeLink,
                    payeeActionTypeId,
                    companyName,
                    checked,
                    city,
                    state,
                    actionId,
                    action,
                    actionType,
                    updatedAt,
                    updatedBy,
                    isNotificationRead,
                    needApproval,
                  },
                  index
                ) => {
                  const header = (
                    <Typography
                      variant="h2"
                      style={{ wordBreak: "break-word", margin: "25px 0 0 0" }}
                    >
                      {companyName}
                      <span
                        style={{
                          background: "#0B1941",
                          color: "#fff",
                          fontSize: "14px",
                          padding: "5px",
                          borderRadius: "2px",
                          fontWeight: "normal",
                          position: "absolute",
                          top: 5,
                          right: 5,
                        }}
                      >
                        {t("componentData.supplierUdateList.New")}
                      </span>
                    </Typography>
                  );
                  const content = (
                    <Typography variant="h5">
                      {renderContent(action, actionType)}
                    </Typography>
                  );
                  const footer = (
                    <Typography variant="body2">{`${t(
                      "componentData.supplierUdateList.UpdatedBy"
                    )} ${updatedBy || ""} ${t(
                      "componentData.supplierUdateList.at"
                    )} ${updatedAt || ""}`}</Typography>
                  );
                  return (
                    <>
                      <Box m={1} key={index}>
                        <CustomCard
                          Data={{
                            payeeId,
                            entityId: actionId,
                            actionType,
                          }}
                          title={header}
                          content={content}
                          footer={footer}
                          isNotificationRead={isNotificationRead}
                          checked={checked}
                          payeeActionTypeId={payeeActionTypeId}
                          selectedCard={props.selectedCard}
                          onClickHandler={() =>
                            handleClick(
                              payeeId,
                              actionId,
                              actionType,
                              action,
                              payeeActionTypeId,
                              needApproval
                            )
                          }
                        />
                      </Box>
                    </>
                  );
                }
              )}

            {supplierUpdateList && supplierUpdateList.length > 0 && (
              <Box width={1}>
                <Table>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[3, 5, 10]}
                      component="div"
                      count={supplierUpdateList.length || 0}
                      rowsPerPage={rowsPerPage}
                      labelRowsPerPage={t(
                        "componentData.supplierUdateList.CardsPerPage"
                      )}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} ${t("componentData.fileName.Of")} ${
                          count !== -1
                            ? count
                            : `${t("componentData.fileName.MoreThan")} ${to}`
                        }`
                      }
                    />
                  </TableRow>
                </Table>
              </Box>
            )}
          </>
        </Box>
      )}
      {showFilter && (
        <CustomDialog
          showButton={false}
          alignSide={true}
          onConfirm={() => {
            setShowFilter(false);
          }}
          title={t("componentData.supplierUdateList.filters")}
          // icon={true}
          width="400px"
        >
          <ReviewPayeeUpdateFilters
            payeeIdSearch={payeeIdSearch}
            startDate={startDate}
            endDate={endDate}
            actionNeeded={actionNeeded}
            tempDateFilter={tempDateFilter}
            typeOfPayeeUpdates={typeOfPayeeUpdates}
            handlePayeeId={(payeeId) => {
              setPayeeIdSearch(payeeId);
            }}
            handleActionNeeded={() => setActionNeeded(!actionNeeded)}
            handleChipClick={handleChipClick}
            handleStartDateChange={(date) => setStartDate(date)}
            handleEndDateChange={(date) => setEndDate(date)}
            handleDateFilterChange={handleDateFilterChange}
            applyPayeeFilter={() => {
              setShowFilter(false);
              applyPayeeFilter();
            }}
            resetPayeeFilter={resetPayeeFilter}
          />
        </CustomDialog>
      )}
    </>
  );
};

export default withTranslation()(withRouter(SupplierUpdateList));
