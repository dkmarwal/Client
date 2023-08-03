import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";

class DefaultRemitToID extends Component {
  state = {};
  render() {
    const { defaultSupplierIds, onChange } = this.props;
    return (
      <>
        {defaultSupplierIds.length > 0 &&
          defaultSupplierIds.map((item, index) => {
            return (
              <Grid item xs={4}>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value={item.entityIdentifier}
                      control={
                        <Checkbox color="primary" disabled={item.disabled} />
                      }
                      label={item.entityIdentifier}
                      labelPlacement="start"
                      onChange={onChange}
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            );
          })}
      </>
    );
  }
}

export default connect((state) => ({
  ...state.clientConfig,
}))(withStyles(styles)(DefaultRemitToID));
