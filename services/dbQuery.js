const User=require('../models/user');
const Product= require('../models/product');
// const Cart= require('../models/cart');
const dbConnection = require('./db'); // Adjust the path as needed
const createProduct =  (name, description, price, quantity, imageUrl,sellerId) => {
    try {
      const insertProductSQL = `
      INSERT INTO products (sellerId,name, description, price,quantity,image)
      VALUES (?,?, ?, ?,?,?)
    `;

    dbConnection.query(insertProductSQL, [sellerId,name, description,price,quantity,imageUrl], (error,results)=>{
      if(error){
        console.log('error inserting product', error)

      }
      console.log(results);
    });
     
     
    } catch (error) {
      throw error;
    }
  };

// Function to add an item to the cart
const addItemToCart = async (userId, productId) => {
    return new Promise((resolve,reject)=>{
      const existingCartItemSQL=`select * from carts where user_id=? and product_id=?`;
      dbConnection.query(existingCartItemSQL,[userId,productId],(error,results)=>{
        if(error){
          reject(error);
        }
        if (results.length >0){
          resolve(null);
        }else{
          const insertCartSQL=`insert into carts (product_id,user_id) values (?,?)`;
      dbConnection.query(insertCartSQL,[productId,userId],(error,results)=>{
        if(error){
          reject(error);
        }else{
          resolve(true);
        }
      });
        }
      });
      
    });
};

// Function to retrieve cart items for a user
const getCartItems = async (userId) => {
    return new Promise((resolve,reject)=>{
      const query=`select c.id as cart_id ,c.user_id,c.product_id,c.quantity as cart_product_quantity,p.* from carts as c inner join
      products as p on c.product_id=p.id where user_id=?
      `;
      dbConnection.query(query,[userId],(error,results)=>{
        if(error){
          reject(error);
        }else{
          const cartItems=results.map((row)=>(
            {
              id:row.cart_id,
              user_id:row.user_id,
              product_id:{
                id:row.product_id,
                name:row.name,
                description:row.description,
                price:row.price,
                quantity:row.quantity,
                image:row.image,
              },
              quantity:row.cart_product_quantity
            }
          ));
          resolve(cartItems);
        }
      })
    })
};

// Function to increase product quantity in the cart
const updateCartProductQuantity = async (itemId, newQuantity) => {
    return new Promise((resolve,reject)=>{
      const query=`
      update carts set quantity=? where id=?
      `;
      dbConnection.query(query,[newQuantity,itemId],(error,results)=>{
        if(error){
          reject(error);
        }else{
          resolve(results[0]);
        }
      });
    });
};

