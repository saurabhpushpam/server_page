const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());


app.get('/', (req, res) => {
  res.send(`document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.startsWith('/products/')) {
    console.log("This is a product page.");
    alert("Product Page);
  }
});`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
