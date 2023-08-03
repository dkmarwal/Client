const styles = (theme) => ({
    gridItem: {
        margin: 0
    },
    toolTipText: {
        color: '#008ce6',
        paddingLeft: 5,
        cursor: 'pointer'
    },
    addBtnGrid: {
        alignItems: 'flex-start',
        justifyContent: 'end',
        padding: 10
    },
    addBtn: {
        border: '2px solid #0B1941',
        borderRadius: 6
    },
    btnInfoText: {
        fontSize: theme.spacing(1.5),
        fontStyle: 'italic',
        color: '#4C4C4C'
    },
    saveButton:{
        marginLeft: theme.spacing(2)
    },
    divider: {
        height: '0.8px',
        background: '#8F9EC4'
    },
    cardImageIcon: {
        margin: theme.spacing(1),
        verticalAlign: 'middle'
    },
    cardImageLabel: {
        color: 'rgba(0, 0, 0, 0.26)' //#4C4C4C
    },
    deleteIconBox: {
        textAlign: 'end'
    },
    deleteIcon: {
        color: '#0B1941',
        cursor: 'pointer',
        marginLeft: theme.spacing(1)
    },
    paper: {
        marginTop: '8px',
        width: '100%',
        padding: '8px 0',
        border: '1px dashed #CCCCCC',
        boxShadow: 'none'
    },
    mccBtnInfoText: {
        fontSize: theme.spacing(1.5),
        fontStyle: 'italic',
        color: '#4C4C4C',
        textAlign: 'end'
    },
    programInfoText: {
        fontStyle: 'italic',
        paddingLeft: theme.spacing(2)
    },
    errorAlertText: {
        border: '1px solid #E02020',
        background: '#fff',
        color: '#E02020'
    },
    headItem: {
        fontSize: 24,
        color: '#0B1941',
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(2)
    },
    p1:{
        padding: '0px 1px'
    }
});
export default styles;
