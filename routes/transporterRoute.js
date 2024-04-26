const express= require('express');
const transporterRoute=express.Router();
const {
    loadtransporterPage,
    loadLoginPage,
    login,
    changeOrderStatus
}=require('../controllers/transporterController');
transporterRoute.get('/login',loadLoginPage);
transporterRoute.get('/',loadtransporterPage);
transporterRoute.post('/login',login);
transporterRoute.put('/order/status/:id_status',changeOrderStatus);
module.exports=transporterRoute;