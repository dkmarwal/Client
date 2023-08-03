import React from 'react'
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from "@material-ui/core/Tooltip";
import { withTranslation } from 'react-i18next';

const PaymentTooltip = ({classes, payeeBankAccountData, t}) => {
    const [tooltipShow, setTooltipShow] = React.useState(false)
    const handleTooltipView = (val) => {
        setTooltipShow(val)
    }
    return <div>
        <ClickAwayListener onClickAway={() => handleTooltipView(false)}>
            <Tooltip
                placement="bottom-start"
                arrow
                PopperProps={{
                    disablePortal: true
                }}
                onClose={() => handleTooltipView(false)}
                open={tooltipShow}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={<List className={classes.locationList}>
                    {payeeBankAccountData.map((locationData) => {
                        return <ListItem>
                            <ListItemText primary={`${locationData.locationName} (${locationData.locationType.locationTypeName})`} />
                        </ListItem>
                    })}
                </List>}
                classes={{ tooltip: classes.showAllTooltip }}
                >
                <span onClick={() => handleTooltipView(true)} className={classes.showAllText}>
                    {t('componentData.SmallTxt.showAll')}
                </span>
            </Tooltip>
        </ClickAwayListener>
    </div>
}

export default withTranslation()(withStyles(styles)(PaymentTooltip));