import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Banner from "~/components/Banner";
import { withTranslation } from 'react-i18next';
import { styles } from "./styles";

class ImportParentProfileDetails extends Component {
  render() {
    const { t } = this.props;
    const {onConfirm, onCancel } = this.props;
    return (
      <Banner
        title= {t('componentData.importOnboardingDailogue.msg3')}
        confirmText= {t('componentData.importOnboardingDailogue.Import')}
        cancelText= {t('componentData.importOnboardingDailogue.Clear')}
        px={12}
        py={2.4}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
  }
}

export default withTranslation()(withStyles(styles)(ImportParentProfileDetails));
