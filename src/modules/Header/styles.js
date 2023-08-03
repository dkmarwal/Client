const styles = theme => ({
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 99,
        background: theme.palette.background.header,
        boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)"
    },
    logoContainer: {
        padding: "1rem"
    },
    logo: {
        maxWidth: "2.5rem"
    },
    searchBarContainer: {

    },
    userInfoContainer: {

    }
})

export default styles
