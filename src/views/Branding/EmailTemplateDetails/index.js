import React from "react";
import { connect } from "react-redux";
import { AlertDialog, ContentDialog } from "../../../components/Dialogs";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  TextField,
} from "@material-ui/core";
import JoditEditor from "jodit-react";
import {
  saveEmailTemplates,
} from "~/redux/helpers/branding";
import "./styles.scss";
import { withTranslation } from 'react-i18next';

class EmailTemplateDetails extends React.Component {
  state = {
    btnLoader: false,
    message: "",
    flag: false,
    htmlMode: false,
    showPreview: false,
    data: {},
    tokens: [],
  };  

  showPreview() {
    this.setState({ showPreview: true });
  }

  hidePreview() {
    this.setState({ showPreview: false });
  }

  componentDidMount() {
    const { templateObject } = this.props;
    this.setState({ data: templateObject });    
  }

  handleInput(e) {
    let keyName = e.target.name;
    const { data } = this.state;
    data[keyName] = e.target.value;
    this.setState({ ...this.state });
  }

  handleEditor(value) {
    const { data } = this.state;
    data["body"] = value;
    this.setState({ ...this.state });
  }

  saveDetails() {
    const { data } = this.state;
    const payload = data;
    this.setState({ btnLoader: true }, () => {
      saveEmailTemplates(payload).then((response) => {
        this.setDialogMessage(true, response.message);
        this.setState({ btnLoader: false });
      });
    });
  }

  setDialogMessage(flag, message) {
    this.setState({ message: message, flag: true });
  }

  hideAlertMessage() {
    this.setState({ message: "", flag: false });
  }

  copy(text) {
    navigator.clipboard.writeText(text);
  }

