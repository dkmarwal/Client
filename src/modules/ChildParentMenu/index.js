import React, { Component } from "react";
import { connect } from "react-redux";

import { Box, Typography, Backdrop, CircularProgress } from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import HomeIcon from "@material-ui/icons/Home";
import BusinessIcon from "@material-ui/icons/Business";
import { withTranslation } from 'react-i18next';

import {
  fetchChildParentList,
  fetchParentInfo,
  fetchChildInfo,
} from "~/redux/actions/user";
import { AlertDialog } from "~/components/Dialogs";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import { accessRights } from "~/config/accessRights";

class ChildParentMenu extends Component {
  flag = true;

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      alertType: "success",
      alertMessage: "",
      alertMessageCallbackType: null,
      expanded: [],
    };
  }

  changeFlag = () => {
    this.flag = false;
  };

  changeFlagAgain = () => {
    this.flag = true;
  };

  componentDidMount = () => {
    const { userRoles, isLoggedIn } = this.props.user;

    const flag =
      (isLoggedIn &&
        userRoles &&
        userRoles.includes(accessRights["PARENT_CHILD_ACCESS_VIEW"])) ||
      false;
    if (flag) {      
      this.getChildParentList();
    }
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  handleToggle = (event, nodeIds) => {
    this.setState({
      expanded: nodeIds,
    });
  };

  fetchDataResponseHandler = (response) => {   
    if (!response) {
      this.setState({
        alertMessage: this.props.user.error,
        alertType: "error",
        isLoading: false,
      });

      return false;
    }

    this.setState({
      isLoading: false,
    });
    window.location.reload();
  };

  setProfile = (event, childPortalProfileId) => {
    if (this.flag === true && !this.state.isLoading) {
      this.setState(
        {
          isLoading: true,
        },
        () => {
          const { userData, activeParentProfileId } = this.props.user;
          const portalProfileId =
            activeParentProfileId || userData.portalProfileId;
          if (
            this.props.user.userData.portalProfileId === childPortalProfileId
          ) {
            this.props
              .dispatch(
                fetchParentInfo({
                  portalProfileId: portalProfileId,
                  portalTypeId: userData.portalTypeId,
                  userId: userData.userId,
                })
              )
              .then((response) => {
                this.fetchDataResponseHandler(response);
              });
          } else {
            this.props
              .dispatch(
                fetchChildInfo({
                  portalProfileId: portalProfileId,
                  portalTypeId: userData.portalTypeId,
                  userId: userData.userId,
                  childPortalProfileId: childPortalProfileId,
                })
              )
              .then((response) => {
                this.fetchDataResponseHandler(response);
              });
          }
        }
      );
    }
  };

  expandedItems = (data, parentId) => {
    let expandItem = "";
    if (data && data.length) {
      data.forEach((item) => {
        if (item.ClientId === +this.props.user.userData.portalProfileId) {
          expandItem = parentId ? parentId : item.ClientId;
        } else if (item.child && item.child.length) {
          expandItem = this.expandedItems(item.child, item.ClientId);
        }
      });
    }
    return expandItem;
  };

  getChildParentList = () => {
    const { userData } = this.props.user;
    this.props
      .dispatch(
        fetchChildParentList({
          portalProfileId: userData.portalProfileId,
          portalTypeId: userData.portalTypeId,
          userId: userData.userId,
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertMessage: this.props.user.error,
            alertType: "error",
            isLoading: false,
          });
          return false;
        }
        const expandedItem = this.expandedItems(
          this.props.user.childParentList,
          null
        );
        this.setState({
          isLoading: false,
          data: this.props.user.childParentList || [],
          expanded: [expandedItem],
        });
      });
  };

  render() {
    const {
      data,
      isLoading,
      alertMessage,
      alertMessageCallbackType,
      expanded,
    } = this.state;
    let { classes, user, t } = this.props;
    const { userData } = user;

    const renderTree = (nodes) => (
      <div>        
        <TreeItem
          key={nodes.ClientId}
          nodeId={nodes.ClientId}
          onIconClick={this.changeFlag}
          onLabelClick={this.changeFlagAgain}
          label={
            <Box
              display="flex"
              mt={1}             
            >
              <BusinessIcon className={classes.labelIcon} />
              <Typography variant="body2" className={classes.labelText}>
                {nodes.ClientName}
              </Typography>
            </Box>
          }
        >
          {Array.isArray(nodes.child)
            ? nodes.child.map((node) => renderTree(node))
            : null}
        </TreeItem>
      </div>
    );
    if (data.length === 0) {
        return null;
    }

    if(isLoading){
        return (<Backdrop open={isLoading}>
              <CircularProgress color="inherit" />
        </Backdrop>
        );
    }

    return (
      <Box>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}          
          selected={[+userData.portalProfileId]}
          expanded={expanded}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeSelect={this.setProfile}
          onNodeToggle={this.handleToggle}
        >
          <TreeItem
            key={userData && userData.portalProfileId}
            nodeId={userData && userData.portalProfileId}
            onIconClick={this.changeFlag}
            onLabelClick={this.changeFlagAgain}
            label={
              <Box
                display="flex"
                mt={1}                
              >
                <HomeIcon className={classes.labelIcon} />
                <Typography variant="body2" className={classes.labelText}>
                {t('componentData.checkDetail.Home')}
                </Typography>
              </Box>
            }
          />
          {data.length > 0 &&
            data.map((item, index) => {
              return renderTree(item);
            })}
        </TreeView>
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </Box>
    );
  }

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => this.hideAlertMessage()}
      />
    );
  };
}

export default withTranslation()(connect((state) => ({ ...state.user }))(
  withStyles(styles)(ChildParentMenu)
));
