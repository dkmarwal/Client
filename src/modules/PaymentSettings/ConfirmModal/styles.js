import { makeStyles } from "@material-ui/core"

export const useStyles = makeStyles((theme) => ({
    infoIcon: {
        flexGrow: 1,
        paddingBottom: 0,
        alignSelf: "end",
        paddingLeft: "55px"
    },
    modalContent: {
        padding: "8px 45px",
        textAlign: "center",
        color: "#000"
    },
    actions: {
        padding: "0px 15px 20px",
        justifyContent: "space-evenly"
    },
    closeIcon: {
        color: "#4C4C4C"
    }
}));
