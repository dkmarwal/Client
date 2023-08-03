export const styles = (theme) => ({
    orgTree: {
        '& $li': {
            float: 'left',
            textAlign: 'center',
            listStyleType: 'none',
            "&::before": {
                content: "",
                position: 'absolute',
                top: 0,
                right: '50%',
                borderTop: '1px solid #ccc',
                width: '50%',
                height: '20px'
            },
            "&:after": {
                content: "",
                position: 'absolute',
                top: 0,                
                borderTop: '1px solid #ccc',
                width: '50%',
                height: '20px',
                right: 'auto',
                left: '50%',
                borderLeft: '1px solid #ccc'
            },
            "&:only-child::before": {
                display: 'none'
            },
            "&:last-child::before": {
                borderRight: `1px solid #ccc`
            }
        }
    }
});