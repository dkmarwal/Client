import React, {
  forwardRef,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import ExpansionBar from "~/components/ExpansionBar";
import { Button } from "~/components/Forms";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import {
  getNotificationOptions,
  saveNotificationSetting,
} from "~/redux/helpers/notificationSetttings";
import {
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { connect } from "react-redux";
import NotiSettingUpdateIcon from "~/assets/icons/notiSettingUpdate.svg";
import NotiPaymentUpdateIcon from "~/assets/icons/notiPaymentUpdate.svg";
import NotiSupplierUpdateIcon from "~/assets/icons/notiSupplierUpdate.svg";
import ChildCompany from "~/assets/icons/child_company.svg";
import SupplierPending from "~/assets/icons/supplier_pending.svg";
import NotiBellIcon from "~/assets/icons/notiBell.svg";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { withTranslation } from 'react-i18next';

const NotificationSetting = forwardRef(
  ({ user, userId, submit, controlled, t }, ref) => {
    const [notificationOptions, setNotificationOptions] = useState([]);
    const [notificationGroupMap, setNotificationGroupMap] = useState({});
    const [clientNotifications, setClientNotifications] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);
    const [portalId, setPortalId] = useState(2);

    useEffect(() => {
      
      if (submit) {
        saveNotifications();
      }
      if (user.userData) {
        setPortalId(user.userData.portalTypeId);
        fetchNotificationOptions(user.userData.portalTypeId || 2);
      }
    }, [submit]);

    const fetchNotificationOptions = async (portalId) => {
      const response = await getNotificationOptions(portalId); // portal type id =1

      if (!response.error && response.data) {
        setNotificationOptions(response.data);
        const notificationGroupData =
          Array.isArray(response.data) &&
          response.data.reduce(
            (obj, { notificationGroupId, description, notificationTypes }) => {
              obj[notificationGroupId] =
                Array.isArray(notificationTypes) &&
                notificationTypes.map(
                  ({ notificationTypeId }) => notificationTypeId
                );
              return obj;
            },
            {}
          );
        setNotificationGroupMap(notificationGroupData);
      } else {
        //NotificationManager.error(response.message || "", "Error!!", 2000);
      }
    };

    const clearAllHandler = () => {
      setClientNotifications({});
    };
    const grantAllHandler = () => {
      setClientNotifications(notificationGroupMap);
    };

    const onChangeNotifications = (event) => {
      const { name, checked, id } = event.target;
      let newClientNotification;
      if (checked) {
        newClientNotification = [
          ...(clientNotifications[id] || []),
          parseInt(name),
        ];
      } else {
        newClientNotification =
          Array.isArray(clientNotifications[id]) &&
          clientNotifications[id].filter((key) => parseInt(name) !== key);
      }
      setClientNotifications({
        ...clientNotifications,
        [id]: newClientNotification,
      });
    };

    const saveNotifications = async () => {
      setSaveLoading(true);

      try {
        const notificationData = Object.keys(clientNotifications).reduce(
          (arr, key) => {
            arr.push({
              notificationTypeId: clientNotifications[key],
              notificationGroupId: key,
            });
            return arr;
          },
          []
        );

        const data = {
          portalTypeId: user.userData.portalTypeId,
          portalProfileId: user.userData.portalProfileId,
          notificationData: notificationData,
          userIds: [userId],
        };

        const resp = await saveNotificationSetting(data);
        if (resp) {
          const { data, error } = resp;
          if (error) {
            /*NotificationManager.error(
              message || "Server Response Error",
              "Error !!",
              3000
            );*/
            return;
          } else if (data) {
          }
        } else {
          //NotificationManager.error("Server Error", "Error !!", 3000);
        }
        //   setSaveLoading(false);
      } catch (error) {
        //   setSaveLoading(false);
        //NotificationManager.error("Client Error", "Error !!", 3000);
      }
    };

    if (notificationOptions && notificationOptions.length === 0) {
      return null;
    }
    return (
      <ExpansionBar
        label={t('componentData.notificationSetting.alertTxt')}
        icon={NotiBellIcon}
        bColor="#F6F6F6"
      >
        <Box mx={2} display="flex" justifyContent="space-between">
          <Box width={1 / 2}>
            <Typography variant="caption">
              {t('componentData.notificationSetting.msgTxt')}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Button
              style={{ fontSize: 14, color: "#0B1941" }}
              color="primary"
              onClick={clearAllHandler}
              variant="filled"
              size="medium"
            >
              {t('componentData.notificationSetting.clearAllPar')}
            </Button>
            <Button
              style={{ fontSize: 14, color: "#fff" }}
              size="medium"
              variant="contained"
              color="primary"
              onClick={grantAllHandler}
            >
              {t('componentData.notificationSetting.GrantAllParameters')}
            </Button>
          </Box>
        </Box>

        <Box mx={1} my={3}>
          {Array.isArray(notificationOptions) &&
            notificationOptions.map(
              ({ notificationGroupId, description, notificationTypes }) => {
                return (
                  <>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <Box pr={1} display="flex" alignItems="center">
                        {notificationGroupId == 2 ? (
                          <img
                            src={NotiSettingUpdateIcon}
                            width={20}
                            alt={t('componentData.notificationSetting.Setting')}
                          />
                        ) : notificationGroupId == 1 ? (
                          <img src={NotiPaymentUpdateIcon} width={20} alt="$" />
                        ) : notificationGroupId == 4 ? (
                          <img
                            src={NotiSupplierUpdateIcon}
                            width={16}
                            alt={t('componentData.notificationSetting.Payee')}
                          />
                        ) : notificationGroupId == 64 ? (
                          <img
                            src={ChildCompany}
                            width={20}
                            alt={t('componentData.roleEditView.ChildCompany')}
                          />
                        ) : notificationGroupId == 128 ? (
                          <img
                            src={SupplierPending}
                            width={20}
                            alt={t('componentData.roleEditView.SupplierPending')}
                          />
                        ) : notificationGroupId == 1024 ? (
                          <InsertDriveFileIcon style={{width:20 }} />
                        ) : null}
                      </Box>
                      <Typography variant="h3">{description}</Typography>
                    </Box>
                    <Box ml={3} my={2} display="flex" flexDirection="column">
                      {Array.isArray(notificationTypes) &&
                        notificationTypes.map(
                          ({ notificationName, notificationTypeId }) => {
                            return (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={
                                      Array.isArray(
                                        clientNotifications[notificationGroupId]
                                      ) &&
                                      clientNotifications[
                                        notificationGroupId
                                      ].includes(notificationTypeId)
                                    }
                                    onChange={onChangeNotifications}
                                    id={notificationGroupId}
                                    name={notificationTypeId}
                                    color="secondary"
                                    variant="outlined"
                                    checkedIcon={<CheckBoxOutlinedIcon />}
                                    icon={<CheckBoxOutlineBlankOutlinedIcon />}
                                  />
                                }
                                label={notificationName}
                              />
                            );
                          }
                        )}
                    </Box>
                  </>
                );
              }
            )}
        </Box>
      </ExpansionBar>
    );
  }
);

export default withTranslation()(connect((state) => ({ ...state.user }))(NotificationSetting));
