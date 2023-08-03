export const styles = theme => ({
    contentBackground: {
        backgroundColor: theme.palette.background.header,
    },
    primaryDark: {
        color: theme.palette.primary.dark,
    },
    infoIcon: {
        marginLeft: '5px',
        verticalAlign: 'middle'
    },
    paymentRadio: {
        width: 'inherit'
    },
    attributeAccordian: {
        background: '#e9eef2'
    },
    formLabel: {
        color: '#4C4C4C'
    },
    enableDownloadIcon: {
        marginRight: '5px',
        verticalAlign: 'middle',
        color: '#0B1941'
    },
    disabledDownloadIcon: {
        marginRight: '5px',
        verticalAlign: 'middle',
        color: 'rgba(1, 1, 1, 0.3)'
    },
    previewText: {
        fontFamily: theme.typography.fontFamily,
        color: '#0B1941'
    },
    downloadContainer: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    downloadListSpacing: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    noPaddingBottom: {
        paddingBottom: 0
    },
    mscResponseLegend: {
        fontSize: '14px',
        color: '#000000'
    },
    smallPlaceholderText: {
        '& label': {
            fontSize: 13
        },
        '& legend': {
            fontSize: 10
        }
    }
})