const db=require('../services/sellerDBQuery');
const userController=require('../controllers/userController');
const jwt = require('jsonwebtoken');

const loadRegisterPage= async (req, res)=>{
    try {
        res.render('seller/sellerRegister',{
            message:null
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({error:"Inter Server Error"});
    }
}
const registerSeller=async (req, res)=>{
    try {
        const subject='Email Verification';
        const text=`There, You have recently visited our website and entered your email. Please follow the given link to verify your email http://localhost:${process.env.PORT}/seller/verify/`
        // const sellerData=;
        // console.log();
        // const data={
        //     ...req.body,
        //     ...req.files
        // }
        // res.json(data);
        const resp=await db.registerSeller(req.body,req.files);
        userController.sendVerifyEmail(resp.name, req.body.email, resp.id,subject,text)
        if(resp){
            res.render('seller/sellerRegister',{
                message:"You have applied successfully,Please verify your email",
            });
        }else{
            res.render('seller/sellerRegister',{
                message:"error, please try again later",
            });
        }

       
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Inter Server Error"});
    }
}
function verifyEmail(req,res){
    const {token,id} = req.params;
jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
        console.log(err);
        res.send("Email verification failed, possibly the link is invalid or expired");
    }
    else {
        db.changeSellerEmailVerificatinStatus(id,true)
        .then(function(user){
            // res.send("Email verifified successfully");
            res.end('Your email has been verified successfully, Further Updates will be shared on email');
        }).catch(function(err){
            res.send({msg:"Email verification Failed",err});
        });
    }
});
}
const loadLoginPage=async (req, res)=>{
    try {
        res.render('seller/sellerLoginPage.ejs',{
            message:null
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({error:"Inter Server Error"});
    }

}
const login = async (req, res) => {
    try {
        const user = await db.findUserByEmail(req.body.email);
        if (user) {
            if (user.password === req.body.password) {
                // const userData=(({ password, ...o }) => o)(user)
                // console.log(userData);
                const sellerData={
                    name:user.f_name + ' ' +user.l_name,
                    role:user.role,
                    id:user.seller_id,
                }
                req.session.user = sellerData;
                // console.log( req.session.user);
                res.status(200).redirect("/seller/dashboard");
                return;
            } else {
                res.render("seller/sellerLoginPage.ejs", {
                    error: "Incorrect user or password"
                })
                return;
            }
        } else {
            res.render("login", {
                error: "User Not Found"
            })
            return;
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}
const loadDashboard=async (req, res)=>{
    try {
       if(req?.session?.user?.role=='seller'){
        res.render('seller/sellerHomePage.ejs',{
            name:req?.session?.user?.name,
            role:req?.session?.user?.role,
            seller_id:req?.session?.user?.id,
        })
       }else {
        res.render("seller/sellerLoginPage.ejs", {
            error: "User Not Found"
        })
        return;
       }
    } catch (error) {
        console.log(error);
        res.status(500).send({error:"Internal Server Error"});
    }

}
const loadCutomerPlacedOrderPage= async (req,res)=>{
    try {
        const sellerId=req?.session?.user?.id;
        const allOrders=await db.getAllPlacedOrders(sellerId);
        
        // console.log(allOrders);
        // const productIds=[];
        // allOrders.forEach(order => {
        //     productIds.push(order.product_id);
        // });
        // const products=await db.getProductsByIdsWithAdress(productIds);
        // res.json(products);
          res.render('seller/placedOrdersPage',{
            name:req?.session?.user?.name,
            allOrders
          });
    } catch (error) {
        console.log(error);
        res.status(500).send({error:"Internal Server Error"});
    
}
}
const dispatchOrder= async (req, res)=>{
    try {
        idWithispatchedTo=req.params.id_dispatched_to.split('-');
        const [id,dispatchedTo]=idWithispatchedTo;
        const response=await db.dispatchOrder(id,dispatchedTo,'dispatched');
        if(response){
        res.json({success:true})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({error:"Inter Server Error"});
    }
}
const loadChartPage= async(req, res)=>{
    try {
        const sellerId=req?.session?.user?.id;
        const productData=await db.getProductData(sellerId);
        console.log(productData);
        res.render('seller/chartPage.ejs',{
            name:req?.session?.user?.name,
            role:req?.session?.user?.role,
            seller_id:req?.session?.user?.id,
            productData
        })
    } catch (error) {
       console.log(error);
        res.status(500).send({error:"Internal Server Error"});  
    }
}

module.exports={
    loadRegisterPage,
    registerSeller,
    verifyEmail,
    loadLoginPage,
    login,
    loadDashboard,
    loadCutomerPlacedOrderPage,
    dispatchOrder,
    loadChartPage
}