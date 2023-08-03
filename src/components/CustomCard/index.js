import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { CardActionArea, Grid } from "@material-ui/core";

const UseCardHeaderStyle = makeStyles((theme) => ({
  root: {
    color: "rgba(0,0,0,0.87)",
    fontSize: "20px",
    letterSpacing: "0.63px",
    lineHeight: "24px",
    padding: "10px 10px 30px 10px",
  },
}));

const UseCardContentStyle = makeStyles((theme) => ({
  root: {
    color: `${theme.palette.primary.main}`,
    fontSize: "14px",
    letterSpacing: "0.14px",
    lineHeight: "24px",
    padding: "10px",
  },
}));

const UseCardFooterStyle = makeStyles((theme) => ({
  root: {
    color: `${theme.palette.primary.grey}`,
    fontSize: "14px",
    letterSpacing: "0.5px",
    lineHeight: "16px",
    padding: "10px",
    display: "block",
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    heigth: "100%",
  },
  gridClass: {
    border: `2px solid ${theme.palette.primary.light}`,
  },
}));

export default function CustomCard({
  Data,
  title,
  content,
  footer,
  onClickHandler,
  payeeActionTypeId,
  selectedCard,
  isNotificationRead,
}) {
  const classes = useStyles();
  const UseCardHeaderClasses = UseCardHeaderStyle();
  const UseCardContentClasses = UseCardContentStyle();
  const UseCardFooterClasses = UseCardFooterStyle();
  const onClick = () => {
    onClickHandler(Data);
  };
  return (
    <Card className={classes.root} id={payeeActionTypeId} onClick={onClick}>
      <Grid
        className={selectedCard === payeeActionTypeId ? classes.gridClass : ""}
      >
        <CardActionArea>
          <CardHeader classes={UseCardHeaderClasses} title={title} />
          <CardContent classes={UseCardContentClasses}>{content}</CardContent>
          <CardActions classes={UseCardFooterClasses}>{footer}</CardActions>
        </CardActionArea>
      </Grid>
    </Card>
  );
}
