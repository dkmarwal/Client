import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: theme.spacing(1),
  },
  card: {
    backgroundColor: "#FFFFFF",
    minHeight:'250px',
    borderRadius: (props) => props.borderRadius || "1.25rem",
    padding: (props) => props.padding || "1rem 3.625rem",
    margin: (props) => props.margin || "0 0 1rem 0",
    [theme.breakpoints.down("sm")]: {
      padding: (props) => props.mobPad || "1rem",
      margin: (props) => props.mobMar || "0",
      borderRadius: (props) => props.mobRadius || "1rem",
    },
  },
}));

export default function WhiteCard({ children, ...rest }) {
  const classes = useStyles(rest);
  return <div className={classes.card}>{children}</div>;
}
