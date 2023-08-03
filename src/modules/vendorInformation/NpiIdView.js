import React, { Component } from "react";
import { Grid, Box, Card, CircularProgress, Chip } from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { getNpiIdList } from "~/redux/helpers/suppliers";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

class NpiIdView extends Component {
  state = { list: [], isLoading: false };

  componentDidMount() {
    this.fetchNPIList();
  }

  fetchNPIList = (id) => {
    const { payeeId, actPayeeId } = this.props;
    this.setState(
      {
        isLoading: true,
      },
      () => {
        getNpiIdList(payeeId, actPayeeId)
          .then((response) => {
            this.setState({ list: response?.data || [], isLoading: false });
          })
          .catch((error) => {
            this.setState({ list: [], isLoading: false });
          });
      }
    );
  };

  showNpiIdList = () => {
    const { list } = this.state;
    const { t } = this.props;

    if (list.length > 0) {
      return list.map((item) => {
        const npiIds = item.npiId;
        if (npiIds?.length > 0) {
          return this.showItems(npiIds);
        } else {
          return (
            <Box display="block" textAlign="center" width={1} my={6}>
              <img
                src={require("~/assets/icons/bankFile_No_data.svg")}
                alt="no_data"
              />
              <Box py={3} color="#A1A1A1" fontSize={14} display="block">
                {t("componentData.customTable.NoDatatoShow")}
              </Box>
            </Box>
          );
        }
      });
    } else {
      return (
        <Box display="block" textAlign="center" width={1} my={6}>
          <img
            src={require("~/assets/icons/bankFile_No_data.svg")}
            alt="no_data"
          />
          <Box py={3} color="#A1A1A1" fontSize={14} display="block">
            {t("componentData.customTable.NoDatatoShow")}
          </Box>
        </Box>
      );
    }
  };

  showItems = (list) => {
    if (list.length > 0) {
      const newList = list.map((item, index) => {
        return (
          <Box p={1} display="flex" key={index}>
            <Chip label={item} disabled />
          </Box>
        );
      });

      return newList;
    }
  };

  render() {
    const { classes } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <Grid container className={classes.details}>
          <Grid item xs={12} md={12} style={{ marginBottom: 24 }}>
            <Card className={classes.card}>
              <Box className="loader-container">
                <CircularProgress color="primary" />
              </Box>
            </Card>
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid container className={classes.details}>
        <Grid item xs={12} md={12} style={{ marginBottom: 24 }}>
          <Card className={classes.card}>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="flex-start"
              alignItems="flex-start"
              width={1}
              flexDirection="row"
              p={2}
            >
              {this.showNpiIdList()}
            </Box>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.clientConfig,
    ...state.user,
  }))(withStyles(styles)(NpiIdView))
);
