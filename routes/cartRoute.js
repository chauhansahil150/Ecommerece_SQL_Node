const express= require('express');
const auth=require('../services/auth');

const cartRoute= express();
const {
    addItemToCart,
    loadCartPage,
    updateProductQuantity,
    deleteItem,
    loadPaceOrderPage,
    placeOrder
}=require('../controllers/cartControllers');

cartRoute.get('/',auth.isLogin,loadCartPage);
cartRoute.post('/:uid/:pid', auth.isLogin,addItemToCart);
cartRoute.put('/product-quantity/:id/:quantity',auth.isLogin, updateProductQuantity);
cartRoute.delete('/delete/:id',auth.isLogin, deleteItem)
cartRoute.get('/place-order',auth.isLogin, loadPaceOrderPage);
cartRoute.post('/place-order',auth.isLogin, placeOrder);

module.exports= cartRoute;