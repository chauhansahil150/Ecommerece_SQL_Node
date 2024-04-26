// db.js

const mysql = require('mysql');
const Product=require('../models/product');
const User=require('../models/user');
const Cart=require('../models/cart');

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database');
});
// const createProductSQL=Product.productModel();
// dbConnection.query(createProductSQL,(error,results,fields)=>{
//   if(error){
//     console.log(error);
//   }
// })
// const createUserSQL=User.userModel();
//    dbConnection.query(createUserSQL,(error)=>{
//     if(error){
//       console.log('error', error);
//     }
//   });
// const createCartSQL=Cart.cartModel();
// dbConnection.query(createCartSQL,(error)=>{
//   if(error){
//     console.log('error creating carts table',error)
//   }
// })
module.exports = dbConnection;
