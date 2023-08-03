import React from "react";
import {
  Grid,
  Box,
  MenuItem,
  CircularProgress,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Button,
  makeStyles,
  Divider,
  FormControlLabel,
  Checkbox,
  FormLabel,
  FormGroup,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { withTranslation } from "react-i18next";
import TextField from "~/components/Forms/TextField";

import { accessRights } from "~/config/accessRights";
import { USBankDynamicReport} from "~/config/entityTypes";

const expansionStyle = makeStyles((theme) => ({
  root: {
    marginBottom: "12px",
  },
  expanded: {
    margin: "20px 0px 0px",
  },
}));

const expansionSumStyle = makeStyles({
  root: {
    backgroundColor: `rgba(239,239,239,0.54)`,
  },
  expanded: {
    backgroundColor: "#FFFFFF",
    // margin: '20px 0px 0px',
  },
  content: {
    "&.Mui-expanded": {
      margin: "20px 0px 0px",
    },
  },
  expandIcon: {
    marginRight: "20px",
  },
});

const expansionDetailStyle = makeStyles({
  root: {
    // borderBottom: '3px solid #6094B1',
  },
  // expanded: {
  //     margin: '20px 0px 0px',
  // }
});

const formControlStyle = makeStyles((theme) => ({
  root: {},
  label: {
    fontFamily: theme.typography.fontFamily,
    fontSize: "14px",
  },
  title: {
    fontSize: "14px",
    color: "#6094B1",
  },
}));

const styles = (theme) => ({
  root: {
    padding: "10px 50px",
    margin: "15px 0px 10px",
  },
  paper: {
    padding: "40px",
    margin: "50px 50px 20px",
  },
  title: {
    marginBottom: "15px",
  },
  btnMargin: {
    margin: "0 20px",
  },
  formLabel: {
    textAlign: "left",
    marginLeft: "20px",
    marginTop: "10px",
    fontSize: "0.9rem",
  },
  container: {
    marginTop: "20px",
    backgroundColor: "#ffffff",
    boxShadow:
      "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
  },
  gridItem: {
    padding: "25px 20px 20px",
  },
  permissionContainer: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  divider: {
    height: "1px",
    width: "100%",
    marginBottom: "20px",
  },
  summary: {
    height: "43px",
    width: "557px",
    color: "#4C4C4C",
    fontFamily: theme.typography.fontFamily,
    fontSize: "12px",
    marginBottom: "10px",
    fontWeight: "300",
    letterSpacing: "0",
    lineHeight: "22px",
  },
});

const rolesPermissions = (props) => {
  const {
    claims,
    classes,
    roleList,
    saveBtnClicked,
    backToRolesScreen,
    sourceRoleId,
    selectedRole,
    onRoleChange,
    validation,
    updateProgress,
    rolePermissionOptions,
    permissionsGranted,
    onChangePermission,
    onClearAllPermissions,
    onSaveAllPermissions,
    handleCopyPermission,
    onGroupSelection,
    user,
  } = props;
  const { isPayeeChoicePortal } = user;
  const expansionClasses = expansionStyle();
  const formControlClasses = formControlStyle();
  const { t } = props;
  let disableInput = !selectedRole.isCustomRole;
  if (selectedRole.isCustomRole) {
    disableInput = !(
      (claims && claims.includes(accessRights["USER_ROLE_EDIT"])) ||
      false
    );
  }
  if (selectedRole.isNewRole) {
    disableInput = !(
      (claims && claims.includes(accessRights["USER_ROLE_ADD"])) ||
      false
    );
  }

  const flatten = (arr) => {
    return arr.reduce(
      (flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next),
      []
    );
  };

  const PermissionAccessItem = ({ label, options }) => {
    const accessOptions = options.map(
      ({ AccessRightMappingId, Description, DisplayOrder }) => {
        return (
          <FormControlLabel
            classes={formControlClasses}
            key={AccessRightMappingId}
            control={
              <Checkbox
                name={Description}
                value={AccessRightMappingId}
                checked={
                  permissionsGranted && permissionsGranted.length > 0
                    ? permissionsGranted.includes(AccessRightMappingId)
                    : false
                }
                onChange={onChangePermission}
                color="primary"
                disabled={disableInput}
              />
            }
            label={Description}
          />
        );
      }
    );

    return (
      <React.Fragment>
        <Grid item xs={12} sm={4}>
          <FormLabel className={classes.formLabel} component="legend">
            {label}
          </FormLabel>
        </Grid>
        <Grid item xs={12} sm={8}>
          <FormGroup aria-label="position" row>
            {accessOptions}
          </FormGroup>
        </Grid>
      </React.Fragment>
    );
  };

  //const getRolePermissionsOptionList = rolePermissionOptions.length>0 && rolePermissionOptions.map(({ AccessGroup, Description, RightsGroup }) => {
  const getRolePermissionsOptionList =
    rolePermissionOptions.length > 0 &&
    rolePermissionOptions
      .filter(
        ({ AccessGroup, Description, RightsGroup }) =>
          AccessGroup != "Payee Enrollment"
      )
      .map(({ AccessGroup, Description, RightsGroup }) => {
        const allGroupPermissons = flatten(
          RightsGroup.map(({ Rights }) =>
            Rights.map(({ AccessRightMappingId }) => {
              return AccessRightMappingId;
            })
          )
        );

        const grpPermissionIds =
          permissionsGranted &&
          permissionsGranted.filter(
            (item) => allGroupPermissons.indexOf(item) !== -1
          );
        return (
          <ExpansionPanel key={AccessGroup} classes={expansionClasses}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <FormControlLabel
                classes={formControlClasses}
                aria-label={AccessGroup}
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                control={
                  <Checkbox
                    indeterminate={
                      grpPermissionIds.length > 0 &&
                      grpPermissionIds.length < allGroupPermissons.length
                    }
                    checked={
                      allGroupPermissons.length > 0 &&
                      allGroupPermissons.length === grpPermissionIds.length
                    }
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<CheckBoxIcon />}
                    onChange={(event) => onGroupSelection(event, RightsGroup)}
                    disabled={disableInput}
                  />
                }
                label={AccessGroup}
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction="row">
                {Description && (
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.summary}>
                      {Description}
                    </Typography>
                  </Grid>
                )}
                {RightsGroup.map(({ AccessName, Rights }) => {
                  if (isPayeeChoicePortal && AccessName === USBankDynamicReport) {
                    return null
                  }
                  return <Grid container direction="row" key={AccessName}>
                    <Divider variant="fullWidth" className={classes.divider} />
                    <PermissionAccessItem
                      key={AccessName}
                      label={AccessName}
                      options={Rights}
                    />
                  </Grid>
                })}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      });
  return (
    <Grid container xs={12} md={12} className={classes.root}>
      <Grid item container className={classes.container}>
        <Grid item xs={6} className={classes.gridItem}>
          <TextField
            required
            name="roleName"
            id="roleName"
            type="text"
            label={t("componentData.permissions.RoleName")}
            variant="outlined"
            fullWidth={true}
            inputProps={{ maxLength: 100 }}
            InputLabelProps={{
              shrink: true,
            }}
            value={selectedRole.roleName}
            error={validation.roleName && validation.roleName.length > 0}
            helperText={validation.roleName}
            onChange={onRoleChange}
            disabled={disableInput}
          />
        </Grid>
        {selectedRole.isNewRole && (
          <Grid item xs={6} className={classes.gridItem}>
            <TextField
              label={t("componentData.permissions.CopyPermissionsFrom")}
              fullWidth={true}
              select
              value={sourceRoleId || ""}
              autoComplete="off"
              variant="outlined"
              name="sourceRoleId"
              onChange={(event) => handleCopyPermission(event)}
            >
              {roleList ? (
                roleList.map((option) => (
                  <MenuItem key={option.roleId} value={option.roleId}>
                    {option.roleName}
                  </MenuItem>
                ))
              ) : (
                <Box
                  width="100px"
                  display="flex"
                  mt={1.875}
                  justifyContent="center"
                  alignItems="center"
                >
                  <CircularProgress color="primary" />
                </Box>
              )}
            </TextField>
          </Grid>
        )}
        <Grid item xs={6} className={classes.gridItem}>
          <TextField
            required
            error={
              validation.roleDescription &&
              validation.roleDescription.length > 0
            }
            helperText={validation.roleDescription}
            name="roleDescription"
            id="roleDescription"
            type="text"
            label={t("componentData.permissions.Description")}
            variant="outlined"
            inputProps={{ maxLength: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            value={selectedRole.roleDescription}
            onChange={onRoleChange}
            fullWidth
            disabled={disableInput}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} className={classes.container}>
        <Box display="flex" width="100%" pl={2}>
          <Box p={1} flexGrow={1} alignSelf="center">
            <Typography
              variant="body2"
              color="primary"
              className={formControlClasses.title}
            >
              {t("componentData.permissions.Permissions")}
            </Typography>
          </Box>
          <Box p={1}>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={onSaveAllPermissions}
              disabled={disableInput}
            >
              {t("componentData.permissions.GrantAllPermissions")}
            </Button>
          </Box>
          <Box p={1} mr={5}>
            <Button
              className={classes.button}
              variant="text"
              color="primary"
              onClick={onClearAllPermissions}
              disabled={disableInput}
            >
              {t("componentData.permissions.ClearAllPermissions")}
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} className={classes.permissionContainer}>
        {getRolePermissionsOptionList}
      </Grid>
      <Grid
        container
        item
        direction="row"
        justify="center"
        alignItems="center"
        xs={12}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={backToRolesScreen}
          className={classes.btnMargin}
        >
          {t("componentData.permissions.Cancel")}
        </Button>
        {updateProgress ? (
          <CircularProgress color="primary" />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={saveBtnClicked}
            className={classes.btnMargin}
            disabled={disableInput}
          >
            {t("componentData.permissions.SaveRole")}
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default withTranslation() (
  connect((state) => ({ ...state.user }))(withStyles(styles)(rolesPermissions))
)
