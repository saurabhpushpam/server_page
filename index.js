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
    
    function displayProducts() {
  const productTitleElements = document.querySelectorAll('.product-item .product-title');

  if (productTitleElements.length > 0) {
    let titles = ""; 

    productTitleElements.forEach((titleElement, index) => {
      const titleText = titleElement.textContent || "No title found";
      console.log(titleText);
      titles += titleText + "\n"; 
    });

    alert(titles);
  } else {
    console.error('No product title elements found on this page.');
  }
}

// Call the function to execute it
displayProducts();


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
