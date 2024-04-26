const express= require('express');
const sellerRoute=express.Router();
const adminControllers=require('../controllers/adminControllers');
const auth=require('../services/auth');
const multer = require("multer");
const path= require('path');


const {
    loadRegisterPage,
    registerSeller,
    verifyEmail,
    loadLoginPage,
    login,
    loadDashboard,
    loadCutomerPlacedOrderPage,
    dispatchOrder,
    loadChartPage
}=require('../controllers/sellerController')       
const createMulterMiddleware = require('../utilities/multipleUploads');
const fieldNames = [
    { name: 'aadharImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 },
    { name: 'storeImage', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ];
  // Create the Multer middleware
  const upload = createMulterMiddleware(fieldNames, 1); 

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '-' + file.originalname
        cb(null, fileName)
    },
  });
  const upload2 = multer({ storage });


  
sellerRoute.route('/register')
.get(loadRegisterPage)
.post(upload,registerSeller);
sellerRoute.get('/verify/:token/:id',verifyEmail );
sellerRoute.get('/login',loadLoginPage);
sellerRoute.get('/chart',auth.isSeller,loadChartPage);
sellerRoute.post('/login',login);
sellerRoute.get('/dashboard',auth.isSeller,loadDashboard);
sellerRoute.post('/products',upload2.single("image"),auth.isSeller,adminControllers.addNewProducts);
sellerRoute.route('/customer-placed-order')
.get(auth.isLogin,auth.isSeller,loadCutomerPlacedOrderPage)
sellerRoute.put('/order/dispatch/:id_dispatched_to',auth.isSeller,dispatchOrder)



module.exports=sellerRoute;