import React from 'react';
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    statusBtn: {
        // backgroundColor: theme.palette.background.lightBlue,
        borderRadius: 30,
        fontSize: 14,
        color: theme.palette.text.black,
        padding: "5px 15px",
        textTransform: "capitalize",
        boxShadow: "none"
    },
}));

export default function LightBlueBtn(props) {
    const classes = useStyles(props);

    return (
        <>
            <Button className={classes.statusBtn} style={{ "backgroundColor": props.color ? props.color : "#cce4ffbf" }} >
                {props.children}
            </Button>
        </>
    )
}
