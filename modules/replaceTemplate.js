module.exports = (temp, product) => {
  let output = temp.replace(/{%STOP_NAME%}/g, product.stopName);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%STOP_CITY%}/g, product.city);
  output = output.replace(/{%BUS_BRAND%}/g, product.brand);
  output = output.replace(/{%BUS_MODEL%}/g, product.model);
  output = output.replace(/{%BUS_YEAR%}/g, product.year);
  return output;
};
