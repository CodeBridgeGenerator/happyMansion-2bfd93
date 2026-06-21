const products = require("./products/products.service.js");
const brand = require("./brand/brand.service.js");
const weight = require("./weight/weight.service.js");
const packing = require("./packing/packing.service.js");
const category = require("./category/category.service.js");
// ~cb-add-require-service-name~

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(products);
  app.configure(brand);
  app.configure(weight);
  app.configure(packing);
  app.configure(category);
    // ~cb-add-configure-service-name~
};
