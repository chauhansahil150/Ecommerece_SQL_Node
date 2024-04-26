const {Router}=require('express');
const auth=require('../services/auth');



const userRoute=Router();

const {
    loadDashboard,
    verifyEmail,
    loadChangePassPage,
    changePassword,
    loadEmailPage,
    sendRecoveryEmail,
    loadPassRecoveryPage,
    loadMyOrdersPage,
    cancelOrder
   
}=require('../controllers/userController');
userRoute.get('/dashboard', loadDashboard);
userRoute.get('/verify/:token/:id', auth.isLogin,verifyEmail );
userRoute.get('/change-password',auth.isLogin, loadChangePassPage)
userRoute.post('/change-password/:id', changePassword)
userRoute.route('/forgot-password')
.get(loadEmailPage)
.post(sendRecoveryEmail)
userRoute.get('/forgot-password/:token/:id', loadPassRecoveryPage)
userRoute.get('/orders',auth.isLogin, loadMyOrdersPage)
userRoute.put('/order/cancel/:id',auth.isLogin, cancelOrder)
module.exports=userRoute;
