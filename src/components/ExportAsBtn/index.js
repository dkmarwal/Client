import React from 'react';
import { Button, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

const useStyles = makeStyles(theme => ({
  iconText: {
    fontWeight: 600,
    marginLeft: 3,
    textTransform: "capitalize",
  },
}));

export default function ExportAsBtn(props) {

  const classes = useStyles(props);

  return (
    <>
      <Button
        color={"primary"}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        <Typography variant="h6" className={classes.iconText}>
          {props.btnName}
        </Typography>
        <ArrowRightIcon fontSize="small" />
      </Button>
    </>
  )
}
