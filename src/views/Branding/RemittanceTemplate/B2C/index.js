import React from "react";
import { connect } from "react-redux";
import { AlertDialog, ContentDialog } from "~/components/Dialogs";
import JoditEditor from "jodit-react";
import {
  Grid,
  Box,
  Card,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";
import RemittanceSelector from "~/modules/RemittanceSelector";
import {
  fetchRemittanceTemplateData,
  fetchTokens,
  saveRemittanceTemplateData,
} from "~/redux/helpers/branding";
//import CKEditor from '@ckeditor/ckeditor5-react';
import Checkbox from "~/components/Forms/Checkbox";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import { accessRights } from "~/config/accessRights";
import "./styles.scss";
import { withTranslation } from "react-i18next";

const code = `function add(a, b) {
  return a + b;
}
`;

class RemittanceTemplate extends React.Component {
  state = {
    html: "",
    footer: "",
    htmlMode: false,
    showPreview: false,
    tokens: [
      // isAdjustmentAmount: 1,
      // isAmountPaid: 1
      // isDeleted: false
      // : 1
       {
        id: 1,
        key: "ClientName",
        value: "isClientName",
        label: "Client Name",
        selected: false,
      },
      {
        id: 2,
        value: "isPayeeName",
        label: "Payee Name",
        key: "PayeeName",
        selected: false,
      },
      {
        id: 3,
        key: "PaymentType",
        value: "isPaymentType",
        label: "Payment Type",
        selected: false,
      },
      {
        id: 4,
        key: "PaymentID",
        value: "isPaymentId",
        label: "Payment ID",
        selected: false,
      },
      {
        id: 5,
        key: "Amount",
        value: "isAmount",
        label: "Amount",
        selected: false,
      },
      {
        id: 6,
        key: "PaymentDate",
        value: "isPaymentDate",
        label: "Payment Date",
        selected: false,
      },
      {
        id: 7,
        key: "PaymentReference",
        value: "isPaymentReference",
        label: "Payment Reference",
        selected: false,
      },
      {
        id: 8,
        key: "ValueDate",
        value: "isValueDate",
        label: "Value Date",
        selected: false,
      },
      {
        id: 9,
        key: "Notes",
        value: "isNotes",
        label: "Notes",
        selected: false,
      },
      {
        id: 10,
        key: "ClientPhoneNumber",
        value: "isClientPhoneNumber",
        label: "Client Phone Number",
        selected: false,
      },
      {
        id: 11,
        key: "ClientEmailAddress",
        value: "isClientEmailAddress",
        label: "Client Email Address",
        selected: false,
      },{
        id: 12,
        key: "LoginURL",
        value: "isLoginURL",
        label: "Login URL",
        selected: false,
      },
    ],
    tableTokens: [
      {
        id: 1,
        value: "isPayeeName",
        label: "Payee Name",
        key: "PayeeName",
        selected: false,
      },
      {
        id: 1,
        value: "isAchCompanyName",
        label: "ACH Company Name",
        key: "ACHCompanyName",
        selected: false,
      },
      {
        id: 1,
        key: "InvoiceNumber",
        value: "isInvoiceNo",
        label: "Invoice Number",
        selected: false,
      },
      {
        id: 1,
        key: "InvoiceDate",
        value: "isInvoiceDate",
        label: "Invoice Date",
        selected: false,
      },
      {
        id: 1,
        key: "InvoiceGrossAmount",
        value: "isInvoiceGrossAmount",
        label: "Invoice Gross Amount",
        selected: false,
      },
      {
        id: 1,
        key: "DiscountAmount",
        value: "isDiscountAmount",
        label: "Discount Amount",
        selected: false,
      },
      {
        id: 1,
        key: "PurchaseOrder",
        value: "isPurchaseOrder",
        label: "Purchase Order",
        selected: false,
      },
      {
        id: 1,
        key: "AdjustmentAmount",
        value: "isAdjustmentAmount",
        label: "Adjustment Amount",
        selected: false,
      },
      {
        id: 1,
        key: "AdjustmentCode",
        value: "isAdjustmentCode",
        label: "Adjustment Code",
        selected: false,
      },
    ],
    btnLoader: false,
    message: "",
    flag: false,
  };

  setDialogMessage(flag, message) {
    this.setState({ message: message, flag: true });
  }

  hideAlertMessage() {
    this.setState({ message: "", flag: false });
  }

  componentDidMount() {
    this.getData();
    this.getTokens();
  }

  updateData() {
    const { html } = this.state;
    const payload = {
      remittance: html || "<div></div>",
    };
    this.setState({ btnLoader: true }, () => {
      saveRemittanceTemplateData(payload).then((response) => {
        this.setDialogMessage(true, response.message);
        this.setState({ btnLoader: false });
      });
    });
  }

  getTokens() {
    let clientId = this.props.user.userData.portalProfileId;
    fetchTokens(clientId, "remittance").then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message);
      }
      let obj =
        response.data &&
        response.data.rows &&
        response.data.rows.length > 0 &&
        response.data.rows[0];
      this.state.tokens.forEach((token) => {
        if (obj && obj[token && token.value] == 1) {
          token["selected"] = true;
        } else {
          token["selected"] = false;
        }
      });
      this.state.tableTokens.forEach((token) => {
        if (obj && obj[token && token.value] == 1) {
          token["selected"] = true;
        } else {
          token["selected"] = false;
        }
      });
      this.setState({ ...this.state }, () => { });
    });
  }

  getData() {
    fetchRemittanceTemplateData().then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message);
        return false;
      }
      this.setState({ html: response.data.remittance });
    });
  }

  handleEditorChange(evt) {
    this.setState({ html: evt.editor.getData() });
  }

  handleEditor(value) {
    this.setState({ html: value?.target?.innerHTML ?? value});
  }

  handleFooterEditor(value) {
    this.setState({ footer: value });
  }

  // returnStaticTable() {
  //   const { tableTokens, tokens } = this.state;
  //   return (
  //     <div>
  //       <Box my={5}>
  //         <div
  //           style={{
  //             display: "grid",
  //             gridTemplateColumns: "auto auto",
  //             padding: "10px",
  //             textAlign: "left",
  //             justifyContent: "flex-start",
  //             alignItems: "center",
  //           }}
  //         >
  //           {tokens
  //             .filter((t) => t.selected == true)
  //             .map((c) => (
  //               <div style={{ margin: "0 100px 10px 0" }}>
  //                 <span style={{ margin: "0 5px 0 0" }}>{c.label}</span>
  //               </div>
  //             ))}
  //         </div>

  //         <Box my={2}>
  //           <table>
  //             <thead>
  //               <tr>
  //                 {tableTokens
  //                   .filter((t) => t.selected == true)
  //                   .map((c) => (
  //                     <th
  //                       style={{
  //                         padding: "10px",
  //                         color: "#008CE6",
  //                         fontSize: "13px",
  //                       }}
  //                     >
  //                       {c.label}
  //                     </th>
  //                   ))}
  //               </tr>
  //             </thead>
  //           </table>
  //         </Box>
  //       </Box>
  //     </div>
  //   );
  // }

  copy(text) {
    navigator.clipboard.writeText(text);
  }

  showPreview() {
    this.setState({ showPreview: true });
  }

  hidePreview() {
    this.setState({ showPreview: false });
  }

  paste() {
    // if (window.clipboardData) {
    //   document.getElementById("txToPaste").value = window.clipboardData.getData(
    //     "Text"
    //   );
    // }
  }

  render() {
    const { t } = this.props;
    const { theme } = this.props.clientConfig.layout;
    const {
      html,
      btnLoader,
      flag,
      message,
      footer,
      showPreview,
      htmlMode,
    } = this.state;

    const { user } = this.props;
    const isBrandingRemmitanceEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["BRANDING_REMITTANCE_TEMPLATE_EDIT"]
        )) ||
      false;

    const config = {
      //readonly: htmlMode,
      readonly: !isBrandingRemmitanceEditEnabled,
      // all options from https://xdsoft.net/jodit/doc/
    };
    return (
      <div className={""}>
        <Grid>
          <Box my={2} mx={6}>
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
                          onClick={() => {
                            if (isBrandingRemmitanceEditEnabled) {
                              this.setState({ htmlMode: false });
                            }
                          }}
                          style={
                            !htmlMode
                              ? {
                                borderBottom: "3px solid #008CE6",
                                color: "#008CE6",
                              }
                              : { border: "none" }
                          }
                        >
                          {t("componentData.remittanceTemplate.editorTxt")}
                        </li>
                      </Box>
                      <Box mx={5}>
                        <li
                          onClick={() => {
                            if (isBrandingRemmitanceEditEnabled) {
                              this.setState({ htmlMode: true });
                            }
                          }}
                          style={
                            htmlMode
                              ? {
                                borderBottom: "3px solid #008CE6",
                                color: "#008CE6",
                              }
                              : { border: "none" }
                          }
                        >
                          {t("componentData.remittanceTemplate.htmlTxt")}
                        </li>
                      </Box>
                    </ul>
                  </Box>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={this.showPreview.bind(this)}
                      className="previewBtn"
                    >
                      {t("componentData.remittanceTemplate.previewBynTxt")}
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={5} style={{ marginTop: "5px" }}>
                  <Grid item xs={5} sm={5}>
                    {htmlMode ? (
                      <Grid>
                        {/* <textarea
                          rows={15}
                          style={{
                            background: "black",
                            color: "white",
                            width: "100%",
                          }}
                          onChange={(e) =>
                            this.setState({ html: e.target.value })
                          }
                        >
                          {this.state.html}
                        </textarea> */}

                        {/* <Editor
                          value={this.state.html}
                          onValueChange={code => this.setState({
                            html: code
                          })}
                          highlight={code => highlight(code, languages.js)}
                          padding={10}
                          style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                            background: "black",
                            color: "white",
                            height: "400px",
                          width: "100%",
                          }}
                        /> */}

                        <JoditEditor
                          ref={null}
                          id="htmlEditor"
                          value={html}
                          config={{
                            defaultMode: "2",
                            height: 500,
                            disablePlugins:
                              "table-keyboard-navigation,table, print, bold,delete, add-new-line,about, drag-and-drop,drag-and-drop-element,enter,error-messages,font,format-block, image-properties,image-processor,image,media,video,file,resize-cells,select-cells, redo-undo,error-messages,font,format-block, indent,hr,inline-popup,justify,limit,link,mobile, preview",
                          }}
                          tabIndex={1} // tabIndex of textarea
                          onBlur={
                            (newContent) => {this.handleEditor(newContent) }
                            // this.handleEditor(
                            //   newContent &&
                            //   newContent.target &&
                            //   newContent.target.innerHTML
                            // )}
                          } // preferred to use only this option to update the content for performance reasons
                          onChange={(newContent) => {
                            //this.handleEditor(newContent);
                          }}
                        />

                        <Box my={4}>
                          <h3>
                            {t(
                              "componentData.remittanceTemplate.TemplateTokens"
                            )}
                          </h3>
                          <div>
                            <h4 style={{ color: "grey" }}>
                              {t(
                                "componentData.remittanceTemplate.enterCodeTxt"
                              )}
                            </h4>
                          </div>
                          <Box my={2}>
                            {this.state.tokens.map((token, index) => (
                              <Button
                                id={`textToCopy${index}`}
                                className="tokenTag"
                                style={{
                                  border: "1px solid black",
                                  textTransform: "capitalize",
                                  padding: "3px 6px",
                                  margin: "10px 6px",
                                }}
                              // onClick={(e) => {
                              //   this.copy(`##${token && token.key}`);
                              //   //this.paste();
                              // }}
                              >
                                ##
                                {token && token.key}
                              </Button>
                            ))}
                          </Box>
                        </Box>
                      </Grid>
                    ) : (
                      <Accordion
                        square
                        expanded={true}
                        style={{ background: "#F6F6F6" }}
                      >
                        <AccordionSummary
                          // expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>
                            {t(
                              "componentData.remittanceTemplate.selectRemittanceParameters"
                            )}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            {t(
                              "componentData.remittanceTemplate.selectTokenTxt"
                            )}
                            <Box>
                              <Grid container spacing={2}>
                                {this.state.tokens &&
                                  this.state.tokens?.filter(item => item.key !== 'LoginURL')?.map((token, i) => (
                                    <Grid xs={6} sm={6} item>
                                      <Checkbox
                                        onChange={(e) => { }}
                                        label={t(
                                          `componentData.remittanceTemplate.${token.key}`
                                        )}
                                        checked={token.selected}
                                        icon={""}
                                        index={i}
                                      />
                                    </Grid>
                                  ))}
                              </Grid>
                            </Box>
                          </Typography>
                        </AccordionDetails>

                        {/*<AccordionSummary
                          // expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>
                            {t(
                              "componentData.remittanceTemplate.selectRemittanceParameters"
                            )}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            {t(
                              "componentData.remittanceTemplate.tokensForRemittance"
                            )}
                            <Box>
                              <Grid container spacing={2}>
                                {this.state.tableTokens &&
                                  this.state.tableTokens.map((token, i) => (
                                    <Grid xs={6} sm={6} item>
                                      <Checkbox
                                        onChange={(e) => { }}
                                        label={t(
                                          `componentData.remittanceTemplate.${token.key}`
                                        )}
                                        checked={token.selected}
                                        icon={""}
                                        index={i}
                                      />
                                    </Grid>
                                  ))}
                              </Grid>
                            </Box>
                          </Typography>
                        </AccordionDetails> */}
                        </Accordion>
                    )}
                  </Grid>
                  <Grid item xs={7} sm={7}>
                    {!htmlMode && (
                      <Box>
                        <h3>
                          {t("componentData.remittanceTemplate.TemplateTokens")}
                        </h3>
                        <div>
                          <h4 style={{ color: "grey" }}>
                            {t("componentData.remittanceTemplate.enterCodeTxt")}
                          </h4>
                        </div>
                        <Box my={2}>
                          {this.state.tokens &&
                            this.state.tokens.map((token, index) => (
                              <Button
                                id={`textToCopy${index}`}
                                className="tokenTag"
                                style={{
                                  border: "1px solid black",
                                  textTransform: "capitalize",
                                  padding: "3px 6px",
                                  margin: "10px 6px",
                                  // background: token && token["selected"] === true  ? "#008CE6" : "#ffffff",
                                  // background: token && token["selected"] === true  ? "#008CE6" : "#ffffff"
                                }}
                                onClick={(e) => {
                                  if (isBrandingRemmitanceEditEnabled) {
                                    this.copy(`##${token && token.key}`);
                                  }
                                  //this.paste();
                                }}
                              >
                                ##
                                {token.key}
                              </Button>
                            ))}
                        </Box>
                      </Box>
                    )}
                    {/* <CKEditor
                      data={`${html}`}
                      type="classic"
                      onChange={this.handleEditorChange.bind(this)}
                    /> */}

                    <Box>
                      <JoditEditor
                        ref={null}
                        value={html}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) =>
                          this.handleEditor(newContent)
                        } // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => { }}
                      />
                      {/* <Grid>
                        <div>{this.returnStaticTable()}</div>
                      </Grid> */}
                      {/* <Box my={2}>
                        <JoditEditor
                          ref={null}
                          value={footer}
                          config={config}
                          tabIndex={1} // tabIndex of textarea
                          onBlur={(newContent) =>
                            this.handleFooterEditor(newContent && newContent.target && newContent.target.innerHTML)
                          } // preferred to use only this option to update the content for performance reasons
                          onChange={(newContent) => {}}
                        />
                      </Box> */}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={9} sm={9}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={html}
                      // onInit={editor => {
                      //     // You can store the "editor" and use when it is needed.
                    
                      // }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        this.setState({ html: data });
                      
                      }}
                      // onBlur={(event, editor) => {
                     
                      // }}
                      // onFocus={(event, editor) => {
                    
                      // }}
                    />
                  </Grid> */}
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
                <Button variant="outlined" color="primary">
                  {t("componentData.remittanceTemplate.cancleBtn")}
                </Button>
              </Box>

              {isBrandingRemmitanceEditEnabled && (
                <Box>
                  {btnLoader ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <Button
                      variant="contained"
                      disableElevation
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        margin: "0px 10px 0 0",
                      }}
                      color="primary"
                      onClick={this.updateData.bind(this)}
                    >
                      {t("componentData.remittanceTemplate.saveBtn")}
                    </Button>
                  )}
                </Box>
              )}
            </div>
            {/* )} */}
          </Box>

          {flag && (
            <AlertDialog
              title={message}
              open={flag}
              onConfirm={() => this.hideAlertMessage()}
            />
          )}

          {showPreview && (
            <ContentDialog onConfirm={this.hidePreview.bind(this)}>
              <div dangerouslySetInnerHTML={{ __html: this.state.html }}></div>

              {/* <Box>{this.returnStaticTable()}</Box> */}
              {/* <Box>
                <div
                  dangerouslySetInnerHTML={{ __html: this.state.footer }}
                ></div>
              </Box> */}
            </ContentDialog>
          )}
        </Grid>
      </div>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
  }))(RemittanceTemplate)
);
