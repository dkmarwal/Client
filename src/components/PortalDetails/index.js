import React from 'react';
import config from '~/config';
import CitiLogo from '~/assets/images/citi-color-logo.svg';
import USBankLogo from '~/assets/images/USBANK 1.svg';
import IncedoLogo from "~/assets/images/incedopay_logo.png";
import { BankType } from '~/config/bankTypes';

export function PortalBankLabel({t}) {
  const renderName = (bankTypeId) => {
    switch (bankTypeId) {
      case BankType.USBANK:
        return t("componentData.Login.logoHeading2");
      case BankType.CITIBANK:
      default:
        return t("componentData.Login.logoHeading");
    }
  };
  return renderName(config.bankTypeId);
}

export function PortalLogo({t, isHeader}) {
  const renderBankLogo = (bankTypeId) => {
    switch (bankTypeId) {
      case BankType.USBANK:
        return <img src={USBankLogo} alt={t("componentData.Login.logoAlt")} height={isHeader ? '30' : '34'} width={isHeader ? '85' : '116'} />;
      case BankType.CITIBANK:
      default:
        return <img src={CitiLogo} alt={t("componentData.Login.logoAlt")} height='34' width='58' />;
    }
  };

  return renderBankLogo(config.bankTypeId);
}

export function PortalFooterLogo({t}) {
  const renderBankLogo = (bankTypeId) => {
    switch (bankTypeId) {
      case BankType.USBANK:
        return <img src={USBankLogo} alt={t("componentData.Login.logoAlt")} height="34" width="50" />;
      case BankType.CITIBANK:
      default:
        return <img src={CitiLogo} alt={t("componentData.Login.logoAlt")} height='34' width='58' />;
    }
  };

  return renderBankLogo(config.bankTypeId);
}

/**
 * Forget Password screen
 */
export function PortalName({t}) {
  const renderPortalName = (bankTypeId) => {
    switch (bankTypeId) {
      case BankType.USBANK:
        return t("componentData.Login.logoHeading2");
      case BankType.CITIBANK:
      default:
        return <img src={IncedoLogo} alt={t("componentData.Login.logoAlt")} height="18" width="120" />
    }
  };
  return renderPortalName(config.bankTypeId)
}

