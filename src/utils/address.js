export const getAddress = (data) => {
  let addressString = '';
  if (data?.addressLine1) {
    addressString += data.addressLine1;
  }
  if (data?.addressLine2) {
    addressString += (addressString.length ? ', ' : '') + data.addressLine2;
  }
  if (data?.city) {
    addressString += (addressString.length ? ', ' : '') + data.city;
  }
  if (data?.state) {
    addressString += (addressString.length ? ', ' : '') + data.state;
  }
  if (data?.country) {
    addressString += (addressString.length ? ', ' : '') + data.country;
  }
  if (data?.postalCode) {
    addressString += (addressString.length ? ', ' : '') + data.postalCode;
  }
  return addressString;
};
