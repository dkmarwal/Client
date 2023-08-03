export const styles = (theme) => ({
    root:{
        background:'#fff',
        lineHeight:2,
        padding: "20px 50px 50px 50px",
        '& p':{
            lineHeight: 2,
        }
     },
     labelHeading: {
         padding:"56px  0 18px 0",
         fontSize:20,
    },
    boxSpace: {
        padding: 15
    },
    iconImage:{
    alignItems: "center",
    display: "flex",
    color: theme.palette.primary.grey
    },
    bigText: {
        fontSize:36,
    },
    subText:{
        fontSize:20,
        margin:"20px 0"
    },

    flagText: {
        fontSize:16,
        textTransform:"uppercase",
        padding:"0 10px 0 0"
    }
})
