import React, { Component } from "react";
import Notification from "~/components/Notification";
import {
  Box,
  Tooltip,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';

import { downloadBankFile } from "~/redux/helpers/files";
import GetAppIcon from "@material-ui/icons/GetApp";
import IconButton from "@material-ui/core/IconButton";
import { styles } from "./styles";
import * as FileSaver from "file-saver";

class BankFileDetails extends Component {
  state = {
    page: 0,
    rowsPerPage: 3,
    rows: [],
    error: false,
  };
  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  componentDidMount() {
    const { bankData } = this.props;
    const arr = [];
    bankData.map((item) => {
      {
        arr.push({
          id: item.BFileID || "--",
          date: item.ReleaseDate || "--",
          icon: item.BankFileName,
        });
      }
    });
    this.setState({
      rows: arr,
    });
  }
  downLoadFile = async (id) => {
    const { t } = this.props;
    downloadBankFile(id)
      .then((response) => {
        if (response && response.data && response.data.error) {
          this.setState({ error: t('componentData.bankFileDetail.FileNotExists') });
          return;
        }

        const fileName = `${response.headers["x-file-name"]}`;

        const type = response.headers["content-type"];
        const data = new Blob([response.data], {
          type: type,
          encoding: "UTF-8",
        });
        FileSaver.saveAs(data, fileName);

        this.setState({ error: false });
      })
      .catch((error) => {
        this.setState({ error: t('componentData.bankFileDetail.FileNotExists') });
      });
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: +event.target.value,
    });
  };

  render() {
    const { classes, canDownload } = this.props;
    const { rows, error } = this.state;
    const { t } = this.props;

    return (
      <>
        <Box>
          <Box
            display="flex"
            justifyContent="center"
            pb={2}
            alignItems="center"
            className={classes.titleBg}
          >
            <Box fontSize={16} width="10%">
              {" "}
            </Box>
            <Box fontSize={16} width="30%">
              {" "}
              {t('componentData.bankFileDetail.ID')}
            </Box>
            <Box fontSize={16} width="50%">
            {t('componentData.bankFileDetail.Released')}
            </Box>
            <Box fontSize={16} width="10%">
              {" "}
            </Box>
          </Box>
          {rows.map((row) => {
            return (
              <>
                <Box display="flex" justifyContent="center" py={2}>
                  <Box fontSize={16} width="10%">
                    {" "}
                    <Tooltip title={row.icon} arrow placement="right">
                      <img
                        src={require(`~/assets/icons/${row.icon}_Blue.svg`)}
                        className={classes.TitleText}
                        alt=""
                      />
                    </Tooltip>
                  </Box>
                  <Box fontSize={16} width="30%">
                    {" "}
                    {row.id}
                  </Box>
                  <Box fontSize={16} width="50%">
                    {row.date}
                  </Box>
                  {canDownload && (
                    <Box
                      fontSize={16}
                      width="10%"
                      onClick={() => this.downLoadFile(parseInt(row.id))}
                    >
                      <IconButton
                        color="primary"
                        aria-label="download"
                        component="span"
                        size="small"
                      >
                        <GetAppIcon color="secondary" fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </>
            );
          })}
        </Box>
        {error && <Notification variant="error" message={error} />}
      </>
    );
  }
}

export default withTranslation()(withStyles(styles)(BankFileDetails));
