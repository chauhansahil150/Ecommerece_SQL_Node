const dbConnection = require("./db"); // Adjust the path as needed
function saveaddress(userId, body) {
  return new Promise((resolve, reject) => {
    const adressQuery = `INSERT INTO addresses (user_id,name,phone,address,city,state,zipcode) 
        values (?,?,?,?,?,?,?)`;
    let address_id;
    dbConnection.query(
      adressQuery,
      [
        userId,
        body.name,
        body.phone,
        body.address,
        body.city,
        body.state,
        body.zipcode,
      ],
      (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results.insertId);
      }
    );
    //select price from products where product_id=?
  });
}
function getAllOrders() {
  return new Promise((resolve, reject) => {
    const cartdata = `select * from carts where user_id=?`;
    dbConnection.query(cartdata, [userId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}
function saveorder(cartProduct, address_id, payment_mode) {
  return new Promise((resolve, reject) => {
    const cartdata = `select price,sellerId from products where id=${cartProduct.product_id}`;
    dbConnection.query(cartdata, [userId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        console.log(results[0]);
        const query = `INSERT INTO orders (user_id,product_id,seller_id,address_id, quantity, total_amount,payment_mode)
            values (?,?,?,?,?,?,?)`;
        dbConnection.query(
          query,
          [
            userId,
            cartProduct.product_id,
            results[0].sellerId,
            address_id,
            cartProduct.quantity,
            results[0].price * cartProduct.quantity,
            payment_mode,
          ],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          }
        );
      }
    });
  });
}
const emptyCartOfUser = async (req, res) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM carts WHERE user_id=?`;
    dbConnection.query(query, [userId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = {
  saveaddress,
  getAllOrders,
  saveorder,
  emptyCartOfUser,
};
