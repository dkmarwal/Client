import React from "react";
import {
  Grid, 
  Typography,
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import NoDataFound from '~/assets/icons/no_data_found.svg';

class NoData extends React.Component {  
    constructor(props){
        super(props);
        this.state = {
            
        }
    }      

  render() {      
    const { t } = this.props;       
    return (
        <Grid
        container
        direction="column"
        spacing={2}
        style={{ margin: 'auto', justifyContent: 'center' }}
        >
        <img
            src={NoDataFound}
            alt="No Data Found!"
            width="auto"
            height="160px"
        />
        <Typography
            style={{
            textAlign: 'center',
            marginTop: '8px',
            marginLeft: '28px',
            color:'#A1A1A1'
            }}
        >
            {t('componentData.fileDetails.NoDataToshow')}
        </Typography>
        </Grid> 
    );
  }
}

export default withTranslation()(NoData);
