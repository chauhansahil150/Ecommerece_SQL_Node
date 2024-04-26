const Cart = require('../models/cart');
const Product = require('../models/product');
const db=require('../services/dbQuery');
const dbOrder=require('../services/dbOrderQuery');
const e = require('express');
const { body } = require('express-validator');


const addItemToCart = async (req, res) => {
    try {
        const userId = req.params.uid;

        if (userId === "hello") {
            return res.redirect('/login');
        }

        const productId = req.params.pid;
        const response = await db.addItemToCart(userId,productId);
        if (response==null) {
            return res.end();
        }
        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

const loadCartPage = async (req, res) => {
    try {
        const userId = req?.session?.user?.id;
        const cartItems = await db.getCartItems(userId);

         res.render('cartPage', {userId:req?.session?.user?.id, cartItems,name:req?.session?.user?.name });
         return;
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const updateProductQuantity = async (req, res) => {
    try {
        const itemId = req.params.id;
        const newQuantity = req.params.quantity;

        const resp=await db.updateCartProductQuantity(itemId,newQuantity);
        if(resp)
            res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

// const deleteItem = async (req, res) => {
//     try {
//         const itemId = req.params.id;
//         await db.deleteCartItem(itemId);
//         return res.end();
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send('Internal Server Error');
//     }
// };
const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const deletionSuccessful = await db.deleteCartItem(itemId);

        if (deletionSuccessful) {
            // Item was successfully deleted
             res.status(204).end();
             return; // Respond with a 204 status (No Content)
        } else {
            // Item with the given ID was not found
             res.status(404).send('Item not found');
             return;
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};
const loadPaceOrderPage=async (req, res)=>{
    try {
        res.render('placeOrderPage',{
            user_id:req?.session?.user?.id,
            name:req?.session?.user?.name,
            message:null
         });
    }
     catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}
const placeOrder=async (req, res)=>{
    userId=req?.session?.user?.id;
    const address_id=await dbOrder.saveaddress(userId,req.body);
    const usersAllPlacedOrders=await dbOrder.getAllOrders(userId);
    let response;
    // dont  use as will not wait for response, but i also delete
    // cart item so will take response from that
    usersAllPlacedOrders.forEach(async e => {
        await dbOrder.saveorder(e,address_id,req.body.payment_mode);
        // await db.updateStock(e.product_id,e.quantity);
        await db.updatePlaceCount(e.product_id);
    });
//      for await (const e of usersAllPlacedOrders) {
//     const result = await dbOrder.saveOrder(e, address_id, req.body.payment_mode);
//     if (!result) {
//       response = false;
//       break;
//     }
//   }
response=await dbOrder.emptyCartOfUser(userId);
if (response) {
    // Conditionally render the "Place Order" page
    res.render('placeOrderPage', {
        user_id: req?.session?.user?.id,
        name: req?.session?.user?.name,
        message: "Order Placed Successfully"
    });

} else {
    // If the response condition is not met, send a JSON response
    res.json({ success: false });
}

}
module.exports = {
    addItemToCart,
    loadCartPage,
    updateProductQuantity,
    deleteItem,
    loadPaceOrderPage,
    placeOrder
};
