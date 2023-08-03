import React, { Component } from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";

import { Checkbox } from "~/components/Forms";

const styles = (theme) => ({
  contentBackground: {
    backgroundColor: theme.palette.background.header,
  },
  primaryDark: {
    color: theme.palette.primary.dark,
  },
  paymentTitle: {
    color: theme.palette.primary.main,
    fontSize: "16px",
  },
  spaceImg: { padding: "0 10px 0 0", width: 24, height: 24 },
  spaceText: { padding: " 0 0 10px 0", width: 32, height: 32 },
});

class ERPSelector extends Component {
  render() {
    const {
      options,
      classes,
      title,
      px,
      py,
      isBulkFrequency,
      isLeftIcon = false,
    } = this.props;
    return (
      <Box px={px || 0} py={py || 0} style={{ borderRadius: "4px" }}>
        {isBulkFrequency ? (
          <Typography variant="div" className={classes.paymentTitle}>
            {title}
          </Typography>
        ) : (
          <Typography variant="h4" className={classes.primaryDark}>
            {title}
          </Typography>
        )}
        <Box>
          <Box my={2} color="#4C4C4C">
            <Grid container spacing={3}>
              {options &&
                options.map((option, index) => (
                  <Grid key={`payment-mode-${index}`} item xs={3} sm={3}>
                    <Checkbox
                      checked={option.selected}
                      label={option.label}
                      isLeftIcon={isLeftIcon}
                      icon={
                        option.icon &&
                        (!option.selected ? (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            {" "}
                            <img
                              src={option.icon}
                              alt={option.label}
                              className={clsx({
                                [classes.spaceImg]: isLeftIcon == true,
                                [classes.spaceText]: isLeftIcon == false,
                              })}
                            />{" "}
                          </Box>
                        ) : (
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <img
                              src={option.iconTypeSelected}
                              alt={option.label}
                              className={clsx({
                                [classes.spaceImg]: isLeftIcon == true,
                                [classes.spaceText]: isLeftIcon == false,
                              })}
                            />
                          </Box>
                        ))
                      }
                      index={index}
                      onChange={(e, index, isChecked) =>
                        this.props.onChange &&
                        this.props.onChange(e, index, isChecked, option)
                      }
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default withStyles(styles)(ERPSelector);
