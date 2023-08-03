import React from 'react';
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

const TextView = (props) => {
    const { item, t } = props; 
    return (
        <>
            <Box width={165} pl={2} pr={2}>
                <Typography>{item.dataTypeDisplay}</Typography>
            </Box>

            <Box width={160} pl={2} pr={2}>
                {item.minLength === null || item.dataTypeId && item.dataTypeId == 4 || item.dataTypeId == 6 ? null :
                    <Typography>{t('componentData.FileMappingTool.minLengthText')} {item.minLength}</Typography>
                }
            </Box>
            <Box width={160} pl={2} pr={2}>
                {item.maxLength === null || item.dataTypeId && item.dataTypeId == 4 || item.dataTypeId == 6 ? null :
                    <Typography>{t('componentData.FileMappingTool.maxLengthText')} {item.maxLength}</Typography>
                }
            </Box>

            <Box width={180} pl={2} pr={2}>
                {item.isMandatory ? t('componentData.FileMappingTool.mandatoryText') : t('componentData.FileMappingTool.optionalText')}
            </Box>
        </>
    )
}
export default withTranslation()(connect((state) => ({ ...state.paymentAttribute }))(TextView));
