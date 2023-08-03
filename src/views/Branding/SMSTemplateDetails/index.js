import React from 'react';
import { connect } from 'react-redux';
import { AlertDialog, ContentDialog } from '../../../components/Dialogs';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  TextField,
} from '@material-ui/core';
import './styles.scss';
import { withTranslation } from 'react-i18next';
import { saveSMSTemplates } from '~/redux/helpers/B2C/branding';


class SMSTemplateDetails extends React.Component {
  state = {
    btnLoader: false,
    message: '',
    flag: false,
    showPreview: false,
    data: {},
    tokens: [],
    smsTemplateValue: undefined,
  };  

  showPreview() {
    this.setState({ showPreview: true });
  }

  hidePreview() {
    this.setState({ showPreview: false });
  }

  componentDidMount() {
    const { templateObject } = this.props;
    this.setState({ data: templateObject, smsTemplateValue: templateObject?.body });    
  }

  saveDetails() {
    const { data, smsTemplateValue } = this.state;
    const payload = { ...data, body: smsTemplateValue };
    if (smsTemplateValue?.trim()?.length) {
      this.setState({ btnLoader: true }, () => {
        saveSMSTemplates(payload).then((response) => {
          this.setDialogMessage(true, response.message);
          this.setState({ btnLoader: false });
        });
      });
    } else {
      this.setDialogMessage(
        true,
        'Body of the Email template cannot be empty!'
      );
      this.setState({ btnLoader: false });
    }
  }

  setDialogMessage(flag, message) {
    this.setState({ message: message, flag: true });
  }

  hideAlertMessage() {
    this.setState({ message: '', flag: false });
  }

  copy(text) {
    navigator.clipboard.writeText(text);
  }
  handleSMSTemplateChange = ({ target }) => {
    const { value } = target;
    this.setState({
      smsTemplateValue: value,
    });
  };

  render() {
    const { t, templateObject } = this.props;
    const { flag, message, btnLoader, showPreview, smsTemplateValue } =
      this.state;
    const { subject } = this.state.data;
    const tokenArray = templateObject?templateObject['templateData.tokens']?.split(', ') : [];
    return (
      <div>
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
                    <ul style={{ display: 'flex' }}>
                      <Box>
                        <li
                          style={{
                            borderBottom: '3px solid #008CE6',
                            color: '#008CE6',
                          }}
                        >
                          {t('componentData.smsTemplateDetail.editorTxt')}
                        </li>
                      </Box>
                    </ul>
                  </Box>
                  <Box>
                    <Button
                      className="previewBtn"
                      onClick={this.showPreview.bind(this)}
                    >
                      {t('componentData.smsTemplateDetail.previewButtonTxt')}
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={5} style={{ marginTop: '5px' }}>
                  <Grid item xs={5} sm={5}>
                    {
                      <Box>
                        <Box my={1} style={{ width: '100%' }}>
                          <TextField
                            label={t(
                              'componentData.smsTemplateDetail.smsTemplateText'
                            )}
                            id="outlined-size-normal"
                            value={subject || ''}
                            name="subject"
                            variant="outlined"
                            disabled
                            style={{
                              width: '100%',
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  </Grid>

                  <Grid item xs={7} sm={7}>
                    <h3 className="tempHeading">
                      {t('componentData.smsTemplateDetail.templateTokensTxt')}
                    </h3>
                    <div>
                      <h4 className="tempTxt">
                        {t('componentData.smsTemplateDetail.enterCodeText')}
                      </h4>
                    </div>
                    <Box my={2}>
                      {
                        tokenArray &&
                        tokenArray.map((token, index) => (
                          <Button
                            key={`textToCopy${index}`}
                            id={`textToCopy${index}`}
                            className="tokenTag"
                            onClick={(e) => {
                              this.copy(`${token}`);
                            }}
                          >
                            {token}
                          </Button>
                        ))}
                    </Box>

                    <TextField
                      id="outlined-multiline-static"
                      label=""
                      multiline
                      className={'textFieldMultiline'}
                      rows={5}
                      variant="outlined"
                      value={smsTemplateValue ?? undefined}
                      onChange={(e) => this.handleSMSTemplateChange(e)}
                      inputProps={{
                        maxLength: 540,
                      }}
                      helperText={
                        <>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              {smsTemplateValue
                                ? `${smsTemplateValue.length}/540`
                                : `0/540`}
                            </div>
                            <div>
                              {t(
                                'componentData.smsTemplateDetail.smsHelperText'
                              )}
                            </div>
                          </div>
                          <div
                            style={{ fontStyle: 'italic', fontSize: '12px' }}
                          >
                            {t('componentData.smsTemplateDetail.smsHelperNote')}
                          </div>
                        </>
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid justify="flex-end">
          <Box mt={4}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box px={5}>
                <Button
                  variant="contained"
                  className="cancelBtn"
                  onClick={() => this.props.onCancel()}
                >
                  {t('componentData.smsTemplateDetail.cancleBtn')}
                </Button>
              </Box>

              <Box px={2}>
                {btnLoader ? (
                  <CircularProgress color="primary" />
                ) : (
                  <Button
                    variant="contained"
                    style={{
                      display: 'inline-block',
                      padding: '6px 10px',
                      width: '120px',
                      margin: '0px 10px 0 0',
                      fontSize: '14px',
                      border: '2px solid #0b1941',
                    }}
                    color="primary"
                    onClick={this.saveDetails.bind(this)}
                  >
                    {t('componentData.smsTemplateDetail.saveBtn')}
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
                dangerouslySetInnerHTML={{
                  __html: this.state.smsTemplateValue,
                }}
              ></div>
            </Box>
          </ContentDialog>
        )}
      </div>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
  }))(SMSTemplateDetails)
);
