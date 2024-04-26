// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   quantity:{
//     type: Number,
//     required: true,
//   },
//   image: {
//     type: String, // You can store the image URL or a reference to the image file
//     required: true,
//   },
//   // Other product properties (e.g., category, brand, etc.) can be added here
// });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;
function productModel(){
     
  const productSchema=`
  CREATE TABLE IF NOT EXISTS products(
    id INT AUTO_INCREMENT PRIMARY KEY,
    sellerId INT ,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    quantity INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(sellerId) REFERENCES users(id)
  )
  `;
     return productSchema;
}

module.exports={productModel};