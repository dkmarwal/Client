import React, { Component, Fragment, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { Box, Grid, ListItem, ListItemIcon, ListItemSecondaryAction, List, Tooltip } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';

import { styles } from "./styles";
import CustomCheckbox from "~/components/Forms/CustomCheckbox";
import EditView from './FileTypes/EditView';
import TextView from './FileTypes/TextView';
import CustomAttribute from '../CustomAttribute';
import { ConfirmDialog } from '~/components/Dialogs';
import { reorderPaymentAttributes, updatePaymentAttribute, setPaymentEditId, deleteCustomPaymentAttributes } from "~/redux/actions/paymentAttribute";
import { entityType, paymentControlParameter } from '~/config/entityTypes';

const ShowAttributeItem = (props) => {
    const [deleted, setDeleted] = useState({ status: false, message: '' });
    const { item, isChild, classes, onCheckClick, onEdit, editId, listItem, dispatch, t } = props;
    const isEditMode = item.index && item.index === editId && listItem.id == entityType.PaymentRecordDetail;

    const handleDelete = (item) => {
        setDeleted({
            status: true,
            message: t('componentData.FileMappingTool.customDeleteMsg', { fieldName: item.fieldName })
        })
    }

    const confirmDelete = (item) => {
        setDeleted({
            status: false,
            message: null
        })
        dispatch(deleteCustomPaymentAttributes(item, entityType.PaymentRecordDetail));
    }

    return (
        <>
            <ListItem key={isChild ? item.attributeId : item.id} role={undefined} dense disableGutters={true} className={isChild ? classes.listItems : classes.parentListItems}>
                {!isChild && <Box pl={3}></Box>}

                <ListItemIcon style={!isChild ? { width: '100%' } : { width: 'auto' }}>
                    <CustomCheckbox
                        item={item}
                        isChild={isChild}
                        onClick={onCheckClick}
                        listItems={listItem}
                    />
                </ListItemIcon>

                <Grid container style={{ width: 'auto' }}>
                    {isEditMode ?
                        <EditView item={item} isChild={isChild} isPayee={false} />
                        :
                        <TextView item={item} isChild={isChild} />
                    }
                    <Box>
                        <ListItemSecondaryAction>
                            {item.attributeId == null && !isEditMode && isChild &&
                                <>
                                    <Tooltip title={t('componentData.FileMappingTool.deleteTooltip')}>
                                        <IconButton aria-label="delete" size="small">
                                            <DeleteIcon fontSize="inherit" color="primary" onClick={() => handleDelete(item)} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t('componentData.FileMappingTool.editTooltip')}>
                                        <IconButton aria-label="edit" size="small">
                                            <EditIcon fontSize="inherit" color="primary" onClick={onEdit} />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            }
                        </ListItemSecondaryAction>
                    </Box>
                </Grid>
            </ListItem>

            {deleted.status &&
                <ConfirmDialog
                    //title={"Delete"}
                    icon={<DeleteIcon className={classes.deleteIconColor} />}
                    message={deleted.message}
                    onCancel={() => setDeleted(!deleted.status)}
                    onConfirm={() => confirmDelete(item)}
                />
            }
        </>
    )
}

const DragHandle = sortableHandle(() =>
    <Box component="span" pt={1.2} pr={1.2}>
        <Tooltip title="Drag">
            <img src={require(`~/assets/icons/drag_indicator.svg`)} style={{ cursor: 'move' }} />
        </Tooltip>
    </Box>
);

const SortableItem = sortableElement(props => {
    const { value, onEdit, onDelete, onChildClick } = props;

    return <Box display="flex" borderBottom="1px solid #d8d8da" px={1} py={0.5} bgcolor="#fafbfe" borderRadius="8px" mb={0.5}>
        <DragHandle />
        <ShowAttributeItem item={value} isChild={true} {...props}
            onCheckClick={onChildClick}
            onEdit={() => onEdit(value)}
            onDelete={() => onDelete(value)}
        />
    </Box>
});

const SortableContainer = sortableContainer(({ children }) => {
    return <ul>{children}</ul>;
});

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const startIndexVal = result[startIndex].index;
    const endIndexVal = result[endIndex].index;

    result[startIndex].index = endIndexVal;
    result[endIndex].index = startIndexVal;

    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
};