// Function to delete an item from the cart
const deleteCartItem = async (itemId) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM carts WHERE id=?
    `;
    dbConnection.query(query, [itemId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        // Check if the delete operation was successful (affected rows > 0)
        if (results.affectedRows > 0) {
          resolve(true); // Deletion successful
        } else {
          resolve(false); // Item with the given id was not found
        }
      }
    });
  });
};

// Get all products with pagination
 function getAllProducts(userId,role,start, limit) {
    // const products = await Product.find().(skipstart).limit(limit);
    return new Promise((resolve,reject)=>{
      console.log(role);
      let selectProductSQL;
      if(role=='seller'){
        selectProductSQL=`SELECT * FROM products  where sellerId=${userId} LIMIT ?,?`;
      }else if(role=='admin'){
        selectProductSQL=`SELECT * FROM products where status='verified' LIMIT ?,?`;
      }else{
        selectProductSQL=`SELECT * FROM products where status='verified' LIMIT ?,?`;
      }
      dbConnection.query(selectProductSQL,[start,limit],(error,results)=>{
        if(error){
          reject(error);
        }else{
          // const jsonResults = results.map((row) => {
          //   return {
          //     id: row.id,
          //     name: row.name,
          //     description: row.description,
          //     price: row.price,
          //     quantity: row.quantity,
          //     image: row.image,
          //   };
          // });
          // resolve(jsonResults);
          resolve(results);
        }
      });
    });

}
function countAllProducts(id,role){
  return new Promise((resolve,reject)=>{
    let query;
    if(role=='seller'){
        query=`SELECT count(*) as total_products FROM products  where sellerId=${id}`;
      }else if(role=='admin'){
        query=`SELECT count(*) as total_products FROM products where status='verified'`;
      }else{
        query=`SELECT count(*) as total_products FROM products where status='verified'`;
      }
      dbConnection.query(query,(error,results)=>{
        if(error){
          reject(error)
        }else{
          console.log('total'+results[0].total_products);
          resolve(results[0].total_products);
        }
      })

  })
}

// Update a product by ID
async function updateProductById(productId, updatedData) {
  try {
    // const product = await Product.findByIdAndUpdate(productId, updatedData, {
    //   new: true, // Return the updated product
    // });
    return  new Promise((resolve,reject)=>{
      const query = `
      UPDATE products SET
        name='${updatedData.name}',
        price=${updatedData.price},
        description='${updatedData.description}',
        quantity=${updatedData.quantity}
      WHERE 
        id=${productId}
    `;
    
    dbConnection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
    
    })
    // return product;
  } catch (error) {
    throw error;
  }
}

// Delete a product by ID
async function deleteProductById(productId) {
  try {
    // const deletedProduct = await Product.findByIdAndDelete(productId);
    // return deletedProduct;
    return new Promise((resolve,reject)=>{
      const query=`
      DELETE FROM products WHERE id=?
      `;
      dbConnection.query(query,productId,(error,results,fields)=>{
        if(error){
          reject(error);
        }else{
          resolve(results);
        }
      });
    })
  } catch (error) {
    throw error;
  }
}

async function checkUserExists(email) {
  try {
    // const user = await User.findOne({ email });
    const findUserSQL=`
    select * from users where email=?
    `;
    const user=await findUserByEmail(email);
    return user !== null;
  } catch (error) {
    throw error;
  }
}

// Create a new user
  function createUser(name, email, password) {
  return new Promise((resolve,reject)=>{
    const insertUserSQL = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;

   dbConnection.query(insertUserSQL, [name, email, password], (error,results)=>{

      if(error){
        reject(error);
      }else{
        resolve({ id: results.insertId, name, email })
      }

    });

  });
}

// Find a user by email
async function findUserByEmail(email) {
  try {
    const findUserSQL=`
    select * from users where email=?
    `;
    // const user=dbConnection.query(findUserSQL,email,(error, results, fields) => {
    //   if (error) {
    //     console.error('Error executing query:', error);
    //     return;
    //   }
    //   console.log('krta hai bhai user exists');
    // });    
    // return user;
    return new Promise((resolve,reject)=>{
      dbConnection.query(findUserSQL,email,(error,results,fields)=>{
        if(error){
          console.log('error executing query',error);
          return;
        }
        if(results.length>0){
          const user=results[0];
          console.log('User exists:', user);
          resolve(user);
        }else{
          console.log('user not found');
          resolve(null);
        }
      })
    })
  } catch (error) {
    throw error;
  }
}

// Update a user's password by ID
 function updateUserPassword(userId, newPassword) {
  return new Promise((resolve,reject)=>{
    const query=`
    UPDATE users SET password=? WHERE id=?
    `;
    dbConnection.query(query,[newPassword,userId],(error,results,fields)=>{
      if(error){
        reject(error);
      }else{
        console.log(fields);
        resolve(results);
      }
    });
  });
}

// Add a new product
// async function addProduct(productData) {
//   try {
//     const newProduct = await Product.create(productData);
//     return newProduct;
//   } catch (error) {
//     throw error;
//   }
// }
function changeVerificatinStatus(id,status){
  return new Promise((resolve,reject)=>{
    const query=`
    UPDATE users SET is_verified=? WHERE id=?
    `;
    dbConnection.query(query,[id,status],(error)=>{
      if(error){
        reject(error);
      }
    });
    dbConnection.query(`select name,role,id from users where id=${id}`,
    (error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results[0]);
      }
    }
    );
  });
}
function getAllRequestedSellers(){
  return new Promise((resolve,reject)=>{
    const query=`
   select * from sellers WHERE is_approved=0 and is_mail_verified=1
    `;
    dbConnection.query(query,
    (error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results);
      }
    }
    );
  });

}
function getAllRequestedProducts(){
  return new Promise((resolve,reject)=>{
      console.log(role);
      let selectProductSQL;
        selectProductSQL=`SELECT * FROM products  where is_verified=0`;
      dbConnection.query(selectProductSQL,(error,results)=>{
        if(error){
          reject(error);
        }else{
          resolve(results);
        }
      });
    });
}
function findMyOrderedProducts(userId){
  return new Promise((resolve,reject)=>{
    const query=`select orders.id as order_id,orders.user_id,orders.seller_id,orders.quantity,
