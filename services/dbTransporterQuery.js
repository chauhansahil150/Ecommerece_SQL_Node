const dbConnection=require('./db');
function findUserByEmail(email){
return new Promise((resolve,reject)=>{
    const query='select * from delivery_man where email=?';
    dbConnection.query(query,email,(err,result)=>{
        if(err){
            reject(err);
        }
        else{
            resolve(result[0]);
        }
    });
});
}


function getAllPlacedOrders(areaAlloted){
  return new Promise((resolve,reject)=>{
    const query=`SELECT orders.id as order_id, orders.payment_mode, orders.total_amount, addresses.*
FROM orders
INNER JOIN addresses ON orders.address_id = addresses.id
WHERE orders.dispatched_to = 'Kurukshetra';
    `;
    dbConnection.query(query,[areaAlloted],(error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results);
      }
    });
  });
}
function getProductIDByOrderId(id){
  return new Promise((resolve, reject)=>{
    const query=`select product_id from orders where id=?`;
    dbConnection.query(query,[id],(error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results[0]);
      }
  })
})
}
module.exports={
    findUserByEmail,
    getAllPlacedOrders,
    getProductIDByOrderId
}