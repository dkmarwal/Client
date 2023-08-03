import React from "react";
import { connect } from "react-redux";
import { Grid, Box, Card} from "@material-ui/core";
import { fetchFAQData } from "../../../redux/helpers/branding";

class FAQs extends React.Component {
  state = {
    html: "",
  };

  componentDidMount() {
    this.getData();
  }

  saveData() {
    //let payload = {};
  }

  getData() {
    let clientId = this.props.user.userData.portalProfileId;
    fetchFAQData(clientId).then((response) => {
      if (response.error) {        
        return false;
      }
      this.setState({ html: response.data.faqs });
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
}))(FAQs);
