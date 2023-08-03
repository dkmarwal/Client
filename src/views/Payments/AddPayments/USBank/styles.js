const styles = (theme) => ({
    container: {
      margin: "24px 48px",
      padding: theme.spacing(4)
    },
    navigationBox: {
      display: "flex",
      alignItems: "center",
      marginLeft: "48px",
      fontSize: "16px"
    },
    navigationBoxItem: {
      display: "flex",
      alignItems: "center",
      color: "#008CE6"
    },
    buttonGroup: {
      display: "flex",
      justifyContent:"center",
      gap: theme.spacing(4),
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(4)
    }
  });
  
  export default styles;
  