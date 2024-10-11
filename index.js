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

  res.send(`
function checkProductsPage() {
  const currentPath = window.location.pathname;

  if (currentPath.includes('/products')) {
    console.log("You're on the products page!");

    alert("Welcome to the Products Page!");
  }
}

checkProductsPage();
`)
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
