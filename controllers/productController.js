const Product= require('../models/product');
const db=require('../services/dbQuery');
const dbConnection = require('../services/db'); // Adjust the path as needed


const loadAddNewProductPage= async(req, res)=>{
       try {
          res.render('addProduct',{
            sellerId:req?.session?.user?.id,
            role:req?.session?.user?.role,
            name:req?.session?.user?.name
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Internal Server Error' });
    } 
  }
  const addBulkData=async (req, res)=>{
await fetch("https://dummyjson.com/products")
        .then(res=>res.json())
        .then(products=>{
          //  const data=[];
          //  let cnt=0;
            products.products.forEach(product => {  
            const ob = {
                name: product.title,
                description: product.description,
                price: product.price,
                quantity: product.stock,
                image: product.images[0]
            }
            console.log('object');
            // cnt++;
            // data.push([product.title,product.description,product.price,product.stock,product.images[0]])
            const insertProductSQL = `
            INSERT INTO products (sellerid,name, description, price,quantity,image,is_verified,status)
            VALUES (?,?, ?, ?,?,?,?,?)
          `;
          dbConnection.query(insertProductSQL,[1,ob.name, ob.description,ob.price,ob.quantity,ob.image,1,'verified'], (error,results)=>{
            if(error){
              console.log('error inserting product', error)
            }else{
              
            }
          }) 
          });   
          res.status(200).json({success:true});
        })
        .catch(err=>console.log(err))
        
  }  
    const getProducts= async (req, res)=>{
        try {
            // Implement pagination logic here if needed
            const start = parseInt(req.query.start) || 0;
            const noOfProducts=parseInt(req.query.no_of_products) || 5;
            console.log(noOfProducts);
            role=req?.session?.user?.role;
            userId=req?.session?.user?.id;
            const products = await db.getAllProducts(userId,role,start,noOfProducts,1);
            res.json(products);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error ' });
          }

    }
    const updateProduct= async (req, res)=>{
      try {
        const id=req.params.id;
        // console.log(req.body);
        const response=await db.updateProductById(id,req.body);
        res.json({
          success:true,
          response
        });
      
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  const deleteProduct=async (req, res)=>{
    try {
      const id=req.params.id;
      const response=await db.deleteProductById(id);
      res.json({
        success:true,
        response
      });
    
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}
const countAllProducts=async (req,res)=>{
try {
  userId=req?.session?.user?.id;
  role=req?.session?.user?.role;
  const count=await db.countAllProducts(userId,role);
  res.json(count);
} catch (error) {
  console.log(error);
res.status(500).json({ error: 'Internal Server Error' });
}
}


module.exports={
    getProducts,
    updateProduct,
    deleteProduct,
    loadAddNewProductPage,
    addBulkData,
    countAllProducts
    
}