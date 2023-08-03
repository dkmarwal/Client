import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ContentDialog } from '~/components/Dialogs';
import { withTranslation } from 'react-i18next';

import {
  Grid,
  Box,
  CircularProgress,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Card,
  Link,
  Switch,
} from '@material-ui/core';
import {
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  StyledTableFooter,
} from '~/components/StyledTable';
import { fetchEmailTemplates } from '~/redux/helpers/branding';
import { updateEmailNotification } from '~/redux/actions/branding';
import EmailTemplateDetails from '../EmailTemplateDetails';
import NoData from '~/components/NoData';
import { accessRights } from '~/config/accessRights';

class EmailTemplate extends React.Component {
  state = {
    data: [],
    isLoading: true,
    message: '',
    flag: false,
    editFlag: false,
    selectedData: '',
  };

  componentDidMount() {
    this.getData();
  }

  setDialogMessage(flag, message) {
    this.setState({ message: message, flag: true });
  }

  hideAlertMessage() {
    this.setState({ message: '', flag: false });
  }

  getData() {
    fetchEmailTemplates().then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message);
        this.setState({ isLoading: false });
        return false;
      }
      this.setState({ data: response.data.rows, isLoading: false });
    });
  }

  createMarkup(html) {
    return { __html: html };
  }

  showTemplate(item) {
    this.setDialogMessage(true, item.body);
  }

  editTemplate(item) {
    this.setState({ editFlag: true, selectedData: item });
  }

  closeEditTemplate() {
    this.setState({ editFlag: false, selectedData: '' }, () => {
      this.getData();
    });
  }

  handleChange(id, isActive) {
    this.props
      .dispatch(
        updateEmailNotification({
          clientTemplateId: id,
          isActive: isActive ? 0 : 1,
        })
      )
      .then((response) => {
        const tempData = this.state.data;
        tempData.map((object) => {
          if (object.clientTemplateId === id) {
            object.isActive = !object.isActive;
          }
        });
        this.setState({ data: tempData });
      });
  }

  render() {
    const { t } = this.props;
    const { data, flag, message, editFlag, selectedData, isLoading } =
      this.state;
    const { user } = this.props;
    const { isPayeeChoicePortal } = user;
    const isBrandingEmailEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['BRANDING_EMAIL_TEMPLATE_EDIT']
        )) ||
      false;

    const isBrandingEmailToggleButtonEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['BRANDING_EMAIL_TEMPLATE_TOGGLE_VIEW']
        )) ||
      false;

    return (
      <div className={''}>
        <Grid>
          <Box my={2} mx={6}>
            {!editFlag ? (
              <Card>
                <Box py={5} px={5}>
                  <Table>
                    <StyledTableHead
                      style={{ backgroundColor: 'rgba(204,228,255,0.75)' }}
                    >
                      <TableRow>
                        <StyledTableCell>
                          {t('componentData.emailTemplate.templateName')}
                        </StyledTableCell>
                        <StyledTableCell>
                          {t('componentData.emailTemplate.tempSubject')}
                        </StyledTableCell>
                        <StyledTableCell>
                          {t('componentData.emailTemplate.tempView')}
                        </StyledTableCell>
                        <StyledTableCell>
                          {t('componentData.emailTemplate.tempEdit')}
                        </StyledTableCell>
                        <StyledTableCell>
                          {isBrandingEmailToggleButtonEnabled &&
                          isPayeeChoicePortal
                            ? t('componentData.emailTemplate.active/inactive')
                            : ''}
                        </StyledTableCell>
                      </TableRow>
                    </StyledTableHead>
                    {isLoading ? (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Box
                              display='flex'
                              p={5}
                              justifyContent='center'
                              alignItems='center'
                            >
                              <CircularProgress color='primary' />
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : data && data?.length > 0 ? (
                      data &&
                      data.map((item, index) => {
                        return (
                          <TableBody>
                            <Fragment key={index}>
                              <StyledTableRow>
                                <StyledTableCell>{item.title}</StyledTableCell>
                                <StyledTableCell>
                                  {item.subject}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Link
                                    onClick={() => this.showTemplate(item)}
                                    style={{ color: 'blue' }}
                                  >
                                    {t('componentData.emailTemplate.tempView')}
                                  </Link>
                                </StyledTableCell>
                                <StyledTableCell>
                                  {isBrandingEmailEditEnabled && (
                                    <img
                                      onClick={() => this.editTemplate(item)}
                                      // className={classes.checkClass}
                                      src={require(`~/assets/icons/edit.svg`)}
                                      alt=''
                                      æ
                                    />
                                  )}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {isBrandingEmailToggleButtonEnabled && (
                                    <Switch
                                      checked={item.isActive ? true : false}
                                      onChange={() =>
                                        this.handleChange(
                                          item.clientTemplateId,
                                          item.isActive
                                        )
                                      }
                                      inputProps={{
                                        'aria-label': 'controlled',
                                      }}
                                    />
                                  )}
                                </StyledTableCell>
                              </StyledTableRow>
                            </Fragment>
                          </TableBody>
                        );
                      })
                    ) : (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Box
                              display='flex'
                              p={5}
                              justifyContent='center'
                              alignItems='center'
                            >
                              <NoData />
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                    <StyledTableFooter>
                      <TableRow>
                        {/* <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, { label: 'All', value: 10 || 10 }]}
                                    colSpan={6}
                                    count={3}
                                    rowsPerPage={10}
                                    page={0}
                                // SelectProps={{
                                //     inputProps: { 'aria-label': 'rows per page' },
                                //     native: true,
                                // }}
                                // onChangePage={this.handlePageChange}
                                // onChangeRowsPerPage={this.handleRowsPerPageChange}
                                /> */}
                      </TableRow>
                    </StyledTableFooter>
                  </Table>
                </Box>
              </Card>
            ) : (
              <Grid>
                <EmailTemplateDetails
                  templateObject={selectedData}
                  onCancel={this.closeEditTemplate.bind(this)}
                />
              </Grid>
            )}
          </Box>

          {flag && (
            <ContentDialog
              boxSize='md'
              open={flag}
              onConfirm={() => this.hideAlertMessage()}
            >
              <Box width='600' mx='auto'>
                <div
                  style={{
                    width: '600px',
                    margin: '0 auto',
                    border: '2px solid #ddd',
                    boxSizing: 'content-box',
                    padding: 10,
                  }}
                  dangerouslySetInnerHTML={this.createMarkup(message)}
                />
              </Box>
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
  }))(EmailTemplate)
);
