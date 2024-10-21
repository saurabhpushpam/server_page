const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');

const axios = require('axios');


const DB = "mongodb+srv://spuspam111:Sp123456@cluster0.0taaaup.mongodb.net/scripttag?retryWrites=true&w=majority";
mongoose.connect(DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });


const Shop = mongoose.model('Shop', new mongoose.Schema({
  shop: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  isEnabled: { type: String, default: false }
}));


app.get('/serve-script/:shop', async (req, res) => {
  // Extract the shop parameter from the query string
  const shopName = req.params.shop;

  if (!shopName) {
    return res.status(400).send('Shop name is required');
  }

  // Find shop details in MongoDB
  const shopData = await Shop.findOne({ shop: shopName });

  if (!shopData) {
    return res.status(404).send('Shop not found');
  }

  // Generate dynamic JavaScript
  const scriptContent = `
    document.addEventListener("DOMContentLoaded", async () => {
      const urlParts = window.location.pathname.split("/");
      const handle = urlParts[urlParts.length - 1];
      
      if (handle) {
        const response = await fetch("https://${shopData.shop}/admin/api/2024-04/products.json?handle=" + handle, {
          method: "GET",
          headers: {
            "X-Shopify-Access-Token": "${shopData.accessToken}",
            "Content-Type": "application/json",
          },
        });
        
        const data = await response.json();
        
        if (data.products && data.products.length > 0) {
          alert("Product title: " + data.products[0].title);
        } else {
          alert("Product not found.");
        }
      }
    });
  `;

  // Set Content-Type to JavaScript
  res.setHeader('Content-Type', 'application/javascript');
  res.send(scriptContent);
});