class PaymentFileAttribute extends Component {
    onParentClick = (item, e) => {
        const { dispatch } = this.props;

        const childItems = item['childRecord'];
        if (childItems.length) {
            childItems.map(ele => {
                return ele.isChecked == e.target.checked ? 1 : 0
            })
        }
        dispatch(updatePaymentAttribute(childItems, item.id));
        // const checkIndex = selectedIds.indexOf(val.id);
        // let newChecked = [...selectedIds];
        // const getChildren = val.children && val.children.map(a => a.id) || [];
        // const allIds = [...getChildren, val.id];
        // if (checkIndex === -1) {
        //     newChecked.push(...allIds);
        // }
        // else {
        //     newChecked = newChecked.filter(item => !allIds.includes(item));
        // }
        // onChangeHandler(newChecked);
    }
    onChildClick = (item, e) => {
        const { listItem, dispatch } = this.props;

        // let list = [...paymentAttribute.attributeList];
        // const index = list.findIndex(x => x.id === listItem.id);
        // const childKey = listItem.id === 1 ? 'fileRecord' : listItem.id === 2 ? 'paymentRecord' : 'remittanceRecord';
        // let childItems = list[index][childKey];
        // const a = childItems.findIndex(x => x.attributeId == item.attributeId);
        // childItems[a].isChecked = 1;
        // list[index][childKey] = childItems;

        if (item.control_group && item.control_group !== null) {
            let allControlItems = listItem.childRecord ? listItem.childRecord.filter(x => x.control_group == item.control_group) : [];
            if (allControlItems.length) {
                allControlItems.map(ele => {
                    return ele.isChecked = e.target.checked ? 1 : 0
                })
            }
            dispatch(updatePaymentAttribute(allControlItems, listItem.id));
        }
        else {
            item.isChecked = item.isChecked == 0 ? 1 : 0;
            dispatch(updatePaymentAttribute(item, listItem.id));
        }

        // const checkIndex = selectedIds.indexOf(val.attributeId);
        // let newChecked = [...selectedIds];
        // if (checkIndex === -1) {
        //     newChecked.push(val.attributeId);
        // } else {
        //     newChecked.splice(checkIndex, 1);
        // }

        // const childKey = listItem.id === 1 ? 'fileRecord' : listItem.id === 2 ? 'paymentRecord' : 'remittanceRecord';
        // let arr = listItem[childKey].length ? listItem[childKey].map(a => a.attributeId) : [];
        // const isAllExist = arr.every(v => newChecked.includes(v));
        // if (isAllExist) {
        //     newChecked.push(listItem.id);
        // } else {
        //     newChecked = newChecked.filter(function (ele) { return ele != listItem.id })
        // }

        // onChangeHandler(newChecked);
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        const { listItem, dispatch, editId } = this.props;

        const items = reorder(listItem['childRecord'], oldIndex, newIndex);

        dispatch(reorderPaymentAttributes(items, listItem.id));
        if (editId != null) {
            dispatch(setPaymentEditId(items[newIndex].index));
        }
    };
    render() {
        const { listItem } = this.props;
        const childAttributeItems = listItem.childRecord.length ? listItem.childRecord : [];

        const filteredChildAttributeItems = childAttributeItems.filter(item => !item.isDeleted);

        return (
            <List>
                <ShowAttributeItem item={listItem} {...this.props} isChild={false}
                    onCheckClick={(e) => this.onParentClick(listItem, e)}
                />
                <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
                    {filteredChildAttributeItems.map((value, index) => {
                        return (<Fragment key={index}>
                            {value.control_group == null || paymentControlParameter.includes(value.fieldName) ?
                                <SortableItem key={`item-${index}`} index={index} value={value} isChild={true}
                                    onChildClick={(e) => this.onChildClick(value, e)}
                                    {...this.props}
                                />
                                : null
                            }
                        </Fragment>
                        )
                    })}
                    {listItem.id === entityType.PaymentRecordDetail ?
                        <CustomAttribute {...this.props} parentId={listItem.id} />
                        : null}
                </SortableContainer>
            </List>
        )
    }
}

export default withTranslation()(connect((state) => ({ ...state.paymentAttribute }))(
    withStyles(styles)(PaymentFileAttribute)
));
