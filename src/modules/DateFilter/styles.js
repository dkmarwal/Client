export const styles = theme => ({
   
    dateInput:{
        padding: '1rem',
        borderRadius: '5px',
        border:'1px'
    },
   
    filterButton:{
        background: theme.palette.primary.main,
        color:theme.palette.primary.contrastText,
        textAlign:'center',
        '&:hover': {
            background: theme.palette.primary.main,
         },
    }
});