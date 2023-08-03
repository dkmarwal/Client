import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import Checkbox from "@material-ui/core/Checkbox";
import {
  TableHead,
  Box,
  CircularProgress,
  MenuItem,
  Menu, FormControl, Select
} from "@material-ui/core";
import CurrencyFlag from "react-currency-flags";
import { StyledTableFooter } from "~/components/StyledTable";
import NumberFormat from "react-number-format";
import { debounce } from "lodash";
import { withTranslation, useTranslation } from "react-i18next";
import Tooltip from "@material-ui/core/Tooltip";
import {
  entityType,
  PayerTypes,
  PaymentCancelStatus,
  PaymentDisableStatus,
} from "~/config/entityTypes";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import BlockIcon from "@material-ui/icons/Block";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
    flexFlow: 1,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgba(204,228,255,0.75) !important",
    color: "rgba(18,18,18,0.87)",
    fontSize: "14px",
    fontWeight: "bold",
    padding: 7,
  },
  body: {
    color: "rgba(0,0,0,0.87) !important",
    fontFamily: "Interstate",
    fontSize: "14px",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    //   '&:nth-of-type(odd)': {
    //     backgroundColor: theme.palette.action.hover,
    //   },
  },
}))(TableRow);

const customStyle = makeStyles((theme) => ({
  root: {
    fontFamily: "'Interstate', Arial, Helvetica, sans-serif",
  },

  flagcontainer: {
    alignContent: "center",
    display: "flex",
  },
  flag: {
    height: "2em !important",
    width: "2em !important",
    borderRadius: "50%",
    marginRight: "5px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "rgba(18,18,18,0.87) !important",
  },
  headerLabel: {
    whiteSpace: "break-spaces",
    lineHeight: "20px",
    minHeight: "50px",
    display: "flex",
    alignItems: "center",
  },
  headerInput: {
    // width: '40%',
    border: "none",
    fontSize: "12px",
    fontFamily: "'Interstate', Arial, Helvetica, sans-serif",
    borderRadius: "4px 4px 0 0",
    height: 30,
  },
  headerInputShort: {
    border: "none",
    fontSize: "12px",
    maxWidth: "18%",
    marginRight: "10px",
    fontFamily: "'Interstate', Arial, Helvetica, sans-serif",
    borderRadius: "4px 4px 0 0",
    height: 30,
  },
  headerInputLong: {
    border: "none",
    fontSize: "12px",
    flexGrow: 1,
    fontFamily: "'Interstate', Arial, Helvetica, sans-serif",
    borderRadius: "4px 4px 0 0",
    height: 30,
  },
  parentSpan: {
    display: "flex",
    border: "none",
    fontSize: "12px",
    fontFamily: "'Interstate', Arial, Helvetica, sans-serif",
    borderRadius: "4px 4px 0 0",
    height: 30,
  },
  headerSelectInput: {
    border: "none",
    fontSize: "12px",
    fontFamily: "'Interstate', Arial, Helvetica, sans-serif",
    borderRadius: "4px 4px 0 0",
    height: 30,
    marginRight: 14,
  },
  table: {
    boxShadow: "none",
  },
  toolTip: {
    marginLeft: "5px",
    maxWidth: 900,
  },
  toolTipStatus: {
    marginLeft: "5px",
    padding: "10px",
  },
  allCheckboxCell: {
    paddingBottom: 0,
    verticalAlign: "bottom",
    textAlign: "center",
    padding: 0,
  },
  singleCheckboxCell: {
    textAlign: "center",
    padding: 0,
  },
  menuIcon: {
    color: "#0B1941",
    marginRight: "5px",
  },
}));

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
        aria-label={t("componentData.customTable.firstpage")}
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label={t("componentData.customTable.previouspage")}
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={t("componentData.customTable.nextpage")}
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label={t("componentData.customTable.lastpage")}
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
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

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default withTranslation()(function CustomTable({
  t,
  rows,
  selectableData,
  isLoading,
  totalRecords,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  dataFilterParams,
  onClickRow,
  changeFilter,
  statusTypeList,
  paymentTypeList: payTypeList,
  allPaymentType: allPaymentTypeKeys,
  apiPaymentTypesList,
  statusList,
  businessType,
  handleSelectAllClick,
  handleRowItemClick,
  selectedPayment,
  setSelectedPayment,
  checkedAll,
  payerTypeId,
  onMenuCancelClick,
  isPaymentRemmitanceCancelEnabled
}) {
  const classes = useStyles2();
  const customClasses = customStyle();
  const [showHeaderCheckbox, setShowHeaderCheckbox] = useState(false);
  const [paymentTypeList, setPaymentTypeList] = useState({});
  const [allPaymentType, setAllPaymentType] = useState("");
  const [dataFilterParamsObj, setDataFilterParamObj] = useState({});
  const [tempValueDate, setTempValueDate] = React.useState(false);
  const [openVCAMenuElement, setOpenVCAMenuElement] = useState([]);

  const isValidDate = (dateString) => {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      return false;
    }

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month === 0 || month > 12) {
      return false;
    }

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
  };

  const isCheckBoxExist = (rows, rowsPerPage) => {
    let showHeaderCheckbox = false;
    rows.map((row) => {
      if (PaymentCancelStatus.includes(row.ReturnStatusID)) {
        showHeaderCheckbox = true;
      }
    });
    setShowHeaderCheckbox(showHeaderCheckbox);
  };

  useEffect(() => {
    isCheckBoxExist(rows, rowsPerPage);
  }, [rows, rowsPerPage]);

  useEffect(() => {
    setDataFilterParamObj(dataFilterParams);
  }, [dataFilterParams]);

  useEffect(() => {
    setPaymentTypeList(payTypeList);
    setAllPaymentType(allPaymentTypeKeys);
  }, [payTypeList, allPaymentTypeKeys]);

  const handler = useCallback(
    debounce((paramsObj) => {
      Object.keys(paramsObj).map(
        (k) =>
          (paramsObj[k] =
            typeof paramsObj[k] == "string"
              ? paramsObj[k].trim()
                ? paramsObj[k].trim()
                : null
              : paramsObj[k])
      );
      changeFilter(paramsObj);
    }, 1000),
    []
  );

  const onChangeInput = (event) => {
    const { id, value, name } = event.target;    
    let newObj = {};    
    // if(id === 'RemitToID' && payerTypeId == PayerTypes.CARDS){
    //   Boolean(id)
    //     ? newObj = {
    //         ...dataFilterParamsObj,
    //         [id]: value?.replace(/[^0-9]/g, ""),
    //       }
    //     : newObj = {
    //         ...dataFilterParamsObj,
    //         [name]: value?.replace(/[^0-9]/g, ""),
    //       } 
    // }else
     if(id==='amount' && payerTypeId == PayerTypes.CARDS){
      const testAmt = /^\d{0,14}(\.\d{1,2})?$/;
      if (testAmt.test(value.toString().trim())) {
        Boolean(id)
        ? newObj = {
            ...dataFilterParamsObj,
            [id]: value,
          }
        : newObj = {
            ...dataFilterParamsObj,
            [name]: value,
          } 
      }else{
         newObj = {
            ...dataFilterParamsObj
          } 
      }
    }
    else{
      Boolean(id)
        ? newObj = {
            ...dataFilterParamsObj,
            [id]: value,
          }
        : newObj = {
            ...dataFilterParamsObj,
            [name]: value,
          } 
    }            
    handler(newObj);
    setDataFilterParamObj(newObj);  
  };

  const onModifyCancelMenu = (e, id) => {
    e.stopPropagation();
    let ele = [...openVCAMenuElement];
    ele[id] = e.currentTarget;
    setOpenVCAMenuElement(ele);
  };
  const onModifyCancelMenuClose = (e, id) => {
    e.stopPropagation();
    let ele = [...openVCAMenuElement];
    ele[id] = null;
    setOpenVCAMenuElement(ele);
  };

  const onCancelVirtualCardMenu = (e, row) => {
    e.stopPropagation();
    onMenuCancelClick(row);
    onModifyCancelMenuClose(e, row.PaymentID);
  };

  const onModifyVirtualCardMenu = (e, row) => {
    e.stopPropagation();
    onClickRow(row.PaymentID, row.RemitToID, row.BusinessType);
  };

  //console.log("statusList", statusList)
  const statusInfo =
    statusList &&
    statusList.length > 0 &&
    statusList.map((item) => {
      return (
        <Box display="flex">
          <Box width={200} justifyContent={"flexStart"}>
            {item.Description}{" "}
          </Box>
          <Box justifyContent={"flexStart"}> - {item.PaymentStatusInfo}</Box>
        </Box>
      );
    });

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table
          className={classes.table}
          aria-label={t("componentData.customTable.custompaginationtable")}
        >
          <TableHead>
            <StyledTableRow>
              {payerTypeId == PayerTypes.CARDS ? (
                <StyledTableCell className={customClasses.allCheckboxCell}>
                  {showHeaderCheckbox && isPaymentRemmitanceCancelEnabled && (
                    <Checkbox
                      checked={
                        selectedPayment.length == 10 ||
                        selectedPayment.length == selectableData.length
                      }
                      color="primary"
                      indeterminate={
                        selectedPayment.length > 0 &&
                        (selectableData.length > 10
                          ? selectedPayment.length < 10
                          : selectedPayment.length < selectableData.length)
                      }
                      onChange={(event) => handleSelectAllClick(event)}
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      indeterminateIcon={
                        <IndeterminateCheckBoxIcon fontSize="small" />
                      }
                    />
                  )}
                </StyledTableCell>
              ) : null}
              <StyledTableCell align="left">
                <span className={customClasses.header}>
                  <span className={customClasses.headerLabel}>
                    {t("componentData.customTable.PaymentReference")}
                  </span>
                  <input
                    className={customClasses.headerInput}
                    disabled={isLoading}
                    placeholder={t("componentData.customTable.PaymentReference")}
                    id="paymentRef"
                    value={dataFilterParamsObj.paymentRef || ""}
                    onChange={onChangeInput}
                  />
                </span>
              </StyledTableCell>

              
              <StyledTableCell align="left">
                <span
                  className={customClasses.header}
                  style={{ maxWidth: 100 }}
                >
                  <span className={customClasses.headerLabel}>
                    {t("componentData.customTable.PayeeID")}
                  </span>
                  <input
                    className={customClasses.headerInput}
                    type="text"
                    placeholder={t("componentData.customTable.PayeeID")}
                    id={"RemitToID"}
                    disabled={isLoading}
                    value={dataFilterParamsObj.RemitToID }
                    onChange={onChangeInput}
                  />
                </span>
              </StyledTableCell>
              

              <StyledTableCell align="left">
                <span className={customClasses.header}>
                  <span className={customClasses.headerLabel}>
                    {t("componentData.customTable.PayeeName")}
                  </span>
                  <input
                    className={customClasses.headerInput}
                    placeholder={t("componentData.customTable.PayeeName")}
                    disabled={isLoading}
                    id="PayeeName"
                    value={dataFilterParamsObj.PayeeName || ""}
                    onChange={onChangeInput}
                  />
                </span>
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={customClasses.header}>
                  <span className={customClasses.headerLabel}>
                    {t("componentData.customTable.ValueDate")}
                  </span>
                  <NumberFormat
                    className={customClasses.headerInput}
                    format="##/##/####"
                    id="ValueDate"
                    disabled={isLoading}
                    placeholder={t("componentData.customTable.dateFormate")}
                    value={dataFilterParamsObj.ValueDate || ""}
                    onChange={(e) => {
                      const date = e.target.value;
                      if (isValidDate(date) || date === "") {
                        onChangeInput(e);
                      } else if (
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
                        setTempValueDate(!tempValueDate);
                      }
                    }}
                    mask={["M", "M", "D", "D", "Y", "Y", "Y", "Y"]}
                  />
                </span>
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={customClasses.header}>
                  <span className={customClasses.headerLabel}>
                    {t("componentData.customTable.Status")}
                    {businessType === entityType.B2C && (
                      <Box ml={1} width={1}>
                        <Tooltip
                          title={statusInfo || ""}
                          placement="bottom"
                          arrow
                          classes={{ tooltip: customClasses.toolTip }}
                        >
                          <InfoOutlinedIcon
                            style={{ fontSize: 20 }}
                            color="primary"
                          />
                        </Tooltip>
                      </Box>
                    )}
                  </span>

                    <FormControl 
                      variant="outlined"
                    >
                      <Select
                        id="statusIDs"
                        name="statusIDs"
                        value={dataFilterParamsObj?.statusIDs ?? ""}
                        onChange={onChangeInput}
                        disabled={isLoading}
                        style={{
                          background: "#fff",
                          height: 31,
                          width: 100,
                          fontSize: 12
                        }}
                      >
                        <MenuItem value="">{t("componentData.customTable.All")}</MenuItem>
                        {statusList &&
                        statusList.length > 0 &&
                        statusList.map((item) => (
                          <MenuItem key={item.StatusID} value={item.StatusID}>
                            {item.Description}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl> 
                </span>
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={customClasses.header}>
                  <span className={customClasses.headerLabel}>
                    {t("componentData.customTable.PaymentAmount")}
                  </span>
                  <span className={customClasses.parentSpan}>

                    <FormControl 
                        variant="outlined"
                      >
                        <Select                      
                          id="AmountFilterBy"
                          name="AmountFilterBy"
                          value={dataFilterParamsObj?.AmountFilterBy ?? ""}
                          onChange={(e) => {
                            onChangeInput(e);
                          }}
                          disabled={isLoading}
                          style={{
                            background: "#fff",
                            height: 31,
                            width: 60,
                            fontSize: 12,
                            marginRight: 5
                          }}
                        >
                          <MenuItem value="">{t("componentData.customTable.All")}</MenuItem>
                          <MenuItem value="<">{"<"}</MenuItem>
                          <MenuItem value=">">{">"}</MenuItem>
                          <MenuItem value="=">{"="}</MenuItem>
                          <MenuItem value="<=">{"<="}</MenuItem>
                          <MenuItem value=">=">{">="}</MenuItem>                          
                        </Select>
                    </FormControl>                    

                    <input
                      className={customClasses.headerInputLong}
                      placeholder={t("componentData.customTable.EnterAmount")}
                      disabled={isLoading}
                      id="amount"
                      value={dataFilterParamsObj.amount || ""}
                      type="number"
                      onScroll={(e) => {
                        e.preventDefault();
                        return null;
                      }}
                      onChange={(e) => {
                        onChangeInput(e);
                      }}
                    />
                  </span>
                </span>
              </StyledTableCell>
              <StyledTableCell align="left">
                <span className={customClasses.header}>
                  <span
                    className={customClasses.headerLabel}
                    style={{ width: "100px" }}
                  >
                    {t("componentData.customTable.PaymentType")}
                  </span>

                  <FormControl 
                      variant="outlined"
                    >
                      <Select                      
                        id="paymentTypeIDs"
                        name="paymentTypeIDs"
                        value={dataFilterParams.paymentTypeIDs || allPaymentType}
                        onChange={onChangeInput}
                        disabled={isLoading || payerTypeId == PayerTypes.CARDS}
                        style={{
                          background: "#fff",
                          height: 31,
                          width: 100,
                          fontSize: 12
                        }}
                      >
                        <MenuItem value={allPaymentType}>{t("componentData.customTable.All")}</MenuItem>
                        {Object.keys(apiPaymentTypesList).map((key, index) => {
                          if (
                            apiPaymentTypesList[index].paymentCode != "EFT" &&
                            Object.keys(payTypeList).length > 0
                          ) {
                            var keys = Object.keys(payTypeList);
                            var currentKey =
                              apiPaymentTypesList[index].paymentTypeId.toString();
                            if (keys.includes(currentKey)) {
                              const tempKey =
                                apiPaymentTypesList[index].paymentTypeId;
                              let tempName = null;
                              if (businessType === entityType.B2C) {
                                tempName =
                                  apiPaymentTypesList[index].b2cDescription;
                              } else {
                                tempName = apiPaymentTypesList[index].paymentCode;
                              }

                              return (                                
                                  <MenuItem
                                    id={tempKey}
                                    key={tempKey}
                                    value={tempKey}
                                  >
                                    {tempName}
                                  </MenuItem>                                
                              );
                            }
                          }
                        })}

                      </Select>
                  </FormControl>

                  {/* <input className={customClasses.headerInput} placeholder="Enter Text"
                                    id='paymentRef'
                                    onChange={onChangeInput} /> */}
                </span>
              </StyledTableCell>

              {payerTypeId == PayerTypes.CARDS &&
                isPaymentRemmitanceCancelEnabled && (
                  <StyledTableCell width={20}></StyledTableCell>
                )}
            </StyledTableRow>
          </TableHead>
          {!isLoading ? (
            <TableBody>
              {rows && rows.length > 0
                ? rowsPerPage > 0 &&
                  rows.map((row) => {
                    const isSelected =
                      selectedPayment.indexOf(row.PaymentID) !== -1;
                    return (
                      <StyledTableRow
                        style={{ wordBreak: "break-word" }}
                        key={`${row.PayeeId}_${row.PaymentID}`}
                        onClick={(e) => {
                          if (e.target.type != "checkbox")
                            onClickRow(
                              row.PaymentID,
                              row.RemitToID,
                              row.BusinessType
                            );
                        }}
                      >
                        {payerTypeId == PayerTypes.CARDS ? (
                          <StyledTableCell
                            className={customClasses.singleCheckboxCell}
                          >
                            {PaymentCancelStatus.includes(row.ReturnStatusID) &&
                            isPaymentRemmitanceCancelEnabled ? (
                              <Checkbox
                                onChange={(event) =>
                                  handleRowItemClick(event, row)
                                }
                                icon={
                                  <CheckBoxOutlineBlankIcon fontSize="small" />
                                }
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                checked={isSelected}
                                color="primary"
                                inputProps={{
                                  "aria-labelledby": row.PaymentID,
                                }}
                              />
                            ) : null}
                          </StyledTableCell>
                        ) : null}
                        <StyledTableCell component="th" align="left">
                          {row.PaymentsRef}
                        </StyledTableCell>
                        <StyledTableCell component="th" align="left">
                                {row?.RemitToID ?? ""}
                        </StyledTableCell>
                        {/* {payerTypeId != PayerTypes.CARDS 
                          ? (
                              <StyledTableCell component="th" align="left">
                                {row?.RemitToID ?? ""}
                              </StyledTableCell>
                            )
                          : (
                            <StyledTableCell component="th" align="left">
                              {row?.PayeeId ?? ""}
                            </StyledTableCell>
                          )
                      } */}

                        <StyledTableCell component="th" align="left">
                          {row.PayeeName}
                        </StyledTableCell>
                        <StyledTableCell component="th" align="left">
                          {row.ValueDate}
                        </StyledTableCell>
                        <StyledTableCell
                          component="th"
                          align="left"
                          style={{ padding: "12px" }}
                        >
                          <Box alignItems="center" display="flex">
                            <Box>{row.PaymentStatus}</Box>
                            {businessType === entityType.B2C && row.PaymentStatus && (
                              <Box ml={1}>
                                <Tooltip
                                  title={row.PaymentStatusInfo || ""}
                                  placement="bottom"
                                  arrow
                                >
                                  <InfoOutlinedIcon
                                    style={{ fontSize: 20 }}
                                    color="primary"
                                  />
                                </Tooltip>
                              </Box>
                            )}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          component="th"
                          align="left"
                        >
                          <span className={customClasses.flagcontainer}>
                            {row.Amount && <>
                              {payerTypeId === PayerTypes.CARDS ? 
                              <>{row.CurrencyCode && <CurrencyFlag
                              className={customClasses.flag}
                              currency={row.CurrencyCode || "USD"}
                              size="lg"
                            />}</>
                              : <CurrencyFlag
                                className={customClasses.flag}
                                currency={row.CurrencyCode || "USD"}
                                size="lg"
                              />}
                              {/* <span
                              className={customClasses.flagLabel}
                              style={{ padding: '5px 3px' }}
                            >{` ${row.CurrencyCode || 'USD'}`}</span> */}
                              <span
                                className={customClasses.amount}
                                style={{ padding: "5px 0px" }}
                              >{` ${row.Amount}`}</span>
                            </>}
                          </span>
                        </StyledTableCell>
                        <StyledTableCell>
                          {businessType === entityType.B2C
                            ? Boolean(row.PaymentType) && row.PaymentTypeDesc
                            : row.PaymentType}
                        </StyledTableCell>

                        {payerTypeId == PayerTypes.CARDS &&
                          isPaymentRemmitanceCancelEnabled && (
                            <StyledTableCell style={{ padding: '4px'}}>
                              {PaymentDisableStatus.includes(
                                row.ReturnStatusID
                              ) ||
                              PaymentCancelStatus.includes(
                                row.ReturnStatusID
                              ) ? (
                                <Box component="span">
                                  <IconButton
                                    aria-label="more"
                                    style={{ padding: "5px" }}
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={(e) =>
                                      onModifyCancelMenu(e, row.PaymentID)
                                    }
                                    disabled={
                                      !PaymentCancelStatus.includes(
                                        row.ReturnStatusID
                                      )
                                    }
                                  >
                                    <MoreVertIcon fontSize="small" />
                                  </IconButton>
                                  <Menu
                                    id={row.PaymentID}
                                    anchorEl={openVCAMenuElement[row.PaymentID]}
                                    keepMounted
                                    open={Boolean(
                                      openVCAMenuElement[row.PaymentID]
                                    )}
                                    onClose={(e) =>
                                      onModifyCancelMenuClose(e, row.PaymentID)
                                    }
                                  >
                                    <MenuItem
                                      onClick={(e) =>
                                        onCancelVirtualCardMenu(e, row)
                                      }
                                    >
                                      <BlockIcon
                                        className={customClasses.menuIcon}
                                        fontSize="small"
                                      />
                                      {t(
                                        "componentData.CCPaymentTransaction.cancelCard"
                                      )}
                                    </MenuItem>
                                    {/* <MenuItem onClick={(e) => onModifyVirtualCardMenu(e, row)}>
                                  <EditIcon className={customClasses.menuIcon} fontSize="small" />
                                  {t('componentData.CCPaymentTransactionTabs.modifyBtn')}
                                </MenuItem> */}
                                  </Menu>
                                </Box>
                              ) : (
                                ""
                              )}
                            </StyledTableCell>
                          )}
                      </StyledTableRow>
                    );
                  })
                : ""}

              {rows && rows.length === 0 && isLoading === false && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box display="block" textAlign="center" width={1} my={6}>
                      <img
                        src={require("~/assets/icons/bankFile_No_data.svg")}
                        alt=""
                      />

                      <Box py={3} color="#A1A1A1" fontSize={14} display="block">
                        {t("componentData.customTable.NoDatatoShow")}
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <Box display="flex" justifyContent="center">
              <CircularProgress color="primary" />
            </Box>
          )}
          <StyledTableFooter>
            <TableRow>
              <TablePagination
                labelRowsPerPage={t("componentData.customTable.rowsPerPage")}
                rowsPerPageOptions={[10, 25, 50]} // { label: 'All', value: -1 }
                colSpan={7}
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": t("componentData.customTable.rowsPerPage"),
                  },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} ${t("componentData.fileName.Of")} ${
                    count !== -1
                      ? count
                      : `${t("componentData.fileName.MoreThan")} ${to}`
                  }`
                }
              />
            </TableRow>
          </StyledTableFooter>
        </Table>
      </TableContainer>
    </>
  );
});
