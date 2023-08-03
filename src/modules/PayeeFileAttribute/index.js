import React, { Component, useState } from "react";
import { styles } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { Box, Grid, ListItem, ListItemIcon, ListItemSecondaryAction, List, Tooltip } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CustomCheckbox from "~/components/Forms/CustomCheckbox";
import EditView from '~/modules/PaymentFileAttribute/FileTypes/EditView';
import TextView from '~/modules/PaymentFileAttribute/FileTypes/TextView';
import CustomAttribute from '../CustomAttribute';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { ConfirmDialog } from '~/components/Dialogs';
import { updatePayeeAttribute, setPayeeEditId, deleteCustomPayeeAttributes, reorderPayeeAttributes } from "~/redux/actions/payeeAttribute";
import { entityType, payeeAttributesGroup, payeeGroupHeader } from '~/config/entityTypes';

const ShowAttributeItem = (props) => {
    const [deleted, setDeleted] = useState({ status: false, message: '' });
    const { item, isChild, classes, onCheckClick, onEdit, editId, listItem, dispatch, t } = props;
    const isEditMode = item.index === editId && listItem.id == entityType.PayeeCustomParameterRecord;

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
        dispatch(deleteCustomPayeeAttributes(item, entityType.PayeeCustomParameterRecord));
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
                    />
                </ListItemIcon>

                <Grid container style={{ width: 'auto' }}>
                    {isEditMode ?
                        <EditView item={item} isChild={isChild} isPayee={true} />
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
            <img src={require(`~/assets/icons/drag_indicator.svg`)} style={{ cursor: 'move' }}/>
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
    const startItemIndex = result[startIndex].index;
    const endItemIndex = result[endIndex].index;

    result[startIndex].index = endItemIndex;
    result[endIndex].index = startItemIndex;

    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

class PayeeFileAttribute extends Component {
    constructor(props) {
        super(props);
    }
    onParentClick = (item, e) => {
        const { dispatch } = this.props;

        let childItems = item['childRecord'];
        if (childItems.length) {
            childItems.map(ele => {
                return ele.isChecked = e.target.checked ? 1 : 0
            })
        }
        dispatch(updatePayeeAttribute(childItems, item.id));
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
    onChildClick = (item) => {
        const {listItem, dispatch } = this.props;

        // let list = [...paymentAttribute.attributeList];
        // const index = list.findIndex(x => x.id === listItem.id);
        // const childKey = listItem.id === 1 ? 'fileRecord' : listItem.id === 2 ? 'paymentRecord' : 'remittanceRecord';
        // let childItems = list[index][childKey];
        // const a = childItems.findIndex(x => x.attributeId == item.attributeId);
        // childItems[a].isChecked = 1;
        // list[index][childKey] = childItems;
        item.isChecked = item.isChecked == 0 ? 1 : 0;
        dispatch(updatePayeeAttribute(item, listItem.id));


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

        dispatch(reorderPayeeAttributes(items, listItem.id));
        if (editId != null) {
            dispatch(setPayeeEditId(items[newIndex].index));
        }
    };

    render() {
        const { listItem, classes } = this.props;
        const childAttributeItems = listItem.childRecord.length ? listItem.childRecord : [];

        const filteredChildAttributeItems = childAttributeItems.filter(item => !item.isDeleted);
        filteredChildAttributeItems.map(item => {
            return item.groupName = payeeAttributesGroup[item.fieldName] || "Custom Information";
        })
        return (
            <List>
                <ShowAttributeItem item={listItem} {...this.props} isChild={false}
                    onCheckClick={(e) => this.onParentClick(listItem, e)}
                />
                {payeeGroupHeader.map((ele, ind) => {
                    const groupItem = filteredChildAttributeItems.filter(x => x.groupName == ele);

                    return <SortableContainer key={ind} onSortEnd={this.onSortEnd} useDragHandle>
                        {groupItem.length > 0 && <>
                            <Box className={classes.groupHeader}>{ele}</Box>

                            {groupItem.map((value, index) => {
                                return (<SortableItem key={`item-${index}`} index={index} value={value} isChild={true}
                                    onChildClick={() => this.onChildClick(value)}
                                    {...this.props}
                                />)
                            })}
                        </>
                        }
                    </SortableContainer>
                })}

                {listItem.id === entityType.PayeeCustomParameterRecord ?
                    <CustomAttribute {...this.props}
                        parentId={listItem.id}
                    />
                    : null}
            </List>

        )
    }
}

export default withTranslation()(connect((state) => ({ ...state.payeeAttribute }))(
    withStyles(styles)(PayeeFileAttribute)
));
