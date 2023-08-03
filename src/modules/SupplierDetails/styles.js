export const styles = (theme) => ({
  keyLabel: {
    fontSize: 14,
    color: "#4C4C4C",
  },
  valueLabel: {
    fontSize: 14,
    color: "#000000",
  },
  mainSection: {
    padding: "8px 40px",
  },
  detailSection: {
    padding: theme.spacing(3),
    borderRadius: "8px 0 0 8px",
    background: "#fff",
  },
  graphSection: {
    background: "#FFF",
    borderRadius: '0 8px 8px 0',
    padding: '24px 8px 24px 0'
  },
  payeeContact: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  headerTag: {
    fontSize: theme.spacing(3),
    color: "#0B1941",
  },
  captionText: {
    fontSize: 14,
    color: "#9E9E9E",
  },
  textColor: {
    color: "#0B1941",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  infoIcon: {
    marginLeft: theme.spacing(1),
    verticalAlign: 'middle'
  },
  checkedBorder: {
    borderRadius: "50%",
    border: "solid 3px #008CE6",
  },
  coutrySeclectionBox: {
    "& .countryBox": {
      display: "flex",
      cursor: "pointer",
      marginRight: 25,
      "& img": {
        float: "left",
        border: "2px solid rgba(0,0,0,0)",
        borderRadius: "50%",
      },
      "& h4": {
        float: "left",
        color: "#7F7F7F",
        fontSize: 14,
        margin: "8px 0 0 10px",
        whiteSpace: "nowrap",
        width: "110px",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      "&[active='true']": {
        "& img": {
          border: "2px solid #002D72",
          boxShadow: "0 0 1px #002D72 inset",
        },
        "& h4": {
          color: "#002D72",
          fontWeight: "bold",
        },
      },
      "&:last-child": {
        marginRight: 0,
      },
    },
  },
  linkText: {
    fontSize: 14,
    color: "#4C4C4C",
    textDecoration: "underline",
    cursor: "pointer",
  },
  seeMorelink: {
    color: "#008ce6",
    cursor: "pointer",
  },
  yearDropdown: {
    paddingTop: theme.spacing(1),
    "& .MuiSelect-selectMenu": {
      width: "70px",
      fontSize: 14,
      boxShadow: "0px 0px 8px rgb(0 0 0 / 14%)",
      borderRadius: "20px",
      padding: "5px 16px",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "none",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none",
    },
  },
  riskModal: {
    '& .MuiDialog-paper': {
      borderRadius: theme.spacing(1)
    }
  },
  modalHeading: {
    fontSize: 24,
    textAlign: 'center',
    color: '#0B1941'
  },
  modalSubHeading: {
    textAlign: 'center',
    color: '#4C4C4C',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  redcolorText: {
    color: '#f44336',
    display: 'inline-flex'
  },
  border: {
    borderLeft: 'solid 1px #9E9E9E',
    paddingLeft: 16,
    height: '100%'
  },
  actionButton: {
    textTransform: 'capitalize'
  },
  workBreak: {
    wordBreak: 'break-word'
  }
});
