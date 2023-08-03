import React, { Component } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

class ResetPassword extends Component {

    state = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }

    handleChange = (evt) => {
        this.setState({
            ...this.state,
            [evt.target.name]: evt.target.value
        });
    };

    handleSubmit = (evt) => {
        evt.preventDefault()
        this.setState({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    }

    render() {
        const { settings, t } = this.props;
        const { currentPassword, newPassword, confirmPassword } = this.state;
        return (
            <Box {...module.moduleSettings?.layout}>
                <Box  {...settings.layout}  >
                    <form onSubmit={this.handleSubmit}>
                        <Box py={2}>
                            <TextField
                                id="outlined-password-input"
                                label= {t('componentData.resetPassword.CurrentPassword')}
                                type="password"
                                fullWidth
                                autoComplete="current-password"
                                variant="outlined"
                                name='currentPassword'
                                value={currentPassword}
                                onChange={this.handleChange}
                            />
                        </Box>
                        <Box py={2}>
                            <TextField
                                id="outlined-password-input"
                                label= {t('componentData.resetPassword.NewPassword')}
                                type="password"
                                fullWidth
                                autoComplete="new-password"
                                variant="outlined"
                                name='newPassword'
                                value={newPassword}
                                onChange={this.handleChange}
                            />
                        </Box>
                        <Box py={2}>
                            <TextField
                                id="outlined-password-input"
                                label= {t('componentData.resetPassword.ConfirmPassword')}
                                type="password"
                                fullWidth
                                autoComplete="confirm-password"
                                variant="outlined"
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={this.handleChange}
                            />
                        </Box>
                        <Box py={2}>
                            <Button
                                type='submit' variant="contained" fullWidth color="primary" disableElevation
                                disabled={currentPassword.length === 0 || newPassword.length === 0 || confirmPassword.length === 0}
                            >
                                {t('componentData.resetPassword.submit')}
                        </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        )
    }
}
export default withTranslation()(ResetPassword);