  render() {
    const { t, templateObject } = this.props;    
    const {
      flag,
      message,
      btnLoader,
      showPreview,      
      htmlMode,
    } = this.state;
    const { body, subject } = this.state.data;
    const config = {
      readonly: htmlMode, // all options from https://xdsoft.net/jodit/doc/
    };
  
    const tokenArray = templateObject?templateObject['templateData.tokens']?.split(', ') : [];
    return (
      <div className={""}>
        <Grid>
          <Box my={0}>
            <Card>
              <Box py={5} px={5}>
                <Box
                  className="tabs"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Box>
                    <ul style={{ display: "flex" }}>
                      <Box>
                        <li
                          onClick={() => this.setState({ htmlMode: false })}
                          style={
                            !htmlMode
                              ? {
                                borderBottom: "3px solid #008CE6",
                                color: "#008CE6",
                              }
                              : { border: "none" }
                          }
                        >
                          {t('componentData.emailTemplateDetail.editorTxt')}
                        </li>
                      </Box>
                      <Box ml={5}>
                        <li
                          onClick={() => this.setState({ htmlMode: true })}
                          style={
                            htmlMode
                              ? {
                                borderBottom: "3px solid #008CE6",
                                color: "#008CE6",
                              }
                              : { border: "none" }
                          }
                        >
                          {t('componentData.emailTemplateDetail.htmlTxt')}
                        </li>
                      </Box>
                    </ul>
                  </Box>
                  <Box>
                    <Button
                      className="previewBtn"
                      onClick={this.showPreview.bind(this)}
                    >
                      {t('componentData.emailTemplateDetail.previewButtonTxt')}
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={5} style={{ marginTop: "5px" }}>
                  <Grid item xs={5} sm={5}>
                    {
                      <Box>
                        <Box className="subheading">
                          {t('componentData.emailTemplateDetail.emailTypeTxt')}
                        </Box>
                        <Box my={5} style={{ width: "100%" }}>
                          {/* <TextField
                          fullWidth={true}
                          autoComplete="off"
                          value={subject}
                          name="subject"
                          variant="outlined"
                          placeholder={"Enter Email Subject"}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 100,
                          }}
                          className={""}
                        /> */}
                          <TextField
                            label={t('componentData.emailTemplateDetail.emailSubjTxt')}
                            id="outlined-size-normal"
                            value={subject || ""}
                            name="subject"
                            variant="outlined"
                            placeholder={t('componentData.emailTemplateDetail.paymentReceiveTxt')}
                            onChange={(e) => this.handleInput(e)}
                            inputProps={{
                              maxLength: 100,
                            }}
                            style={{
                              width: "100%",
                            }}
                          />
                        </Box>
                      </Box>
                    }
                    {htmlMode && (
                      <Grid style={{ display: "block" }}>
                        <textarea
                          rows={15}
                          style={{
                            background: "black",
                            color: "white",
                            width: "100%",
                          }}
                          onChange={(e) =>
                            this.setState({
                              data: {
                                ...this.state.data,
                                body: e.target.value,
                              },
                            })
                          }
                        >
                          {this.state.data.body}
                        </textarea>
                        {/* <Editor
                          value={this.state.data.body}
                          onValueChange={code => this.setState({
                            data: {
                              ...this.state.data,
                              body: code,
                            },
                          })}
                          
                          padding={10}
                          style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                          }}
                        /> */}
                      </Grid>
                    )}
                    {/* {<Box my={5}>
                                            <TextField
                                                fullWidth={true}
                                                autoComplete="off"
                                                value={source}
                                                name='source'
                                                label="Sender Email*"
                                                onChange={(e) => this.handleInput(e)}
                                                dir='horizontal'
                                                size="small"
                                                inputProps={{
                                                    maxLength: 100
                                                }}
                                                className={""}
                                            />
                                        </Box>} */}
                  </Grid>

                  {/* <CKEditor
                                            editor={ClassicEditor}
                                            data={html}
                                            // onInit={editor => {
                                            //     // You can store the "editor" and use when it is needed.
                                            //     console.log('Editor is ready to use!', editor);
                                            // }}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                this.setState({ html: data });
                                                //console.log({ event, editor, data });
                                            }}
                                        // onBlur={(event, editor) => {
                                        //     console.log('Blur.', editor);
                                        // }}
                                        // onFocus={(event, editor) => {
                                        //     console.log('Focus.', editor);
                                        // }}
                                        />

                                    </Grid> */}

                  <Grid item xs={7} sm={7}>
                    <h3 className="tempHeading">{t('componentData.emailTemplateDetail.templateTokensTxt')}</h3>
                    <div>
                      <h4 className="tempTxt">
                        {t('componentData.emailTemplateDetail.enterCodeTxt')}
                      </h4>
                    </div>
                    <Box my={2}>
                      {tokenArray &&
                        tokenArray.map((token, index) => (
                          <Button
                            id={`textToCopy${index}`}
                            className="tokenTag"
                            onClick={(e) => {
                              this.copy(`${token}`);
                              //this.paste();
                            }}
                          >
                            {token}
                          </Button>
                        ))}
                    </Box>

                    <JoditEditor
                      ref={null}
                      value={body}
                      config={config}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={(newContent) => {
                        this.handleEditor(newContent)
                      }}
                      onChange={(newContent) => { }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid justify="end">
          <Box mt={4}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box px={5}>
                <Button
                  variant="contained"
                  color=""
                  className="cancelBtn"
                  onClick={() => this.props.onCancel()}
                >
                  {t('componentData.emailTemplateDetail.cancleBtn')}
                </Button>
              </Box>

              <Box px={2}>
                {btnLoader ? (
                  <CircularProgress color="primary" />
                ) : (
                  <Button
                    variant="contained"
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      width: "120px",
                      margin: "0px 10px 0 0",
                      fontSize: "14px",
                      border:'2px solid #0b1941'
                    }}
                    color="primary"
                    onClick={this.saveDetails.bind(this)}
                  >
                    {t('componentData.emailTemplateDetail.saveBtn')}
                  </Button>
                )}
              </Box>
            </div>
          </Box>
        </Grid>

        {flag && (
          <AlertDialog
            title={message}
            open={flag}
            onConfirm={() => this.hideAlertMessage()}
          />
        )}

        {showPreview && (
          <ContentDialog onConfirm={this.hidePreview.bind(this)}>
            <Box>
              <div
                dangerouslySetInnerHTML={{ __html: this.state.data.body }}
              ></div>
            </Box>
          </ContentDialog>
        )}
      </div>
    );
  }
}

export default withTranslation()(connect((state) => ({
  ...state.user,
  ...state.clientConfig,
}))(EmailTemplateDetails));
