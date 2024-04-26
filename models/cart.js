// const {Schema,model} = require('mongoose');
// const cartSchema= new Schema({
//     product_id:{
//         type:Schema.Types.ObjectId,
//         ref:'Product'
//     },
//     user_id:{
//         type:Schema.Types.ObjectId,
//         ref:'user'   
//     },
//     quantity:{
//         type:Number,
//         default:1
//     }
// }, {timestamps:true});
// const Cart=model('cart', cartSchema);

// module.exports = Cart;
function cartModel(){
    const cartSchema=`
    CREATE TABLE IF NOT EXISTS carts(
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(product_id) REFERENCES products(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    `;
    return cartSchema;
}

  

module.exports={cartModel}
