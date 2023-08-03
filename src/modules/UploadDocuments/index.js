import React, { Component } from "react";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import {
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
} from "@material-ui/core";

import Notification from "~/components/Notification";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { connect } from "react-redux";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { withTranslation } from "react-i18next";
import CancelIcon from "@material-ui/icons/Cancel";
import JoditEditor from "jodit-react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

class UploadDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadFile: null,
      isCheked: false,
      html: "",
      isPopupOpen: false,
      popupType: 1,
      notificationVariant: null,
      notificationMSg: null,
      isAPiFile: null,
    };
  }

  componentDidMount() {
    const { apiData } = this.props;
    if (Object.keys(apiData).length > 0) {
      this.setAPIData(apiData);
    }
    this.sendComponentData();
  }

  componentDidUpdate(prevProps) {    
    // if (
    //   this.props.apiData != prevProps.apiData &&
    //   Object.keys(prevProps.apiData).length > 0
    // ) {
    //   this.setAPIData(prevProps.apiData);
    // }
  }

  handleUploadClick = (e) => {
    const fileSize = this.getUploadedFileSize(e.target.files[0]);
    const fileType = e.target.files[0].type;

    if (fileType !== "application/pdf") {
      this.setState({
        notificationVariant: "error",
        notificationMSg: this.props.paraTxt2,
      });
      return false;
    }

    if (fileSize) {
      this.setState(
        {
          uploadFile: e.target.files[0],
          isAPiFile: false,
        },
        () => {
          this.sendComponentData();
        }
      );
    } else {
      this.setState({
        notificationVariant: "error",
        notificationMSg: this.props.fileSizeTxt,
      });
    }
    e.currentTarget.value = "";
  };

  getUploadedFileSize = (file) => {
    const fSizeInMB = file.size / (1024 * 1024).toFixed(2);
    if (fSizeInMB > 5) {
      return false;
    } else {
      return true;
    }
  };

  removeFile = () => {
    this.setState(
      {
        uploadFile: null,
      },
      () => {
        this.sendComponentData();
      }
    );
  };

  handleEditorCheck = (e) => {
    const { uploadFile, html } = this.state;
    if (Boolean(uploadFile) || Boolean(html)) {
      this.setState({
        isPopupOpen: true,
        popupType: e.currentTarget.checked ? 1 : 2,
      });
    } else {
      this.setState(
        {
          isCheked: e.currentTarget.checked,
        },
        () => {
          this.sendComponentData();
        }
      );
    }
  };

  handleHTMLEditor = (content) => {
    this.setState(
      {
        html: content?.target?.innerHTML ?? content,
      },
      () => {
        this.sendComponentData();
      }
    );
  };

  handleAgreeClose = () => {
    const checkStatus = this.state.isCheked;
    this.setState(
      {
        isPopupOpen: false,
        isCheked: !checkStatus,
        popupType: 1,
      },
      () => {
        this.sendComponentData();
      }
    );
  };

  handleClose = () => {
    this.setState({
      isPopupOpen: false,
    });
  };

  sendComponentData = () => {
    const { uploadFile, html, isCheked, isAPiFile } = this.state;
    this.props.documentData({
      isCheked: isCheked || false,
      fileData: uploadFile || null,
      htmlData: html || null,
      isAPiFile: isAPiFile || false,
    });
  };

  setAPIData = (apiData) => {
    if (apiData.type === "file") {
      this.setState(
        {
          uploadFile: apiData,
          name: apiData.name,
          size: apiData.size,
          popupType: 1,
          html: null,
          isCheked: false,
          isAPiFile: true,
        },
        () => {
          this.sendComponentData();
        }
      );
    } else if (apiData.type === "html") {
      let hasContent = apiData?.data?.replace(/(<([^>]+)>)/gi, "");
      hasContent = hasContent?.replace(/&nbsp;/g, "");
      hasContent = hasContent?.trim("");      
      this.setState(
        {
          isCheked: !Boolean(hasContent) ? false : true,
          html: !Boolean(hasContent) ? "" : apiData.data,
          popupType: 2,
          uploadFile: null,
        },
        () => {
          this.sendComponentData();
        }
      );
    }
  };

  render() {
    const {
      classes,
      headingTxt,
      paraTxt,
      noFileTxt,
      uploadBtnTxt,
      orTxt,
      editorCheckTxt,
      popupBodyTxt1,
      popupBodyTxt2,
      popupYesBtn,
      paraTxt2,
    } = this.props;

    const {
      uploadFile,
      isCheked,
      html,
      isPopupOpen,
      popupType,
      notificationVariant,
      notificationMSg,
    } = this.state;

    return (
      <>
        <Box className={classes.documentArea}>
          <Typography variant="h1" className={classes.documenHeadingTxt}>
            {headingTxt}
          </Typography>

          <Typography className={classes.documenParaTxt}>
            {paraTxt} <br />
            {paraTxt2}
          </Typography>

          <Box className={classes.docUploadBox} disabled={isCheked}>
            <input
              accept=".pdf"
              className={classes.uploadInput}
              id="contained-button-file"
              multiple={false}
              type="file"
              onChange={(e) => this.handleUploadClick(e)}
            />

            <Typography variant="body2" className={classes.fileName}>
              <span title={uploadFile?.name ?? noFileTxt}>
                {uploadFile?.name ?? noFileTxt}{" "}
                {Boolean(uploadFile) &&
                Boolean(uploadFile.size) &&
                Boolean(uploadFile.name)
                  ? `(${Number(uploadFile.size / 1024).toFixed(2)} kb)`
                  : null}
              </span>

              {Boolean(uploadFile) && Boolean(uploadFile.name) ? (
                <CancelIcon
                  className={classes.removeFile}
                  onClick={this.removeFile}
                />
              ) : null}
            </Typography>

            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUploadIcon />}
                className={classes.uploadBtn}
              >
                {uploadBtnTxt}
              </Button>
            </label>
          </Box>

          <Box className={classes.ORBox}>
            <Typography variant="h1">{orTxt}</Typography>
            <span></span>
          </Box>

          <Box className={classes.editorCheckBox}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCheked}
                  onChange={(e) => this.handleEditorCheck(e)}
                  name="checkedB"
                  color="primary"
                />
              }
              label={editorCheckTxt}
            />
          </Box>

          <Box className={classes.editorBoxArea} disabled={!isCheked}>
            <JoditEditor
              ref={null}
              id="htmlEditor"
              value={html}
              config={{
                readonly: false,
                defaultMode: "1",
                height: 400,
                showCharsCounter: true,
                showWordsCounter: true,
                showXPathInStatusbar: false,
                askBeforePasteHTML: false,
                disablePlugins:
                  "table-keyboard-navigation, print,delete, add-new-line,about, drag-and-drop,drag-and-drop-element,enter,error-messages,format-block, image-properties,image-processor,media,video,file,resize-cells,select-cells, redo-undo,error-messages,format-block, indent,hr,inline-popup,limit, font, fullsize, search",
              }}
              tabIndex={1}
              onBlur={(newContent) => {
                this.handleHTMLEditor(newContent);
              }}
              onChange={(newContent) => {}}
            />
          </Box>

          <Dialog
            open={isPopupOpen}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            className={classes.dialogBox}
          >
            <InfoOutlinedIcon className="infoIcon" />
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {popupType === 1 ? popupBodyTxt1 : popupBodyTxt2}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleClose}
                color="primary"
                className="closeBtn"
              >
                <CloseOutlinedIcon />
              </Button>
              <Button
                onClick={this.handleAgreeClose}
                color="primary"
                className="OKBtn"
              >
                {popupYesBtn}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        {notificationVariant && (
          <Notification
            variant={notificationVariant}
            message={notificationMSg}
            handleClose={() => {
              this.setState({ notificationVariant: null });
            }}
          />
        )}
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(withStyles(styles)(UploadDocuments))
);
