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
  //   function checkProductsPage() {
  //     const currentPath = window.location.pathname;

  //     if (currentPath.includes('/products')) {
  //       console.log("You're on the products page!");

  //       alert("Welcome to the Products Page!");
  //     }
  //   }

  //   checkProductsPage();
  //   `)
  // });


  res.send(`
  document.addEventListener("DOMContentLoaded", async () => {
    const urlParts = window.location.pathname.split("/");
    const handle = urlParts[urlParts.length - 1];

    const query = \`
      query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          title
        }
      }
    \`;

    const response = await fetch("/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": "shpua_f467a9bdebce1123d2cef6ab05d54d39"
      },
      body: JSON.stringify({ query, variables: { handle } }),
    });

    const data = await response.json();
    const productTitle = data.data.productByHandle ? data.data.productByHandle.title : "Product not found";

    alert(productTitle);
  });
`);
});




//   res.send(`

//     function displayProducts() {
//     alert("Hello");
//    if (window.location.pathname.includes('/products/')) {

//     const urlPath = window.location.pathname;
//     const productTitle = urlPath.split('/products/')[1].split('?')[0];

//     console.log("Product Title:", productTitle);
//     alert("Product Title: " + productTitle);
//   } else {
//     console.error('Not on a product page.');
//   }

// displayProducts();


//   `)
// });


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
