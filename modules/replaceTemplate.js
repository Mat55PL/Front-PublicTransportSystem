module.exports = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.Id);
  output = output.replace(/{%IMAGE%}/g, product.Brand);
  output = output.replace(/{%PRICE%}/g, product.Model);

  return output;
};
