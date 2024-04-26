const dbConnection = require('./db'); // Adjust the path as needed
function registerSeller(body,files){
    return new Promise((resolve,reject)=>{
        const query=`
INSERT INTO sellers(f_name,l_name,gender,
email,password,mobile_no,dob,business_name,business_address,
aadhar_no,pan_no,gst_no,aadhar_image,pan_image,profile_image,
store_image) VALUES
(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ` ;
        dbConnection.query(query,[body.fName,body.lName,
            body.gender,body.email,body.password,body.mobile,body.dob,
        body.buisnessName,body.buisnessAddress,
    body.aadharNumber,body.panNumber,body.gstNumber,
    `/images/seller/aadharImage/${files.aadharImage[0].filename}`,
    `/images/seller/panImage/${files.panImage[0].filename}`,
    `/images/seller/profileImage/${files.profileImage[0].filename}`,
    `/images/seller/storeImage/${files.storeImage[0].filename}`], 
    (error,results)=>{
    if(error){
        reject(error);
    }else{
        const name=body.fName+" "+body.lName;
        resolve({ id: results.insertId, name, email:body.email });
    }
})
    });
}
function changeSellerEmailVerificatinStatus(id,status){
  return new Promise((resolve,reject)=>{
    const query=`
    UPDATE sellers SET is_mail_verified=? WHERE seller_id=?
    `;
    dbConnection.query(query,[status,id],(error)=>{
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
function rejectSellerRequest(id){
    return new Promise((resolve,reject)=>{
        const query=`delete from sellers where seller_id=?`;
        dbConnection.query(query,[id],(error)=>{
            if(error){
                reject(error)
            }else{
                resolve(true);
            }
    })
});
}
function approveSellerRequest(id,status){
    return new Promise((resolve,reject)=>{
        const query=`update sellers set is_approved=?, role="seller" where seller_id=?`;
        dbConnection.query(query,[status,id],(error)=>{
            if(error){
                reject(error)
            }else{
                resolve(true);
            }
    })
}); 
}
function getSellerNameAndEmail(id){
     return new Promise((resolve,reject)=>{
        const query=`select seller_id,concat(f_name," ",l_name) as name,email from sellers where seller_id=?`;
        dbConnection.query(query,[id],(error,results)=>{
            if(error){
                reject(error)
            }else{
                resolve(results[0]);
            }
    })
}); 
}
// function addSellerToUsers(id){
//     return new Promise((resolve,reject)=>{
//         const query=`select concat(f_name," ",l_name) as name,email,password from sellers where seller_id=?`;
//         dbConnection.query(query,[id],(error,results)=>{
//             if(error){
//                 reject(error)
//             }else{
//                 const {name,email,password}=results[0];
//                 const query=`insert into users(name,email,password,role,is_verified) values(?,?,?,"seller",1)`;
//                 dbConnection.query(query,[name,email,password],(error)=>{
//                     if(error){
//                         reject(error)
//                     }else{
//                         resolve(true)
//                     }
//                 })
//             }
//     })
// }); 
// }
async function findUserByEmail(email) {
  try {
    const findUserSQL=`
    select * from sellers where email=?
    `;
    return new Promise((resolve,reject)=>{
      dbConnection.query(findUserSQL,email,(error,results,fields)=>{
        if(error){
          console.log('error executing query',error);
         reject(error);
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
function rejectSellerProductRequest(id){
    return new Promise((resolve,reject)=>{
        const query=`update products set status=? where id=?`;
        dbConnection.query(query,['rejected',id],(error)=>{
            if(error){
                reject(error)
            }else{
                resolve(true);
            }
    })
});
}
function approveSellerProductRequest(id,status){
    return new Promise((resolve,reject)=>{
        const query=`update products set status=?,is_verified=?  where id=?`;
        dbConnection.query(query,['verified',status,id],(error)=>{
            if(error){
                reject(error)
            }else{
                resolve(true);
            }
    })
}); 
}
function getAllPlacedOrders(sellerId){
  return new Promise((resolve,reject)=>{
    const query=`SELECT * FROM orders WHERE seller_id=? and dispatched_to=? `;
    dbConnection.query(query,[sellerId,'seller'],(error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results);
      }
    });
  });
}
// function getProductsByIdsWithAdress(productIds){
//   return new Promise((resolve,reject)=>{
//     const query=`SELECT * FROM products WHERE id in (${productIds})`;
//     dbConnection.query(query,(error,results)=>{
//       if(error){
//         reject(error);
//       }else{
//         resolve(results);
//       }
//     });
//   });
// }
function dispatchOrder(id,dispatchedTo,status){
  return new Promise((resolve,reject)=>{
    const deliveryDate=new Date().toLocaleString();
    let query;
    if(status=='delivered'){
           query=`UPDATE orders SET dispatched_to=?,delivery_date=now(),status=? WHERE id=?`;
    }else{
       query=`UPDATE orders SET dispatched_to=?,status=? WHERE id=?`;
    }
    dbConnection.query(query,[dispatchedTo,status,id],(error)=>{
      if(error){
        reject(error);
      }else{
        resolve(true);
      }
    })
  });
}
function getProductData(userId){
return new Promise((resolve,reject)=>{
    let query=`select p.name,p.quantity,p.cancelled_counts,p.returned_counts,p.delivered_counts,p.placed_counts from products as p
   where sellerId=?`;
    dbConnection.query(query,[userId],(error,results)=>{
      if(error){
        reject(error);
      }else{
        resolve(results);
      }
    })
  });
}
module.exports={
    registerSeller,
    changeSellerEmailVerificatinStatus,
    rejectSellerRequest,
    approveSellerRequest,
    getSellerNameAndEmail,
    // addSellerToUsers,
    findUserByEmail,
    rejectSellerProductRequest,
    approveSellerProductRequest,
    getAllPlacedOrders,
    dispatchOrder,
    getProductData
}