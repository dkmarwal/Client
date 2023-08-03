import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import DialogueModal from "~/components/DialogueModal";
import { styles } from "./styles";
import { withTranslation } from 'react-i18next';

class ImportOnboardingDailogue extends Component {
  render() {
    const { t } = this.props;
    const { onConfirm, onCancel, open } = this.props;
    return (
      <DialogueModal
        title= {t('componentData.importOnboardingDailogue.OnboardingCompletedSuccessfully')}
        confirmText="Login"
        px={12}
        py={2.4}
        onConfirm={onConfirm}
        onCancel={onCancel}
        open={open}
      />
    );
  }
}

export default withTranslation()(withStyles(styles)(ImportOnboardingDailogue));
