const {Router}= require('express');
const productRoute= Router();
const auth=require('../services/auth');

const {
    loadAddNewProductPage,
    getProducts,
    updateProduct,
    deleteProduct,
    addBulkData,
    countAllProducts
}=require('../controllers/productController');

productRoute.put('/add-bulk',addBulkData)
productRoute.route('/add-new')
.get(auth.canAddProduct,loadAddNewProductPage)
productRoute.get('/products', getProducts)
productRoute.get('/products/count', countAllProducts)
productRoute.put('/:id',auth.isLogin, updateProduct)
productRoute.delete('/:id',auth.isLogin, deleteProduct)

console.log('hello');

module.exports= productRoute;