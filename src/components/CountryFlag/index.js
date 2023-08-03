import { Box } from "@material-ui/core";
import React from "react";
import { withTranslation } from "react-i18next";

const CountryFlag = (props) => {
    const { t, countryCode, height } = props;

    const getFlagURL = (code) => {
        switch (code) {
            case 'USD':
                return require('~/assets/icons/USAFlag.svg');
            case 'CAD':
                return require('~/assets/icons/CanadianFlag.svg');
            default:
                return require('~/assets/icons/USAFlag.svg');
        }
    }

    return (
        <Box mr={0.5}>
            <img
                height={height ? height : 36}
                src={getFlagURL(countryCode)}
                alt={`${countryCode || ''}-${t('componentData.paymentDetails.flagAltTxt')}`}
            />
        </Box>
    )
}
export default withTranslation()(CountryFlag);