orders.total_amount,orders.payment_status,orders.payment_mode,orders.order_date,orders.status,orders.dispatched_to,
products.id as product_id,products.name,products.image,products.description,orders.cancel_date,orders.delivery_date,
products.thumbnail
from orders
     inner join products on orders.product_id=products.id
     where user_id=?;
    `;
    dbConnection.query(query,[userId],(error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results);
      }
    });
  });
}
function cancelOrder(id,reason,cancel_date){
 return new Promise((resolve,reject)=>{
      console.log(role);
      let selectProductSQL;
        selectProductSQL=`
        UPDATE orders 
SET status = 'cancelled',
    cancel_date = '${cancel_date}',
    cancel_reason = '${reason}' 
WHERE id = ${id};
`;
      dbConnection.query(selectProductSQL,(error,results)=>{
        if(error){
          reject(error);
        }else{
          resolve(results);
        }
      });
    });
}
async function updateStock(productId, quantity) {
  try {
    // const product = await Product.findByIdAndUpdate(productId, updatedData, {
    //   new: true, // Return the updated product
    // });
    return  new Promise((resolve,reject)=>{
      const query = `
      UPDATE products SET
        quantity=quantity-${quantity},
      WHERE 
        id=${productId}
    `;
    
    dbConnection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
    
    })
    // return product;
  } catch (error) {
    throw error;
  }
}
 function getProductIdFromOrders(id){
    return new Promise((resolve,reject)=>{
      const query=`select product_id from orders where id=${id}`
      dbConnection.query(query,(error,results)=>{
        if(error){
          reject(error);
        }else{
          resolve(results[0]);
        }
      }
      
    )
  })
}
function updatePlaceCount(id){
  return new Promise((resolve,reject)=>{
    const query=`update products set placed_counts=placed_counts+1 where id=${id}`
    dbConnection.query(query,(error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results);
      }
    })
  })
}
function updateCancelledCount(id){
  return new Promise((resolve,reject)=>{
    const query=`update products set cancelled_counts=cancelled_counts+1 where id=${id}`
    dbConnection.query(query,(error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results);
      }
    })
  })
}
function updateDeliveredCount(id){
  return new Promise((resolve,reject)=>{
    const query=`update products set delivered_counts=delivered_counts+1 where id=${id}`
    dbConnection.query(query,(error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results);
      }
    })
  })
}
function updateReturnedCount(id){
  return new Promise((resolve,reject)=>{
    const query=`update products set returned_counts=returned_counts+1 where id=${id}`
    dbConnection.query(query,(error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results);
      }
    })
  })
}
  module.exports={
    createProduct,
    addItemToCart,
    getCartItems,
    updateCartProductQuantity,
    deleteCartItem,
    getAllProducts,
    updateProductById,
    deleteProductById,
    // addProduct,
    checkUserExists,
    createUser,
    findUserByEmail,
    updateUserPassword,
    changeVerificatinStatus,
    getAllRequestedSellers,
    getAllRequestedProducts,
    findMyOrderedProducts,
    cancelOrder,
    updateStock,
    getProductIdFromOrders,
    updatePlaceCount,
    updateCancelledCount,
    updateDeliveredCount,
    updateReturnedCount,
    countAllProducts
    
  }