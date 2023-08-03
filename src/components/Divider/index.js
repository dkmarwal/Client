import React from "react";
import { Divider as MUIDivider, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  divider: {
    height: "1px",
    width: "100%",
  },
}));

const Divider = (props) => {
  const classes = useStyles();

  return (
    <MUIDivider variant="fullWidth" className={classes.divider} {...props} />
  );
};

export default Divider;