app.get("/check-store", async (req, res) => {
  const { shop } = req.query;

  try {
    const store = await Shop.findOne({ shop });

    if (!store) {
      return res.status(404).json({ message: "Store not registered." });
    }

    res.json({ accessToken: store.accessToken });
  } catch (error) {
    console.error("Error retrieving store data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




app.get("/server-script.js", (req, res) => {
  res.set("Content-Type", "application/javascript");


  // var shop = 'demosaurav.myshopify.com';
  // res.send(`
  //      var shop = window.location.hostname;

  //     function displayProductInfo() {
  //       const shop = "${shop}"; // Injected from server into client script
  //       const pathParts = window.location.pathname.split("/");

  //       console.log("Script loaded for shop:", shop);

  //       async function fetchProductData() {
  //         try {
  //           const displayContainer = document.createElement("div");
  //           displayContainer.style = "position: fixed; top: 0; left: 0; width: 100%; background: #f0f8ff; color: #333; padding: 20px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); z-index: 9999;";
  //           displayContainer.innerHTML = "<h3>Product Information</h3>";
  //           document.body.insertAdjacentElement("afterbegin", displayContainer);

  //           const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
  //           const tokenData = await tokenResponse.json();

  //           if (!tokenData || !tokenData.accessToken) {
  //             alert("Store not registered or access token not found.");
  //             return;
  //           }

  //           const accessToken = tokenData.accessToken;

  //           const insertSchema = (products) => {
  //             products.forEach((product) => {
  //               const schema = {
  //                 "@context": "https://schema.org/",
  //                 "@type": "Product",
  //                 "name": product.title,
  //                 "image": product.images ? product.images.map((img) => img.src) : [],
  //                 "description": product.body_html || "",
  //                 "sku": product.sku || "",
  //                 "brand": { "@type": "Brand", "name": product.vendor || "" },
  //                 "offers": {
  //                   "@type": "Offer",
  //                   "priceCurrency": tokenData.currency || "USD",
  //                   "price": product.variants && product.variants[0] ? product.variants[0].price : "0",
  //                   "availability": product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  //                   "url": \`https://${shop}/products/\${product.handle}\`,
  //                   "seller": { "@type": "Organization", "name": shop }
  //                 }
  //               };

  //               const scriptTag = document.createElement("script");
  //               scriptTag.type = "application/ld+json";
  //               scriptTag.text = JSON.stringify(schema);
  //               document.head.appendChild(scriptTag);

  //               const productInfo = \`
  //                 <div style="margin-bottom: 10px;">
  //                   <strong>Product Title:</strong> \${product.title} <br>
  //                   <strong>Price:</strong> \${product.variants && product.variants[0] ? product.variants[0].price : "N/A"} \${tokenData.currency || "USD"} <br>
  //                 </div>
  //               \`;
  //               displayContainer.innerHTML += productInfo;
  //             });
  //           };

  //           if (pathParts[1] === "products" && pathParts[2]) {
  //             const handle = pathParts[2];
  //             const productResponse = await fetch(\`https://${shop}/admin/api/2024-04/products.json?handle=\${handle}\`, {
  //               method: "GET",
  //               headers: { "X-Shopify-Access-Token": accessToken, "Content-Type": "application/json" },
  //             });
  //             const productData = await productResponse.json();
  //             if (productData.products && productData.products.length > 0) {
  //               insertSchema(productData.products);
  //             } else {
  //               alert("Product not found.");
  //             }
  //           } else if (pathParts[1] === "products") {
  //             const productsResponse = await fetch(\`https://${shop}/admin/api/2024-04/products.json\`, {
  //               method: "GET",
  //               headers: { "X-Shopify-Access-Token": accessToken, "Content-Type": "application/json" },
  //             });
  //             const productsData = await productsResponse.json();
  //             if (productsData.products && productsData.products.length > 0) {
  //               insertSchema(productsData.products);
  //             } else {
  //               alert("No products found.");
  //             }
  //           }
  //         } catch (error) {
  //           console.error("Error fetching product data:", error);
  //         }
  //       }

  //       fetchProductData();
  //     }

  //     displayProductInfo();
  //   `);












  res.send(`
    const shop = window.location.hostname;
  
    async function insertProductSchema() {
      try {
        const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
        const tokenData = await tokenResponse.json();
  
        if (tokenData && tokenData.accessToken) {
          const accessToken = tokenData.accessToken;
          const pathParts = window.location.pathname.split("/");
  
          if (pathParts[1] === "products") {
            const handle = pathParts[2];
  
            let productData;
            if (handle) {
              const productResponse = await fetch(
                \`https://\${shop}/admin/api/2024-04/products.json?handle=\${handle}\`,
                {
                  method: "GET",
                  headers: {
                    "X-Shopify-Access-Token": accessToken,
                    "Content-Type": "application/json",
                  },
                }
              );
              productData = await productResponse.json();
              if (productData.products && productData.products.length > 0) {
                const product = productData.products[0];
                insertSchema(product);
              } else {
                console.warn("Product not found.");
              }
            } else {
              const allProductsResponse = await fetch(
                \`https://\${shop}/admin/api/2024-04/products.json\`,
                {
                  method: "GET",
                  headers: {
                    "X-Shopify-Access-Token": accessToken,
                    "Content-Type": "application/json",
                  },
                }
              );
              productData = await allProductsResponse.json();
              if (productData.products && productData.products.length > 0) {
                productData.products.forEach(insertSchema);
              } else {
                console.warn("No products found.");
              }
            }
          } else {
            console.warn("Not on products page.");
          }
        } else {
          console.warn("Access token not found for this shop.");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }
  
    function insertSchema(product) {
      const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "shipping_fee": 100,
        "shipping_Address": "India",
        "image": product.images.map(image => image.src),
        "description": product.body_html.replace(/<[^>]*>/g, ""),
        "sku": product.variants[0].sku,
        "mpn": product.variants[0].sku,
        "brand": {
          "@type": "Brand",
          "name": product.vendor
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": product.variants[0].currency,
          "price": product.variants[0].price,
          "itemCondition": "https://schema.org/NewCondition",
          "availability": product.variants[0].inventory_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": window.location.href,
          "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
          "seller": {
            "@type": "Organization",
            "name": shop
          }
        }
      };
  
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
      console.log("JSON-LD schema inserted for product:", product.title);
    }
  
    insertProductSchema();
  `);







  // append all data in schema in head tag

  // res.send(`
  //    const shop = window.location.hostname;

  //   async function insertProductSchema() {


  //     try {
  //       // Fetch access token from server
  //       const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
  //       const tokenData = await tokenResponse.json();

  //       if (tokenData && tokenData.accessToken) {
  //         const accessToken = tokenData.accessToken;
  //         const pathParts = window.location.pathname.split("/");

  //         // Check if on products page or single product page
  //         if (pathParts[1] === "products") {
  //           const handle = pathParts[2];

  //           let productData;
  //           if (handle) {
  //             // Fetch specific product by handle
  //             const productResponse = await fetch(
  //               \`https://\${shop}/admin/api/2024-04/products.json?handle=\${handle}\`,
  //               {
  //                 method: "GET",
  //                 headers: {
  //                   "X-Shopify-Access-Token": accessToken,
  //                   "Content-Type": "application/json",
  //                 },
  //               }
  //             );
  //             productData = await productResponse.json();
  //             if (productData.products && productData.products.length > 0) {
  //               const product = productData.products[0];
  //               insertSchema(product);
  //             } else {
  //               console.warn("Product not found.");
  //             }
  //           } else {
  //             // Fetch all products for the /products page
  //             const allProductsResponse = await fetch(
  //               \`https://\${shop}/admin/api/2024-04/products.json\`,
  //               {
  //                 method: "GET",
  //                 headers: {
  //                   "X-Shopify-Access-Token": accessToken,
  //                   "Content-Type": "application/json",
  //                 },
  //               }
  //             );
  //             productData = await allProductsResponse.json();
  //             if (productData.products && productData.products.length > 0) {
  //               productData.products.forEach(insertSchema);
  //             } else {
  //               console.warn("No products found.");
  //             }
  //           }
  //         } else {
  //           console.warn("Not on products page.");
  //         }
  //       } else {
  //         console.warn("Access token not found for this shop.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching product data:", error);
  //     }
  //   }

  //   function insertSchema(product) {
  //     // Build the JSON-LD schema for the product
  //     const schemaData = {
  //       "@context": "https://schema.org/",
  //       "@type": "Product",
  //       "name": product.title,
  //       "image": product.images.map(image => image.src),
  //       "description": product.body_html.replace(/<[^>]*>/g, ""),
  //       "sku": product.variants[0].sku,
  //       "mpn": product.variants[0].sku,
  //       "brand": {
  //         "@type": "Brand",
  //         "name": product.vendor
  //       },
  //       "offers": {
  //         "@type": "Offer",
  //         "priceCurrency": product.variants[0].currency,
  //         "price": product.variants[0].price,
  //         "itemCondition": "https://schema.org/NewCondition",
  //         "availability": product.variants[0].inventory_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  //         "url": window.location.href,
  //         "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
  //         "seller": {
  //           "@type": "Organization",
  //           "name": shop
  //         }
  //       }
  //     };

  //     // Create a <script> tag and insert JSON-LD structured data
  //     const script = document.createElement("script");
  //     script.type = "application/ld+json";
  //     script.text = JSON.stringify(schemaData);
  //     document.head.appendChild(script);
  //     console.log("JSON-LD schema inserted for product:", product.title);
  //   }

  //   insertProductSchema();
  // `);




  // alert all product title if we are in /products page, and if we are in single product page then alert product title and price

  // res.send(`
  //   async function hello() {
  //     const shop = window.location.hostname;
  //     alert("Shop: " + shop);

  //     try {
  //       // Fetch access token from server
  //       const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
  //       const tokenData = await tokenResponse.json();

  //       if (tokenData && tokenData.accessToken) {
  //         const accessToken = tokenData.accessToken;
  //         alert("Access Token: " + accessToken);

  //         const pathParts = window.location.pathname.split("/");

  //         // Check if on products page or a single product page
  //         if (pathParts[1] === "products") {
  //           const handle = pathParts[2];

  //           if (handle) {
  //             // If a specific product handle is in the URL, fetch that product's data
  //             alert("Product Handle: " + handle);

  //             const productResponse = await fetch(
  //               \`https://\${shop}/admin/api/2024-04/products.json?handle=\${handle}\`,
  //               {
  //                 method: "GET",
  //                 headers: {
  //                   "X-Shopify-Access-Token": accessToken,
  //                   "Content-Type": "application/json",
  //                 },
  //               }
  //             );

  //             const productData = await productResponse.json();

  //             if (productData.products && productData.products.length > 0) {
  //               const product = productData.products[0];
  //               alert("Product Title: " + product.title + "\\nPrice: $" + product.variants[0].price);
  //             } else {
  //               alert("Product not found.");
  //             }
  //           } else {
  //             // No handle: Fetch all products
  //             const allProductsResponse = await fetch(
  //               \`https://\${shop}/admin/api/2024-04/products.json\`,
  //               {
  //                 method: "GET",
  //                 headers: {
  //                   "X-Shopify-Access-Token": accessToken,
  //                   "Content-Type": "application/json",
  //                 },
  //               }
  //             );

  //             const allProductsData = await allProductsResponse.json();

  //             if (allProductsData.products && allProductsData.products.length > 0) {
  //               const productTitles = allProductsData.products.map(product => product.title);
  //               alert("All Products:\\n" + productTitles.join("\\n"));
  //             } else {
  //               alert("No products found.");
  //             }
  //           }
  //         } else {
  //           alert("Not on products page.");
  //         }
  //       } else {
  //         alert("Access token not found for this shop.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching product data:", error);
  //       alert("Failed to fetch product data.");
  //     }
  //   }

  //   hello();
  // `);


  // display single product title 

  // res.send(`
  //   async function hello(){
  //        const shop = window.location.hostname;

  //       alert('helloooooooooo');

  //       try {

  //         const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
  //         const tokenData = await tokenResponse.json();


  //       if (tokenData && tokenData.accessToken) {
  //         const accessToken = tokenData.accessToken;
  //         alert("Access Token: " + accessToken);

  //         // Check if on a product page
  //         const pathParts = window.location.pathname.split("/");
  //         if (pathParts[1] === "products" && pathParts[2]) {
  //           const handle = pathParts[2];
  //           alert("Product Handle: " + handle);

  //           // Fetch product details using the handle
  //           const productResponse = await fetch(
  //             \`https://\${shop}/admin/api/2024-04/products.json?handle=\${handle}\`,
  //             {
  //               method: "GET",
  //               headers: {
  //                 "X-Shopify-Access-Token": accessToken,
  //                 "Content-Type": "application/json",
  //               },
  //             }
  //           );

  //           const productData = await productResponse.json();

  //           if (productData.products && productData.products.length > 0) {
  //             alert("Product Title: " + productData.products[0].title);
  //           } else {
  //             alert("Product not found.");
  //           }
  //         } else {
  //           alert("No product found.");
  //         }
  //       } else {
  //         alert("Access token not found for this shop.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching product data:", error);
  //       alert("Failed to fetch product data.");
  //     }
  //   }
  //      hello();
  //   `);








  // display token


  // res.send(`
  //   async function hello(){
  //        const shop = window.location.hostname;

  //       alert('helloooooooooo');

  //       try {

  //         const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
  //         const tokenData = await tokenResponse.json();

  //         if (tokenData && tokenData.accessToken) {
  //           alert("Access Token: " + tokenData.accessToken);
  //         } else {
  //           alert("Access token not found for this shop.");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching token:", error);
  //         alert("Failed to fetch access token.");
  //       }
  //   }
  //      hello();
  //   `);
});




//   res.send(`
//   document.addEventListener("DOMContentLoaded", async () => {
//     const shop = window.location.hostname;

//     try {
//       const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
//       const tokenData = await tokenResponse.json();
//       alert(tokenData);

//       if (!tokenData || !tokenData.accessToken) {
//         console.warn("Store not registered or access token not found.");
//         return;
//       }

//       const accessToken = tokenData.accessToken;
//       console.log(accessToken);
//       const pathParts = window.location.pathname.split("/");

//       if (pathParts[1] === "products" && pathParts[2]) {
//         const handle = pathParts[2];

//         const productResponse = await fetch(
//           \`https://\${shop}/admin/api/2024-04/products.json?handle=\${handle}\`,
//           {
//             method: "GET",
//             headers: {
//               "X-Shopify-Access-Token": accessToken,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const productData = await productResponse.json();

//         if (productData.products && productData.products.length > 0) {
//         console.log('hello');
//           alert(\`Product Title: \${productData.products[0].title}\`);
//         } else {
//          console.log('Product not found.');
//           alert("Product not found.");
//         }
//       } else {
//         console.log('no Product found');
//         alert("No product found.");
//       }
//     } catch (error) {
//       console.error("Error fetching product data:", error);
//     }
//   });
// `);
// });



// app.get('server-script', async (req, res) => {
//   `
// document.addEventListener("DOMContentLoaded", async () => {
//   const shop = window.location.hostname; // Store name from URL

//   try {
//     const tokenResponse = await fetch(`https://server-page-xo9v.onrender.com/serve-script.js
// /check-store?shop=${shop}`);
// const tokenData = await tokenResponse.json();

// if (!tokenData || !tokenData.accessToken) {
//   console.warn("Store not registered or access token not found.");
//   return;
// }

// const accessToken = tokenData.accessToken;

// const pathParts = window.location.pathname.split("/");
// if (pathParts[1] === "products" && pathParts[2]) {
//   const handle = pathParts[2];

//   const productResponse = await fetch(
//     `https://${shop}/admin/api/2024-04/products.json?handle=${handle}`,
//     {
//       method: "GET",
//       headers: {
//         "X-Shopify-Access-Token": accessToken,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   const productData = await productResponse.json();

//   if (productData.products && productData.products.length > 0) {
//     alert(`Product Title: ${productData.products[0].title}`);
//   } else {
//     alert("Product not found.");
//   }
// } else {
//   alert("No product found.");
// }
//   } catch (error) {
//   console.error("Error fetching product data:", error);
// }
// });

// })








app.get('/', (req, res) => {
  //   res.send(`document.addEventListener("DOMContentLoaded", function () {
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


  //   res.send(`
  //   document.addEventListener("DOMContentLoaded", async () => {
  //     const urlParts = window.location.pathname.split("/");
  //     const handle = urlParts[urlParts.length - 1];

  //     const query = \`
  //       query getProductByHandle($handle: String!) {
  //         productByHandle(handle: $handle) {
  //           title
  //         }
  //       }
  //     \`;

  //     const response = await fetch("/api/graphql", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-Shopify-Storefront-Access-Token": "shpua_f467a9bdebce1123d2cef6ab05d54d39"
  //       },
  //       body: JSON.stringify({ query, variables: { handle } }),
  //     });

  //     const data = await response.json();
  //     const productTitle = data.data.productByHandle ? data.data.productByHandle.title : "Product not found";

  //     alert(productTitle);
  //   });
  // `);
  // });



  res.send(`alert('hello')`)
});



app.get('/static/product-title-script.js', (req, res) => {
  res.send(`
    document.addEventListener("DOMContentLoaded", async () => {
      const urlParts = window.location.pathname.split("/");
      if (urlParts[1] === "products") {
        const handle = urlParts[urlParts.length - 1];
        
        try {
          const response = await fetch('/admin/api/products/' + handle);
          const product = await response.json();
          alert(product.title || "Product not found");
        } catch (error) {
          console.error("Error fetching product title:", error);
          alert("Error fetching product title");
        }
      }
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








// app.get("/remove-script.js", (req, res) => {
//   res.set("Content-Type", "application/javascript");

//   res.send(`
//     const shop = window.location.hostname;

//     async function removeProductSchema() {
//       try {
//         const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
//         const tokenData = await tokenResponse.json();

//         if (tokenData && tokenData.accessToken) {
//           const accessToken = tokenData.accessToken;
//           const pathParts = window.location.pathname.split("/");

//           if (pathParts[1] === "products") {
//             const handle = pathParts[2];

//             if (handle) {
//               // Remove schema for a single product if on a specific product page
//               const singleProductSchema = document.querySelector(\`script[data-product-handle="\${handle}"]\`);
//               if (singleProductSchema) {
//                 document.head.removeChild(singleProductSchema);
//                 console.log(\`JSON-LD schema removed for product handle: \${handle}\`);
//               } else {
//                 console.warn(\`Schema not found for product handle: \${handle}\`);
//               }
//             } else {
//               // Remove all product schemas if on the /products listing page
//               const allProductSchemas = document.querySelectorAll('script[data-product-handle]');
//               allProductSchemas.forEach(script => document.head.removeChild(script));
//               console.log("All JSON-LD schemas removed for products.");
//             }
//           } else {
//             console.warn("Not on products page.");
//           }
//         } else {
//           console.warn("Access token not found for this shop.");
//         }
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//       }
//     }

//     // Function call to initiate schema removal
//     removeProductSchema();
//   `);


// });







app.get('/remove-server-script', (req, res) => {
  res.set("Content-Type", "application/javascript");

  // JavaScript to remove the script tag
  res.send(`
    async function removeServerScript() {
      const scriptUrl = "https://server-page-xo9v.onrender.com/server-script.js";
      
      // Find the script tag
      const scriptTag = document.querySelector('script[src="' + scriptUrl + '"]');
      if (scriptTag) {
        scriptTag.parentNode.removeChild(scriptTag);
        console.log("Server script removed successfully.");
      } else {
        console.warn("Server script not found.");
      }
    }
  
    removeServerScript();
  `);

});






// insert scripttag for remove product from head


app.get('/removetag/:shopname', async (req, res) => {

  // const shop = 'demosaurav.myshopify.com';
  // const shop = window.location.hostname;
  const shop = req.params.shopname;
  // const store = await Shop.findOne({ shop });
  // const accessToken = store.accessToken;

  // if (!store) {
  //   return res.status(404).json({ message: "Store not registered." });
  // }

  const scriptUrl = "https://server-page-xo9v.onrender.com/product-script.js";
  // const scriptUrl = "https://server-page-xo9v.onrender.com/remove-schema-script.js";

  try {
    // Fetch shop data
    // const store = await Shop.findOne({ shop });
    const shopData = await Shop.findOne({ shop });
    console.log(shopData);

    if (!shopData || !shopData.accessToken) {
      return res.status(404).json({ message: `No access token found for store ${shop}` });
    }

    const accessToken = shopData.accessToken;

    // Step 1: Check for existing script tags
    const existingResponse = await axios.get(`https://${shop}/admin/api/2024-10/script_tags.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    const existingData = existingResponse.data;

    // Step 2: Normalize the script URL
    const normalizedScriptUrl = new URL(scriptUrl).href;

    // Step 3: Find the script tag ID to remove
    const scriptTag = existingData.script_tags.find(tag => new URL(tag.src).href === normalizedScriptUrl);

    if (scriptTag) {
      // Step 4: Remove the script tag
      await axios.delete(`https://${shop}/admin/api/2024-10/script_tags/${scriptTag.id}.json`, {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      });

      console.log(`Script tag removed for store ${shop}`);
      return res.status(200).json({ message: `Script tag removed for store ${shop}` });
    } else {
      console.log(`No matching script tag found for store ${shop}`);
      return res.status(404).json({ message: `No matching script tag found for store ${shop}` });
    }
  } catch (error) {
    console.error(`Error removing script tag for store ${shop}:`, error.message);
    return res.status(500).json({ message: `Error removing script tag for store ${shop}`, error: error.message });
  }
});







// app.get("/all-script.js", (req, res) => {
//   res.set("Content-Type", "application/javascript");
//   res.send(`
//     const shop = window.location.hostname;

//     async function insertSchemaBasedOnPage() {
//       try {
//         const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
//         const tokenData = await tokenResponse.json();

//         if (tokenData && tokenData.accessToken) {
//           const accessToken = tokenData.accessToken;
//           const pathParts = window.location.pathname.split("/");

//           if (pathParts[1] === "products") {
//             // Handle Product Schema
//             await insertProductSchema(accessToken, shop, pathParts);
//           } else if (pathParts[1] === "collections") {
//             // Handle Collection Schema
//             await insertCollectionSchema(accessToken, shop, pathParts);
//           } else if (pathParts[1] === "blogs" && pathParts[3] === "articles") {
//             // Handle Article Schema
//             await insertArticleSchema(accessToken, shop, pathParts);
//           } else if (pathParts[1] === "blogs") {
//             // Handle Blog Schema
//             await insertBlogSchema(accessToken, shop, pathParts);
//           } else {
//             console.warn("Not on a products, collections, blogs, or articles page.");
//           }
//         } else {
//           console.warn("Access token not found for this shop.");
//         }
//       } catch (error) {
//         console.error("Error fetching schema data:", error);
//       }
//     }

//     // Product Schema Insertion
//     async function insertProductSchema(accessToken, shop, pathParts) {
//       const handle = pathParts[2];
//       try {
//         let productData;
//         if (handle) {
//           const productResponse = await fetch(
//             \`https://\${shop}/admin/api/2024-04/products.json?handle=\${handle}\`,
//             {
//               method: "GET",
//               headers: {
//                 "X-Shopify-Access-Token": accessToken,
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           productData = await productResponse.json();
//           if (productData.products && productData.products.length > 0) {
//             const product = productData.products[0];
//             insertProductSchemaData(product, shop);
//           } else {
//             console.warn("Product not found.");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//       }
//     }

//     // Collection Schema Insertion
//     async function insertCollectionSchema(accessToken, shop, pathParts) {
//       const handle = pathParts[2];
//       try {
//         let collectionData;
//         const collectionResponse = await fetch(
//           \`https://\${shop}/admin/api/2024-04/collections.json?handle=\${handle}\`,
//           {
//             method: "GET",
//             headers: {
//               "X-Shopify-Access-Token": accessToken,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         collectionData = await collectionResponse.json();
//         if (collectionData.collections && collectionData.collections.length > 0) {
//           const collection = collectionData.collections[0];
//           insertCollectionSchemaData(collection, shop);
//         } else {
//           console.warn("Collection not found.");
//         }
//       } catch (error) {
//         console.error("Error fetching collection data:", error);
//       }
//     }

//     // Article Schema Insertion
//     async function insertArticleSchema(accessToken, shop, pathParts) {
//       const blogHandle = pathParts[2];
//       const articleHandle = pathParts[4];
//       try {
//         let articleData;
//         const articleResponse = await fetch(
//           \`https://\${shop}/admin/api/2024-04/blogs/\${blogHandle}/articles.json?handle=\${articleHandle}\`,
//           {
//             method: "GET",
//             headers: {
//               "X-Shopify-Access-Token": accessToken,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         articleData = await articleResponse.json();
//         if (articleData.articles && articleData.articles.length > 0) {
//           const article = articleData.articles[0];
//           insertArticleSchemaData(article, shop);
//         } else {
//           console.warn("Article not found.");
//         }
//       } catch (error) {
//         console.error("Error fetching article data:", error);
//       }
//     }

//     // Blog Schema Insertion
//     async function insertBlogSchema(accessToken, shop, pathParts) {
//       const handle = pathParts[2];
//       try {
//         let blogData;
//         const blogResponse = await fetch(
//           \`https://\${shop}/admin/api/2024-04/blogs.json?handle=\${handle}\`,
//           {
//             method: "GET",
//             headers: {
//               "X-Shopify-Access-Token": accessToken,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         blogData = await blogResponse.json();
//         if (blogData.blogs && blogData.blogs.length > 0) {
//           const blog = blogData.blogs[0];
//           insertBlogSchemaData(blog, shop);
//         } else {
//           console.warn("Blog not found.");
//         }
//       } catch (error) {
//         console.error("Error fetching blog data:", error);
//       }
//     }

//     // Insert Product Schema Data
//     function insertProductSchemaData(product, shop) {
//       const schemaData = {
//         "@context": "https://schema.org/",
//         "@type": "Product",
//         "name": product.title,
//         "image": product.images.map(image => image.src),
//         "description": product.body_html.replace(/<[^>]*>/g, ""),
//         "sku": product.variants[0].sku,
//         "brand": { "@type": "Brand", "name": product.vendor },
//         "offers": {
//           "@type": "Offer",
//           "price": product.variants[0].price,
//           "priceCurrency": product.variants[0].currency,
//           "availability": product.variants[0].inventory_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
//           "url": window.location.href,
//           "seller": { "@type": "Organization", "name": shop }
//         }
//       };
//       insertSchemaToDOM(schemaData);
//     }

//     // Insert Collection Schema Data
//     function insertCollectionSchemaData(collection, shop) {
//       const schemaData = {
//         "@context": "https://schema.org/",
//         "@type": "Collection",
//         "name": collection.title,
//         "description": collection.body_html.replace(/<[^>]*>/g, ""),
//         "url": window.location.href,
//         "seller": { "@type": "Organization", "name": shop }
//       };
//       insertSchemaToDOM(schemaData);
//     }

//     // Insert Article Schema Data
//     function insertArticleSchemaData(article, shop) {
//       const schemaData = {
//         "@context": "https://schema.org/",
//         "@type": "Article",
//         "headline": article.title,
//         "author": article.author,
//         "datePublished": article.published_at,
//         "url": window.location.href
//       };
//       insertSchemaToDOM(schemaData);
//     }

//     // Insert Blog Schema Data
//     function insertBlogSchemaData(blog, shop) {
//       const schemaData = {
//         "@context": "https://schema.org/",
//         "@type": "Blog",
//         "name": blog.title,
//         "description": blog.body_html.replace(/<[^>]*>/g, ""),
//         "url": window.location.href
//       };
//       insertSchemaToDOM(schemaData);
//     }

//     // Function to insert schema into the DOM
//     function insertSchemaToDOM(schemaData) {
//       const script = document.createElement("script");
//       script.type = "application/ld+json";
//       script.text = JSON.stringify(schemaData);
//       document.head.appendChild(script);
//       console.log("JSON-LD schema inserted:", schemaData);
//     }

//     insertSchemaBasedOnPage();
//   `);
// });




app.get("/product-script.js", (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.send(`
    const shop = window.location.hostname;

    async function insertProductSchema() {
      try {
        const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
        const tokenData = await tokenResponse.json();

        if (tokenData && tokenData.accessToken) {
          const accessToken = tokenData.accessToken;
          const pathParts = window.location.pathname.split("/");

          // Check if on the product page
          if (pathParts[1] === "products") {
            const handle = pathParts[2];
            if (handle) {
              await fetchProductAndInsertSchema(accessToken, shop, handle);
            } else {
              console.warn("Product handle not found in the URL.");
            }
          } else {
            console.warn("Not on a product page.");
          }
        } else {
          console.warn("Access token not found for this shop.");
        }
      } catch (error) {
        console.error("Error fetching schema data:", error);
      }
    }

    async function fetchProductAndInsertSchema(accessToken, shop, handle) {
      try {
        const productResponse = await fetch(
          \`https://\${shop}/admin/api/2024-04/products.json?handle=\${handle}\`,
          {
            method: "GET",
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
            }
          }
        );
        
        const productData = await productResponse.json();
        
        if (productData.products && productData.products.length > 0) {
          const product = productData.products[0];
          insertProductSchemaData(product, shop);
        } else {
          console.warn("Product not found.");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }

    function insertProductSchemaData(product, shop) {
      const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "shipping_fee":100,
        "Shipping_Country":"India",
        "image": product.images.map(image => image.src),
        "description": product.body_html.replace(/<[^>]*>/g, ""),
        "sku": product.variants[0].sku,
        "brand": { "@type": "Brand", "name": product.vendor },
        "offers": {
          "@type": "Offer",
          "price": product.variants[0].price,
          "priceCurrency": product.variants[0].currency,
          "availability": product.variants[0].inventory_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": window.location.href,
          "seller": { "@type": "Organization", "name": shop }
        }
      };
      insertSchemaToDOM(schemaData);
    }

    function insertSchemaToDOM(schemaData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
      console.log("JSON-LD product schema inserted:", schemaData);
    }

    insertProductSchema();
  `);
});




// app.get('/remove-product-schema/:shopname', async (req, res) => {
//   const shop = req.params.shopname;
//   const scriptUrl = "https://server-page-xo9v.onrender.com/product-script.js"; // Assuming this is the URL where the schema is injected.

//   try {
//     // Fetch shop data (replace this with your actual way of getting accessToken)
//     const shopData = await Shop.findOne({ shop });
//     if (!shopData || !shopData.accessToken) {
//       return res.status(404).json({ message: `No access token found for store ${shop}` });
//     }

//     const accessToken = shopData.accessToken;

//     // Step 1: Fetch script tags for the shop
//     const existingResponse = await axios.get(`https://${shop}/admin/api/2024-10/script_tags.json`, {
//       headers: {
//         "X-Shopify-Access-Token": accessToken,
//         "Content-Type": "application/json",
//       },
//     });

//     const existingData = existingResponse.data;

//     // Step 2: Normalize the script URL to find the correct tag
//     const normalizedScriptUrl = new URL(scriptUrl).href;

//     // Step 3: Find the script tag that has the product schema
//     const scriptTag = existingData.script_tags.find(tag => new URL(tag.src).href === normalizedScriptUrl);

//     if (scriptTag) {
//       // Step 4: Fetch the current script content (assuming the script content is dynamically injected or fetched by the store)
//       const scriptContentResponse = await axios.get(scriptUrl);
//       let scriptContent = scriptContentResponse.data;

//       // Step 5: Remove the product schema (modify the content of the script)
//       const schemaStart = scriptContent.indexOf('"@type": "Product"');
//       if (schemaStart !== -1) {
//         // Identify the product schema block and remove it
//         const schemaEnd = scriptContent.indexOf('}', schemaStart) + 1;
//         const productSchema = scriptContent.slice(schemaStart, schemaEnd);
//         scriptContent = scriptContent.replace(productSchema, '');

//         // (Optional) If needed, upload or inject the updated scriptContent back to the store
//         console.log("Product schema removed:", productSchema);
//         return res.status(200).json({ message: `Product schema removed for store ${shop}` });
//       } else {
//         return res.status(404).json({ message: `No product schema found for store ${shop}` });
//       }
//     } else {
//       return res.status(404).json({ message: `No matching script tag found for store ${shop}` });
//     }
//   } catch (error) {
//     console.error(`Error removing product schema for store ${shop}:`, error.message);
//     return res.status(500).json({ message: `Error removing product schema for store ${shop}`, error: error.message });
//   }
// });




// app.get('/remove-product-schema/:shopname', async (req, res) => {
//   const shop = req.params.shopname;
//   const scriptUrl = "https://server-page-xo9v.onrender.com/product-script.js"; // URL where schema was injected

//   try {
//     // Fetch shop data (replace this with your actual method to get accessToken)
//     const shopData = await Shop.findOne({ shop });
//     if (!shopData || !shopData.accessToken) {
//       return res.status(404).json({ message: `No access token found for store ${shop}` });
//     }

//     const accessToken = shopData.accessToken;

//     // Step 1: Fetch script tags for the shop
//     const scriptTagsResponse = await axios.get(`https://${shop}/admin/api/2024-10/script_tags.json`, {
//       headers: {
//         "X-Shopify-Access-Token": accessToken,
//         "Content-Type": "application/json",
//       },
//     });

//     const scriptTags = scriptTagsResponse.data.script_tags;

//     // Step 2: Normalize the script URL to match the one you inserted
//     const normalizedScriptUrl = new URL(scriptUrl).href;

//     // Step 3: Find the script tag that matches your script URL
//     const matchingScriptTag = scriptTags.find(tag => new URL(tag.src).href === normalizedScriptUrl);

//     if (matchingScriptTag) {
//       // Step 4: Fetch the content of the script from the URL
//       const scriptContentResponse = await axios.get(scriptUrl);
//       let scriptContent = scriptContentResponse.data;

//       // Step 5: Find and remove the product schema in the script
//       const schemaStart = scriptContent.indexOf('"@type": "Product"');
//       if (schemaStart !== -1) {
//         // Identify the schema block and remove it
//         const schemaEnd = scriptContent.indexOf('}', schemaStart) + 1;
//         const productSchema = scriptContent.slice(schemaStart, schemaEnd);
//         scriptContent = scriptContent.replace(productSchema, '');

//         // Step 6: (Optional) Re-inject the updated script back to the store
//         console.log("Product schema removed:", productSchema);
//         return res.status(200).json({ message: `Product schema removed for store ${shop}` });
//       } else {
//         return res.status(404).json({ message: `No product schema found in the script for store ${shop}` });
//       }
//     } else {
//       return res.status(404).json({ message: `No matching script tag found for store ${shop}` });
//     }
//   } catch (error) {
//     console.error(`Error removing product schema for store ${shop}:`, error.message);
//     return res.status(500).json({ message: `Error removing product schema for store ${shop}`, error: error.message });
//   }
// });





// app.get('/remove-schema-script.js', async (req, res) => {
//   res.set("Content-Type", "application/javascript");

//   res.send(`

// // Find all JSON-LD script tags
// const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');

// // Loop through each script tag and remove those with "@type": "Product"
// jsonLdScripts.forEach((script, index) => {
//   try {
//     // Parse the script content
//     const scriptContent = JSON.parse(script.textContent);

//     // Check if the script contains a Product schema
//     if (scriptContent['@type'] === 'Product') {
//       console.log("Removing Product Schema :", scriptContent);
//       script.remove(); 
//     } else {

//     console.log("Keeping Schema :", scriptContent);
//     }
//   } catch (error) {
//     console.error("Error parsing schema at index ", error);
//   }
// });

// `)
// });

















// app.get('/remove-product-schema/:shopname', async (req, res) => {
//   const shop = req.params.shopname;
//   const removalScriptUrl = "https://server-page-xo9v.onrender.com/remove-schema-script.js"; // This script contains the logic to remove the schema.

//   try {
//     const shopData = await Shop.findOne({ shop });
//     if (!shopData || !shopData.accessToken) {
//       return res.status(404).json({ message: `No access token found for store ${shop}` });
//     }

//     const accessToken = shopData.accessToken;

//     // Step 1: Check if the removal script is already added
//     const scriptTagsResponse = await axios.get(`https://${shop}/admin/api/2024-10/script_tags.json`, {
//       headers: {
//         "X-Shopify-Access-Token": accessToken,
//         "Content-Type": "application/json",
//       },
//     });

//     const scriptTags = scriptTagsResponse.data.script_tags;

//     // Step 2: Check if the removal script is already present
//     const matchingScriptTag = scriptTags.find(tag => tag.src === removalScriptUrl);
//     if (matchingScriptTag) {
//       return res.status(200).json({ message: "Schema removal script is already injected." });
//     }

//     // Step 3: If not, inject the script tag that removes the product schema
//     await axios.post(`https://${shop}/admin/api/2024-10/script_tags.json`, {
//       script_tag: {
//         event: "onload",
//         src: removalScriptUrl
//       }
//     }, {
//       headers: {
//         "X-Shopify-Access-Token": accessToken,
//         "Content-Type": "application/json",
//       }
//     });

//     return res.status(200).json({ message: `Schema removal script injected successfully for store ${shop}` });
//   } catch (error) {
//     console.error(`Error injecting schema removal script for store ${shop}:`, error.message);
//     return res.status(500).json({ message: `Error injecting schema removal script for store ${shop}`, error: error.message });
//   }
// });











// app.get("/newproduct-script.js", (req, res) => {
//   res.set("Content-Type", "application/javascript");
//   res.send(`
//     const shop = window.location.hostname;

//     async function insertProductSchema() {
//       try {
//         const tokenResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-store?shop=\${shop}\`);
//         const tokenData = await tokenResponse.json();

//         if (tokenData && tokenData.accessToken) {
//           const accessToken = tokenData.accessToken;
//           const pathParts = window.location.pathname.split("/");

//           // Fetch the isEnabled state
//           const stateResponse = await fetch(\`https://server-page-xo9v.onrender.com/check-schema-state/\${shop}\`);
//           const stateData = await stateResponse.json();

//           // Only proceed if schema is enabled
//           if (stateData.isEnabled) {
//             // Check if on a product page
//             if (pathParts[1] === "products") {
//               const handle = pathParts[2];
//               if (handle) {
//                 await fetchProductAndInsertSchema(accessToken, shop, handle);
//               } else {
//                 console.warn("Product handle not found in the URL.");
//               }
//             } else {
//               console.warn("Not on a product page.");
//             }
//           } else {
//             console.log("Product schema is disabled.");
//           }
//         } else {
//           console.warn("Access token not found for this shop.");
//         }
//       } catch (error) {
//         console.error("Error fetching schema data:", error);
//       }
//     }

//     async function fetchProductAndInsertSchema(accessToken, shop, handle) {
//       try {
//         const productResponse = await fetch(
//           \`https://\${shop}/admin/api/2024-04/products.json?handle=\${handle}\`,
//           {
//             method: "GET",
//             headers: {
//               "X-Shopify-Access-Token": accessToken,
//               "Content-Type": "application/json",
//             }
//           }
//         );

//         const productData = await productResponse.json();

//         if (productData.products && productData.products.length > 0) {
//           const product = productData.products[0];
//           insertProductSchemaData(product, shop);
//         } else {
//           console.warn("Product not found.");
//         }
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//       }
//     }

//     function insertProductSchemaData(product, shop) {
//       const schemaData = {
//         "@context": "https://schema.org/",
//         "@type": "Product",
//         "name": product.title,
//         "shipping_fee": 100,
//         "Shipping_Country": "India",
//         "image": product.images.map(image => image.src),
//         "description": product.body_html.replace(/<[^>]*>/g, ""),
//         "sku": product.variants[0].sku,
//         "brand": { "@type": "Brand", "name": product.vendor },
//         "offers": {
//           "@type": "Offer",
//           "price": product.variants[0].price,
//           "priceCurrency": product.variants[0].currency,
//           "availability": product.variants[0].inventory_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
//           "url": window.location.href,
//           "seller": { "@type": "Organization", "name": shop }
//         }
//       };
//       insertSchemaToDOM(schemaData);
//     }

//     function insertSchemaToDOM(schemaData) {
//       const script = document.createElement("script");
//       script.type = "application/ld+json";
//       script.text = JSON.stringify(schemaData);
//       document.head.appendChild(script);
//       console.log("JSON-LD product schema inserted:", schemaData);
//     }

//     insertProductSchema();
//   `);
// });







// insert but unable to remove


// app.get("/newproduct-script.js", (req, res) => {
//   res.set("Content-Type", "application/javascript");
//   res.send(`
//     const shop = window.location.hostname;

//     async function insertProductSchema() {
//       try {
//         const tokenResponse = await fetch('https://server-page-xo9v.onrender.com/check-store?shop=' + shop);
//         const tokenData = await tokenResponse.json();

//         if (tokenData && tokenData.accessToken) {
//           const accessToken = tokenData.accessToken;
//           const pathParts = window.location.pathname.split("/");

//           // Fetch the isEnabled state
//           const stateResponse = await fetch('https://server-page-xo9v.onrender.com/check-schema-state/' + shop);
//           const stateData = await stateResponse.json();

//           // Check if on a product page
//           if (pathParts[1] === "products") {
//             const handle = pathParts[2];
//             if (handle) {
//               if (stateData.isEnabled) {
//                 // If schema is enabled, insert schema
//                 await fetchProductAndInsertSchema(accessToken, shop, handle);
//               } else {
//                 // If schema is disabled, remove schema
//                 removeProductSchema();
//                 console.log("Product schema is disabled.");
//               }
//             } else {
//               console.warn("Product handle not found in the URL.");
//             }
//           } else {
//             console.warn("Not on a product page.");
//           }
//         } else {
//           console.warn("Access token not found for this shop.");
//         }
//       } catch (error) {
//         console.error("Error fetching schema data:", error);
//       }
//     }

//     async function fetchProductAndInsertSchema(accessToken, shop, handle) {
//       try {
//         const productResponse = await fetch(
//           'https://' + shop + '/admin/api/2024-04/products.json?handle=' + handle,
//           {
//             method: "GET",
//             headers: {
//               "X-Shopify-Access-Token": accessToken,
//               "Content-Type": "application/json",
//             }
//           }
//         );

//         const productData = await productResponse.json();

//         if (productData.products && productData.products.length > 0) {
//           const product = productData.products[0];
//           insertProductSchemaData(product, shop);
//         } else {
//           console.warn("Product not found.");
//         }
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//       }
//     }

//     function insertProductSchemaData(product, shop) {
//       const schemaData = {
//         "@context": "https://schema.org/",
//         "@type": "Product",
//         "name": product.title,
//         "shipping_fee": 100,
//         "Shipping_Country": "India",
//         "image": product.images.map(image => image.src),
//         "description": product.body_html.replace(/<[^>]*>/g, ""),
//         "sku": product.variants[0].sku,
//         "brand": { "@type": "Brand", "name": product.vendor },
//         "offers": {
//           "@type": "Offer",
//           "price": product.variants[0].price,
//           "priceCurrency": product.variants[0].currency,
//           "availability": product.variants[0].inventory_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
//           "url": window.location.href,
//           "seller": { "@type": "Organization", "name": shop }
//         }
//       };
//       insertSchemaToDOM(schemaData);
//     }

//     function insertSchemaToDOM(schemaData) {
//       const script = document.createElement("script");
//       script.type = "application/ld+json";
//       script.text = JSON.stringify(schemaData);
//       document.head.appendChild(script);
//       console.log("JSON-LD product schema inserted:", schemaData);
//     }

//     // Function to remove the existing product schema
//     function removeProductSchema() {
//       const existingSchema = document.querySelector('script[type="application/ld+json"]');
//       if (existingSchema) {
//         existingSchema.remove(); // Remove the schema script tag if it exists
//         console.log("Product schema removed.");
//       }
//     }

//     // Call the function to manage the schema
//     insertProductSchema();
//   `);
// });




app.get("/newproduct-script.js", (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.send(`
    const shop = window.location.hostname;

    async function insertProductSchema() {
      try {
        const tokenResponse = await fetch('https://server-page-xo9v.onrender.com/check-store?shop=' + shop);
        const tokenData = await tokenResponse.json();

        if (tokenData && tokenData.accessToken) {
          const accessToken = tokenData.accessToken;
          const pathParts = window.location.pathname.split("/");

          // Fetch the isEnabled state
          const stateResponse = await fetch('https://server-page-xo9v.onrender.com/check-schema-state/' + shop);
          const stateData = await stateResponse.json();

          // Check if on a product page
          if (pathParts[1] === "products") {
            const handle = pathParts[2];
            if (handle) {
              if (stateData.isEnabled) {
                // If schema is enabled, insert schema
                await fetchProductAndInsertSchema(accessToken, shop, handle);
              } else {
                // If schema is disabled, remove schema
                removeProductSchema();
                console.log("Product schema is disabled.");
              }
            } else {
              console.warn("Product handle not found in the URL.");
            }
          } else {
            console.warn("Not on a product page.");
          }
        } else {
          console.warn("Access token not found for this shop.");
        }
      } catch (error) {
        console.error("Error fetching schema data:", error);
      }
    }

    async function fetchProductAndInsertSchema(accessToken, shop, handle) {
      try {
        const productResponse = await fetch(
          'https://' + shop + '/admin/api/2024-04/products.json?handle=' + handle,
          {
            method: "GET",
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
            }
          }
        );
        
        const productData = await productResponse.json();
        
        if (productData.products && productData.products.length > 0) {
          const product = productData.products[0];
          insertProductSchemaData(product, shop);
        } else {
          console.warn("Product not found.");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    }

    function insertProductSchemaData(product, shop) {
      const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "shipping_fee": 100,
        "Shipping_Country": "India",
        "image": product.images.map(image => image.src),
        "description": product.body_html.replace(/<[^>]*>/g, ""),
        "sku": product.variants[0].sku,
        "brand": { "@type": "Brand", "name": product.vendor },
        "offers": {
          "@type": "Offer",
          "price": product.variants[0].price,
          "priceCurrency": product.variants[0].currency,
          "availability": product.variants[0].inventory_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": window.location.href,
          "seller": { "@type": "Organization", "name": shop }
        }
      };
      insertSchemaToDOM(schemaData);
    }

    function insertSchemaToDOM(schemaData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.className = "product-schema"; // Added class for easy selection
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
      console.log("JSON-LD product schema inserted:", schemaData);
    }

    // Function to remove the existing product schema
    function removeProductSchema() {
      const existingSchema = document.querySelector('script.product-schema'); // Use class to select
      if (existingSchema) {
        existingSchema.remove(); // Remove the schema script tag if it exists
        console.log("Product schema removed.");
      } else {
        console.log("No product schema found to remove.");
      }
    }

    // Call the function to manage the schema
    insertProductSchema();
  `);
});






// Endpoint to check the schema state
app.get("/check-schema-state/:shopname", async (req, res) => {
  try {
    const shopName = req.params.shopname;
    const shop = await Shop.findOne({ shop: shopName });

    if (shop) {
      return res.status(200).json({ isEnabled: shop.isEnabled });
    } else {
      // If shop does not exist, create it with default state
      const newShop = new Shop({ shop: shopName });
      await newShop.save();
      return res.status(200).json({ isEnabled: newShop.isEnabled });
    }
  } catch (error) {
    console.error("Error fetching schema state:", error);
    res.status(500).json({ message: "Error fetching schema state" });
  }
});


app.post("/update-state/:shopname/:isEnable", async (req, res) => {
  try {
    const shopName = req.params.shopname;
    const value = req.params.isEnable;

    const updatedShop = await Shop.findOneAndUpdate(
      { shop: shopName }, // Find document by shopName
      { $set: { isEnabled: value } }, // Use $set to update only specific fields
      { new: true, upsert: false } // Return the updated document
    );
    res.status(200).send({ success: true, data: updatedShop })
  } catch (error) {
    res.status(500).json({ message: "Error fetching schema state" });

  }
})




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
