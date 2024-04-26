// const { Sequelize, DataTypes } = require('sequelize');

// // Create a Sequelize instance
// const sequelize = new Sequelize('ecommerece', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
// });

// // Define the User model
// const User = sequelize.define('User', {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   role: {
//     type: DataTypes.STRING,
//     defaultValue: 'user',
//   },
//   is_verified: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false,
//   },
// });

// // Sync the model with the database
// sequelize.sync()
//   .then(() => {
//     console.log('User model synced with database');
//   })
//   .catch((error) => {
//     console.error('Error syncing User model:', error);
//   });

// module.exports = User;

function userModel(){
     
   const userSchema= `CREATE TABLE IF NOT EXISTS users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'seller', 'admin') DEFAULT 'user',
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`;
      return userSchema;
}

module.exports={userModel};
  
