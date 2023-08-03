import {  
  Grid,  
  withStyles,  
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import SubHeader from "~/components/_SubHeader";
import styles from "./styles";
import { withTranslation } from "react-i18next";
import General from './General';
import {PayerTypes} from "~/config/entityTypes"; 
import Cards from './Cards'



class Dashboard extends Component {  
  render() {
    const {classes, t } = this.props;  
    const {payerTypeId} = this?.props?.user?.userData ?? 1;    

    return (
      <Grid className={classes.dashboardContainer}>        
        <SubHeader
          title={t("componentData.dashboard.Dashboard")}
          alias={"dashboard"}          
          tabs={[
            {
              url: "/dashboard",
              name: t("componentData.dashboard.B2B"),
              items: [],
              component: (
                <General {...this.props} />
              ),
              alias: "DASHBOARD_TEMPLATE_VIEW",
              isProtected: true,
              showTab: false
            },
            {
              url: "/dashboard",
              name: t("componentData.dashboard.B2BCards"),
              items: [],
              component: (
               <Cards {...this.props} />
              ),
              alias: "DASHBOARD_CARDS_TEMPLATE_VIEW",
              isProtected: true,
              showTab: false
            }  
          ]}
        />

        {payerTypeId != PayerTypes.CARDS 
          ? <General {...this.props} />
          : <Cards {...this.props} />
        }
        
      </Grid>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user}))(
    withStyles(styles)(Dashboard)
  )
);
