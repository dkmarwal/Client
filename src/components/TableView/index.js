import React, { Component } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import "./styles.scss";
import { Box } from "@material-ui/core";
import { withTranslation } from 'react-i18next';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    headCells,
    t
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={"row"}>
        {headCells
          ? headCells.map((headCell, cellIndex) => (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? "right" : "left"}
                padding={headCell.disablePadding ? "none" : "default"}
                sortDirection={orderBy === headCell.id ? order : false}
                className={cellIndex === 0 ? classes.firstHeading : ""}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  <Typography variant="subtitle1">
                    {headCell.label.replace("_", " ")}
                  </Typography>

                  {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === "desc"
                        ? t('componentData.SmallTxt.sortedDescending')
                        : t('componentData.SmallTxt.sortedAscending')}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))
          : ""}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const ASC = "asc";
const DESC = "desc";
class TableView extends Component {
  constructor() {
    super();
    this.state = {
      order: ASC,
      orderBy: "",
      selected: [],
      page: 0,
      dense: false,
      rowsPerPage: 10,
      rows: [],
      headerMap: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props && state.rows.length === 0) {
      return {
        rows: props.bodyData,
        orderBy: props.defaultOrderBy,
        order: props.defaultOrder,
        headerMap: props.headData,
        rowsPerPage: props.setting.paging
          ? state.rowsPerPage
          : props.bodyData.length,
      };
    }
    return null;
  }

  handleRequestSort = (event, property) => {
    const isAsc = this.state.orderBy === property && this.state.order === ASC;
    this.setState({ order: isAsc ? DESC : ASC, orderBy: property });
  };

  handleSelectAllClick = (event) => {
    // for select all check box
    if (event.target.checked) {
      const newSelecteds = this.state.rows.map((n) => n.name);
      this.setState({ selected: newSelecteds });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, name) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
  };

  isSelected = (name) => this.state.selected.indexOf(name) !== -1;

  emptyRows = () =>
    this.state.rowsPerPage -
    Math.min(
      this.state.rowsPerPage,
      this.state.rows.length - this.state.page * this.state.rowsPerPage
    );

  stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  cellText = (text) => {
    //console.log(typeof text)
    if (typeof text === "object") {
      const textArr = text.map((item) => {
        return <Typography variant="subtitle2">{item}</Typography>;
      });
      return textArr;
    } else {
      return <Typography variant="subtitle2">{text}</Typography>;
    }
  };

  render() {
    const { classes, title, setting, t } = this.props;
    const {
      order,
      orderBy,
      selected,
      page,
      dense,
      rowsPerPage,
      rows,
      headerMap,
    } = this.state;

    return (
      <div className={classes.root}>
        <Box paddingX={3}>
          <div className={classes.paper}>
            {title ? (
              <Box paddingLeft={2} paddingTop={2}>
                <Typography variant="h5">{title}</Typography>
              </Box>
            ) : (
              ""
            )}
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                  rowCount={rows.length}
                  headCells={headerMap}
                />
                <TableBody>
                  {this.stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                          className={"row table-striped"}
                        >
                          {headerMap.map((cell, i) => (
                            <TableCell key={`${cell.id}_${i}`}>
                              {this.cellText(row[cell.id])}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  {this.emptyRows > 0 && (
                    <TableRow
                      style={{ height: (dense ? 33 : 53) * this.emptyRows }}
                    >
                      <TableCell colSpan={headerMap.length} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {setting.paging ? (
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('componentData.fileName.Of')} ${count !== -1 ? count : `${t('componentData.fileName.MoreThan')} ${to}`}`}
              />
            ) : null}
          </div>
        </Box>
      </div>
    );
  }
}
export default withTranslation()(withStyles(styles)(TableView));
