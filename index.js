const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());


app.get('/', (req, res) => {
  //   res.send(`document.addEventListener("DOMContentLoaded", function() {
  //   if (window.location.pathname.startsWith('/products/')) {
  //     console.log("This is a product page.");
  //     alert("Product Page);
  //   }
  // });`);

  //   res.send(`
  // function checkProductsPage() {
  //   const currentPath = window.location.pathname;

  //   if (currentPath.includes('/products')) {
  //     console.log("You're on the products page!");

  //     alert("Welcome to the Products Page!");
  //   }
  // }

  // checkProductsPage();
  // `)
  // });



  res.send(`
document.addEventListener('DOMContentLoaded', function () {
  if (window.location.pathname.includes('/products') &&
      typeof Shopify !== 'undefined' && typeof Shopify.product !== 'undefined') {
    
    const product = Shopify.product;

    const productTitleElement = document.querySelector('.product-title');
    const productPriceElement = document.querySelector('.product-price');

    if (productTitleElement) {
      productTitleElement.textContent = product.title;
    }

  } else {
    console.error('Not a product page or no product data found.');
  }
});


  `)
});

// if (productPriceElement) {
//   const price = product.variants[0].price;
//   productPriceElement.textContent = `$${parseFloat(price).toFixed(2)}`;
// }

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
