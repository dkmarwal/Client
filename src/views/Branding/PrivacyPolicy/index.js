import React from "react";
import { connect } from "react-redux";
import { Grid, Box, Card} from "@material-ui/core";
import { fetchPrivacyPolicyData } from "../../../redux/helpers/branding";

class PrivacyPolicy extends React.Component {
  state = {
    html: "",
  };

  componentDidMount() {
    this.getData();
  }

  getData() {
    let clientId = this.props.user.userData.portalProfileId;
    fetchPrivacyPolicyData(clientId).then((response) => {
      if (response.error) {        
        return false;
      }
      this.setState({ html: response.data.privacyPolicy });
    });
  }

  createMarkup(html) {
    return { __html: html };
  }

  render() {    
    const { html } = this.state;
   
    return (
      <div className={""}>
        <Grid>
          <Box my={0} mx={5}>
            <Card>
              <Box py={5} px={5}> 
                <div dangerouslySetInnerHTML={this.createMarkup(html)} />
              </Box>
            </Card>
          </Box>
        </Grid>        
      </div>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.clientConfig,
}))(PrivacyPolicy);
