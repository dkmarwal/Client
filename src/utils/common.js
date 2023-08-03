import _ from 'lodash';
export const starredMask = (ssn, maskingLength = 4) => {
    ssn = ssn && ssn.toString();
    let maskedCharsLength = ssn && ssn.length > maskingLength ? ssn.length - maskingLength : 0;
    let str = "";
    str = ssn && "*".repeat(maskedCharsLength) + ssn.slice(maskedCharsLength);

    return str;
};

/**
 *
 * @param string phoneNumber
 * @returns phoneNumber in format 'XXX-XXX-XXXX'
 */
export const getFormattedPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
      const match = phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
          return  match[1] + '-' + match[2] + '-' + match[3];
      }
    }
    return "";
};
  /**
   * function to convert an array of object
   * into desired line chart data format
   */
  export const getLineChartDataFormat = (fieldName, dataSet) => {
    let finalResult = [];
    const groupedData = _.groupBy(dataSet, fieldName);
    for (const item in groupedData) {
      finalResult.push({
        fill: false,
        hoverBackgroundColor: 'white',
        pointHoverBackgroundColor: 'white',
        label: item?.toUpperCase(),
        backgroundColor: groupedData[item][0].colourCode,
        borderColor: groupedData[item][0].colourCode, //paymentColorCodes[item],
        lineTension: 0,
        pointStyle: 'circle',
        data: groupedData[item].map((item) => ({
          y: item.figure,
          x: item.figureFor,
        })),
      });
    }
    return finalResult;
  };

  /**
 * function to convert an array of object
 * into desired barChartData format
 */
export const getBarChartDataFormat = (paymentsArr) => {
  let barChartDataSet = {};
  if (paymentsArr?.length) {
    barChartDataSet = {
      labels: paymentsArr.map((item) => item.description),
      datasets: [
        {
          data: paymentsArr.map((item) => item.totalPaymentCount),
          backgroundColor: paymentsArr.map((item) => item.colourCode),
        },
      ],
    };
  }

  return barChartDataSet;
};

/**
 * function to convert an array of object
 * into desired barChartData format for
 * enrolled payees
 */
export const getEnrolledPayeesBarChartData = (payeesData) => {
  let barChartDataSet = {};
  if (payeesData?.length) {
    barChartDataSet = {
      labels: payeesData.map((item) => item.description),
      datasets: [
        {
          data: payeesData.map((item) => item.totalcount),
          backgroundColor: payeesData.map((item) => item.colorCode),
        },
      ],
    };
  } else barChartDataSet = null;
  return barChartDataSet;
}

// Create our number formatter.
export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
