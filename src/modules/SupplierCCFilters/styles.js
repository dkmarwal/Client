export const styles = (theme) => ({
  filterText: {
    color: theme.palette.primary.main,
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "0.25px",
  },
  itemSelected: {
    margin: "0px 5px 5px 0px",
    fontSize: "14px",
    fontWeight: "500",
    boxSizing: "border-box",
    padding: "0 10px",
  },
  item: {
    margin: "0px 5px 5px 0px",
    fontSize: "14px",
    background: "#e4e4e4",
    fontWeight: "500",
    padding: "0 10px",
    border: "none",
    color: theme.palette.text.black,
  },
  imgIcon: {
    width: "18px",
    height: "18px",
  },
  paymentsTabContainer: {
    marginTop: 32,
  },
  implementationProgram: {
    marginTop: 24,
  },
  cursorPointer: {
    cursor: "pointer",
  },
  selectBtn: {
    padding: "10px",
    "& span": {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "1rem",
    },
  },
  enrollMidSec: {
    float: "left",
    width: "100%",
    "& .dateIcon": {
      padding: 1,
      margin: "0 -10px 0 0",
    },
    "& #dateRangeBox": {
      cursor: "pointer",
    },
    "& .datePickerBox": {
      float: "left",
      width: "82%",
      margin: "5px 0 0 0",
      background: "#fff",
      position: "absolute",
      zIndex: "1",
      boxSizing: "border-box",
      border: "1px solid #F0F6FB",
      padding: "0 0 8px 0 !important",
      boxShadow: "1px 1px 5px #F0F6FB",
      borderRadius: "7px",
      "& > ul": {
        float: "left",
        width: "20%",
        listStyle: "none",
        "& li": {
          padding: "17px 15px",
          textAlign: "left",
          backgroundColor: "#F2F2F2",
          cursor: "pointer",
          margin: "0 0 10px",
          fontSize: 14,
          borderRadius: "4px",
          "&:hover": {
            background: "#008CE6",
            color: "#fff",
          },
          "&.active": {
            background: "#008CE6",
            color: "#fff",
          },
        },
      },

      "& .datePicker": {
        float: "left",
        width: "100%",
        // margin: '0 0 0 1%',
        "& .react-datepicker": {
          border: "1px solid #F0F6FB",
          width: "100%",
        },
        "& .react-datepicker__header ": {
          background: "#F0F6FB",
        },
        "& .react-datepicker__month-container ": {
          width: "100%",
        },
        "& .react-datepicker__day": {
          margin: 0,
          borderRadius: 0,
          padding: "10px 0",
          fontSize: 14,
          width: "41px",
        },
        "& .react-datepicker__day-name": {
          width: "2.25rem",
        },
        "& .react-datepicker__day--in-range": {
          background: "#F0F6FB",
          color: "#4C4C4C",
          "&:empty": {
            visibility: "hidden",
          },
        },
        "& .react-datepicker__day--range-start": {
          background: "#008CE6",
          color: "#fff",
          borderRadius: "10px 0 0 10px",
        },
        "& .react-datepicker__day--range-end": {
          background: "#008CE6",
          color: "#fff",
          borderRadius: "0 10px 10px 0",
        },
      },
      "& .arrowUp": {
        position: "absolute",
        top: "-36px",
        color: "#dcdcdc",
        "& svg": {
          fontSize: 60,
        },
      },
    },
    "& .selectedDate": {
      display: "inline-block",
      margin: "11px 0 0 20px",
      color: "#9E9E9E",
      fontSize: 14,
    },
    "& .DateBox": {
      float: "left",
      width: "100%",
    },
  },
  error: {
    fontSize: "14px",
    color: "#E03617",
  },
  annualPopup:{
    padding:"24px !important",
    background:"#FFFFFF",
    boxShadow: "0px 6px 10px rgb(0 0 0 / 14%), 0px 1px 18px rgb(0 0 0 / 12%), 0px 3px 5px -1px rgb(0 0 0 / 20%)",
    borderRadius: "8px"
  },
});
