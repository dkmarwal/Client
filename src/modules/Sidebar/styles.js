const styles = (theme) => ({
  sidebarContainer: {
    position: "fixed",
    paddingTop: "2.6rem",
    width: "4.375rem",
    backgroundColor: theme.palette.primary.main,
    height: "100vh",
    boxShadow: "0 0 10px #ddd",
    zIndex: 5,
  },
  sidebarMenu: {
    "& a span": {
      fontSize: "12px",
      display: "flex",
      textAlign: "center",
      wordBreak: "break-word",
      color: "white",
    },
  },
  sidebarItemContainer: {
    display: "block",
  },
  sidebarItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0.875rem 0rem",
    padding: "0.70rem 0.25rem",
    wordBreak: "break-word",
  },

  sidebarItemSelected: {
    backgroundColor: theme.palette.background.active,
  },
  sidebarItemNameSelected: {
    color: theme.palette.primary.main,
    "& span": {
      color: `${theme.palette.primary.main} !important`,
    },
  },
});

export default styles;
