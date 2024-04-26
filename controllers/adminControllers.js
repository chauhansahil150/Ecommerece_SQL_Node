const db=require('../services/dbQuery');
const dbSeller=require('../services/sellerDBQuery');
const nodemailer= require('nodemailer');

const transporter = nodemailer.createTransport({
   service:'gmail',
    auth: {
        user: process.env.NODEMAILER_USER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});
const loadAdminPage = async (req, res) => {
    try {
        res.render("adminPage", {
            name:req?.session?.user?.name,
            role:req?.session?.user?.role,
            userId:req?.session?.user?.id,
        });
    } catch (error) {
        console.log(error);
    }
}

const addNewProducts= async (req, res)=>{
    try {
        const { name, description, price, quantity, sellerId} = req.body;
        const imageUrl = "/images/" + req?.file?.filename;
    
        // Call the generic createProduct function using async/await
        const product = await db.createProduct(name, description, price, quantity, imageUrl,Number(sellerId));
        console.log('product added');
        res.json({message:"Product added successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}

const loadSellerRequestsPage=async (req,res)=>{
    try {
        const allSellersData=await db.getAllRequestedSellers();
        // res.json(allSellersData);
        console.log(allSellersData);
        res.render("sellerRequestPage.ejs", {
            allSellersData
        });
    } catch (error) {
        console.log(error);
    }
}
const rejectSellerRequest=async (req,res)=>{
    try {
        const {id}=req.params;
        const seller=await dbSeller.getSellerNameAndEmail(id);
        const resp=await dbSeller.rejectSellerRequest(id);
        if(resp){
            res.send({success:true});
            sendSellerRequestRejectionEmail(seller.seller_id,seller.name,seller.email);
        }else{
            res.send({success:false});
        }
        
        
    } catch (error) {
        console.log(error);
    }

}
const approveSellerRequest=async (req,res)=>{
    try {
        const {id}=req.params;
        const resp=await dbSeller.approveSellerRequest(id,true);
        if(resp){
            res.send({success:true});
            const seller=await dbSeller.getSellerNameAndEmail(id);
            // dbSeller.addSellerToUsers(id);
            sendSellerRequestApprovalEmail(seller.seller_id,seller.name,seller.email);
        }else{
            res.send({success:false});
        }   
    } catch (error) {
        console.log(error);
    }
}
function sendSellerRequestApprovalEmail(id,name,email){
    try {
        console.log(email);
        const mailConfigurations = {
        // It should be a string of sender/server email
        from: process.env.NODEMAILER_USER_EMAIL,
        to: email,
        // Subject of Email
        subject: 'Seller Request Approved',
        // This would be the text of email body
         html: `
    <html>
      <head>
        <style>
          /* Add your custom CSS styles here for a professional look */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .email-container {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 10px;
          }
          .email-header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .email-message {
            font-size: 16px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <p class="email-header">Seller Request Approved</p>
          <p class="email-message">Dear ${name},</p>
          <p class="email-message">We are pleased to inform you that your seller request has been approved.</p>
          <p class="email-message">You are now a verified seller on our platform.</p>
          <p class="email-message">Thank you for choosing our platform.</p>
          <p class="email-message"> click here to login <a href="http://localhost:${process.env.PORT}/seller/login">Login</a></p>
          
          <p class="email-message">Best regards,</p>
        </div>
      </body>
    </html>
  `,
        
    };
     transporter.sendMail(mailConfigurations,(error,info)=>{
        console.log('email sent successfully');
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
}
}
function sendSellerRequestRejectionEmail(id,name,email){
    try {
        console.log(email);
        const mailConfigurations = {
        // It should be a string of sender/server email
        from: process.env.NODEMAILER_USER_EMAIL,
        to: email,
        // Subject of Email
        subject: 'Seller Request Rejected',
        // This would be the text of email body
        html: `
    <html>
      <head>
        <style>
          /* Add your custom CSS styles here for a professional look */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .email-container {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 10px;
          }
          .email-header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .email-message {
            font-size: 16px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <p class="email-header">Seller Request Rejected</p>
          <p class="email-message">Dear ${name},</p>
          <p class="email-message">We regret to inform you that your request to become a seller has been rejected.</p>
          <p class="email-message">If you have any questions or concerns, please feel free to contact our support team.</p>
          <p class="email-message">Thank you for considering our platform.</p>
          <p class="email-message">Best regards,</p>
        </div>
      </body>
    </html>
  `,
};
     transporter.sendMail(mailConfigurations,(error,info)=>{
        console.log('email sent successfully');
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
}
}
const loadProductRequestsPage=async (req,res)=>{
    try {
        const allProductsData=await db.getAllRequestedProducts();
        // res.json(allProductsData);
        res.render("admin/productRequestPage.ejs", {
            allProductsData
        });
    } catch (error) {
        console.log(error);
    }

}
const rejectSellerProductRequest=async (req,res)=>{
 try {
        const {id}=req.params;
        const seller=await dbSeller.getSellerNameAndEmail(id);
        const resp=await dbSeller.rejectSellerProductRequest(id);
        if(resp){
            res.send({success:true});
            // sendSellerProductRequestRejectionEmail(seller.seller_id,seller.name,seller.email);
        }else{
            res.send({success:false});
        }
        
        
    } catch (error) {
        console.log(error);
    }
}
const approveSellerProductRequest= async (req, res)=>{
 try {
        const {id}=req.params;
        const resp=await dbSeller.approveSellerProductRequest(id,true);
        if(resp){
            res.send({success:true});
            const seller=await dbSeller.getSellerNameAndEmail(id);
            // dbSeller.addSellerToUsers(id);
            // sendSellerRequestApprovalEmail(seller.seller_id,seller.name,seller.email);
        }else{
            res.send({success:false});
        }   
    } catch (error) {
        console.log(error);
    }
}
module.exports={
    loadAdminPage,
    addNewProducts,
    loadSellerRequestsPage,
    rejectSellerRequest,
    approveSellerRequest,
    loadProductRequestsPage,
    rejectSellerProductRequest,
    approveSellerProductRequest
}