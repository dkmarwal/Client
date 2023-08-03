import React from 'react'
import { Box, Button, Typography,  makeStyles, } from "@material-ui/core";
import Access_Denied from '~/assets/icons/access_denied.svg';
import config from "~/config";
import { withTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
     padding:"10%",
     background:theme.palette.background.header,
    display:"flex",
    justifyContent:"center"

    },
  heading:{
    fontSize: 24,
    textAlign: "center",
    color:  theme.palette.primary.main,
    fontWeight: "normal"
  },

  subHeading:{
    fontSize: 24,
    textAlign: "center",
    color: "#565656",
    fontWeight: "normal",
    width:"60%"
  }   
}));

const Unauthorise = (props) => {
    const classes = useStyles();
    const {t} = props;
    return (
        <div className={classes.root}>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Box pb={5}>   <img src={Access_Denied } alt= {t('componentData.sessionOut.AccessDenied')} width="392" /></Box>
          <Box pb={5}>  <Typography  variant="h1" className={classes.heading}>{t('componentData.sessionOut.SESSIONEXPIRED')}</Typography></Box>
              <Typography  variant="h4" className={classes.subHeading}>{t('componentData.sessionOut.tryAgain')}</Typography>
            <Box pt={5}>
                <Button variant="contained" color="primary" onClick={() => props.history.push(`${config.baseName}/`)}>{t('componentData.sessionOut.Login')}</Button>
            </Box>
        </Box>
        </div>
    )
}

export default withTranslation()(Unauthorise);
