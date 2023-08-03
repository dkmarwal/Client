export const styles = theme => ({
    loginContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexBasis: "30%",
        marginTop: '20vh',
        padding: "2rem 0rem",
    },
    loginForm: {
        display: "flex",
        flexDirection: "column",
        width: "80%",
        padding: "1rem 1rem",
        "& > div": {
            margin: "0.5rem 0rem"
        }
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
    }
});