import handlebars from 'express-handlebars';

const setupHandlebars = () => {
  return handlebars.engine({
    helpers: {
      gt: function (a, b) {
        return a > b;
      },
      lt: function (a, b) {
        return a < b;
      },
      eq: function (a, b) {
        return a === b;
      },
      multiply: function(a, b) {
        return a * b;
      },
      cartTotal: function(products) {
        if (!products) return 0;
        return products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      }
    },
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    }
  });
};

export default setupHandlebars; 