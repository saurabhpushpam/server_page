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
        "shipping_fee": 500,
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


app.get('/removetag', async (req, res) => {
  const shop = 'demosaurav.myshopify.com';
  const scriptUrl = "https://server-page-xo9v.onrender.com/server-script.js";

  try {
    // Fetch shop data
    const shopData = await Shop.findOne({ shop: shop });

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




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
