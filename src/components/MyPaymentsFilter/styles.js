export const styles = (theme) => ({
  center: {
    display: 'flex',
    justifyContent: 'center'
  },
  filterText: {
    color: theme.palette.primary.grey,
    fontSize: "18px",
    letterSpacing: "0.25px",
    margin: "10px 0"
  },
  itemSelected: {
    border: "2px solid ",
    margin: "0px 10px 5px 0px",
    fontSize: "14px",
    fontWeight: "500"
  },
  item: {
    margin: "0px 15px 5px 0px",
    fontSize: "14px",
    background: theme.palette.background.default,
    border: "none",
    fontWeight: "500",
    color: theme.palette.text.black
  },
  imgIcon: {
    width: "13px",
    height: "12px"
  },
  btnScpace: {
    fontSize: '14px !important'
  },
  filterAccordion: {
    '& .MuiPaper-root': {
      boxShadow: 'none',
      borderBottom: 'solid 1px rgba(0, 0, 0, 0.12)'
    },
    '& .MuiAccordionDetails-root, .MuiAccordionSummary-root': {
      padding: 0
    },
    '& .MuiAccordion-root.Mui-expanded': {
      margin: 0
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: 0
    },
    '& .MuiAccordionSummary-root.Mui-expanded': {
      minHeight: 'auto'
    }
  },
  bottomPadd: {
    paddingBottom: theme.spacing(2)
  },
  accHeading: {
    fontSize: 14,
    color: '#4C4C4C'
  },
  accRadio: {
    color: '#4C4C4C',
    '& .MuiFormControlLabel-label': {
      fontSize: 14
    }
  },
  helperText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontStyle: 'italic'
  }
});
