import React from "react";
import { connect } from "react-redux";
import AddView from '~/views/Reports/Report/AddView/add'
import EditView from "~/views/Reports/Report/EditView"

const mapStateToProps = state => {
  return { 
    reportDataTypeList: state.report.report.reportDataTypeList,
    reportParametersList: state.report.report.reportParametersList,
    report:state.report.report,
    user:state.user,
    frequencyList:state.report.report.frequencyList,
    selectedReportDetails:state.report.report.selectedReportDetails,
    selectedReportDetailsById:state.report.report.selectedReportDetailsById,
    deleteDynamicReportStatus: state.report.report.deleteDynamicReportStatus
  };
};

export const ReportsAddContainer = connect(mapStateToProps)(AddView)
export const ReportsEditContainer = connect(mapStateToProps)(EditView)