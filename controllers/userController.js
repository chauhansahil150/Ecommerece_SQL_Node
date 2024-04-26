const User=require('../models/user');
const nodemailer= require('nodemailer');
const jwt = require('jsonwebtoken');
const db=require('../services/dbQuery');


// const sendVerifyEmail= async (name,email,user_id){

// }
const transporter = nodemailer.createTransport({
   service:'gmail',
    auth: {
        user: process.env.NODEMAILER_USER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});



const loadRegister = async (req, res) => {
    
    try {
        res.render('register');
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}

const register = async (req, res) => {
    const subject='Email Verification';
    const text=`There, You have recently visited our website and entered your email. Please follow the given link to verify your email http://localhost:${process.env.PORT}/user/verify/`
    const userData =await  db.checkUserExists(req.body.email); 
    if (userData) {
        res.render("register", {
            error: "User Already exists"
        });
        return;
    }else{
        try {
          
                const name= req.body.name;
                const email= req.body.email;
                const password= req.body.password;
            const user=await db.createUser(name, email, password);
            sendVerifyEmail(req.body.name, req.body.email, user.id,subject,text)
            res.render("register", {
                // message:"User Created Successfully"
                message:"check email for verification"
            });
            return;
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
            return;
        } 
    }
   
}
const loadLogin = async (req, res) => {
    try {
        res.render('login');
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
        return;
    }
}
const login = async (req, res) => {
    try {
        const user = await db.findUserByEmail(req.body.email);
        console.log(user);
        if (user) {
            if (user.password === req.body.password) {
                // const userData=(({ password, ...o }) => o)(user)
                // console.log(userData);
                req.session.user = user;
                res.status(200).redirect("/user/dashboard");
                return;
            } else {
                res.render("login", {
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
const loadDashboard= async (req, res)=>{
    try {
       if(req?.session?.user?.role=='admin'){
        res.status(200).redirect('/admin');
       }else if(req?.session?.user?.role=='seller'){
        res.status(200).redirect('/seller');
       }else {
        res.render("dashboard", {
            name:req?.session?.user?.name,
            role:req?.session?.user?.role,
            userId:req?.session?.user?.id,
        });
        res.end();
       }
    }
     catch (error) {
        console.log(error);
    }
}

const logout =  (req, res) => {
    req.session.destroy();
    res.status(200).redirect('/login');
    return;
}
function verifyEmail(req,res){
    const {token,id} = req.params;
jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
        console.log(err);
        res.send("Email verification failed, possibly the link is invalid or expired");
    }
    else {
        db.changeVerificatinStatus(id,true)
        .then(function(user){
            // res.send("Email verifified successfully");
            req.session.user=user;
            res.redirect("/user/dashboard");
        }).catch(function(err){
            res.send("Email verification Failed");
        });
    }
});
}
function sendVerifyEmail(userName,userEmail,userId, subject,text){
   try {
    const token = jwt.sign({
        data: 'Token Data'
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '10m' }
    );
    const mailConfigurations = {
        // It should be a string of sender/server email
        from: process.env.NODEMAILER_USER_EMAIL,
        to: userEmail,
        // Subject of Email
        subject: subject,
        // This would be the text of email body
        text: `Hi ${userName}!`+text+`${token}/${userId} 
        It will expire in 10 minutes
        Thanks`
        
    };
    transporter.sendMail(mailConfigurations,(error,info)=>{
        console.log('email sent successfully');
    });
   } catch (error) {
    console.log(error);
   }
}
const loadChangePassPage= async (req, res)=>{
    try {
        res.render('changePassword',{
            user:{
                id:req?.session?.user.id
            },
            message:null
        })
    } catch (error) {
        console.log(error);
    }
}
const changePassword= async (req, res)=>{
    try {
        const userId=req.params.id;
        const newPass=req.body.new_password;
        await db.updateUserPassword(userId,newPass);
        res.render('changePassword',{
            user:{
                id:req?.session?.user?.id
            },
            message:"Password changed successfuly",
        })
        return;

    } catch (error) {
        console.log(error);
    }
}
const loadEmailPage= async(req, res)=>{
    try {
        res.render('email', {
            message:null,
        });
        return;
    } catch (error) {
        console.log(error);
    }
}
const sendRecoveryEmail= async (req, res)=>{
    try {
        const user=await db.findUserByEmail(req.body.email);
        const token = jwt.sign({
            data: 'Token Data'
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1m' }
        );
        const mailConfigurations = {
            // It should be a string of sender/server email
            from: process.env.NODEMAILER_USER_EMAIL,
            to: req.body.email,
            // Subject of Email
            subject: "Password Recovery",
            // This would be the text of email body
            text: `Hi ${user.name}!`+`Click here to change the password http://localhost:${process.env.PORT}/user/forgot-password/${token}/${user.id} Thanks`
            
        };
        transporter.sendMail(mailConfigurations,(error,info)=>{
            if(error) throw Error(error)
            console.log('email sent successfully');
        })
        res.render('email', {
            message:"check email to reset the password",
        });

    } catch (error) {
        console.log(error);
    }
}
const loadPassRecoveryPage= async (req, res)=>{
   try {
    const {token,id} = req.params;
    jwt.verify(token, process.env.JWT_SECRET, (err,decoded)=>{
        if(err){
            console.log(err);
            res.send("Password can not be changed, possibly link is invalid or expire");
            return;
        }else{
            res.render('changePassword', {
                user:{
                    id:id,
                },
                message:null,
            })
            return;
        }
    })
   } catch (error) {
    console.log(error);
   }
}
const loadMyOrdersPage= async (req, res)=>{
    try {
        const myOrderedProdects=await db.findMyOrderedProducts(req?.session?.user?.id);
        // res.json(myOrderedProdects);
       res.render('user/myOrdersPage.ejs',{
        userId:req?.session?.user?.id,
        name:req?.session?.user?.name,
        role:req?.session?.user?.role,
        myOrderedProdects:myOrderedProdects,
       });
       return;
    } catch (error) {
     console.log(error);
     res.status(500).send({error:"Internal Server Error"});
    }
}
const cancelOrder=async (req, res)=>{
try {
    const id=req.params.id;
    const response=await db.cancelOrder(id,req.body.reason,req.body.cancel_date);
    const productId=await db.getProductIdFromOrders(id);
    // await db.updateStock(productId.product_id,-1);
    await db.updateCancelledCount(productId.product_id);
    res.json(response);

} catch (error) {
    console.log(error);
     res.status(500).send({error:"Internal Server Error"});
}
}

module.exports={
    sendVerifyEmail,
    loadRegister,
    register,
    loadLogin,
    login,
    loadDashboard,
    logout,
    verifyEmail,
    loadChangePassPage,
    changePassword,
    loadEmailPage,
    sendRecoveryEmail,
    loadPassRecoveryPage,
    loadMyOrdersPage,
    cancelOrder
    
}