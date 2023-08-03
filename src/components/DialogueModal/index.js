import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "~/components/Forms";

const styles = (theme) => ({
  contentBackground: {
    backgroundColor: theme.palette.background.header,
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.15)",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    flexBasis: "50%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexBasis: "33%",
  },
  checkedIcon: {
    position: "absolute",
    right: "45%",
  },
  outlineIcon: {
    position: "absolute",
    right: "2%",
    top: "2%",
  },
});
class DialogueModal extends Component {
  render() {
    const { classes, title, confirmText, onConfirm, onCancel, open } =
      this.props;
    return (
      <Dialog open={open} className={classes.dialogue}>
        <DialogTitle id="alert-dialog-title">
          <Box mx={1} my={2}>
            <img
              className={classes.checkedIcon}
              src={require(`~/assets/icons/ic_check_circle.svg`)}
              alt=""
            />
            <img
              className={classes.outlineIcon}
              src={require(`~/assets/icons/ic_add_circle_outline.svg`)}
              alt=""
              onClick={onCancel}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box m={3} className={classes.titleContainer}>
            <Typography variant="h3" color={"primary"}>
              <Box lineHeight={1.4}>{title}</Box>
            </Typography>
          </Box>
          <Box m={3} className={classes.buttonContainer}>
            <Button
              type="submit"
              fullWidth={false}
              variant="contained"
              color="primary"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
}
export default withStyles(styles)(DialogueModal);
