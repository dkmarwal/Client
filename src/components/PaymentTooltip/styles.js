export const styles = (theme) => ({
    locationList: {
        padding: '0px',
        '& .MuiTypography-body1': {
            fontSize: '14px',
            lineHeight: '16px'
        },
        '& .MuiListItem-gutters': {
            padding: '0px',
            color: 'rgba(0,0,0,0.87)'
        }
    },
    showAllTooltip: {
        boxShadow: "0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 6px 0 rgba(0,0,0,0.2)",
        backgroundColor: theme.palette.common.white,
        fontWeight: "normal",
        color: theme.palette.text.black,
        margin: '10px 0px',
        '& .MuiTooltip-arrow': {
            left: '4px !important',
            color: theme.palette.common.white,
            '&::before': {
                boxShadow: "0 14px 14px 4px rgb(0 0 0 / 14%)",
            }
        }
    },
    showAllText: {
        color: '#7F7F7F',
        fontSize: 14,
        cursor: 'pointer'
    },
})