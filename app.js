require('dotenv').config();

const express=require('express');
const session = require('express-session');
// const mysql= require('mysql');

const app= express();
const PORT=process.env.PORT || 3000;
const path= require('path');
const db=require('./services/db.js');
//controllers
const userController=require('./controllers/userController');
//routes
const userRoute= require('./routes/userRoute');
const productRoute= require('./routes/productRoute');
const cartRoute=require('./routes/cartRoute');
const adminRoute=require('./routes/adminRoute');
const sellerRoute=require('./routes/sellerRoute');
const transporterRoute=require('./routes/transporterRoute');
const auth = require('./services/auth');
const multer = require("multer");
const dbConnection = require('./services/db');
const cors=require('cors');

app.use(cors({
  origin:'http://localhost:5173',
  optionsSuccessStatus:200
}));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './public')));
// dbConnection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     return;
//   }
//   console.log('Connected to database');
// });
// const User = require('./models/user');
// Create a new user
// User.create({
//   name: 'John Doe',
//   email: 'johndoe@example.com',
//   password: 'password123',
// })
// .then((user) => {
//   console.log('User created:', user.toJSON());
// })
// .catch((error) => {
//   console.error('Error creating user:', error);
// });

// const dbConnection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'ecommerece'
// });

// const query = 
// `CREATE TABLE users (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL UNIQUE,
//   password VARCHAR(255) NOT NULL,
//   role VARCHAR(255) DEFAULT 'user',
//   is_verified BOOLEAN DEFAULT FALSE,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// )`;

// dbConnection.query(query, (err, results) => {
//   if (err) {
//     console.error('Error executing query:', err);
//     return;
//   }
//   console.log('Query results:', results);
// });



app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}))
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, './public/images'))
  },
  filename: (req, file, cb) => {
      const fileName = Date.now() + '-' + file.originalname
      cb(null, fileName)
  },
});
const upload = multer({ storage });

app.get('/', (req,res)=>{
  res.sendFile(__dirname + '/views/index.html');
});
app.route("/register")
    .get(userController.loadRegister)
    .post(userController.register);
app.route("/login")
    .get(auth.isLogout,userController.loadLogin)
    .post(auth.isLogout,userController.login);
app.get('/dashboard',auth.isLogout, userController.loadDashboard);
app.get('/logout', userController.logout);
app.use('/user', userRoute);
app.use('/product',productRoute);
app.use('/cart',auth.isLogin,cartRoute);
app.use('/admin',auth.isAdmin, upload.single("image"),adminRoute);
app.use('/seller',sellerRoute);
app.use('/transporter',transporterRoute);
app.get("*", (req, res) => {
  if(req?.session?.user?.role=='user'){
    res.redirect("/user/dashboard");
  }else if(req?.session?.user?.role=='admin'){
    res.redirect("/admin");
  }else{
    res.redirect("/dashboard");
  }
});

app.listen(PORT, ()=> console.log('server started at port', PORT));



